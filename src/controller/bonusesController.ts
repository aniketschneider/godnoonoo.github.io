/*
Controls equipping and leveling bonuses.
Sends calls both to frontend and backend.
*/

import { autoBattle } from "../data/object.js";
import { pick, updateButton, updateInput } from "../utility.js";
import { u2Mutations } from "../data/mutations.js";
import { IRing, IABTypes } from "../data/buildTypes.js";
import {
    modifiedAutoBattle,
    modifiedAutoBattleWithBuild,
} from "./autoBattleController.js";

export function getOneTimers(): typeof autoBattle.oneTimers {
    return autoBattle.oneTimers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOneTimersSA(saveString?: any): IABTypes["oneTimers"] {
    const data = saveString ? saveString : autoBattle;
    const oneTimers = data.oneTimers;

    return pick(
        oneTimers,
        "Master_of_Arms",
        "Dusty_Tome",
        "Whirlwind_of_Arms"
    ) as typeof oneTimers;
}

export function getRing() {
    const chances = autoBattle.getRingStatusChance();
    return {
        bonus: autoBattle.oneTimers.The_Ring,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stats: autoBattle.rings as any,
        chances: chances,
    };
}

export function getPossibleRingMods() {
    return autoBattle.ringStats;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRingStatAmt(mod: any) {
    return autoBattle.getRingStatAmt(mod);
}

export function getMutations() {
    return u2Mutations.tree;
}

export function getUnlocks() {
    return autoBattle.bonuses;
}

export function clearBonuses() {
    const oneTimers = getOneTimersSA();
    for (const key of Object.keys(oneTimers)) {
        const oneTimerName = key as keyof IABTypes["oneTimers"];
        oneTimers[oneTimerName].owned = false;
        updateButton(oneTimerName, true);
    }

    const ring = getRing();
    const mods = getPossibleRingMods();
    ring.bonus.owned = false;
    ring.stats.level = 0;
    ring.stats.mods = [];

    updateInput("Ring", 0);
    for (const key of Object.keys(mods)) {
        const name = key as keyof IRing["mods"];
        updateButton(name, true);
    }

    const mutations = getMutations();
    for (const key of Object.keys(mutations)) {
        const name = key as keyof IABTypes["mutations"];
        mutations[name].purchased = false;
        updateButton(name, true);
    }

    autoBattle.scruffyLvl21 = false;
    updateButton("S21", true);

    modifiedAutoBattleWithBuild();
}

export function equipOneTimer(
    oneTimer: keyof IABTypes["oneTimers"],
    setUnselected?: boolean
) {
    // Backend
    autoBattle.oneTimers[oneTimer].owned =
        !autoBattle.oneTimers[oneTimer].owned;

    // Frontend
    updateButton(oneTimer, setUnselected);

    modifiedAutoBattleWithBuild();
}

export function equipRingMods(ringMods: string[]) {
    const ring = getRing();

    if (ring.bonus.owned) {
        for (const mod of ringMods) {
            // Backend
            const index = ring.stats.mods.indexOf(mod);
            if (index === -1) {
                ring.stats.mods.push(mod);
            } else {
                ring.stats.mods.splice(index);
            }

            // Frontend
            updateButton(mod);
        }

        modifiedAutoBattle();
    }
}

export function unequipRingMods() {
    const ring = getRing();

    // Frontend
    for (const value of Object.values(ring.stats.mods)) {
        updateButton(value as string);
    }

    // Backend
    ring.stats.mods = [];

    modifiedAutoBattle();
}

export function setRingLevel(level: number, frontendCall?: boolean) {
    const ring = getRing();

    ring.bonus.owned = level >= 1;

    ring.stats.level = level;
    if (!frontendCall) {
        updateInput("Ring", level);
    }

    modifiedAutoBattleWithBuild();
}

export function equipMutation(
    mutation: keyof IABTypes["mutations"],
    setUnselected?: boolean
) {
    // Backend
    const mutations = getMutations();
    mutations[mutation].purchased = !mutations[mutation].purchased;

    // Frontend
    updateButton(mutation, setUnselected);

    modifiedAutoBattle();
}

export function equipScruffy(xp?: number, setUnselected?: boolean) {
    const update = xp ? xp > 1466015503701000 : true;
    if (update) {
        // Backend
        autoBattle.scruffyLvl21 = !autoBattle.scruffyLvl21;
        if (xp) autoBattle.fluffyExp2 = xp;

        // Frontend
        updateButton("S21", setUnselected);
    }

    modifiedAutoBattle();
}
