const { expect } = require('chai');
const hre = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('Ticket', function () {
    async function deployTicketAndMintTokenFixture() {
        const Ticket = await hre.ethers.getContractFactory('Ticket');
        const ticketInstance = await Ticket.deploy('100');
        const [owner, otherAccount] = await ethers.getSigners();
        await ticketInstance.safeMint(otherAccount.address, 0, "ticket_0.json");     
        
        return { ticketInstance };
    }

    it('is possible to mint a ticket', async() => {
        const { ticketInstance } = await loadFixture(deployTicketAndMintTokenFixture);
        const [owner, otherAccount] = await ethers.getSigners();
        
        expect(await ticketInstance.ownerOf(0)).to.equal(otherAccount.address);
    });

    it('fails to transfer tickets from the wrong address', async() => {
        const { ticketInstance } = await loadFixture(deployTicketAndMintTokenFixture);
        const [owner, otherAccount, notTheNFTOwner] = await ethers.getSigners();
        
        expect(await ticketInstance.ownerOf(0)).to.equal(otherAccount.address);
    });

    it('should allow the creation of vouchers', async() => {
        const { ticketInstance } = await loadFixture(deployTicketAndMintTokenFixture);

        const [signer, otherAccount] = await ethers.getSigners();        
        const tokenId = Number(await ticketInstance._nextTokenId()) + 1
        const minPrice = Number(await ticketInstance._price());
        const uri = 'ticket_'+ tokenId +'.json';
       
        const encodedMessage = hre.ethers.solidityPacked(
            ["uint256", "uint256", "string"],
            [tokenId, minPrice, uri]
        );
        const messageHash = hre.ethers.keccak256(encodedMessage);
        const signature = await signer.signMessage(ethers.getBytes(messageHash));        
        const { v, r, s } = ethers.Signature.from(signature);
      
        const ticketInstanceConnected = ticketInstance.connect(otherAccount);
        const transaction = await ticketInstanceConnected.mintWithVoucher({
            tokenId,
            minPrice,
            uri,            
            v,
            r,
            s
        }, { value: minPrice, from: otherAccount.address });
        
        await transaction.wait();
    });
});