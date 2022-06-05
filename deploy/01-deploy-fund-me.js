//imports
//main function
//calling main function

//main function to be called by hardhat deploy
const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        //get most recent deployment
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //if the contract does not exist, we deploy a minimal version for our local testing

    //what happens when we want to change chains...
    //when going for localhost or hardhat network we want to use a mock
    // const fundMe = await deploy("FundMe", {
    //     from: deployer,
    //     args: [ethUsdPriceFeedAddress], //put pricefeed address,
    //     log: true,
    // })

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //verify if NOT in local/dev network
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args)
    }

    log(" - - - - - - - - - - - - - - - - - - - - - - - -s")
}

module.exports.tags = ["all", "fundme"]
