package paladin

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
)

var AvengingWrathCD = core.NewCooldownID()
var AvengingWrathAuraID = core.NewAuraID()
var AvengingWrathActionID = core.ActionID{SpellID: 31884}

func (paladin *Paladin) registerAvengingWrathCD() {
	cd := time.Minute * 3
	dur := time.Second * 20
	var manaCost float64 = 236

	paladin.AddMajorCooldown(core.MajorCooldown{
		ActionID:   AvengingWrathActionID,
		CooldownID: AvengingWrathCD,
		Cooldown:   cd,
		Type:       core.CooldownTypeDPS,
		CanActivate: func(sim *core.Simulation, character *core.Character) bool {
			return character.CurrentMana() >= manaCost
		},
		// modify this logic if it should ever not be spammed on CD / maybe should synced with other CDs
		ShouldActivate: func(sim *core.Simulation, character *core.Character) bool {
			return true
		},
		ActivationFactory: func(sim *core.Simulation) core.CooldownActivation {
			return func(sim *core.Simulation, character *core.Character) {
				character.AddAura(sim, core.Aura{
					ID:       AvengingWrathAuraID,
					ActionID: AvengingWrathActionID,
					Expires:  sim.CurrentTime + dur,
					OnBeforeSpellHit: func(sim *core.Simulation, spellCast *core.SpellCast, spellEffect *core.SpellHitEffect) {
						spellEffect.DamageMultiplier *= 1.3
					},
					OnBeforePeriodicDamage: func(sim *core.Simulation, spellCast *core.SpellCast, spellEffect *core.SpellEffect, tickDamage *float64) {
						*tickDamage *= 1.3
					},
				})
				character.Metrics.AddInstantCast(AvengingWrathActionID)
				character.SetCD(AvengingWrathCD, sim.CurrentTime+cd)
			}
		},
	})
}
