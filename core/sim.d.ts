import { Enchant } from '/tbc/core/proto/common.js';
import { Encounter as EncounterProto } from '/tbc/core/proto/common.js';
import { EquipmentSpec } from '/tbc/core/proto/common.js';
import { Gem } from '/tbc/core/proto/common.js';
import { GemColor } from '/tbc/core/proto/common.js';
import { ItemSlot } from '/tbc/core/proto/common.js';
import { ItemSpec } from '/tbc/core/proto/common.js';
import { Item } from '/tbc/core/proto/common.js';
import { Stat } from '/tbc/core/proto/common.js';
import { Raid as RaidProto } from '/tbc/core/proto/api.js';
import { RaidSimRequest, RaidSimResult } from '/tbc/core/proto/api.js';
import { StatWeightsRequest, StatWeightsResult } from '/tbc/core/proto/api.js';
import { SimSettings as SimSettingsProto } from '/tbc/core/proto/ui.js';
import { EquippedItem } from '/tbc/core/proto_utils/equipped_item.js';
import { Gear } from '/tbc/core/proto_utils/gear.js';
import { SimResult } from '/tbc/core/proto_utils/sim_result.js';
import { Encounter } from './encounter.js';
import { Player } from './player.js';
import { Raid } from './raid.js';
import { EventID, TypedEvent } from './typed_event.js';
export declare type RaidSimData = {
    request: RaidSimRequest;
    result: RaidSimResult;
};
export declare type StatWeightsData = {
    request: StatWeightsRequest;
    result: StatWeightsResult;
};
export declare class Sim {
    private readonly workerPool;
    private iterations;
    private phase;
    private fixedRngSeed;
    private show1hWeapons;
    private show2hWeapons;
    private showMatchingGems;
    private showThreatMetrics;
    private showExperimental;
    readonly raid: Raid;
    readonly encounter: Encounter;
    private items;
    private enchants;
    private gems;
    readonly iterationsChangeEmitter: TypedEvent<void>;
    readonly phaseChangeEmitter: TypedEvent<void>;
    readonly fixedRngSeedChangeEmitter: TypedEvent<void>;
    readonly lastUsedRngSeedChangeEmitter: TypedEvent<void>;
    readonly show1hWeaponsChangeEmitter: TypedEvent<void>;
    readonly show2hWeaponsChangeEmitter: TypedEvent<void>;
    readonly showMatchingGemsChangeEmitter: TypedEvent<void>;
    readonly showThreatMetricsChangeEmitter: TypedEvent<void>;
    readonly showExperimentalChangeEmitter: TypedEvent<void>;
    readonly settingsChangeEmitter: TypedEvent<void>;
    readonly changeEmitter: TypedEvent<void>;
    readonly simResultEmitter: TypedEvent<SimResult>;
    private readonly _initPromise;
    private lastUsedRngSeed;
    private modifyRaidProto;
    private modifyEncounterProto;
    constructor();
    waitForInit(): Promise<void>;
    setModifyRaidProto(newModFn: (raidProto: RaidProto) => void): void;
    getModifiedRaidProto(): RaidProto;
    setModifyEncounterProto(newModFn: (encounterProto: EncounterProto) => void): void;
    getModifiedEncounterProto(): EncounterProto;
    private makeRaidSimRequest;
    runRaidSim(eventID: EventID, onProgress: Function): Promise<SimResult>;
    runRaidSimWithLogs(eventID: EventID): Promise<SimResult>;
    private updateCharacterStats;
    statWeights(player: Player<any>, epStats: Array<Stat>, epReferenceStat: Stat, onProgress: Function): Promise<StatWeightsResult>;
    getItems(slot: ItemSlot | undefined): Array<Item>;
    getEnchants(slot: ItemSlot | undefined): Array<Enchant>;
    getEnchantFlexible(id: number): Enchant | null;
    getGems(socketColor: GemColor | undefined): Array<Gem>;
    getMatchingGems(socketColor: GemColor): Array<Gem>;
    getPhase(): number;
    setPhase(eventID: EventID, newPhase: number): void;
    getFixedRngSeed(): number;
    setFixedRngSeed(eventID: EventID, newFixedRngSeed: number): void;
    static MAX_RNG_SEED: number;
    private nextRngSeed;
    getLastUsedRngSeed(): number;
    getShow1hWeapons(): boolean;
    setShow1hWeapons(eventID: EventID, newShow1hWeapons: boolean): void;
    getShow2hWeapons(): boolean;
    setShow2hWeapons(eventID: EventID, newShow2hWeapons: boolean): void;
    getShowMatchingGems(): boolean;
    setShowMatchingGems(eventID: EventID, newShowMatchingGems: boolean): void;
    getShowThreatMetrics(): boolean;
    setShowThreatMetrics(eventID: EventID, newShowThreatMetrics: boolean): void;
    getShowExperimental(): boolean;
    setShowExperimental(eventID: EventID, newShowExperimental: boolean): void;
    getIterations(): number;
    setIterations(eventID: EventID, newIterations: number): void;
    lookupItemSpec(itemSpec: ItemSpec): EquippedItem | null;
    lookupEquipmentSpec(equipSpec: EquipmentSpec): Gear;
    toProto(): SimSettingsProto;
    fromProto(eventID: EventID, proto: SimSettingsProto): void;
}
