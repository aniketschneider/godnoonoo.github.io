/*
Controller for the levels, effects and resistance divs.
*/

import { builderData } from "../data/buildData.js";
import { IABTypes } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import { updateInput } from "../utility.js";
import { updateEffects, updateLimbs } from "../view/levelsView.js";
import { getEnemyLevel, modifiedAutoBattle } from "./autoBattleController.js";

export function getActiveEffects() {
    const level = getEnemyLevel();
    const effects = autoBattle.getEffects(level);
    if (effects === undefined) {
        return new Map();
    }
    return effects;
}

export function changeLimbs(item: IABTypes["items"][keyof IABTypes["items"]]) {
    const increment = item.equipped ? 1 : -1;
    builderData.limbs += increment;
    updateLimbs(increment);
}

export function getLimbs() {
    return builderData.limbs;
}

export function setEnemyLevel(level: number, frontendCall?: boolean) {
    // Backend
    autoBattle.enemyLevel = level;

    // Frontend
    if (!frontendCall) {
        updateInput("currentEnemyLevel", level);
        updateEffects();
    }

    modifiedAutoBattle();
}

export function setMaxEnemyLevel(level: number, frontendCall?: boolean) {
    // Backend
    autoBattle.maxEnemyLevel = level;

    // Frontend
    if (!frontendCall) {
        updateInput("maxEnemyLevel", level);
    }

    modifiedAutoBattle();
}

export function checkMaxLevel(level: number) {
    const maxLevel = autoBattle.maxEnemyLevel;
    if (level > maxLevel) {
        setMaxEnemyLevel(level);
    }
}
