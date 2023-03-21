const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "048cfc124247d00c0edb5371302396cf2df3c5d034f4cbfffcdbbb7d82057cd63f3e6e33fb8dfd40b27a006cef995b9d50f2e0b53379c1bf1621274081b5b358b3": 100,
  "0493f9d2887f2eeb29c247d10e4bb717906f5d6484045584cbab040565233f2c57a11fb4d86b4c4a77e3cbdec2197e3b303191d731a9794fd935aebf6f89002e8c": 50,
  "04e279cd8aafc78fe5a6498a01f6c7b5328e23bd70b14060db315d689351a8b9d2cc6536abb2a6ea510613eaeeb5149f1a35f96e775d6320403d91d6548b8aa872": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
