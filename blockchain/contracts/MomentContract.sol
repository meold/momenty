//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./ERC721Full.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MomentContract is IERC721Metadata, ERC721Full {
    event MomentSold(uint256 _momentId, address _buyer, uint256 _price);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("Momenty", "MMT") {}

    function mint(address owner, string memory metadataURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        _setTokenURI(id, metadataURI);

        return id;
    }
}
