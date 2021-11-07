# Leaderboard
Leaderboard is a contract used to store position tables for on-chain games. 
A position table organize a max of 10 players, where `position[0]` is the player with the highest amount of points. 

To create a table, it is required to specify the game contract address:
`createBoard(IGame game, uint256 timestampBegin, uint256 timestampEnd) public`

Any game must implement the interface `IGame` in order to be compatible with this leaderboard. 


Any `IGame` implementation must have the next functions:
`getLifetimeScore(address player) public view`

At the end of the defined timestamp, the players get a reward according to the position on the table.
The position table can be updated by anyone by calling the public function `update(uint leaderboardId)`, 
which iterates over the participants list, getting the points for each player and updates the table.
Once the timestamp has finished, the players cannot update the leaderboard anymore and can withdraw their rewards.

`Reward = Points * (MAX_PLAYERS - Position)`
