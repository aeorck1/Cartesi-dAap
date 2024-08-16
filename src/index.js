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
let transactions = []

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
 
  const metadata = data["metadata"]
  const sender = metadata["msg_sender"]
  const payload = data["payload"]

  let txData = JSON.parse(hex2str(payload))
  
  if (!txData.to || !isNumeric(txData.amount)) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: str2hex("Invalid transaction data") }),
    });
    return "reject"
  }

  const amount = parseFloat(txData.amount)
  if (amount <= 0) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: str2hex("Amount must be positive") }),
    });
    return "reject"
  }

  if (!balances[sender] || balances[sender] < amount) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: str2hex("Insufficient balance") }),
    });
    return "reject"
  }

  balances[sender] -= amount
  balances[txData.to] = (balances[txData.to] || 0) + amount

  transactions.push({
    from: sender,
    to: txData.to,
    amount: amount,
    timestamp: new Date().toISOString()
  })

  const notice_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(`Transferred ${amount} tokens from ${sender} to ${txData.to}`) }),
  });
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
  else {
    responseObject = "route not implemented"
  }

  const report_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(responseObject) }),
  });

  return "accept";
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