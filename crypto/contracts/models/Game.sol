// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract GameModel {
  struct Character {
    uint index;
    uint health;
    uint maxHealth;
    uint attackDamage;
    string name;
    string imageUri;
  }
}