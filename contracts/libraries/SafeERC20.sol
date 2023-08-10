// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SafeERC20 {
    bytes4 private constant APPROVE_SELECTOR = 0x095ea7b3;
    bytes4 private constant TRANSFER_SELECTOR = 0xa9059cbb;
    bytes4 private constant TRANSFER_FROM_SELECTOR = 0x23b872dd;

    bytes4 private constant INVALID_TOKEN = 0xc1ab6dc1;
    bytes4 private constant INVALID_MSG_VALUE = 0x78f38f76;
    bytes4 private constant ZERO_ADDRESS = 0xd92e233d;
    bytes4 private constant ZERO_VALUE = 0x7c946ed7;

    function safeApprove(
        address token,
        address spender,
        uint256 value
    ) internal {
        if (!_tryApprove(token, spender, value)) {
            if (
                !_tryApprove(token, spender, 0) ||
                !_tryApprove(token, spender, value)
            ) {
                reRevert();
            }
        }
    }

    function _tryApprove(
        address token,
        address spender,
        uint256 value
    ) private returns (bool) {
        if (!isNative(token)) {
            return _call(token, APPROVE_SELECTOR, spender, value);
        }

        return true;
    }

    function safeTransfer(
        address token,
        address recipient,
        uint256 value
    ) internal {
        if (!isNative(token)) {
            if (!_call(token, TRANSFER_SELECTOR, recipient, value)) {
                reRevert();
            }
        } else {
            safeTransferNative(recipient, value);
        }
    }

    function safeTransferNative(address recipient, uint256 value) internal {
        assembly ("memory-safe") {
            if iszero(recipient) {
                mstore(0, ZERO_ADDRESS)
                revert(0, 4)
            }

            if iszero(value) {
                mstore(0, ZERO_VALUE)
                revert(0, 4)
            }

            if iszero(call(gas(), recipient, value, 0, 0, 0, 0)) {
                let ptr := mload(0x40)
                returndatacopy(ptr, 0, returndatasize())
                revert(ptr, returndatasize())
            }
        }
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        assembly ("memory-safe") {
            if iszero(extcodesize(token)) {
                mstore(0, INVALID_TOKEN)
                revert(0, 4)
            }

            if or(iszero(from), iszero(to)) {
                mstore(0, ZERO_ADDRESS)
                revert(0, 4)
            }

            let ptr := mload(0x40)

            mstore(ptr, TRANSFER_FROM_SELECTOR)
            mstore(add(ptr, 0x04), from)
            mstore(add(ptr, 0x24), to)
            mstore(add(ptr, 0x44), value)

            let success := and(
                or(
                    and(eq(mload(0x00), 0x01), gt(returndatasize(), 0x1f)),
                    iszero(returndatasize())
                ),
                call(gas(), token, 0, ptr, 0x64, 0, 0x20)
            )

            if iszero(success) {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }

    function _call(
        address token,
        bytes4 selector,
        address account,
        uint256 value
    ) private returns (bool success) {
        assembly ("memory-safe") {
            if iszero(extcodesize(token)) {
                mstore(0, INVALID_TOKEN)
                revert(0, 4)
            }

            if iszero(account) {
                mstore(0, ZERO_ADDRESS)
                revert(0, 4)
            }

            let ptr := mload(0x40)

            mstore(ptr, selector)
            mstore(add(ptr, 0x04), account)
            mstore(add(ptr, 0x24), value)

            success := and(
                or(
                    and(eq(mload(0), 1), gt(returndatasize(), 0x1f)),
                    iszero(returndatasize())
                ),
                call(gas(), token, 0, ptr, 0x44, 0, 0x20)
            )
        }
    }

    function isNative(address token) internal pure returns (bool value) {
        assembly ("memory-safe") {
            value := or(
                eq(token, 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE),
                iszero(token)
            )
        }
    }

    function reRevert() private pure {
        assembly ("memory-safe") {
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, returndatasize())
            revert(ptr, returndatasize())
        }
    }
}
