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
                quest_1.updateQuestUser();
            }, 1000 * 60 * 60 * 3);
            setInterval(() => {
                ranking_1.calculRanking();
            }, 1000 * 60);
            setInterval(() => {
                quest_1.initQuestGroup();
            }, 1000 * 60 * 60 * 24);
        }
    });
});
io.on("connection", (socket) => {
    socket.on('userLogged', (message) => {
        verifyTimers(message);
    });
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
    socket.on('researchFinished', (message) => {
        asteroid_1.researchFinished(message);
    });
    socket.on('chooseAsteroid', (message) => {
        asteroid_1.chooseAsteroid(message);
    });
    socket.on('arrivedToAsteroid', (message) => {
        asteroid_1.travelFinished(message);
    });
    socket.on('rejectResults', (message) => {
        asteroid_1.rejectResults(message);
    });
});
function verifyTimers(message) {
    asteroid_1.researchFinished(message);
    asteroid_1.travelFinished(message);
}
//# sourceMappingURL=server.js.map