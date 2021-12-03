import { Spec } from '/tbc/core/proto/common.js';

import { Player } from './player.js';
import { TypedEvent } from './typed_event.js';
import { Sim } from './sim.js';

export interface PartyConfig {
}

export const MAX_PARTY_SIZE = 5;

// Manages all the settings for a single Party.
export class Party {
  // Emits when anything in the party changes.
  readonly changeEmitter = new TypedEvent<void>();

	// Should always hold exactly MAX_PARTY_SIZE elements.
	private players: Array<Player<any>?>;

	private readonly sim: Sim;

  constructor(sim: Sim) {
		this.sim = sim;
		this.players = [...Array(MAX_PARTY_SIZE).keys()].map(i => null);
  }

	size(): number {
		return this.players.filter(player => player != null).length;
	}

	empty(): boolean {
		return this.size() == 0;
	}

	getPlayers(): Array<Player<any>?> {
		// Make defensive copy.
		return this.players.slice();
	}

	setPlayer(newPlayer: Player<any>?, partyIndex: number) {
		if (partyIndex < 0 || partyIndex >= MAX_PARTY_SIZE) {
			throw new Error('Invalid party index: ' + partyIndex);
		}

		if (newPlayer != null) {
			newPlayer.changeEmitter.on(() => this.changeEmitter.emit());
		}
		this.players[partyIndex] = newPlayer;
		this.changeEmitter.emit();
	}

  // Returns JSON representing all the current values.
  toJson(): Object {
		return this.players.map(player => {
			if (player == null) {
				return null;
			} else {
				return {
					'spec': player.spec,
					'player': player.toJson(),
				};
			}
		});
  }

  // Set all the current values, assumes obj is the same type returned by toJson().
  fromJson(obj: any) {
		this.players = [];
		this.changeEmitter.emit();

		(obj as Array<any>).forEach(playerObj => {
			const newPlayer = new Player(playerObj['spec'] as Spec, this.sim);
			newPlayer.fromJson(playerObj['player']);
			this.addPlayer(newPlayer);
		});
  }
}
