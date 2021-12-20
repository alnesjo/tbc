import { Class } from '/tbc/core/proto/common.js';
import { RaidTarget } from '/tbc/core/proto/common.js';
import { Raid as RaidProto } from '/tbc/core/proto/api.js';
import { RaidBuffs } from '/tbc/core/proto/common.js';
import { Party } from './party.js';
import { Player } from './player.js';
import { TypedEvent } from './typed_event.js';
import { Sim } from './sim.js';
export declare const MAX_NUM_PARTIES = 5;
export declare class Raid {
    private buffs;
    readonly compChangeEmitter: TypedEvent<void>;
    readonly buffsChangeEmitter: TypedEvent<void>;
    readonly changeEmitter: TypedEvent<void>;
    private parties;
    private modifyRaidProto;
    readonly sim: Sim;
    constructor(sim: Sim);
    size(): number;
    isEmpty(): boolean;
    getParties(): Array<Party>;
    getParty(index: number): Party;
    getPlayers(): Array<Player<any> | null>;
    getPlayer(index: number): Player<any> | null;
    getPlayerFromRaidTarget(raidTarget: RaidTarget): Player<any> | null;
    setPlayer(index: number, newPlayer: Player<any> | null): void;
    getClassCount(playerClass: Class): number;
    getBuffs(): RaidBuffs;
    setBuffs(newBuffs: RaidBuffs): void;
    setModifyRaidProto(newModFn: (raidProto: RaidProto) => void): void;
    toProto(): RaidProto;
    fromProto(proto: RaidProto): void;
    toJson(): Object;
    fromJson(obj: any): void;
}
