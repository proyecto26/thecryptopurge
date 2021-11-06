// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/* import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol"; */

import "./Game.sol";

contract Leaderboard {
    struct Game {
        Game game;
        address[] boardPlayers;
        uint256[] boardScores;
        uint256 begin;
        uint256 end;
    }

    address gameAddr;
    Game[] games;

    // Events
    event BoardCreated(uint256 leaderboardId);

    event BoardUpdated(uint256 leaderboardId);

    event RewardWithdraw(uint256 leaderboardId, address player, uint256 amount);

    fallback() external payable {
        
    }

    receive() external payable {
        // Nothing to do here
    }

    // This modifier is used to avoid non players to try to withdraw rewards
    modifier onlyPlayerInBoard(uint256 leaderboardId) {
        address[] memory players = games[leaderboardId].boardPlayers;
        bool isValidPlayer = false;
        for (uint256 i; i < players.length; i++) {
            if (msg.sender == players[i]) {
                isValidPlayer = true;
            }
        }
        require(isValidPlayer, "Player is not on the leader board");
        _;
    }

    // This function is used to create a board
    // This is done by instantiating a game and pushing into the games list
    function createBoard(
        Game game,
        uint256 timestampBegin,
        uint256 timestampEnd
    ) public payable {
        require(
            timestampEnd > block.timestamp,
            "Timestamp end must be greater"
        );
        require(
            msg.value > 0,
            "Some ethers must be deposited in order to create a board"
        );
        Game memory g = Game(
            game,
            new address[](10),
            new uint256[](10),
            timestampBegin,
            timestampEnd
        );
        games.push(g);
        emit BoardCreated(games.length - 1);
    }

    // This function is used to retrieve data from the game contract and update the board positions
    function update(uint256 leaderboardId) public {
        // Get the game by its id
        Game memory gameObj = games[leaderboardId];

        // The board cannot be updated if timestampend has passed
        require(
            block.timestamp <= gameObj.end,
            "This leader board cannot be updated anymore"
        );

        // Get the players list from game contract
        address[] memory gamePlayers = gameObj.game.getPlayers();
        uint256[] memory fullScoresList = new uint256[](gamePlayers.length);
        if (gamePlayers.length == 0) {
            return;
        }

        // Iterate over players list to get their scores.
        for (uint256 i = 0; i < gamePlayers.length; i++) {
            uint256 score = gameObj.game.getLifetimeScore(gamePlayers[i]);
            fullScoresList[i] = score;
        }

        // Sort the lists of players and scores and get the top 10.
        (
            address[] memory top10Players,
            uint256[] memory top10PlayersScores
        ) = getHighscore(gamePlayers, fullScoresList, 10);

        // Update game data
        games[leaderboardId].boardPlayers = top10Players;
        games[leaderboardId].boardScores = top10PlayersScores;

        emit BoardUpdated(leaderboardId);
    }

    // This function is used to withdraw rewards according to the board results.
    function withdrawReward(uint256 leaderboardId)
        public
        onlyPlayerInBoard(leaderboardId)
    {
        Game memory gameObj = games[leaderboardId];
        require(
            block.timestamp > gameObj.end,
            "This leader board is not closed yet"
        );

        uint256 score = 0;
        uint256 position = gameObj.boardPlayers.length - 1;
        uint256 playersCount = 0;
        // Get player score and amount of total players
        for (uint256 i = 0; i < gameObj.boardPlayers.length; i++) {
            if (gameObj.boardPlayers[i] == msg.sender) {
                score = gameObj.boardScores[i];
                position = i;
            }
            if (gameObj.boardPlayers[i] == address(0x0)) {
                break;
            }
            playersCount += 1;
        }
        uint256 reward = score * (playersCount - position);
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Withdraw reward failed.");
        emit RewardWithdraw(leaderboardId, msg.sender, reward);
    }

    function getLeaderboardData(uint256 leaderboardId)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        Game memory gameObj = games[leaderboardId];
        return (gameObj.boardPlayers, gameObj.boardScores);
    }

    // Internal function used to quicksort players and scores
    function quickSortScores(
        uint256[] memory scores,
        address[] memory players,
        int256 left,
        int256 right
    ) internal {
        int256 i = left;
        int256 j = right;
        if (i == j) return;
        uint256 pivot = scores[uint256(left + (right - left) / 2)];
        while (i <= j) {
            while (scores[uint256(i)] < pivot) i++;
            while (pivot < scores[uint256(j)]) j--;
            if (i <= j) {
                (scores[uint256(i)], scores[uint256(j)]) = (
                    scores[uint256(j)],
                    scores[uint256(i)]
                );
                (players[uint256(i)], players[uint256(j)]) = (
                    players[uint256(j)],
                    players[uint256(i)]
                );
                i++;
                j--;
            }
        }
        if (left < j) quickSortScores(scores, players, left, j);
        if (i < right) quickSortScores(scores, players, i, right);
    }

    // This function is used to get the top N players and its scores
    function getHighscore(
        address[] memory players,
        uint256[] memory scores,
        uint256 limit
    ) private returns (address[] memory, uint256[] memory) {
        address[] memory resultAddr = new address[](limit);
        uint256[] memory resultScores = new uint256[](limit);
        quickSortScores(scores, players, 0, int256(scores.length - 1));

        if (players.length <= limit) {
            return (players, scores);
        }

        for (uint256 i = 0; i < limit; i++) {
            resultAddr[i] = players[i];
            resultScores[i] = scores[i];
        }
        return (resultAddr, resultScores);
    }
}


/* PD: Leaderboard is a contract used to store position tables for on-chain games. 
A position table organize a max of 10 players (where position[0] is the player with the highest amount of points). 
To create a table, it is required to specify the game contract address.
`createBoard(Game game, uint256 timestampBegin, uint256 timestampEnd) public`
Any game must implement the interface Game in order to be compatible with this leaderboard. 
Any Game implementation must have the next functions:
`getLifetimeScore(address player) public view`
At the end of the defined timestamp, the players get a reward according to the position on the table.
The position table can be updated by anyone by calling the public function "update(uint leaderboardId)", 
which iterates over the participants list, getting the points for each player and updates the table.
Once the timestamp has finished, the players cannot update the leaderboard anymore and can withdraw their rewards.
Reward = Points * (MAX_PLAYERS - Position) */