import { defaultDatabase } from "./environment";
import { toFixed2, sort_by } from "./utils";

// Ranking managed
export function calculScore(amount: number, user, userID: number) {
    defaultDatabase.ref("users/" + userID + "/score").set(amount + user.score);
}

// Calcul the ranking with the score
export function calculRanking() {
    let scoreTab = [];

    defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]]
            const currentScoreFixed = toFixed2(currentUser.score + currentUser.credit).toString();
            scoreTab[i] = {
                name: currentUser.profile.name,
                score: currentScoreFixed
            }
        }
        scoreTab.sort(sort_by('score', true, parseInt));
        defaultDatabase.ref("ranking").set(scoreTab);
    });   
}