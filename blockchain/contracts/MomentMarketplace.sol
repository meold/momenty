//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error PriceNotMet(address momentAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address momentAddress, uint256 tokenId);
error NotListed(address momentAddress, uint256 tokenId);
error AlreadyListed(address momentAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract MomentMarketplace is ReentrancyGuard {
    event MomentListed(address indexed seller, address indexed momentAddress, uint256 indexed tokenId, uint256 price);
    event MomentCanceled(address indexed seller, address indexed momentAddress, uint256 indexed tokenId);
    event MomentBought(address indexed buyer, address indexed momentAddress, uint256 indexed tokenId, uint256 price);

    struct Listing {
        uint256 price;
        address seller;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    modifier notListed(address momentAddress, uint256 tokenId, address owner) {
        Listing memory listing = s_listings[momentAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(momentAddress, tokenId);
        }
        _;
    }

    modifier isListed(address momentAddress, uint256 tokenId) {
        Listing memory listing = s_listings[momentAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(momentAddress, tokenId);
        }
        _;
    }

    modifier isOwner(address momentAddress, uint256 tokenId, address spender) {
        IERC721 moment = IERC721(momentAddress);
        address owner = moment.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    function listMoment(address momentAddress, uint256 tokenId, uint256 price)
        external
        notListed(momentAddress, tokenId, msg.sender)
        isOwner(momentAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }

        IERC721 moment = IERC721(momentAddress);

        if (moment.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        s_listings[momentAddress][tokenId] = Listing(price, msg.sender);
        emit MomentListed(msg.sender, momentAddress, tokenId, price);
    }

    function cancelListing(address momentAddress, uint256 tokenId)
        external
        isOwner(momentAddress, tokenId, msg.sender)
        isListed(momentAddress, tokenId)
    {
        delete (s_listings[momentAddress][tokenId]);
        emit MomentCanceled(msg.sender, momentAddress, tokenId);
    }

    function buyMoment(address momentAddress, uint256 tokenId)
        external
        payable
        isListed(momentAddress, tokenId)
        nonReentrant
    {
        Listing memory listedItem = s_listings[momentAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(momentAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;

        delete (s_listings[momentAddress][tokenId]);
        IERC721(momentAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit MomentBought(msg.sender, momentAddress, tokenId, listedItem.price);
    }

    function updateListing(address momentAddress, uint256 tokenId, uint256 newPrice)
        external
        isListed(momentAddress, tokenId)
        nonReentrant
        isOwner(momentAddress, tokenId, msg.sender)
    {
        //We should check the value of `newPrice` and revert if it's below zero (like we also check in `listMoment()`)
        if (newPrice <= 0) {
            revert PriceMustBeAboveZero();
        }
        s_listings[momentAddress][tokenId].price = newPrice;
        emit MomentListed(msg.sender, momentAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    function getListing(address momentAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[momentAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
