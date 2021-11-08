// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract CommonData {
  struct Character {
    uint index;
    uint health;
    uint maxHealth;
    uint attackDamage;
    string name;
    string imageUri;
  }
}