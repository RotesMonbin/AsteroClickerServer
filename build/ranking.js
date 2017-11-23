"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const utils_1 = require("./utils");
function calculScore(amount, user, userID) {
    environment_1.defaultDatabase.ref("users/" + userID + "/score").set(amount + user.score);
}
exports.calculScore = calculScore;
function calculRanking() {
    let scoreTab = [];
    environment_1.defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]];
            const currentScoreFixed = utils_1.toFixed2(currentUser.score + currentUser.credit).toString();
            scoreTab[i] = {
                name: currentUser.email,
                score: currentScoreFixed
            };
        }
        scoreTab.sort(utils_1.sort_by('score', true, parseInt));
        environment_1.defaultDatabase.ref("ranking").set(scoreTab);
    });
}
exports.calculRanking = calculRanking;
//# sourceMappingURL=ranking.js.map