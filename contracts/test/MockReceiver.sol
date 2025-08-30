// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract MockReceiver {
    bool public flag;
    uint256 public value;

    function setFlag(bool _flag) external {
        flag = _flag;
    }

    function setValue(uint256 _value) external {
        value = _value;
    }

    function setBoth(bool _flag, uint256 _value) external {
        flag = _flag;
        value = _value;
    }
}
