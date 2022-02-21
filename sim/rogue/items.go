package rogue

import (
	"log"
	"time"

	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/stats"
)

func init() {
	core.AddItemEffect(30450, ApplyWarpSpringCoil)
	core.AddItemEffect(32492, ApplyAshtongueTalismanOfLethality)

	core.AddItemSet(ItemSetAssassination)
	core.AddItemSet(ItemSetNetherblade)
	core.AddItemSet(ItemSetDeathmantle)
	core.AddItemSet(ItemSetSlayers)
}

var ItemSetAssassination = core.ItemSet{
	Name:  "Assassination Armor",
	Items: map[int32]struct{}{28414: {}, 27776: {}, 28204: {}, 27908: {}, 27509: {}},
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
		},
		4: func(agent core.Agent) {
			// Your Eviscerate and Envenom abilities cost 10 less energy.
			// Handled in eviscerate.go.
		},
	},
}

var ItemSetNetherblade = core.ItemSet{
	Name:  "Netherblade",
	Items: map[int32]struct{}{29044: {}, 29045: {}, 29046: {}, 29047: {}, 29048: {}},
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			// Increases the duration of your Slice and Dice ability by 3 sec.
			// Handled in slice_and_dice.go.
		},
		4: func(agent core.Agent) {
			// Your finishing moves have a 15% chance to grant you an extra combo point.
			// Handled in talents.go.
		},
	},
}

var Deathmantle4PcAuraID = core.NewAuraID()
var ItemSetDeathmantle = core.ItemSet{
	Name:  "Deathmantle",
	Items: map[int32]struct{}{30144: {}, 30145: {}, 30146: {}, 30148: {}, 30149: {}},
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			// Your Eviscerate and Envenom abilities cause 40 extra damage per combo point.
			// Handled in eviscerate.go.
		},
		4: func(agent core.Agent) {
			// Your attacks have a chance to make your next finishing move cost no energy.
			rogueAgent, ok := agent.(RogueAgent)
			if !ok {
				log.Fatalf("Non-rogue attempted to activate rogue t5 4p bonus.")
			}
			rogue := rogueAgent.GetRogue()

			ppmm := rogue.AutoAttacks.NewPPMManager(1.0)

			rogue.AddPermanentAura(func(sim *core.Simulation) core.Aura {
				return core.Aura{
					ID: Deathmantle4PcAuraID,
					OnMeleeAttack: func(sim *core.Simulation, ability *core.ActiveMeleeAbility, hitEffect *core.AbilityHitEffect) {
						if !hitEffect.Landed() {
							return
						}

						// https://tbc.wowhead.com/spell=37170/free-finisher-chance, proc mask = 20.
						if !hitEffect.ProcMask.Matches(core.ProcMaskMelee) {
							return
						}

						if !ppmm.Proc(sim, hitEffect.IsMH(), false, "Deathmantle 4pc") {
							return
						}

						rogue.deathmantle4pcProc = true
					},
				}
			})
		},
	},
}

var ItemSetSlayers = core.ItemSet{
	Name:  "Slayer's Armor",
	Items: map[int32]struct{}{31026: {}, 31037: {}, 31028: {}, 31029: {}, 31030: {}, 34558: {}, 34575: {}, 34448: {}},
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			// Increases the haste from your Slice and Dice ablity by 5%.
			// Handled in slice_and_dice.go.
		},
		4: func(agent core.Agent) {
			// Increases the damage dealt by your Backstab, Sinister Strike, Mutilate, and Hemorrhage abilities by 6%.
			// Handled in the corresponding ability files.
		},
	},
}

var WarpSpringCoilAuraID = core.NewAuraID()
var WarpSpringCoilProcAuraID = core.NewAuraID()

func ApplyWarpSpringCoil(agent core.Agent) {
	character := agent.GetCharacter()
	character.AddPermanentAura(func(sim *core.Simulation) core.Aura {
		statApplier := character.NewTempStatAuraApplier(sim, WarpSpringCoilProcAuraID, core.ActionID{ItemID: 30450}, stats.ArmorPenetration, 1000, time.Second*15)
		const procChance = 0.25

		const icdDur = time.Second * 30
		icd := core.NewICD()

		return core.Aura{
			ID: WarpSpringCoilAuraID,
			OnMeleeAttack: func(sim *core.Simulation, ability *core.ActiveMeleeAbility, hitEffect *core.AbilityHitEffect) {
				if !hitEffect.Landed() {
					return
				}

				// https://tbc.wowhead.com/spell=37173/armor-penetration, proc mask = 16.
				if !hitEffect.ProcMask.Matches(core.ProcMaskMeleeSpecial) {
					return
				}

				if icd.IsOnCD(sim) {
					return
				}

				if sim.RandomFloat("WarpSpringCoil") > procChance {
					return
				}

				icd = core.InternalCD(sim.CurrentTime + icdDur)
				statApplier(sim)
			},
		}
	})
}

var AshtongueTalismanOfLethalityProcAuraID = core.NewAuraID()

func ApplyAshtongueTalismanOfLethality(agent core.Agent) {
	// TODO: Add a 'finisher' bit flag so we can put the logic here instead of talents.go.
}
