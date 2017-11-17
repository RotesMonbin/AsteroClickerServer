"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const app = express();
const server = new http.Server(app);
const io = socketIO(server);
app.use(cors());
var admin = require("firebase-admin");
var mineRateUpgrade;
var storageUpgrade;
var asteroidTypes;
var quest;
var serviceAccount = {
    "type": "service_account",
    "project_id": "asteroclicker",
    "private_key_id": "ce28ff07e1cdba7a8cf6681e659008613ebd9c5a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2UP42m5rDh16q\n8gJddMQp3BGvEbaUaT1fqgGTzhJ/LX4qR8zHcJmOim0cdOnBlFmubHMX6Ugy18kp\ntmj4yeWLlko/ra4S2p2nR6becMymKrnRN2bvVhG6OrpCEWO3lQftWwoUIyGIjrXc\nNGIYQ5y03kBtvincEdd5Z826+DH/SGSoBwG5MbdUv7hjanERcrdJXFvS0LP70KUs\npTn7lm+yUr52IU3ZXw2j4zuENcHY/1tRillmbqdPRgHz/d7aLQ8ctHodNTThkM0/\nkbQ40nC1V7S6sQK6Cn8zk4l87BZeJ2cGvTEZg2Tn1nJ35S4+3ZiRL04gnM/tiQEr\n0ULpk6InAgMBAAECggEAKcRoWM5RKFZM49DJpetoPUbDbl4ae+mYO+BQuDHPnv8n\nFjyYt2Aebb9cu9Y07zozSXhi7alt9ufkl//IEKcARXhKzkfVx0/6KiaKHg+tcqv7\nIekVVeNb8FQf857UP2yPAluG9ZIOzqATHb2Kc5CZx/3auMmGAXq86H1Vbm4J1je2\negHU7qKb9fAO1GlxIXeCD6rzVKH4u6dTQYlX5hoRDpk9qfyaZ8pGkqbtbctvnAGt\nm0QSbFyilf5jIX+Wj8Dj2XTgRa7S8EMsyidxWWXPPBrXIY2pGEowBAHqjdAA2y+m\nSJ6CfAXkyxzw+mAEWXflbTYXJULnQMaYrfzAfwL8wQKBgQDgEeJwt/y3QJ9FmFSz\nI5OmiYAMD1V3aUhBFHFHdwiI+krj8EgFpP8dweHnKLH7xXGe26eJqd6sHKfc6NlG\nq5XRuqPvujmoEyfKpwL9pucBVVpCoKLejgYtVS4lBKHot+QbOmjxSHOlGOPpv19/\nSi4FQSJdKVfR9ZRrQATcILDWMQKBgQDQS+7Ft7niOwCM6DP2sVSNm+84jC4/CLpE\nF7ccgZaLE6gGHiQ7ACdbQK3zMKJoNFZcpzyA9GcTzuwmV2G0DdzZBDR0PshAMh79\n73puZZogVEIAtSKoyyWQRWr5vJ6i532M7W2aG7zEMLiPWR+SN44BGcTpreHZp+v3\nnKiWMJjv1wKBgGn968h4L/Ibfnv0T/ShWqHHnyuVQU+IHOa0HdW5Z+8rvqtOKTOK\nViekZBDtviujvVhw/TJwiWWO9JTaDJWSav9Xs16eD9ICpasGD7Me9V07G8Qyqnhu\nZFujVH2sUE5+VkfO/H9OT24EdSNIJItY8qYHppK9EM6/xWJqWSIr0JqxAoGBALM3\nEdpVyH5Ia6HQy5zOWER6zOlnWwbq+HBLw0WojaFdqSySVHPbHwGZddEOoD1uAnw3\ne4wsPF/DolUey7aCUuj5gDQgLGVneljb6ggALQrx09QOBSMbnlcyEueKjSb2a4SM\nZ8e3Y8Odc74KXWqNmAWEaXLxI6gEnbbut/J5H60DAoGAdc8ts7TQNgtdDw8iijkv\nz0F0gRy4H3HN3HDCNrkHRbhng2jZvNTd3i1qD15w2KNCP6vJohTd/Y5RsW2IuBCT\n8cgppuVQBCdo6g12O+riXbRhmPjcM9oOEhsJAwCxjknRucanQB8y2MSjNiLjeueu\ntOJASQBJIe8M/1Mtu2bOhUc=\n-----END PRIVATE KEY-----\n",
    "client_email": "asteroadmin@asteroclicker.iam.gserviceaccount.com",
    "client_id": "104181626588928906233",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/asteroadmin%40asteroclicker.iam.gserviceaccount.com"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://asteroclicker.firebaseio.com"
});
var defaultDatabase = admin.database();
Promise.all([loadMineRate(), loadStorage(), loadAsteroidTypes(), loadQuest()]).then(() => {
    server.listen(4000, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Server listen on 4000");
            setInterval(() => {
                updateQuestUser();
            }, 1000 * 60);
            setInterval(() => {
                calculRanking();
            }, 1000 * 60);
        }
    });
});
io.on("connection", (socket) => {
    socket.on('incrementOre', (message) => {
        incrementOre(message);
    });
    socket.on('upgradeShip', (message) => {
        upgradeShip(message);
    });
    socket.on('sellOre', (message) => {
        sellOre(message);
    });
    socket.on('buyOre', (message) => {
        buyOre(message);
    });
    socket.on('searchAster', (message) => {
        searchAster(message);
    });
});
function incrementOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const maxMinerate = mineRateUpgrade[user.val().mineRateLvl].maxRate *
            asteroidTypes[user.val().asteroid.numAsteroid].mineRate / 100;
        if (data.amount <= maxMinerate) {
            const currentAmount = user.val()[data.ore];
            const maxAmount = storageUpgrade[user.val().storageLvl].capacity;
            if (currentAmount < maxAmount) {
                if (currentAmount + data.amount <= maxAmount) {
                    defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(toFixed2(currentAmount + data.amount));
                    checkQuest(data.ore, data.amount, user.val(), data.user);
                }
                else {
                    defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(maxAmount);
                }
            }
        }
    });
}
function upgradeShip(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentLvl = user.val()[data.upgrade + "Lvl"];
        const cost = getUpgradeFromString(data.upgrade)[currentLvl + 1].cost;
        if (user.val().credit >= cost) {
            defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
            defaultDatabase.ref("users/" + data.user + "/" + data.upgrade + "Lvl").set(currentLvl + 1);
            checkQuest('upgrade' + data.upgrade, 1, user.val(), data.user);
            calculScore(cost, user.val(), data.user);
        }
    });
}
function sellOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentOreAmount = user.val()[data.ore];
        if (currentOreAmount >= data.amount) {
            defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
                var keys = Object.keys(oreValue.val());
                const currentValue = oreValue.val()[keys[29]];
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit + currentValue * data.amount));
                defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(toFixed2(currentOreAmount - data.amount));
                checkQuest('sell' + data.ore, data.amount, user.val(), data.user);
                calculScore(toFixed2(currentValue * data.amount), user.val(), data.user);
            });
            defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
                defaultDatabase.ref("trend/" + data.ore).set(trend.val() - data.amount);
            });
        }
    });
}
function buyOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentCredit = user.val().credit;
        defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
            var keys = Object.keys(oreValue.val());
            const currentValue = oreValue.val()[keys[29]];
            const cost = data.amount * currentValue;
            if (currentCredit >= cost && toFixed2(user.val()[data.ore] + data.amount) <= storageUpgrade[user.val().storageLvl].capacity) {
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
                defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(toFixed2(user.val()[data.ore] + data.amount));
                checkQuest('buy' + data.ore, data.amount, user.val(), data.user);
            }
        });
        defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
            defaultDatabase.ref("trend/" + data.ore).set(trend.val() + data.amount);
        });
    });
}
function searchAster(data) {
    const asteNum = getNewAsteroidType();
    const seed = generateRandomNumber(4) + generateRandomNumber(4);
    defaultDatabase.ref("users/" + data.user + "/asteroid/numAsteroid").set(asteNum);
    defaultDatabase.ref("users/" + data.user + "/asteroid/seed").set(seed);
}
function getNewAsteroidType() {
    return Math.floor(Math.random() * asteroidTypes.length);
}
function generateRandomNumber(range) {
    let seed = "";
    let nums = [];
    for (let i = 0; i < range; i++) {
        nums[i] = i;
    }
    let i = nums.length;
    let j = 0;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        seed = seed + "" + nums[j];
        nums.splice(j, 1);
    }
    return seed;
}
function checkQuest(oreName, values, currentUser, userID) {
    if (currentUser.quest.gain === 0) {
        return;
    }
    if (oreName === currentUser.quest.type) {
        const finalValues = currentUser.quest.values - values;
        if (finalValues <= 0) {
            defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.quest.gain + currentUser.credit);
            calculScore(currentUser.quest.gain, currentUser, userID);
            defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);
            defaultDatabase.ref("users/" + userID + "/quest/values").set(0);
        }
        else {
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(finalValues));
        }
    }
}
function updateQuestUser() {
    defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]];
            if (currentUser.quest.gain != 0) {
                continue;
            }
            const randomQuest = Math.floor((Math.random() * quest.length));
            initQuestUser(randomQuest, userUis[i]);
        }
    });
}
function initQuestUser(i, userID) {
    defaultDatabase.ref("users/" + userID + "/quest/values").set(quest[i].values);
    defaultDatabase.ref("users/" + userID + "/quest/gain").set(quest[i].gain);
    defaultDatabase.ref("users/" + userID + "/quest/name").set(quest[i].name);
    defaultDatabase.ref("users/" + userID + "/quest/type").set(quest[i].type);
    defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
}
function calculScore(amount, user, userID) {
    defaultDatabase.ref("users/" + userID + "/score").set(amount + user.score);
}
function calculRanking() {
    let scoreTab = [];
    defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]];
            scoreTab[i] = {
                name: currentUser.email,
                score: currentUser.score
            };
        }
        scoreTab.sort(sort_by('score', true, parseInt));
        defaultDatabase.ref("ranking").set(scoreTab);
    });
}
function getUpgradeFromString(name) {
    switch (name) {
        case "mineRate":
            return mineRateUpgrade;
        case "storage":
            return storageUpgrade;
        default:
            console.log("Upgrade unknown");
            return null;
    }
}
const sort_by = function (field, reverse, primer) {
    var key = function (x) { return primer ? primer(x[field]) : x[field]; };
    return function (a, b) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
    };
};
function loadMineRate() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("mineRate").once('value').then((snapshot) => {
            mineRateUpgrade = snapshot.val();
            resolve(1);
        });
    });
}
function loadStorage() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("storage").once('value').then((snapshot) => {
            storageUpgrade = snapshot.val();
            resolve(1);
        });
    });
}
function loadAsteroidTypes() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("typeAste").once('value').then((snapshot) => {
            asteroidTypes = snapshot.val();
            resolve(1);
        });
    });
}
function loadQuest() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("quest").once('value').then((snapshot) => {
            quest = snapshot.val();
            resolve(1);
        });
    });
}
function toFixed2(number) {
    return parseFloat(number.toFixed(2));
}
//# sourceMappingURL=server.js.map