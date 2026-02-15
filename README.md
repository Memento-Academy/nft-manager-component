# ⬡ NFT Manager

A decentralized application (dApp) for minting and managing NFTs on the Ethereum Sepolia testnet. Built with React, ethers.js, and Vite.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Ethers.js](https://img.shields.io/badge/ethers.js-v6-7b3fe4)
![Vite](https://img.shields.io/badge/Vite-4-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Mint NFTs** — Preview a random image, shuffle for another, and mint it on-chain with one click
- **View Collection** — Browse your NFTs in a responsive card grid with token IDs
- **Wallet Management** — Connect/disconnect MetaMask with network detection and auto-switch to Sepolia
- **Premium UI** — Dark theme with glassmorphism, gradient accents, micro-animations, and skeleton loading

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React 18, React Router v6             |
| Blockchain | ethers.js v6, MetaMask                |
| Styling    | Vanilla CSS (glassmorphism, CSS Grid) |
| Build      | Vite 4                                |
| Network    | Ethereum Sepolia Testnet              |

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MetaMask](https://metamask.io/) browser extension
- Sepolia testnet ETH ([faucet](https://sepoliafaucet.com/))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Memento-Academy/nft-manager-component.git
cd nft-manager-component
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the project root:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

## How It Works

1. **Connect** your MetaMask wallet (the app will prompt you to switch to Sepolia if needed)
2. **Mint** — On the Mint page, preview a random image. Hit ↻ to shuffle. Click "⬡ Mint NFT" to mint it on-chain
3. **View** — Go to the Collection page to see your NFTs displayed as cards with their token IDs

## Project Structure

```
src/
├── App.jsx              # Root component — routing, wallet logic
├── App.css              # Navbar, layout styles
├── index.css            # Design system (CSS vars, animations)
├── components/
│   ├── MintNFT.jsx      # Mint page with image preview
│   └── ViewNFTs.jsx     # Collection page with card grid
├── CSS/
│   ├── MintNFT.css      # Mint card, shuffle, button styles
│   └── ViewNFT.css      # Card grid, skeleton loading, empty state
└── abis/
    └── contractABI.json # Smart contract ABI
```

## Environment Variables

| Variable                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `VITE_CONTRACT_ADDRESS` | Deployed ERC-721 contract address on Sepolia |
