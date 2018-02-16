import { defaultDatabase } from "./environment";



/**
 * 
 * @param message [user] : userId 
 * @param message [email]: userEmail
 * 
 */
export function initializeUser(message) {

    let json = {};

    json["boosts"] = {};
    json["boosts"]["0"] = {};
    json["boosts"]["0"]["boughtQuantity"] = 0;
    json["boosts"]["0"]["usedQuantity"] = 0;
    json["boosts"]["0"]["start"] = 0;
    json["boosts"]["0"]["timer"] = 0;
    json["boosts"]["0"]["active"] = 0;

    json["frenzy"] = {};

    json["frenzy"]["info"] = {};
    json["frenzy"]["info"]["nextCombos"] = 0;
    json["frenzy"]["info"]["state"] = 0;

    json["frenzy"]["time"] = {};
    json["frenzy"]["time"]["start"] = 0;
    json["frenzy"]["time"]["timer"] = 0;

    json["asteroid"] = {};
    json["asteroid"]["capacity"] = 1000;
    json["asteroid"]["currentCapacity"] = 1000;
    json["asteroid"]["ore"] = "carbon";
    json["asteroid"]["purity"] = 100;
    json["asteroid"]["seed"] = "01230123";
    json["asteroid"]["collectible"] = 0;

    json["miningInfo"]= {};
    json["miningInfo"]["clickGauge"] = 0;
    json["miningInfo"]["lastClickExplosion"] = 0;
    json["miningInfo"]["lastTick"] = 0;

    json["ore"] = {};
    json["ore"]["carbon"] = 0;
    json["ore"]["titanium"] = 0;
    json["ore"]["iron"] = 0;
    json["ore"]["hyperium"] = 0;
    json["ore"]["gold"] = 0;


    json["chest"] = {};
    json["chest"]["numberOfChest"] = 0;

    json["profile"] = {};

    json["event"] = 0;

    json["quest"] = {};
    json["quest"]["gain"] = -1;

    json["upgrade"] = {};
    json["upgrade"]["mineRate"] = {};
    json["upgrade"]["mineRate"]["timer"] = 0;
    json["upgrade"]["mineRate"]["start"] = 0;

    json["upgrade"]["storage"] = {};
    json["upgrade"]["storage"]["timer"] = 0;
    json["upgrade"]["storage"]["start"] = 0;

    json["upgrade"]["research"] = {};
    json["upgrade"]["research"]["timer"] = 0;
    json["upgrade"]["research"]["start"] = 0;

    json["upgrade"]["engine"] = {};
    json["upgrade"]["engine"]["timer"] = 0;
    json["upgrade"]["engine"]["start"] = 0;

    json["upgrade"]["QG"] = {};
    json["upgrade"]["QG"]["timer"] = 0;
    json["upgrade"]["QG"]["start"] = 0;

    json["score"] = 0;

    json["cargo"] = {};
    json["cargo"]["availableCargo"] = 1;

    json["cargo"]["cargo1"] = {};
    json["cargo"]["cargo1"]["start"] = 0;
    json["cargo"]["cargo1"]["timer"] = 0;

    json["cargo"]["cargo1"]["ore"] = {};
    json["cargo"]["cargo1"]["ore"]["value"] = 0;
    json["cargo"]["cargo1"]["ore"]["type"] = '';

    json["search"] = {};
    json["search"]["result"] = 0;
    json["search"]["timer"] = 0;
    json["search"]["start"] = 0;
    json["search"]["state"] = 0;


    json["profile"]["email"] = message.email;
    json["profile"]["name"] = message.pseudo;
    json["profile"]["badConfig"] = 1;
    json["profile"]["address"] = 0;

    json["upgrade"]["mineRate"]["lvl"] = 1;
    json["upgrade"]["storage"]["lvl"] = 1;
    json["upgrade"]["research"]["lvl"] = 1;
    json["upgrade"]["engine"]["lvl"] = 1;
    json["upgrade"]["QG"]["lvl"] = 1;

    json["credit"] = 0;

    defaultDatabase.ref("users/" + message.user).set(json);
}

export function addField() {
    defaultDatabase.ref("users/").once('value').then((user) => {

        let allUsers = user.val();
        let usersId = Object.keys(allUsers);

        let json = {};

        for (let i = 0; i < usersId.length; i++) {

            json["boosts"]= {};
            json["boosts"]["0"] = {};
            json["boosts"]["0"]["boughtQuantity"] = allUsers[usersId[i]].boosts[0].boughtQuantity;
            json["boosts"]["0"]["usedQuantity"] = allUsers[usersId[i]].boosts[0].usedQuantity;
            json["boosts"]["0"]["start"] = allUsers[usersId[i]].boosts[0].start;
            json["boosts"]["0"]["timer"] = allUsers[usersId[i]].boosts[0].timer;
            json["boosts"]["0"]["active"] = allUsers[usersId[i]].boosts[0].active;

            
            json["miningInfo"]= {};
            json["miningInfo"]["clickGauge"] = 0;
            json["miningInfo"]["lastClickExplosion"] = 0;
            json["miningInfo"]["lastTick"] = 0;

            json["frenzy"] = {};

            json["frenzy"]["info"] = {};
            json["frenzy"]["info"]["nextCombos"] = 0;
            json["frenzy"]["info"]["state"] = 0;

            json["frenzy"]["time"] = {};
            json["frenzy"]["time"]["start"] = 0;
            json["frenzy"]["time"]["timer"] = 0;

            json["cargo"] = allUsers[usersId[i]].cargo;

            json["asteroid"] = {};
            json["asteroid"]["capacity"] = allUsers[usersId[i]].asteroid.capacity;
            json["asteroid"]["currentCapacity"] = allUsers[usersId[i]].asteroid.currentCapacity;
            json["asteroid"]["ore"] = allUsers[usersId[i]].asteroid.ore;
            json["asteroid"]["purity"] = allUsers[usersId[i]].asteroid.purity;
            json["asteroid"]["seed"] = allUsers[usersId[i]].asteroid.seed;
            json["asteroid"]["collectible"] = 0;

            json["ore"] = {};


            json["chest"] = allUsers[usersId[i]].chest;

            json["profile"] = {};

            json["event"] = allUsers[usersId[i]].event;

            json["quest"] = allUsers[usersId[i]].quest;

            json["upgrade"] = {};
            json["upgrade"]["mineRate"] = {};
            json["upgrade"]["mineRate"]["timer"] = allUsers[usersId[i]].upgrade.mineRate.timer;
            json["upgrade"]["mineRate"]["start"] = allUsers[usersId[i]].upgrade.mineRate.start;

            json["upgrade"]["storage"] = {};
            json["upgrade"]["storage"]["timer"] = allUsers[usersId[i]].upgrade.storage.start;
            json["upgrade"]["storage"]["start"] = allUsers[usersId[i]].upgrade.storage.start;

            json["upgrade"]["research"] = {};
            json["upgrade"]["research"]["timer"] = allUsers[usersId[i]].upgrade.research.start;
            json["upgrade"]["research"]["start"] = allUsers[usersId[i]].upgrade.research.start;

            json["upgrade"]["engine"] = {};
            json["upgrade"]["engine"]["timer"] = allUsers[usersId[i]].upgrade.engine.start;
            json["upgrade"]["engine"]["start"] = allUsers[usersId[i]].upgrade.engine.start;

            json["upgrade"]["QG"] = {};
            json["upgrade"]["QG"]["timer"] = allUsers[usersId[i]].upgrade.QG.start;
            json["upgrade"]["QG"]["start"] = allUsers[usersId[i]].upgrade.QG.start;

            json["score"] = allUsers[usersId[i]].score;

            json["search"] = {};
            json["search"]["result"] = allUsers[usersId[i]].search.result;
            json["search"]["timer"] = allUsers[usersId[i]].search.timer;
            json["search"]["start"] = allUsers[usersId[i]].search.start;
            json["search"]["state"] = allUsers[usersId[i]].search.state;

            json["profile"]["email"] = allUsers[usersId[i]].profile.email;
            json["profile"]["name"] = allUsers[usersId[i]].profile.name;
            json["profile"]["badConfig"] = allUsers[usersId[i]].profile.badConfig;
            json["profile"]["address"] = 0;

            json["upgrade"]["mineRate"]["lvl"] = allUsers[usersId[i]].upgrade.mineRate.lvl;
            json["upgrade"]["storage"]["lvl"] = allUsers[usersId[i]].upgrade.storage.lvl;
            json["upgrade"]["research"]["lvl"] = allUsers[usersId[i]].upgrade.research.lvl;
            json["upgrade"]["engine"]["lvl"] = allUsers[usersId[i]].upgrade.engine.lvl;
            json["upgrade"]["QG"]["lvl"] = allUsers[usersId[i]].upgrade.QG.lvl;

            json["ore"]["carbon"] = allUsers[usersId[i]]["ore"]["carbon"];
            json["ore"]["titanium"] = allUsers[usersId[i]]["ore"]["titanium"];
            json["ore"]["iron"] = allUsers[usersId[i]]["ore"]["iron"];
            json["ore"]["hyperium"] = allUsers[usersId[i]]["ore"]["hyperium"];
            json["ore"]["gold"] = allUsers[usersId[i]]["ore"]["gold"];

            json["credit"] = allUsers[usersId[i]].credit;

            defaultDatabase.ref("users/" + usersId[i]).set(json);
        }
    });
}