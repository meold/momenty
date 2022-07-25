//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./MomentContract.sol";

contract MomentSaleContract is MomentContract {
    MomentContract public momentContract;

    event MomentSold(uint256 _momentId, address _buyer, uint256 _price);

    constructor(MomentContract _momentContract) public {
        momentContract = _momentContract;
    }

    function buyMoment(
        address _owner,
        uint256 _momentId,
        uint256 _price
    ) public payable {
        momentContract.transferFrom(_owner, msg.sender, _momentId);
        momentContract.nftSold(_momentId);

        emit MomentSold(_momentId, msg.sender, _price);
    }
}
