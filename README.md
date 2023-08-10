# Strands Task

Deployed at <a href="https://goerli.lineascan.build/address/0xaE778109BAfe1e62bEa36AF14eE00Ed437BBF2A7#code">0xaE778109BAfe1e62bEa36AF14eE00Ed437BBF2A7</a>

## Task Instruction

```text
Please include your GitHub account and complete this task with your submission.

Write a contract with 2 simple functions.

function transferToken(address tokenAddress, address recipient, uint256 amount)

function transferEth(address payable recipient)

Deploy it on Linea testnet and include the 2 test transactions with your submission. Bonus points if you can verify the contract.
```

## Installation

```bash
git clone https://github.com/fomoweth/strands-task

cd strands-task

npm install
```

## Usage

Create an environment file `.env` with the following content:

```text
INFURA_API_KEY=YOUR_INFURA_API_KEY
LINEASCAN_API_KEY=YOUR_LINEASCAN_API_KEY
MNEMONIC=YOUR_MNEMONIC
```

Then you can compile the contracts:

```bash
# compile contracts to generate artifacts and typechain-types
npm run compile

# remove the generated artifacts and typechain-types
npm run clean

# clean and compile
npm run build
```

## Tasks

```bash
# to run hardhat test
npm test

# to deploy the contract on Linea testnet
npx hardhat deploy --network linea_test

# to verify the contract deployed on Linea testnet
npx hardhat verify-contract --network linea_test
```
