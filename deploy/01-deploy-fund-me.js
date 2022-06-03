//imports
//main function
//calling main function

//main function to be called by hardhat deploy
function deployFunc() {
    console.log("TEST")
}

module.exports.default = ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts
    const chainId = network.config.chainId

    //what happens when we want to change chains...
    //when going for localhost or hardhat network we want to use a mock
}
