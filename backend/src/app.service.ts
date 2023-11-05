import { Injectable } from '@nestjs/common';
const { ethers } = require("ethers");
const fs = require('fs');

@Injectable()
export class AppService {
  private readonly mnemonic: string;
  private readonly infuraProjectId: string;
  private readonly contractAddress: string;
  private readonly networkURL: string;
  private readonly contractPath: string;
  private tokenId: number;
  private minPrice: number;
  private uri: string;

  constructor() {
    this.mnemonic = process.env.MNEMONIC;
    this.infuraProjectId = process.env.INFURA_PROJECT_ID;
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.networkURL = process.env.NETWORK_URL;
    this.contractPath = process.env.CONTRACT_PATH;
  }

  async getEventData(): Promise<any> {    
    await this.setTicketData();

    return {
      eventName: 'Event Name',
      eventDescription: 'Event Description.',
      eventDate: 'Event Date',
      eventTime: 'Event Time',
      eventLocal: 'Event Local',
      tokenId: this.tokenId,
      minPrice: this.minPrice,
      uri: this.uri
    };
  }

  async setTicketData(): Promise<any> {
    const contractJson = JSON.parse(fs.readFileSync(this.contractPath, 'utf8'));
    const provider = new ethers.JsonRpcProvider(this.networkURL + this.infuraProjectId);
    const contract = new ethers.Contract(this.contractAddress, contractJson.abi, provider);
    this.minPrice = Number(await contract._price());
    this.tokenId = Number(await contract._nextTokenId()) + 1;
    this.uri = 'ticket_'+ this.tokenId +'.json';    
  }

  getContract(): object {
    return {
      contractAddress: this.contractAddress,
      contract: JSON.parse(fs.readFileSync(this.contractPath, 'utf8'))
    }
  }

  async signMessage(): Promise<any> {
    const signer          = await this.getSigner();        
    const encodedMessage  = ethers.solidityPacked(
      ["uint256", "uint256", "string"],
      [this.tokenId, this.minPrice, this.uri]
    );
    const messageHash     = ethers.keccak256(encodedMessage);
    const signature       = await signer.signMessage(ethers.getBytes(messageHash));    
    const { v, r, s }     = ethers.Signature.from(signature);

    return { v, r, s };
  }

  private async getSigner() {
    const provider = new ethers.JsonRpcProvider(this.networkURL + this.infuraProjectId);
    const walletMnemonic = ethers.Wallet.fromPhrase(this.mnemonic);
    const signer = new ethers.Wallet(walletMnemonic.privateKey, provider);
    
    return signer;
  };
}
