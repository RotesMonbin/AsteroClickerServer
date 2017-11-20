import { defaultDatabase } from "./environment";
import { calculScore } from "./ranking";
import { quest } from "./resources";
import { toFixed2 } from "./utils";


export function checkQuest(oreName: string, values: number, currentUser, userID) {
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
        } else {
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(finalValues));
        }
    }
}

export function updateQuestUser() {
    defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());

        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]]
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


