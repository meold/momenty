//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./ERC721Full.sol";

contract MomentContract is IERC721Metadata, ERC721Full {
    event MomentSold(uint256 _momentId, address _buyer, uint256 _price);

    struct metadata {
        string name;
        string description;
        string url;
        string videoUrl;
        uint256 price;
    }

    string[] public moments;
    mapping(uint => metadata) public momentMetadata;
    mapping(string => bool) _momentExists;

    mapping(uint256 => bool) _listedForSale;

    constructor() public ERC721("NFT_MOMENTS", "MMNT") {}

    function mint(
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        string memory _videoUrl,
        uint256 _price
    ) public returns (uint256) {
        //NOTE: we know that _imageUrl is unique, because we use crypto random uuid for uploads
        require(!_momentExists[_imageUrl]);

        metadata memory md;
        md.name = _name;
        md.description = _description;
        md.url = _imageUrl;
        md.videoUrl = _videoUrl;
        md.price = _price;

        moments.push(_imageUrl);
        uint256 _newMomentId = moments.length - 1;

        momentMetadata[_newMomentId] = md;

        _mint(msg.sender, _newMomentId);

        _momentExists[_imageUrl] = true;

        return _newMomentId;
    }

    function approveNFT(address _to, uint256 _tokenId) public {
        approve(_to, _tokenId);
    }

    function isApprovedOrOwner(address _address, uint256 _tokenId)
        public
        returns (bool)
    {
        return _isApprovedOrOwner(_address, _tokenId);
    }

    function updatePrice(uint256 _id, uint256 _price) public returns (bool) {
        require(ownerOf(_id) == msg.sender);
        momentMetadata[_id].price = _price;

        return true;
    }

    function approveForSale(
        address _to,
        uint256 _tokenId,
        uint256 _price
    ) public {
        _listedForSale[_tokenId] = true;
        updatePrice(_tokenId, _price);
        approveNFT(_to, _tokenId);
    }

    function nftSold(uint256 _tokenId) public {
        _listedForSale[_tokenId] = false;
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
