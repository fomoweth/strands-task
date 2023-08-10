import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import chalk from "chalk";
import { BigNumber, utils } from "ethers";

import { ETH_ADDRESS, WETH_ADDRESS, ZERO_ADDRESS } from "./shared/constants";
import { completeFixture } from "./shared/fixtures";

describe(chalk.green("TransferHelper"), () => {
    describe(chalk.cyan("#transferToken\n"), () => {
        async function prepareTokenTransfer() {
            const { sender, receiver, transferHelper, weth } =
                await loadFixture(completeFixture);

            const value = utils.parseEther("10");

            await weth.connect(sender).deposit({ value });

            const senderBalance = await weth.balanceOf(sender.address);
            expect(senderBalance).to.be.eq(value);

            await weth.connect(sender).approve(transferHelper.address, value);

            const allowance = await weth.allowance(
                sender.address,
                transferHelper.address
            );
            expect(allowance).to.be.eq(value);

            return { sender, receiver, transferHelper, weth };
        }

        it("should revert the tx when invalid token address is given\n", async () => {
            const { sender, receiver, transferHelper } =
                await prepareTokenTransfer();

            const value = utils.parseEther("10");

            let tx;

            tx = transferHelper
                .connect(sender)
                .transferToken(ZERO_ADDRESS, receiver.address, value);

            await expect(tx).to.be.revertedWithCustomError(
                transferHelper,
                "InvalidToken"
            );

            tx = transferHelper
                .connect(sender)
                .transferToken(ETH_ADDRESS, receiver.address, value);

            await expect(tx).to.be.revertedWithCustomError(
                transferHelper,
                "InvalidToken"
            );

            tx = transferHelper
                .connect(sender)
                .transferToken(receiver.address, receiver.address, value);

            await expect(tx).to.be.revertedWithCustomError(
                transferHelper,
                "InvalidToken"
            );
        });

        it("should revert the tx when given recipient address is 0\n", async () => {
            const { sender, transferHelper, weth } =
                await prepareTokenTransfer();

            const value = utils.parseEther("10");

            const tx = transferHelper
                .connect(sender)
                .transferToken(weth.address, ZERO_ADDRESS, value);

            await expect(tx).to.be.revertedWithCustomError(
                transferHelper,
                "ZeroAddress"
            );
        });

        it("should successfully transfer tokens to recipient\n", async () => {
            const { sender, receiver, transferHelper, weth } =
                await prepareTokenTransfer();

            const value = utils.parseEther("10");

            const tx = transferHelper
                .connect(sender)
                .transferToken(WETH_ADDRESS, receiver.address, value);

            await expect(tx).to.changeTokenBalances(
                weth,
                [receiver, sender],
                [value, value.mul(BigNumber.from(-1))]
            );

            const receiverBalance = await weth.balanceOf(receiver.address);
            expect(receiverBalance).to.be.eq(value);
        });
    });

    describe(chalk.cyanBright("#transferEth\n"), () => {
        it("should revert when given recipient address is 0\n", async () => {
            const { sender, transferHelper } = await loadFixture(
                completeFixture
            );

            const value = utils.parseEther("10");

            const tx = transferHelper
                .connect(sender)
                .transferEth(ZERO_ADDRESS, { value });

            await expect(tx).to.be.revertedWithCustomError(
                transferHelper,
                "ZeroAddress"
            );
        });

        it("should revert when given value is 0\n", async () => {
            const { sender, receiver, transferHelper } = await loadFixture(
                completeFixture
            );

            const tx = transferHelper
                .connect(sender)
                .transferEth(receiver.address, { value: 0 });

            await expect(tx).to.be.revertedWithCustomError(
                transferHelper,
                "ZeroValue"
            );
        });

        it("should successfully transfer ETH to recipient\n", async () => {
            const { sender, receiver, transferHelper } = await loadFixture(
                completeFixture
            );

            const value = utils.parseEther("10");

            const tx = transferHelper
                .connect(sender)
                .transferEth(receiver.address, { value });

            await expect(tx).to.changeEtherBalances(
                [receiver, sender],
                [value, value.mul(BigNumber.from(-1))]
            );
        });
    });
});
