const express = require("express");
const app = express();
const jsforce = require("jsforce");
require("dotenv").config();
const PORT = 4000;
const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

const con = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL,
});
con.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInfo) => {
  if (err) {
    console.error(`Error from Salesforce: ${err}`);
  } else {
    console.log(`user Id: ${userInfo.id}`);
    console.log(`Org Id: ${userInfo.organizationId}`);
  }
});

app.get("/", (req, res) => {
  con.query(`SELECT id, Name FROM Account`, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log(`Total Records : ${result.totalSize}`);
      res.json(result.records);
    }
  });
  //   res.send("node integrete to salesforce");
});

app.get("/create", (req, res) => {
  // Single record creation
  con.sobject("Account").create({ Name: "My Account #1" }, function (err, ret) {
    if (err || !ret.success) {
      return console.error(err, ret);
    }
    console.log("Created record id : " + ret.id);
    res.send(ret.id);
    // ...
  });
});

app.listen(PORT, () => {
  console.log(`server is started at http://localhost:${PORT}`);
});
