# 🚀 Enhanced NFT and Token Transfer System on Cartesi

Welcome to my Web3 project! This is a decentralized system built on top of Cartesi, enabling users to transfer tokens, mint and transfer NFTs, check balances, and view transaction history in a fully decentralized manner.

## 🌟 Features

- **Token Transfers:** Users can transfer tokens to other addresses securely on the blockchain.
- **NFT Minting:** Create unique Non-Fungible Tokens (NFTs) with custom metadata.
- **NFT Transfers:** Transfer ownership of NFTs between addresses.
- **Balance Tracking:** Keep track of token balances for all addresses.
- **NFT Ownership:** Track ownership of all minted NFTs.
- **Transaction History:** View a complete history of all token and NFT operations.
- **Inspection Routes:** Check individual balances, view all balances, access transaction history, and query NFT data directly from the app.

## 📚 How It Works

1. **Transferring Tokens:**
   - Users submit transfer requests with recipient address and amount.
   - The app processes these transfers, updates balances, and records the transaction.

2. **Minting NFTs:**
   - Users can mint new NFTs by providing a unique token ID and metadata.
   - The system records the NFT creation and assigns ownership.

3. **Transferring NFTs:**
   - NFT owners can transfer their NFTs to other addresses.
   - The system updates ownership records and logs the transfer.

4. **Inspecting Balances, NFTs, and Transactions:**
   - Users can check individual address balances, view all balances, access the full transaction history, and query NFT data.

5. **Decentralized and Transparent:**
   - All operations are handled in a decentralized environment using Cartesi's Rollups, ensuring transparency and trust.

## 🚀 Getting Started

### Prerequisites

- Node.js
- Cartesi Development Environment
- Docker Desktop

### Installation

1. **Clone the Repository:**

   ```git clone https://github.com/aeorck1/enhanced-nft-token-system.git
   cd enhanced-nft-token-system
   ```

2. **Install Dependencies:**
   ```npm install -g @cartesi/cli
   ```

   **Test if Cartesi is successfully installed on your PC:**
   ```cartesi doctor
   ```
   You should see: ✔ Your system is ready for cartesi.

3. **Build the Application:**
   ```cartesi build
   ```

4. **Run the Application:**
   ```
   cartesi run
   ```

## 🛠️ Usage

### Transferring Tokens:

Send a request to the app's /advance endpoint with transfer details encoded in hexadecimal.
Example:

```json
{
  "payload": "0x7b2274797065223a227472616e73666572222c22746f223a22307831323334222c22616d6f756e74223a3130307d"
}
```
(Hexadecimal for `{"type":"transfer","to":"0x1234","amount":100}`)

### Minting NFTs:

Send a request to mint a new NFT:

```json
{
  "payload": "0x7b2274797065223a226d696e745f6e6674222c22746f6b656e4964223a2231222c226d65746164617461223a7b226e616d65223a2245786368616e6765204e4654227d7d"
}
```
(Hexadecimal for `{"type":"mint_nft","tokenId":"1","metadata":{"name":"Exchange NFT"}}`)

### Transferring NFTs:

Send a request to transfer an NFT:

```json
{
  "payload": "0x7b2274797065223a227472616e736665725f6e6674222c22746f223a22307831323334222c22746f6b656e4964223a2231227d"
}
```
(Hexadecimal for `{"type":"transfer_nft","to":"0x1234","tokenId":"1"}`)

### Checking Balances:

Send a request to the app's /inspect endpoint with the payload "balances" or "balance:address".
Example:

```json
{
  "payload": "0x62616c616e6365733a307831323334"
}
```
(Hexadecimal for "balances:0x1234")

### Viewing Transaction History:

Send a request to the app's /inspect endpoint with the payload "transactions".

### Querying NFT Data:

Send a request to view all NFTs or a specific NFT:

```json
{
  "payload": "0x6e6674733a31"
}
```
(Hexadecimal for "nfts:1")

## 🎯 Roadmap

- Implement Token Minting: Allow creation of new tokens.
- Add Token Burning Mechanism: Implement a way to remove tokens from circulation.
- Introduce Staking: Develop a staking system for token holders.
- Smart Contract Integration: Further decentralize the system by managing advanced features through smart contracts.
- NFT Marketplace: Develop a decentralized marketplace for trading NFTs.

## 📄 License

This project is licensed under the MIT License.

## 📢 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 🌐 Connect with Me

- WhatsApp: https://wa.me/+2349069983946 
- Twitter: @godwinfinity
- GitHub: https://github.com/aeorck1

Thank you for checking out this enhanced Web3 project! I'm excited to share this journey with you all. 🚀