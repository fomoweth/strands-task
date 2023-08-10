import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract, utils } from "ethers";
import { ethers } from "hardhat";

declare var hre: HardhatRuntimeEnvironment;

export const { getAddress, isAddress } = utils;

export const deployContract = async <T extends Contract>(
    name: string,
    deployer: SignerWithAddress,
    args?: any[]
): Promise<T> => {
    const contractFactory = await ethers.getContractFactory(name, deployer);
    const contract = await contractFactory.deploy(...(args || []));
    await contract.deployed();

    setNameTag(name, contract.address);

    return contract as T;
};

export const getContract = async <T extends Contract>(
    name: string,
    address: string
): Promise<T> => {
    const contract = await ethers.getContractAt(name, address);

    setNameTag(name, contract.address);

    return contract as T;
};

export const getSigners = async () => {
    const [deployer, ...signers] = await ethers.getSigners();
    const [sender, receiver] = signers;

    setNameTag("Deployer", deployer.address);
    setNameTag("Sender", sender.address);
    setNameTag("Receiver", receiver.address);

    return { deployer, sender, receiver };
};

export const setNameTag = (id: string, address: string) => {
    if (!hre.tracer.nameTags[getAddress(address)]) {
        hre.tracer.nameTags[getAddress(address)] = id;
    }
};
