import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

const main = async (
    _taskArgs: TaskArguments,
    hre: HardhatRuntimeEnvironment
) => {
    const { deployments, run } = hre;
    const transferHelper = await deployments.get("TransferHelper");

    try {
        await run("verify:verify", {
            address: transferHelper.address,
        });
    } catch (e) {
        console.error(e);
    }
};

export default main;
