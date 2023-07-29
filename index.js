const express = require('express');
const configs = require('./config.json');
const {getActiveWithOutPort, cleanLog, getActiveWithPort} = require("./functions");
let ips = [];
setInterval(() => {
    if (configs.portForce) {
        getActiveWithPort().then((i) => {
            ips = i;
            cleanLog();
        })
    } else {
        getActiveWithOutPort().then((i) => {
            ips = i;
            cleanLog();
        });
    }
}, configs.interval);

const app = express();

app.get('/get', (req, res) => {
    return res.send(ips.length.toString());
});


app.listen(configs.appListenOn, () => {
    console.log("app run");
})