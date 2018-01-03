import { defaultDatabase } from "./environment";
import { quest, oreInfo } from "./resources";
import { toFixed2, getOreAmountFromString } from "./utils";

// Check if the quest is finish 
export function checkQuest(missionName: string, values: number, currentUser, userID) {
    if (currentUser.quest.values === 0) {
        return;
    }
    if (missionName === currentUser.quest.type) {
        const finalValues = currentUser.quest.values - values;
        if (finalValues <= 0) {
            defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.quest.gain + currentUser.credit);
            defaultDatabase.ref("users/" + userID + "/quest/values").set(0);
            defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);
        } else {
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(finalValues));
        }
    }
}

/*
numberOfChest: numberOfChest,
userID: userID
*/
export function giveGainUser(message) {
    defaultDatabase.ref("users/" + message.user + "/chest/numberOfChest").set(message.numberOfChest);
    const stringTempChest = 'chest' + message.numberOfChest;
    defaultDatabase.ref("users/" + message.user + "/chest/" + stringTempChest).once('value').then((chest) => {
        const chestTemp = chest.val();
        defaultDatabase.ref("users/" + message.user).once('value').then((currentUser) => {
            let json = currentUser.val().ore;

            let creditTemp = currentUser.val().credit;
            for (let i = 0; i < 3; i++) {
                if (Object.keys(chestTemp[i])[0] === 'credit') {
                    creditTemp += chestTemp[i][Object.keys(chestTemp[i])[0]];
                } else {
                    regroupGainChest(Object.keys(chestTemp[i])[0], chestTemp[i][Object.keys(chestTemp[i])[0]], json);
                }
            }
            addChestToBase(json, message.user, creditTemp);
        });
    }).then(() => {
        defaultDatabase.ref("users/" + message.user + "/chest/chest" + message.numberOfChest).remove();
    });

}

export function updateQuestUser() {
    defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]]
            if (currentUser.quest.gain != -1) {
                continue;
            }
            const randomQuest = Math.floor((Math.random() * quest.length));
            initQuestUser(randomQuest, userUis[i], currentUser);
        }
    });
}


function initQuestUser(i, userID, currentUser) {
    const questCurrent = quest[i];

    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            let type = randomOre(oreInfo.val());
            let values;
            const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()[type].miningSpeed;
            let typeFinal;
            switch (questCurrent.type) {
                case 'Buy':
                    values = getOreAmountFromString(type, currentUser); // * oreInfo.val()[type].meanValue;
                    typeFinal = 'buy' + type;
                    break;

                case 'Sell':
                    values = mineRateCurrent * 60 * 10;  // * oreInfo.val()[type].meanValue;
                    typeFinal = 'sell' + type;
                    break;

                case 'Retrieve':
                    values = mineRateCurrent * 60 * 20;
                    typeFinal = type;
                    break;

                case 'Upgrade':
                    values = 3;
                    const temp = (Math.floor(Math.random() * 10)) % 2 === 0 ? "storage" : "mineRate";
                    typeFinal = 'upgrade' + temp;
                    type = temp;
                    break;

                case 'Win': // credit
                    values = mineRateCurrent * 60 * 20 * oreInfo.val()[type].meanValue;
                    type = 'Credit';
                    typeFinal = 'credit';
                    break;

                case 'Click':
                    break;
            }
            const text = questCurrent.type + ' ' + toFixed2(values) + ' ' + type;
            defaultDatabase.ref("users/" + userID + "/quest/gain").set(1);
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(values));
            defaultDatabase.ref("users/" + userID + "/quest/valuesFinal").set(toFixed2(values));
            defaultDatabase.ref("users/" + userID + "/quest/name").set(text);
            defaultDatabase.ref("users/" + userID + "/quest/text").set(questCurrent.text);
            defaultDatabase.ref("users/" + userID + "/quest/type").set(typeFinal);
            defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
        });
    });
}

function randomOre(oreName) {
    const keys = Object.keys(oreName);
    const type = (Math.floor(Math.random() * keys.length));

    return (keys[type]);
}


// Glory quest - - - - - - - - - - - - - - -- - - - - - - -- - - - - - -- - - - - - - -- 
export function checkQuestGroup(oreName: string, values: number) {
    if (oreName === 'carbon' || oreName === 'titanium' || oreName === 'iron' || oreName === 'hyperium' || oreName === 'gold') {
        defaultDatabase.ref("questGroup/").once('value').then((questGroup) => {
            const finalValues = questGroup.val().values - values;
            if (finalValues <= 0) {
                defaultDatabase.ref("users/").once('value').then((user) => {
                    const userUis = Object.keys(user.val());
                    for (let i = 0; i < userUis.length; i++) {
                        const currentUser = user.val()[userUis[i]]
                        const creditWin = currentUser.credit + questGroup.val().gain + currentUser.upgrade.score * 0.2;
                        defaultDatabase.ref("users/" + userUis[i] + "/credit").set(creditWin);
                    }
                });
                initQuestGroup();
            } else {
                defaultDatabase.ref("questGroup/values").set(toFixed2(finalValues));
            }
        });

    }
}

export function initQuestGroup() {
    defaultDatabase.ref("users/").once('value').then((user) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            const randOreName = randomOre(oreInfo.val());
            let valuesRecover = 50000 * oreInfo.val()[randOreName].miningSpeed;
            const values = Object.keys(user.val()).length * valuesRecover;
            defaultDatabase.ref("questGroup/values").set(values);
            defaultDatabase.ref("questGroup/gain").set(10000);
            defaultDatabase.ref("questGroup/type").set(randOreName);
            defaultDatabase.ref("questGroup/valuesFinal").set(values);
            defaultDatabase.ref("questGroup/name").set('Retrieve ' + values + ' ' + randOreName + ' with other Captains !');

        });
    });
}



// MANAGED CHest - - - - - - - - - - - - - - -- - - - - - - -- - - - - - -- - - - - - - -- 
/*
userID, currentUser
*/
export function newChest(message) {
    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            defaultDatabase.ref("users/" + message.userID).once('value').then((currentUser) => {
                const gainMin = 0.01;
                const gainMax = 0.02;
                const gain = 1000;
                initChestRandom(message.userID, currentUser.val(), gainMin, gainMax, gain, mineRate, oreInfo);
            });
        });
    });
}

function regroupGainChest(type, number, json) {
    json[type] = toFixed2(json[type] + number);
}


function addChestToBase(json, userID, creditTemp) {
    defaultDatabase.ref("users/" + userID + "/ore").set(json);
    defaultDatabase.ref("users/" + userID + "/credit").set(toFixed2(creditTemp));
}

export function openChest(userID, currentUser) {
    defaultDatabase.ref("users/" + userID + "/chest/").remove('chest' + currentUser.chest.numberOfChest);
    defaultDatabase.ref("users/" + userID + "/chest/numberOfChest").set(currentUser.chest.numberOfChest - 1);
}

export function checkQuestForAddChest() {
    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            defaultDatabase.ref("users/").once('value').then((user) => {
                const userUis = Object.keys(user.val());
                for (let i = 0; i < userUis.length; i++) {
                    const currentUser = user.val()[userUis[i]]
                    if (currentUser.quest.gain === 0) {
                        initChestRandom(userUis[i], currentUser, 0.01, 0.03, 3000, mineRate, oreInfo);
                        defaultDatabase.ref("users/" + userUis[i] + "/quest/gain").set(-1);
                    }
                }
            });

        });
    });
}

function initChestRandom(userID, currentUser, gainMin, gainMax, gain, mineRate, oreInfo) {
    let json = {};
    const chest1 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    const stringChest = 'chest' + (currentUser.chest.numberOfChest);

    json = {};
    json["0"] = {};
    json["0"][chest1.type] = toFixed2(chest1.number);

    const chest2 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    json["1"] = {};
    json["1"][chest2.type] = toFixed2(chest2.number);

    const chest3 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    json["2"] = {};
    json["2"][chest3.type] = toFixed2(chest3.number);

    defaultDatabase.ref("users/" + userID + '/chest/' + stringChest).set(json);
    defaultDatabase.ref("users/" + userID + '/chest/numberOfChest').set(currentUser.chest.numberOfChest + 1);

}

function stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain) {
    const name = definePourcentageOre(currentUser.upgrade.research.lvl);

    if (name === 'credit') {
        const gainCredit = currentUser.upgrade.score *
        toFixed2((Math.random() * gainMax) + gainMin)
        + gain;
        return { type: 'credit', number: gainCredit / 3 };
    }
    const values = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()[name].miningSpeed;
    const valuesTotal = values * 10 * Math.floor((Math.random() * 10) + 5);
    
    return {type: name, number: valuesTotal};
}

// Random for chest
function definePourcentageOre(researchLvl: number) {
    const tabName = new Array<string>();
    const tabPource = new Array<number>();
    const oreName = Object.keys(oreInfo);

    for (let i = 0; i < oreName.length; i++) {
        if (researchLvl >= oreInfo[oreName[i]].searchNewOre) {
            tabName.push(oreName[i]);
        }
    }
    for (let j = 1; j <= tabName.length; j++) {
        tabPource.push( Math.round(j * (70 / tabName.length)));
    }
    const rand = Math.floor((Math.random() * 100) + 1);
    
    for (let i = 0 ; i < tabName.length; i++) {
        if (rand < tabPource[i]) {
            return tabName[i];
        }
    }
    return 'credit'; 
}

// EVENT 

/*
userID
*/
export function deleteEvent(message) {
    defaultDatabase.ref("users/" + message.userID + '/event').set(0);
}

