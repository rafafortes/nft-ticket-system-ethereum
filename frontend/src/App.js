import React, { Component } from 'react';
import axios from 'axios';
const { ethers } = require("ethers");
const API_URI = 'http://localhost:3001/';

class App extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      eventName: '',
      eventDescription: '',
      eventDate: '',
      eventTime: '',
      eventLocal: '',
      contractAddress: '',
      contract: '',
      tokenId: '',
      minPrice: '',
      uri: '',
    };    
  }

  componentDidMount() {
    this.fetchEventData();
    this.retrieveContract();
  }

  fetchEventData = async () => {
    try {
      const response = await axios.get(API_URI + 'event-data?_t=' + Date.now());
      this.setState({ 
        eventName: response.data.eventName,
        eventDescription: response.data.eventDescription,
        eventDate: response.data.eventDate,
        eventTime: response.data.eventTime,
        eventLocal: response.data.eventLocal,
        tokenId: response.data.tokenId,
        minPrice: response.data.minPrice,
        uri: response.data.uri
      });
    } catch (error) {
      console.error('Error fetching greeting:', error);
    }
  }

  retrieveContract = async() => {
    try {
      const response = await axios.get(API_URI + 'contract');
      this.setState({ 
        contractAddress: response.data.contractAddress,
        contract: response.data.contract 
      });
    } catch (error) {
      console.error('Error retrieving the contract', error);
    }
  }

  signMessage = async () => {
    let response = {};
    try {
      response = await axios.get(API_URI + 'sign-message');      
    } catch (error) {
      console.error('Error fetching greeting:', error);
    }
    return response.data;
  }

  getSigner = async function () {
    if (!window.ethereum) {
      throw new Error("No crypto wallet found. Please install it.");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
  }

  buyTickets = async () => {
    const response = await this.signMessage();
    const { v, r, s } = response;
    const uri = this.state.uri;
    const tokenId = this.state.tokenId;
    const minPrice = this.state.minPrice;

    const userSigner = await this.getSigner();
    const contract = new ethers.Contract(
      this.state.contractAddress,
      this.state.contract.abi,
      userSigner
    );   

    try {
      const transaction = await contract.mintWithVoucher({
        tokenId,
        minPrice,
        uri,            
        v,
        r,
        s
      }, { value: minPrice });
      
      await transaction.wait();
    } catch (error) {
      console.log("Error when minting: ", error);
    }
  };

  render() {
    return (
      <div>
        <div>
          <h1>{this.state.eventName}</h1>
          <p>{this.state.eventDescription}</p>
          <p>{this.state.eventDate}, {this.state.eventTime}</p>
          <p>{this.state.eventLocal}</p>
        </div>
        <div>
          <button onClick={this.buyTickets}>Buy tickets now!</button>
        </div>
      </div>
    );
  }
}

export default App;
