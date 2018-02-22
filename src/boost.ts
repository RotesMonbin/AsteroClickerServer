import * as Web3 from 'web3-eth'
import { Contract, EventEmitter } from 'web3/types';
import { addresses, defaultDatabase } from './environment';
import { abi } from './abi/boost.abi';

export enum BoostType {
    fasterResearchAndTraveling,

}

export class Boost {

    public contract: Contract;

    constructor() {
        const web3 = new Web3('https://ropsten.infura.io/Ge8pLCXZNKUB86c7miUf');
        this.contract = new web3.Contract(abi, addresses.boost);
    }

    /**
     * EVENT
     */
    /** Start watching transfer */
    public Purchase(): EventEmitter {
        return this.contract.events.Transfer();
    }

    public retrieveCost(nb: number) {
        return this.contract.methods.retrieveCost(nb).call();
    }

    public playerNumberOfBoost(address: string, nbBoost: number) {
        return this.contract.methods.playerNumberOfBoost(address, nbBoost).call();
    }

}

const boost = new Boost;

/*export function updateUserBoost() {
    defaultDatabase.ref("users").once('value').then((users) => {
        for (let id in users.val()) {
            if (users.val()[id].profile.address != 0) {
                boost.playerNumberOfBoost(users.val()[id].profile.address, 0).then((amount: number) => {
                    defaultDatabase.ref("users/" + id + "/boosts/0/boughtQuantity").set(amount);
                });
            }
        }
    });
}*/
/**
 * 
 * @param data [user] = useriD
 */
export function upsertUserBoosts(data) {
    defaultDatabase.ref("users/" + data.user + "/profile/address").once('value').then((userAddress) => {
        defaultDatabase.ref("boosts").once('value').then((boosts) => {
            const boostsId = Object.keys(boosts.val());
            for (const id in boostsId) {
                if (userAddress.val() != 0) {
                    boost.playerNumberOfBoost(userAddress.val(), parseInt(id)).then((amount: number) => {
                        defaultDatabase.ref("users/" + data.user + "/boosts/" + parseInt(id) + "/boughtQuantity").set(amount);
                    });
                }
            }
        });
    });
}



/**
 * 
 * @param message [user] : userId
 * @param message [type] : boostType
 */
export function activateBoost(message) {
    defaultDatabase.ref("users/" + message.user + "/boosts/" + message.type).once('value').then((boost) => {
        if (boost.val().active != 1 && ((boost.val().boughtQuantity) - (boost.val().usedQuantity)) > 0) {
            defaultDatabase.ref("users/" + message.user + "/boosts/" + message.type).set({
                active: 1,
                usedQuantity: boost.val().usedQuantity + 1,
                boughtQuantity: boost.val().boughtQuantity,
                start: Date.now(),
                timer: 0
            });
        }
    });
}

export function updateBoostTimer(boostType: BoostType, userId: string) {
    defaultDatabase.ref("boosts/" + boostType).once('value').then((boostInfo) => {
        defaultDatabase.ref("users/" + userId + "/boosts/" + boostType).once('value').then((boost) => {
            let timer = boostInfo.val().duration -
                (Date.now() - boost.val().start);

            if (timer < 0) {
                defaultDatabase.ref("users/" + userId + "/boosts/" + boostType + "/active").set(0);
                defaultDatabase.ref("users/" + userId + "/boosts/" + boostType + "/timer").set(0);

            }
            else {
                defaultDatabase.ref("users/" + userId + "/boosts/" + boostType + "/timer").set(timer);
            }
        });
    });
}
