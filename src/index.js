const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function hex2str(hex) {
  return ethers.toUtf8String(hex)
}

function str2hex(payload) {
  return ethers.hexlify(ethers.toUtf8Bytes(payload))
}

function isNumeric(num) {
  return !isNaN(num)
}

let balances = {}
let nfts = {}
let transactions = []

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
 
  const metadata = data["metadata"]
  const sender = metadata["msg_sender"]
  const payload = data["payload"]

  let txData = JSON.parse(hex2str(payload))
  
  if (txData.type === "transfer") {
    return handleTokenTransfer(sender, txData);
  } else if (txData.type === "mint_nft") {
    return handleNFTMint(sender, txData);
  } else if (txData.type === "transfer_nft") {
    return handleNFTTransfer(sender, txData);
  } else {
    return rejectWithReason("Invalid transaction type");
  }
}

async function handleTokenTransfer(sender, txData) {
  if (!txData.to || !isNumeric(txData.amount)) {
    return rejectWithReason("Invalid transaction data");
  }

  const amount = parseFloat(txData.amount);
  if (amount <= 0) {
    return rejectWithReason("Amount must be positive");
  }

  if (!balances[sender] || balances[sender] < amount) {
    return rejectWithReason("Insufficient balance");
  }

  balances[sender] -= amount;
  balances[txData.to] = (balances[txData.to] || 0) + amount;

  transactions.push({
    type: "token_transfer",
    from: sender,
    to: txData.to,
    amount: amount,
    timestamp: new Date().toISOString()
  });

  await sendNotice(`Transferred ${amount} tokens from ${sender} to ${txData.to}`);
  return "accept";
}

async function handleNFTMint(sender, txData) {
  if (!txData.tokenId || !txData.metadata) {
    return rejectWithReason("Invalid NFT data");
  }

  if (nfts[txData.tokenId]) {
    return rejectWithReason("NFT already exists");
  }

  nfts[txData.tokenId] = {
    owner: sender,
    metadata: txData.metadata
  };

  transactions.push({
    type: "nft_mint",
    by: sender,
    tokenId: txData.tokenId,
    metadata: txData.metadata,
    timestamp: new Date().toISOString()
  });

  await sendNotice(`Minted NFT ${txData.tokenId} to ${sender}`);
  return "accept";
}

async function handleNFTTransfer(sender, txData) {
  if (!txData.to || !txData.tokenId) {
    return rejectWithReason("Invalid NFT transfer data");
  }

  if (!nfts[txData.tokenId] || nfts[txData.tokenId].owner !== sender) {
    return rejectWithReason("You don't own this NFT");
  }

  nfts[txData.tokenId].owner = txData.to;

  transactions.push({
    type: "nft_transfer",
    from: sender,
    to: txData.to,
    tokenId: txData.tokenId,
    timestamp: new Date().toISOString()
  });

  await sendNotice(`Transferred NFT ${txData.tokenId} from ${sender} to ${txData.to}`);
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  
  const payload = data["payload"]
  const route = hex2str(payload)
  let responseObject

  if (route === "balances") {
    responseObject = JSON.stringify(balances)
  }
  else if (route === "transactions") {
    responseObject = JSON.stringify(transactions)
  }
  else if (route.startsWith("balance:")) {
    const address = route.split(":")[1]
    responseObject = JSON.stringify({ balance: balances[address] || 0 })
  }
  else if (route === "nfts") {
    responseObject = JSON.stringify(nfts)
  }
  else if (route.startsWith("nft:")) {
    const tokenId = route.split(":")[1]
    responseObject = JSON.stringify(nfts[tokenId] || "NFT not found")
  }
  else {
    responseObject = "route not implemented"
  }

  await sendReport(responseObject);
  return "accept";
}

async function sendNotice(message) {
  await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: str2hex(message) }),
  });
}

async function sendReport(message) {
  await fetch(rollup_server + "/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: str2hex(message) }),
  });
}

async function rejectWithReason(reason) {
  await sendReport(reason);
  return "reject";
}
var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();