const fs = require('fs');
const path = require("path");

const getLogPath = () => {
    return path.join(path.join(__dirname, '..'), '3xipl-access-persistent.log')
}

const getLastRecord = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await fs.promises.readFile(getLogPath());
            resolve(result.toString().split("\n"));
        } catch (e) {
            reject(e)
        }
    });
}

const isNumber = (n) => {
    switch (n) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            return true;
        default:
            return false
    }
}

async function getActiveWithPort() {
    console.log('getUsers')
    let file = await getLastRecord();
    let ips = [];
    file.forEach((ele) => {
        const ip = ele.split(' ')[2];

        if (ip && ip.split(':')[0] !== '127.0.0.1' && ele.split(' ')[3] === 'accepted' && isNumber(ip[0])) {
            if (!ips.includes(ip)) {
                ips.push(ip);
            }
        }

    });
    return ips;
}

async function getActiveWithOutPort() {
    console.log('get users with out ports')
    let file = await getLastRecord();
    let ips = [];
    file.forEach((ele) => {
        const ip = ele.split(' ')[2]?.split(':')[0];

        if (ip && ip !== '127.0.0.1' && ele.split(' ')[3] === 'accepted' && isNumber(ip[0])) {
            if (!ips.includes(ip)) {
                ips.push(ip);
            }
        }

    });
    return ips;
}

function cleanLog() {
    console.log('cleaning...')
    fs.writeFile(getLogPath(), '', (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    isNumber,
    getLogPath,
    getLastRecord,
    getActiveWithPort,
    getActiveWithOutPort,
    cleanLog
}