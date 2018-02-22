import { defaultDatabase } from "./environment";

// When you have a new Cargo 
export function unlockNewCargo(iDUser: string) {
    defaultDatabase.ref("users/" + iDUser + "/cargo/availableCargo").once('value').then((availableCargo) => {

        const json = {};

        const currentCargoActu = availableCargo.val() + 1;
        json["cargo"]["availableCargo"] = currentCargoActu;

        json["cargo"]["cargo" + currentCargoActu] = {};
        json["cargo"]["cargo" + currentCargoActu]["start"] = 0;
        json["cargo"]["cargo" + currentCargoActu]["timer"] = 0;

        json["cargo"]["cargo" + currentCargoActu]["ore"] = {};
        json["cargo"]["cargo" + currentCargoActu]["ore"]["value"] = 0;
        json["cargo"]["cargo" + currentCargoActu]["ore"]["type"] = '';

        defaultDatabase.ref("users/" + iDUser + "/cargo").set(json);
    });
}

// When you buy some ressource 
export function timeCargoGo(iDUser, nameOre, value, nameDirect, valueDirect) {
    if (value === 0) {
        return;
    }
    defaultDatabase.ref("users/" + iDUser + "/cargo").once('value').then((cargo) => {

        if (cargo.val().availableCargo === 0) {
            return;
        }
        const stringCargo = "cargo" + cargo.val().availableCargo;

        if (cargo.val()[stringCargo].start == 0) {
            const json = {};

            json[stringCargo] = {};
            json[stringCargo]["start"] = Date.now();
            json[stringCargo]["timer"] = 0;

            json[stringCargo]["ore"] = {};
            json[stringCargo]["ore"]["value"] = value;
            json[stringCargo]["ore"]["type"] = nameOre;

            defaultDatabase.ref("users/" + iDUser + "/cargo").set(json);
            defaultDatabase.ref("users/" + iDUser + "/cargo/availableCargo").set(cargo.val().availableCargo - 1);
            
            if(nameDirect === 'credit') {
                defaultDatabase.ref("users/" + iDUser + "/credit").set(valueDirect);
            } else {
                defaultDatabase.ref("users/" + iDUser + "/ore/" + nameDirect).set(valueDirect);
            }

        }

    });
}

// every seconde for timer
/**
 * 
 * @param message [user] : userId
 * 
 */
export function upgradeTimerAllCargo(message) {
    const iDUser = message.user;
    defaultDatabase.ref("users/" + iDUser).once('value').then((user) => {
        const currentUser = user.val();
        const numberOfCargo = Object.keys(currentUser.cargo).length;
        for (let i = 1; i < numberOfCargo; i++) {
            let currentCargo = currentUser.cargo['cargo' + i];
            if (currentCargo.start != 0) {
                let timer = (0 * 1000) -
                    (Date.now() - currentCargo.start);
                if (timer <= 0) {
                    timer = 0;
                    if (currentCargo.ore.type === 'credit') {
                        defaultDatabase.ref("users/" + iDUser + "/credit").set(currentUser.credit + currentCargo.ore.value);
                    } else {
                        defaultDatabase.ref("users/" + iDUser + "/ore/" + currentCargo.ore.type).set(currentUser.ore[currentCargo.ore.type] + currentCargo.ore.value);
                    }
                    defaultDatabase.ref("users/" + iDUser + "/cargo/availableCargo").set(currentUser.cargo.availableCargo + 1);
                    defaultDatabase.ref("users/" + iDUser + "/cargo/cargo" + i + "/start").set(0);
                }
                defaultDatabase.ref("users/" + iDUser + "/cargo/cargo" + i + "/timer").set(timer);
            }
        }
    });
}