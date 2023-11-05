// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract Ticket is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;

    struct TicketVoucher {
        uint256 tokenId;
        uint256 minPrice;
        string uri;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    uint256 public _nextTokenId;
    uint256 public _price;

    constructor(uint256 price) ERC721("Ticket", "TKT") Ownable(msg.sender) { 
        _nextTokenId = 0;
        _price = price;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://your-url/";
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintWithVoucher(TicketVoucher memory voucher) public payable {
        require(msg.value >= _price, "Insufficient funds to mint");

        _nextTokenId+=1;
        voucher.tokenId = _nextTokenId;
        voucher.uri = string(abi.encodePacked("ticket_", uintToString(voucher.tokenId), ".json"));
        voucher.minPrice = _price;

        address signer = _verify(voucher);
        require(signer == owner(), "Signature invalid or unauthorized");
        
        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.uri);
    }

    function _verify(TicketVoucher memory voucher) internal pure returns (address) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(voucher.tokenId, voucher.minPrice, voucher.uri)
        );
       
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        return ecrecover(ethSignedMessageHash, voucher.v, voucher.r, voucher.s);
    }

    function uintToString(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

}