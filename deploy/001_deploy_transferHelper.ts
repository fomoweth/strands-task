import chalk from "chalk";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Receipt } from "hardhat-deploy/dist/types";

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, getChainId } = hre;
    const { deploy, getNetworkName } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log(
        "\n================================================================================"
    );
    console.log(
        `\nDeploying TransferHelper on ${chalk.green(
            getNetworkName()
        )} ${chalk.yellow(await getChainId())}`
    );
    console.log(`\nDeployer: ${chalk.green(deployer)}`);

    const { receipt } = (await deploy("TransferHelper", {
        from: deployer,
        args: [],
        skipIfAlreadyDeployed: false,
        log: false,
    })) as { receipt: Receipt };

    console.log(
        `\nDeployed at ${chalk.green(
            receipt.contractAddress
        )} with ${chalk.yellow(receipt.cumulativeGasUsed)} gas`
    );
    console.log(`\ntx: ${chalk.green(receipt.transactionHash)}`);
    console.log(
        "\n================================================================================"
    );
};

main.tags = ["TransferHelper"];

export default main;
