package shaman

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/stats"
)

var ShamanisticRageCD = core.NewCooldownID()
var ShamanisticRageAuraID = core.NewAuraID()

var ShamanisticRageActionID = core.ActionID{SpellID: 30823}

func (shaman *Shaman) registerShamanisticRageCD() {
	if !shaman.Talents.ShamanisticRage {
		return
	}

	const dur = time.Second * 15
	const cd = time.Minute * 2

	shaman.AddMajorCooldown(core.MajorCooldown{
		ActionID:   ShamanisticRageActionID,
		CooldownID: ShamanisticRageCD,
		Cooldown:   cd,
		Type:       core.CooldownTypeMana,
		CanActivate: func(sim *core.Simulation, character *core.Character) bool {
			return true
		},
		ShouldActivate: func(sim *core.Simulation, character *core.Character) bool {
			const manaReserve = 1000 // If mana goes under 1000 we will need more soon. Pop shamanistic rage.
			if character.CurrentMana() > manaReserve {
				return false
			}

			return true
		},
		ActivationFactory: func(sim *core.Simulation) core.CooldownActivation {
			ppmm := shaman.AutoAttacks.NewPPMManager(15)
			return func(sim *core.Simulation, character *core.Character) {
				character.AddAura(sim, core.Aura{
					ID:       ShamanisticRageAuraID,
					ActionID: ShamanisticRageActionID,
					Expires:  sim.CurrentTime + dur,
					OnSpellHit: func(sim *core.Simulation, spellCast *core.SpellCast, spellEffect *core.SpellEffect) {
						// proc mask: 20
						if !spellEffect.Landed() || !spellEffect.ProcMask.Matches(core.ProcMaskMelee) {
							return
						}
						if !ppmm.Proc(sim, spellEffect.IsMH(), false, "shamanistic rage") {
							return
						}
						mana := character.GetStat(stats.AttackPower) * 0.3
						character.AddMana(sim, mana, ShamanisticRageActionID, true)
					},
				})
				character.Metrics.AddInstantCast(ShamanisticRageActionID)
				character.SetCD(ShamanisticRageCD, sim.CurrentTime+cd)
			}
		},
	})
}
