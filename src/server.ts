import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as cors from 'cors';
import { upgradeShip } from './upgrade';
import { loadMineRate, loadStorage, loadQuest, loadOreInfo, loadResearch } from './resources';
import { incrementOre } from './mining';
import { sellOre, buyOre, updateCostsMarket } from './market';
import { searchAster, chooseAsteroid, rejectResults, updateAsteroidTimer } from './asteroid';
import { calculRanking } from './ranking';
import { updateQuestUser, initQuestGroup } from './quest';
//import { resetUsers } from './databaseSetUp';



const app = express();
const server = new http.Server(app);
const io = socketIO(server);
app.use(cors());

Promise.all([loadMineRate(), loadStorage(),
loadQuest(), loadResearch(), loadOreInfo()]).then(() => {
    server.listen(4000, (err: Error) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Server listen on 4000");
            setInterval(() => {
                updateCostsMarket();
            }, 1000 * 10);
            setInterval(() => {
                updateQuestUser();
            }, 1000 * 60 * 60 * 3);
            setInterval(() => {
                calculRanking();
            }, 1000 * 60);
            setInterval(() => {
                initQuestGroup();
            }, 1000 * 60 * 60 * 24);
        }
    });
});


io.on("connection", (socket: SocketIO.Socket) => {

    socket.on('userLogged', (message) => {
        verifyTimers(message);
    });

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

    socket.on('chooseAsteroid', (message) => {
        chooseAsteroid(message);
    });

    socket.on('rejectResults', (message) => {
        rejectResults(message);
    });

    socket.on('updateAsteroidTimer',(message)=>{
        updateAsteroidTimer(message);
    });

})


function verifyTimers(message) {
    updateAsteroidTimer(message);
}
