# 🚀 Decentralized Token Transfer System on Cartesi

Welcome to my Web3 project! This is a decentralized token transfer system built on top of Cartesi, where users can transfer tokens, check balances, and view transaction history in a fully decentralized manner.

## 🌟 Features

- **Token Transfers:** Users can transfer tokens to other addresses securely on the blockchain.
- **Balance Tracking:** Keep track of token balances for all addresses.
- **Transaction History:** View a complete history of all token transfers.
- **Inspection Routes:** Check individual balances, view all balances, and access transaction history directly from the app.

## 📚 How It Works

1. **Transferring Tokens:**
   - Users submit transfer requests with recipient address and amount.
   - The app processes these transfers, updates balances, and records the transaction.

2. **Inspecting Balances and Transactions:**
   - Users can check individual address balances, view all balances, or access the full transaction history.

3. **Decentralized and Transparent:**
   - All operations are handled in a decentralized environment using Cartesi's Rollups, ensuring transparency and trust.

## 🚀 Getting Started

### Prerequisites

- Node.js
- Cartesi Development Environment
- DockerDesktop

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/decentralized-token-transfer.git
   cd decentralized-token-transfer```
   
   

2. **Install Dependencies:**
   ```npm install -g @cartesi/cli```

   **Test if Cartesi is succefully installed on your PC**
   ```cartesi doctor```
      ✔ Your system is ready for cartesi.

3. **Run the Application:**
   ```cartesi build```

3. **Run the Application:**
   ```cartesi run```

### 🛠️ Usage

   **Transferring Tokens:**

      Send a request to the app's /advance endpoint with transfer details encoded in hexadecimal.
      Example:

      jsonCopy{
      "payload": "0x7b22746f223a22307831323334222c22616d6f756e74223a3130307d"  // Hexadecimal for {"to":"0x1234","amount":100}
      }

   **Checking Balances:**

      Send a request to the app's /inspect endpoint with the payload "balances" or "balance:address".
      Example:

      jsonCopy{
      "payload": "0x62616c616e6365733a307831323334"  // Hexadecimal for "balances:0x1234"
      }

   **Viewing Transaction History:**

      Send a request to the app's /inspect endpoint with the payload "transactions".



### 🎯 Roadmap

      Implement Token Minting: Allow creation of new tokens.
      Add Token Burning Mechanism: Implement a way to remove tokens from circulation.
      Introduce Staking: Develop a staking system for token holders.
      Smart Contract Integration: Further decentralize the system by managing advanced features through smart contracts.

### 📄 License

      This project is licensed under the MIT License.
      📢 Contributing
      Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
     
     
### 🌐 Connect with Me

      Whatsapp: https://wa.me/+2349069983946 
      Twitter: @godwinfinity
      GitHub: https://github.com/aeorck1


      Thank you for checking out my Web3 project! I'm excited to share this journey with you all. 🚀