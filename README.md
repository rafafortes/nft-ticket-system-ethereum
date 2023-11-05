# NFT Ticket System

This is a NFT Ticket System that can be used by any event that wants to sell tickets through the Ethereum Blockchain. It includes the Smart contract written in Solidity, a backend written in NestJs and a frontend written in React.

## Prerequisites

Node.js v18.17.0 or greater

## API Key and Passphrase

Make sure to create the following file in the root folder of the backend:
- .env

Make sure to create the following files in the root folder of the ethereum:
- .secret (this contains your seed phrase)
- .infura (this container your Infura API Key)
- .etherscan (optional, in case you want to verify the contract, add your etherscan API Key)

## Installation

Installing the backend packages

- cd backend && npm install

Installing the ethereum packages

- cd ethereum && npm install

Installing the frontend packages

- cd frontend && npm install

## Compilation

- cd ethereum && npx hardhat compile

## Tests

- cd ethereum && npx hardhat test

## Deploy

- npx hardhat run --network localhost scripts/deploy.js

## Initialization

- cd backend && npm run start
- cd frontend && npm run start