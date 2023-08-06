const express = require('express');
const configs = require('./config.json');
const {getActiveWithOutPort, cleanLog, getActiveWithPort} = require("./functions");
const axios = require("axios");
let isAuth = false;

let lastStates = [];

let axiosInstance = axios.create({baseURL: `http://${configs.xui}`});

axiosInstance.post('/login',
    {username: 'admin', password: 'admin'}
)
    .then(res => {
        if (res.data.success) {
            const [cookie] = res.headers["set-cookie"];
            axiosInstance.defaults.headers.Cookie = cookie;
            isAuth = true;
        } else {
            console.log('error');
        }
    })
    .catch(e => {
        console.log(e);
    });

Array.prototype.avg = function () {
    if (this.length == 0) {
        return 0;
    }
    let total = 0;
    this.forEach(e => total += e);

    return parseInt(total / this.length);
}

setInterval(async () => {
    if (isAuth) {
        let result = await axiosInstance.post('/server/status');
        console.clear();
        console.log(lastStates.avg());

        if (lastStates.length <= 60) {
            lastStates.push(result.data.obj.netIO.up + result.data.obj.netIO.down);
        } else {
            lastStates.shift();
            lastStates.push(result.data.obj.netIO.up + result.data.obj.netIO.down);
        }
    }
}, configs.interval);

const app = express();

app.get('/get', (req, res) => {
    return res.send({user_online: lastStates.avg()});
});


app.listen(configs.appListenOn, () => {
    console.log("app run");
})