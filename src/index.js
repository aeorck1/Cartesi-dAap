const { ethers } = require("ethers");
const fetch = require("node-fetch");
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

// Utility functions
function hex2str(hex) {
  return ethers.toUtf8String(hex);
}
function str2hex(payload) {
  return ethers.hexlify(ethers.toUtf8Bytes(payload));
}
function isNumeric(num) {
  return !isNaN(num);
}

// Data storage
let balances = {};
let nfts = {};
let transactions = [];

// Token transfer
async function handleTokenTransfer(sender, txData) {
  const { to: recipient, amount: rawAmount } = txData;
  const amount = parseFloat(rawAmount);

  if (amount <= 0 || !isNumeric(amount)) {
    return rejectWithReason("Invalid amount");
  }
  if (!balances[sender] || balances[sender] < amount) {
    return rejectWithReason("Insufficient balance");
  }
  
  // Perform the transfer
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + amount;
  
  transactions.push({
    type: "token_transfer",
    from: sender,
    to: recipient,
    amount: amount,
    timestamp: new Date().toISOString(),
  });

  await sendNotice(`Transferred ${amount} tokens from ${sender} to ${recipient}`);
  return "accept";
}

// NFT mint
async function handleNFTMint(sender, txData) {
  const { tokenId, metadata } = txData;

  if (!tokenId || !metadata) {
    return rejectWithReason("Invalid NFT data");
  }
  if (nfts[tokenId]) {
    return rejectWithReason("NFT already exists");
  }

  nfts[tokenId] = {
    owner: sender,
    metadata: metadata,
  };

  transactions.push({
    type: "nft_mint",
    by: sender,
    tokenId: tokenId,
    metadata: metadata,
    timestamp: new Date().toISOString(),
  });

  await sendNotice(`Minted NFT ${tokenId} to ${sender}`);
  return "accept";
}

// NFT transfer
async function handleNFTTransfer(sender, txData) {
  const { tokenId, to: recipient } = txData;

  if (!tokenId || !recipient) {
    return rejectWithReason("Invalid NFT transfer data");
  }
  if (!nfts[tokenId] || nfts[tokenId].owner !== sender) {
    return rejectWithReason("You don't own this NFT");
  }

  // Perform the NFT transfer
  nfts[tokenId].owner = recipient;

  transactions.push({
    type: "nft_transfer",
    from: sender,
    to: recipient,
    tokenId: tokenId,
    timestamp: new Date().toISOString(),
  });

  await sendNotice(`Transferred NFT ${tokenId} from ${sender} to ${recipient}`);
  return "accept";
}

// Balance query
async function handleBalanceQuery(address) {
  return balances[address] || 0;
}

// Transaction history query
async function handleTransactionHistory() {
  return transactions;
}

// NFT ownership query
async function handleNFTOwnership(tokenId) {
  return nfts[tokenId] ? nfts[tokenId].owner : "NFT not found";
}

// Send notice/report to Rollup server
async function sendNotice(message) {
  await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: str2hex(message) }),
  });
}

// Reject with reason
async function rejectWithReason(reason) {
  await sendNotice(reason);
  return "reject";
}

// CLI interface
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Enter command (token_transfer, nft_mint, nft_transfer, balance_query, transaction_history, nft_ownership): ",
  async (command) => {
    try {
      switch (command) {
        case "token_transfer":
          const sender = await askQuestion("Enter sender address: ");
          const recipient = await askQuestion("Enter recipient address: ");
          const amount = await askQuestion("Enter amount: ");
          console.log(
            await handleTokenTransfer(sender, { to: recipient, amount })
          );
          break;
        case "nft_mint":
          const owner = await askQuestion("Enter owner address: ");
          const tokenId = await askQuestion("Enter NFT token ID: ");
          const metadata = await askQuestion("Enter NFT metadata: ");
          console.log(await handleNFTMint(owner, { tokenId, metadata }));
          break;
        case "nft_transfer":
          const nftSender = await askQuestion("Enter sender address: ");
          const nftRecipient = await askQuestion("Enter recipient address: ");
          const nftTokenId = await askQuestion("Enter NFT token ID: ");
          console.log(await handleNFTTransfer(nftSender, { to: nftRecipient, tokenId: nftTokenId }));
          break;
        case "balance_query":
          const address = await askQuestion("Enter address: ");
          console.log(await handleBalanceQuery(address));
          break;
        case "transaction_history":
          console.log(await handleTransactionHistory());
          break;
        case "nft_ownership":
          const ownershipTokenId = await askQuestion("Enter NFT token ID: ");
          console.log(await handleNFTOwnership(ownershipTokenId));
          break;
        default:
          console.log("Invalid command");
      }
    } catch (error) {
      console.error("Error executing command:", error);
    } finally {
      rl.close();
    }
  }
);

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}
