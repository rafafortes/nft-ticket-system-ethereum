const hre = require("hardhat");

(async () => {
    try {
        const Ticket = await hre.ethers.getContractFactory("Ticket");

        const ticketInstance = await Ticket.deploy(100);
    } catch (e) {
        console.error(e);
        process.exitCode = 1;
    }
})();