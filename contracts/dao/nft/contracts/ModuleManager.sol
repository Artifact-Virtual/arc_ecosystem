// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ModuleManager {
    address public admin;
    mapping(address => bool) public modules;

    event ModuleRegistered(address indexed module);
    event ModuleUnregistered(address indexed module);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "ModuleManager: admin only");
        _;
    }

    modifier onlyModule() {
        require(modules[msg.sender], "ModuleManager: module only");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerModule(address module) external onlyAdmin {
        require(module != address(0), "ModuleManager: invalid module address");
        require(!modules[module], "ModuleManager: already registered");
        modules[module] = true;
        emit ModuleRegistered(module);
    }

    function unregisterModule(address module) external onlyAdmin {
        require(modules[module], "ModuleManager: not registered");
        modules[module] = false;
        emit ModuleUnregistered(module);
    }

    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "ModuleManager: invalid admin address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    function isModule(address maybe) external view returns (bool) {
        return modules[maybe];
    }

    // Emergency function to unregister all modules
    function emergencyUnregisterAll() external onlyAdmin {
        // This would need to be implemented with a mapping iteration
        // For now, admin can call unregisterModule for each module
    }
}
