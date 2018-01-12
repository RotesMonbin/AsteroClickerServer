import { defaultDatabase } from "./environment";


/**
 * 
 * @param message [user] : userId, [isBadConfig]: isBadConfig
 * 
 */
export function changeBadConfig(message) {
    defaultDatabase.ref("users/" + message.user + "/profile/badConfig").set(message.isBadConfig ? 1 : 0);
}