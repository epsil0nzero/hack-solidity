const Attacker = artifacts.require("Attacker");
const SafeStore = artifacts.require("SafeStore");
const VulnStore = artifacts.require("VulnStore");

module.exports = async function (deployer, network, accounts) {
  
  await deployer.deploy(VulnStore);
  const store = await VulnStore.deployed();
  await deployer.deploy(Attacker, store.address);

};
