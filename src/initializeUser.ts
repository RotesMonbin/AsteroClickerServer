
import { defaultDatabase } from "./environment"

export function sendUser(id){
   return defaultDatabase.ref("users/" + id ).once('value');
}

export function sendOre(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}

export function sendAsteroid(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}

export function sendResearch(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}

export function sendUpgrade(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}

export function sendCredit(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}

export function sendBoosts(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}

export function sendChest(id){

    defaultDatabase.ref("users/" + id + "/ore").once('value').then((oreAmount) => {
        return oreAmount.val();
    });

}