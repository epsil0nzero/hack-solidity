const Attacker = artifacts.require("Attacker");
const SafeStore = artifacts.require("SafeStore");
const VulnStore = artifacts.require("VulnStore");

contract("Reentrancy", function(accounts) {

  before(() => { });  
  
  it("should perform reentrancy attack succesfully", async () => {  

    const attacker = await Attacker.deployed();
    const store = await VulnStore.deployed();

    const alice = accounts[1];
    const bob = accounts[2];
    const eve = accounts[3];

    console.log(`***** Balances before Attack *****`);
    console.log(`Store Balance: ${await web3.eth.getBalance(store.address)}`);
    console.log(`Alice Balance: ${await web3.eth.getBalance(alice)}`);
    console.log(`Bob Balance: ${await web3.eth.getBalance(bob)}`);
    console.log(`Eve Balance: ${await web3.eth.getBalance(eve)}`);
    console.log(`Attacker Contract Balance: ${await web3.eth.getBalance(attacker.address)}`);

    const tx1 = await store.deposit({value: '1000000000000000000', from: alice});
    const tx2 = await store.deposit({value: '1000000000000000000', from: bob});
    const tx3 = await store.deposit({value: '1000000000000000000', from: eve});
    const tx4 = await attacker.attack({value:'1000000000000000000', from: eve});

    console.log(`\n***** Balances after Attack *****`);
    console.log(`Store Balance: ${await web3.eth.getBalance(store.address)}`);
    console.log(`Alice Balance: ${await web3.eth.getBalance(alice)}`);
    console.log(`Bob Balance: ${await web3.eth.getBalance(bob)}`);
    console.log(`Eve Balance: ${await web3.eth.getBalance(eve)}`);
    console.log(`Attacker Contract Balance: ${await web3.eth.getBalance(attacker.address)}`);
    
    assert.equal(await web3.eth.getBalance(store.address), 0, 'unsuccesfull attack');
  });

});
