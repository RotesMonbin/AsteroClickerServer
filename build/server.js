"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const upgrade_1 = require("./upgrade");
const resources_1 = require("./resources");
const mining_1 = require("./mining");
const market_1 = require("./market");
const asteroid_1 = require("./asteroid");
const ranking_1 = require("./ranking");
const quest_1 = require("./quest");
const app = express();
const server = new http.Server(app);
const io = socketIO(server);
app.use(cors());
Promise.all([resources_1.loadMineRate(), resources_1.loadStorage(),
    resources_1.loadQuest(), resources_1.loadResearch(), resources_1.loadOreInfo()]).then(() => {
    server.listen(4000, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Server listen on 4000");
            setInterval(() => {
                market_1.updateCostsMarket();
            }, 1000 * 10);
            setInterval(() => {
                quest_1.updateQuestUser();
            }, 1000 * 30);
            setInterval(() => {
                ranking_1.calculRanking();
            }, 1000 * 60);
            setInterval(() => {
                quest_1.initQuestGroup();
            }, 1000 * 60 * 60 * 24);
            setInterval(() => {
                market_1.updateMeanCosts();
            }, 1000 * 60 * 60);
        }
    });
});
io.on("connection", (socket) => {
    socket.on('incrementOre', (message) => {
        mining_1.incrementOre(message);
    });
    socket.on('upgradeShip', (message) => {
        upgrade_1.upgradeShip(message);
    });
    socket.on('sellOre', (message) => {
        market_1.sellOre(message);
    });
    socket.on('buyOre', (message) => {
        market_1.buyOre(message);
    });
    socket.on('searchAster', (message) => {
        asteroid_1.searchAster(message);
    });
    socket.on('chooseAsteroid', (message) => {
        asteroid_1.chooseAsteroid(message);
    });
    socket.on('rejectResults', (message) => {
        asteroid_1.rejectResults(message);
    });
    socket.on('updateAsteroidTimer', (message) => {
        asteroid_1.updateAsteroidTimer(message);
    });
    socket.on('updateUpgradeTimer', (message) => {
        upgrade_1.updateUpgradeTimer(message);
    });
    socket.on('removeChest', (message) => {
        quest_1.giveGainUser(message);
    });
    socket.on('newChest', (message) => {
        quest_1.newChest(message);
    });
});
//# sourceMappingURL=server.js.map