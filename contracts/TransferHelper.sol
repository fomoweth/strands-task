// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./libraries/SafeERC20.sol";

contract TransferHelper {
    using SafeERC20 for address;

    error InvalidToken();
    error ZeroAddress();
    error ZeroValue();

    constructor() {}

    function transferToken(
        address token,
        address recipient,
        uint256 value
    ) external {
        token.safeTransferFrom(msg.sender, recipient, value);
    }

    function transferEth(address recipient) external payable {
        recipient.safeTransferNative(msg.value);
    }
}
