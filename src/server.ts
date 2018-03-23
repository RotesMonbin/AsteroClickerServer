import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as cors from 'cors';
import { upgradeShipCredit, upgradeShipOre, updateUpgradeTimer } from './upgrade';
import { loadQuest, loadOreInfo, generateResources, resources, initializeTrading } from './resources';
import { breakIntoCollectible, reachFrenzy, validArrow, pickUpCollectible, updateClickGauge } from './mining';
import { sellOre, buyOre, updateCostsMarket, updateLastDayCosts, updateLastHourCosts } from './market';
import { searchAster, chooseAsteroid, rejectResults, updateAsteroidTimer } from './asteroid';
import { changeBadConfig } from './profile';

import { calculRanking } from './ranking';
import { updateQuestUser, initQuestGroup, giveGainUser, newChest, checkQuestForAddChest, deleteEvent } from './quest';
import { initializeUser, addField } from './databaseSetUp';
import { upgradeTimerAllCargo } from './cargo';
import { Boost, activateBoost, upsertUserBoosts } from './boost';
import { EventLog } from 'web3/types';
import { nextStep } from './tutorial';
import { sendUser } from './initializeUser';


const app = express();
const server = new http.Server(app);
const io = socketIO(server);
app.use(cors());

let connectedClient: string[] = new Array();

Promise.all([loadQuest(), loadOreInfo()]).then(() => {
    server.listen(process.env.PORT || 4000, (err: Error) => {
        if (err) {
            console.log(err);
        } else {
            generateResources();
            let startMarket: boolean = false;
            process.argv.forEach(function (val) {
                if (val == "market") {
                    startMarket = true;
                }
            });
            console.log(`Server listen on ${process.env.PORT || 4000}`);
            if (startMarket) {
                console.log("market started");
                setInterval(() => {
                    updateCostsMarket();
                }, 1000 * 2);
            }
            setInterval(() => {
                updateQuestUser();
            }, 1000 * 60 * 60);
            setInterval(() => {
                calculRanking();
                checkQuestForAddChest();
            }, 1000 * 10);
            setInterval(() => {
                initQuestGroup();
            }, 1000 * 60 * 60 * 24);
            setInterval(() => {
                updateLastDayCosts();
            }, 1000 * 60 * 60);
            setInterval(() => {
                updateLastHourCosts();
            }, 1000 * 60);
        }
    });
});


io.on("connection", (socket: SocketIO.Socket) => {
    socket.on('initializeUser', (message) => {
        initializeUser(message);
    });

    socket.on('authentify', (userId: string) => {
        socket.id = userId;

        if (!userAlreadyConnected(userId)) {
            connectedClient.push(userId);
            launchlistner(socket, userId);
        }

    });
});

function userAlreadyConnected(id: string) {
    for (let i = 0; i < connectedClient.length; i++) {
        if (connectedClient[i] == id) {
            return true;
        }
    }
    return false;
}

function launchlistner(socket: SocketIO.Socket, userId: string) {
    socket.on('disconnect', () => {
        const i = connectedClient.indexOf(socket.id);
        connectedClient.splice(i, 1);
    });

    socket.on('breakIntoCollectible', (message) => {
        breakIntoCollectible(message);
    });

    socket.on('pickUpCollectible', (message) => {
        pickUpCollectible(message);
    });

    socket.on('updateClickGauge', (message) => {
        updateClickGauge(message);
    });

    socket.on('upgradeShipCredit', (message) => {
        upgradeShipCredit(message);
    });

    socket.on('upgradeShipOre', (message) => {
        upgradeShipOre(message);
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

    socket.on('chooseAsteroid', (message) => {
        chooseAsteroid(message);
    });

    socket.on('rejectResults', (message) => {
        rejectResults(message);
    });

    socket.on('updateAsteroidTimer', (message) => {
        updateAsteroidTimer(message);
    });

    socket.on('updateUpgradeTimer', (message) => {
        updateUpgradeTimer(message);
    });

    socket.on('updateCargoTimer', (message) => {
        upgradeTimerAllCargo(message);
    });


    socket.on('removeChest', (message) => {
        giveGainUser(message);
    })

    socket.on('newChest', (message) => {
        newChest(message);
    })

    socket.on('deleteEvent', (message) => {
        deleteEvent(message);
    })

    socket.on('reachFrenzy', (message) => {
        reachFrenzy(message);
    });

    socket.on('validArrow', (message) => {
        validArrow(message);
    });

    socket.on('changeBadConfig', (message) => {
        changeBadConfig(message);
    });

    socket.on('upsertUserBoosts', (message) => {
        upsertUserBoosts(message);
    });

    socket.on('activateBoost', (message) => {
        activateBoost(message);
    });

    socket.on('nextStep', (message) => {
        nextStep(message);
    });

    socket.emit('sendResources', resources);
    sendUser(userId).then((user) => {
        socket.emit('sendUser', user.val());
    });


}

export function getConnectedUserCount() {
    return Object.keys(io.sockets.sockets).length;
}

/*function startWatchers() {
    boost.Transfer()
        .on('data', (event: EventLog) => {
            console.log("id =" + event.returnValues["idBoost"] + " quantity=" + event.returnValues["numberOfBoost"] + " addr=" + event.returnValues["0"]);
            addBoostToUser(event.returnValues["idBoost"], event.returnValues["numberOfBoost"], event.returnValues["0"]);
        })
        .on('error', (error: Error) => {
            console.log("error " + error.message);

            boost = new Boost();
            startWatchers();
        });
}*/


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});