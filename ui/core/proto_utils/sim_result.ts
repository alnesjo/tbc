import { ActionMetrics as ActionMetricsProto } from '/tbc/core/proto/api.js';
import { AuraMetrics as AuraMetricsProto } from '/tbc/core/proto/api.js';
import { DpsMetrics as DpsMetricsProto } from '/tbc/core/proto/api.js';
import { Encounter as EncounterProto } from '/tbc/core/proto/api.js';
import { EncounterMetrics as EncounterMetricsProto } from '/tbc/core/proto/api.js';
import { Party as PartyProto } from '/tbc/core/proto/api.js';
import { PartyMetrics as PartyMetricsProto } from '/tbc/core/proto/api.js';
import { Player as PlayerProto } from '/tbc/core/proto/api.js';
import { PlayerMetrics as PlayerMetricsProto } from '/tbc/core/proto/api.js';
import { Raid as RaidProto } from '/tbc/core/proto/api.js';
import { RaidMetrics as RaidMetricsProto } from '/tbc/core/proto/api.js';
import { Target as TargetProto } from '/tbc/core/proto/api.js';
import { TargetMetrics as TargetMetricsProto } from '/tbc/core/proto/api.js';
import { Class } from '/tbc/core/proto/common.js';
import { Spec } from '/tbc/core/proto/common.js';
import { ActionId } from '/tbc/core/resources.js';
import { getIconUrl } from '/tbc/core/resources.js';
import { getName } from '/tbc/core/resources.js';
import { playerToSpec } from '/tbc/core/proto_utils/utils.js';

export class SimResult {
	private readonly request: RaidSimRequest;
	private readonly result: RaidSimResult;

	readonly raidMetrics: RaidMetrics;
	readonly encounterMetrics: RaidMetrics;

	private constructor(request: RaidSimRequest, result: RaidSimResult, raidMetrics: RaidMetrics, encounterMetrics: EncounterMetrics) {
		this.request = request;
		this.result = result;
		this.raidMetrics = raidMetrics;
		this.encounterMetrics = encounterMetrics;
	}

	toJson(): any {
		return {
			'request': RaidSimRequest.toJson(this.request),
			'result': RaidSimResult.toJson(this.result),
		};
	}

	static async fromJson(obj: any): SimResult {
		const request = RaidSimRequest.fromJson(obj['request']);
		const result = RaidSimResult.fromJson(obj['result']);
		return SimResult.makeNew(request, result);
	}

	static async makeNew(request: RaidSimRequest, result: RaidSimResult): Promise<SimResult> {
		const iterations = request.simOptions?.iterations || 1;
		const duration = request.encounter?.duration || 1;

		const raidPromise = RaidMetrics.makeNew(iterations, duration, request.raid!, result.raidMetrics!);
		const encounterPromise = EncounterMetrics.makeNew(iterations, duration, request.encounter!, result.encounterMetrics!);

		const raidMetrics = await raidPromise;
		const encounterMetrics = await encounterPromise;

		return new SimResult(request, result, raidMetrics, encounterPromise);
	}
}

export class RaidMetrics {
	private readonly raid: RaidProto;
	private readonly metrics: RaidMetricsProto;

	readonly parties: Array<PartyMetrics>;

	private constructor(raid: RaidProto, metrics: RaidMetricsProto, parties: Array<PartyMetrics>) {
		this.raid = raid;
		this.metrics = metrics;
		this.parties = parties;
	}

	static async makeNew(iterations: number, duration: number, raid: RaidProto, metrics: RaidMetricsProto): Promise<RaidMetrics> {
		const numParties = Math.min(raid.parties.length, metrics.parties.length);
		
		const parties = await Promise.all(
				[...new Array(numParties).keys()]
						.map(i => PartyMetrics.makeNew(
								iterations,
								duration,
								raid.parties[i],
								metrics.parties[i],
								i)));

		return new RaidMetrics(raid, metrics, parties);
	}
}

export class PartyMetrics {
	private readonly party: PartyProto;
	private readonly metrics: PartyMetricsProto;

	readonly partyIndex: number;
	readonly players: Array<PlayerMetrics>;

	private constructor(party: PartyProto, metrics: PartyMetricsProto, partyIndex: number, players: Array<PlayerMetrics>) {
		this.party = party;
		this.metrics = metrics;
		this.partyIndex = partyIndex;
		this.players = players;
	}

	static async makeNew(iterations: number, duration: number, party: PartyProto, metrics: PartyMetricsProto, partyIndex: number): Promise<PartyMetrics> {
		const numPlayers = Math.min(party.players.length, metrics.players.length);
		const players = await Promise.all(
				[...new Array(numPlayers).keys()]
						.filter(i => party.players[i].class != Class.ClassUnknown)
						.map(i => PlayerMetrics.makeNew(
								iterations,
								duration,
								party.players[i],
								metrics.players[i],
								partyIndex * 5 + i)));

		return new PartyMetrics(party, metrics, partyIndex, players);
	}
}

export class PlayerMetrics {
	private readonly player: PlayerProto;
	private readonly metrics: PlayerMetricsProto;

	readonly raidIndex: number;
	readonly name: string;
	readonly spec: Spec;
	readonly actions: Array<ActionMetrics>;
	readonly auras: Array<AuraMetrics>;

	private constructor(player: PlayerProto, metrics: PlayerMetricsProto, raidIndex: number, actions: Array<ActionMetrics>, auras: Array<AuraMetrics>) {
		this.player = player;
		this.metrics = metrics;

		this.raidIndex = raidIndex;
		this.name = player.name;
		this.spec = playerToSpec(player);
		this.actions = actions;
		this.auras = auras;
	}

	static async makeNew(iterations: number, duration: number, player: PlayerProto, metrics: PlayerMetricsProto, raidIndex: number): Promise<PlayerMetrics> {
		const actionsPromise = Promise.all(metrics.actions.map(actionMetrics => ActionMetrics.makeNew(iterations, duration, actionMetrics)));
		const aurasPromise = Promise.all(metrics.auras.map(auraMetrics => AuraMetrics.makeNew(iterations, duration, auraMetrics)));

		const actions = await actionsPromise;
		const auras = await aurasPromise;
		return new PlayerMetrics(player, metrics, raidIndex, actions, auras);
	}
}

export class EncounterMetrics {
	private readonly encounter: EncounterProto;
	private readonly metrics: EncounterMetricsProto;

	readonly targets: Array<PlayerMetrics>;

	private constructor(encounter: EncounterProto, metrics: EncounterMetricsProto, targets: Array<PlayerMetrics>) {
		this.encounter = encounter;
		this.metrics = metrics;
		this.encounterIndex = encounterIndex;
		this.targets = targets;
	}

	static async makeNew(iterations: number, duration: number, encounter: EncounterProto, metrics: EncounterMetricsProto): Promise<EncounterMetrics> {
		const numTargets = Math.min(encounter.targets.length, metrics.targets.length);
		const targets = await Promise.all(
				[...new Array(numTargets).keys()]
						.map(i => TargetMetrics.makeNew(
								iterations,
								duration,
								encounter.targets[i],
								metrics.targets[i],
								i)));

		return new EncounterMetrics(encounter, metrics, encounterIndex, targets);
	}
}

export class TargetMetrics {
	private readonly target: TargetProto;
	private readonly metrics: TargetMetricsProto;

	readonly index: number;
	readonly auras: Array<AuraMetrics>;

	private constructor(target: TargetProto, metrics: TargetMetricsProto, index: number, auras: Array<AuraMetrics>) {
		this.target = target;
		this.metrics = metrics;

		this.index = index;
		this.auras = auras;
	}

	static async makeNew(iterations: number, duration: number, target: TargetProto, metrics: TargetMetricsProto, index: number): Promise<TargetMetrics> {
		const auras = await Promise.all(metrics.auras.map(auraMetrics => AuraMetrics.makeNew(iterations, duration, auraMetrics)));
		return new TargetMetrics(target, metrics, index, auras);
	}
}

export class AuraMetrics {
	readonly name: string;
	readonly iconUrl: string;
	readonly actionId: ActionId;
	private readonly iterations: number;
	private readonly duration: number;
	private readonly data: AuraMetricsProto;

	private constructor(name: string, iconUrl: string, iterations: number, duration: number, data: AuraMetricsProto) {
		this.name = name;
		this.iconUrl = iconUrl;
		this.iterations = iterations;
		this.duration = duration;
		this.data = data;

		this.actionId = {
			id: {
				spellId: data.id,
			},
			tag: 0,
		};
	}

	get uptimePercent() {
		return this.data.uptimeSecondsAvg / this.duration * 100;
	}

	static async makeNew(iterations: number, duration: number, auraMetrics: AuraMetricsProto): AuraMetrics {
		const namePromise = getName(auraMetrics.actionId.id);
		const iconPromise = getIconUrl(auraMetrics.actionId.id);

		const name = await namePromise;
		const iconUrl = await iconPromise;

		return new AuraMetrics(name, iconUrl, iterations, duration, auraMetrics);
	}
};

// Manages the metrics for a single player action (e.g. Lightning Bolt).
export class ActionMetrics {
	readonly name: string;
	readonly iconUrl: string;
	readonly actionId: ActionId;
	private readonly iterations: number;
	private readonly duration: number;
	private readonly data: ActionMetricsProto;

	private constructor(name: string, iconUrl: string, iterations: number, duration: number, data: ActionMetricsProto) {
		this.name = name;
		this.iconUrl = iconUrl;
		this.iterations = iterations;
		this.duration = duration;
		this.data = data;

		if (actionMetric.id!.rawId.oneofKind == 'spellId') {
			this.actionId = {
				id: {
					spellId: actionMetric.id!.rawId.spellId,
				},
				tag: actionMetric.id!.tag,
			};
		} else if (actionMetric.id!.rawId.oneofKind == 'itemId') {
			this.actionId = {
				id: {
					itemId: actionMetric.id!.rawId.itemId,
				},
				tag: actionMetric.id!.tag,
			};
		} else if (actionMetric.id!.rawId.oneofKind == 'otherId') {
			this.actionId = {
				id: {
					otherId: actionMetric.id!.rawId.otherId,
				},
				tag: actionMetric.id!.tag,
			};
		} else {
			throw new Error('Invalid action metric with no ID');
		}
	}

	get dps() {
		return this.data.totalDmg / this.iterations / this.duration;
	}

	get casts() {
		return this.data.casts / this.iterations;
	}

	get castsPerMinute() {
		return this.data.casts / this.iterations / (this.duration / 60);
	}

	get avgCast() {
		return this.data.totalDmg / this.data.casts;
	}

	get hits() {
		return this.data.hits / this.iterations;
	}

	get avgHit() {
		return this.data.totalDmg / this.data.hits;
	}

	get critPercent() {
		return (this.data.crits / this.data.hits) * 100;
	}

	get missPercent() {
		return (this.data.misses / (this.data.hits + this.data.misses)) * 100;
	}

	static async makeNew(iterations: number, duration: number, actionMetrics: ActionMetricsProto): ActionMetrics {
		const namePromise = getName(actionMetrics.actionId.id);
		const iconPromise = getIconUrl(actionMetrics.actionId.id);

		let name = await namePromise;
		if (actionMetrics.actionId.tag != 0) {
			if (name == "Mind Flay") { // for now we can just check the name and use special tagging rules.
				if (actionMetrics.actionId.tag == 1) {
					name += ' (1 Tick)';
				} else if (actionMetrics.actionId.tag == 2) {
					name += ' (2 Tick)';
				} else if (actionMetrics.actionId.tag == 3) {
					name += ' (3 Tick)';
				}
			} else {
				if (actionMetrics.actionId.tag == 1) {
					name += ' (LO)';
				} else {
					name += ' (??)';
				}
			} 
		} 

		const iconUrl = await iconPromise;

		return new ActionMetrics(name, iconUrl, iterations, duration, actionMetrics);
	}
}
