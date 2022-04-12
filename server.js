const express = require("express");
const moment = require("moment");
const path = require("path");
const app = express();

const port = 80;

app.get("/", (req, res) => {
    let today = new Date();
    let date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    console.log(`GET request received at ${date}`);

    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use(express.static(path.join(__dirname, "public"), { index: "_" }));

app.listen(port, () => {
    console.log(`Listening on 'http://localhost:${port}'`);
});