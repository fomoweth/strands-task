import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { WETH_ADDRESS } from "./constants";
import { deployContract, getContract, getSigners } from "./utils";

import { IWETH, TransferHelper } from "../../typechain-types";

interface CompleteFixture {
    deployer: SignerWithAddress;
    sender: SignerWithAddress;
    receiver: SignerWithAddress;
    transferHelper: TransferHelper;
    weth: IWETH;
}

export const completeFixture = async (): Promise<CompleteFixture> => {
    const { deployer, sender, receiver } = await getSigners();

    const transferHelper = await deployContract<TransferHelper>(
        "TransferHelper",
        deployer,
        []
    );

    const weth = await getContract<IWETH>("IWETH", WETH_ADDRESS);

    return { deployer, sender, receiver, transferHelper, weth };
};
