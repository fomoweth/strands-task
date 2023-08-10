import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-tracer";

import verifyContract from "./tasks/verifyContract";

const accounts = {
    mnemonic:
        process.env.MNEMONIC ||
        "test test test test test test test test test test test junk",
    initialIndex: 0,
    count: 20,
    path: "m/44'/60'/0'/0",
};

task("verify-contract", "Verify solidity source", verifyContract);

const config: HardhatUserConfig = {
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./contracts",
        tests: "./test",
    },
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    viaIR: true,
                    evmVersion: "istanbul",
                    optimizer: {
                        enabled: true,
                        runs: 1_000_000,
                    },
                    metadata: {
                        bytecodeHash: "none",
                    },
                },
            },
        ],
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: false,
            chainId: 59144,
            forking: {
                url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
                blockNumber: 162133,
            },
            accounts,
        },
        linea: {
            chainId: 59144,
            url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            live: true,
            saveDeployments: true,
        },
        linea_test: {
            chainId: 59140,
            url: `https://linea-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            live: true,
            saveDeployments: true,
        },
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true,
    },
    defaultNetwork: "linea_test",
    etherscan: {
        apiKey: {
            linea: process.env.LINEASCAN_API_KEY!,
            linea_test: process.env.LINEASCAN_API_KEY!,
        },
        customChains: [
            {
                network: "linea",
                chainId: 59144,
                urls: {
                    apiURL: "https://api.lineascan.build/api",
                    browserURL: "https://lineascan.build/",
                },
            },
            {
                network: "linea_test",
                chainId: 59140,
                urls: {
                    apiURL: "https://api-testnet.lineascan.build/api",
                    browserURL: "https://goerli.lineascan.build/",
                },
            },
        ],
    },
    mocha: {
        timeout: 60000,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    tracer: {
        enabled: true,
        logs: true,
        calls: true,
        sstores: false,
        sloads: false,
        gasCost: true,
    },
};

export default config;
