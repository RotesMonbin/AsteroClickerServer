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
        const web3 = new Web3('ws://vm-eth-node1-test.velvethyne.fr:8546');
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

    public playerNumberOfBoost(address: string,nbBoost:number) {
        return this.contract.methods.playerNumberOfBoost(address,nbBoost).call();
    }

}

const boost = new Boost;

export function updateUserBoost() {
    defaultDatabase.ref("users").once('value').then((users) => {
        for (let id in users.val()) {
            if (users.val()[id].profile.address != 0) {
                 boost.playerNumberOfBoost(users.val()[id].profile.address,0).then((amount:number)=>{
                    defaultDatabase.ref("users/" + id + "/boosts/0/boughtQuantity").set(amount);
                   // console.log("New amount for: " + users.val()[id].profile.name + " amoun : " + amount);
                });
            }
        }
    });
}

/**
 * 
 * @param message [user] : userId
 * @param message [type] : boostType
 */
export function activateBoost(message) {
    defaultDatabase.ref("users/" + message.user + "/boosts/" + message.type).once('value').then((boost) => {
        if (boost.val().active != 1 && ((boost.val().boughtQuantity) - (boost.val().usedQuantity) )> 0) {
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

export function addBoostToUser(boostType: BoostType, quantity: number, address: string) {
    defaultDatabase.ref("users").once('value').then((users) => {
        for (let id in users.val()) {
            if (users.val()[id].profile.address == address) {
                const currentQuantity = users.val()[id].boost[boostType].boughtQuantity;
                defaultDatabase.ref("users/" + id + "/boosts/" + boostType + "/boughtQuantity").set(currentQuantity + quantity);
                console.log(users.val()[id].profile.name + " a acheter " + quantity + " du boost numero " + boostType);
            }
        }
    });
}
