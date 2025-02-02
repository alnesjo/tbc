package rogue

import (
	"github.com/wowsims/tbc/sim/core"
)

var EviscerateActionID = core.ActionID{SpellID: 26865}

func (rogue *Rogue) newEviscerateTemplate(sim *core.Simulation) core.SimpleSpellTemplate {
	rogue.eviscerateEnergyCost = 35
	if ItemSetAssassination.CharacterHasSetBonus(&rogue.Character, 4) {
		rogue.eviscerateEnergyCost -= 10
	}

	refundAmount := 0.4 * float64(rogue.Talents.QuickRecovery)
	hasDeathmantle2pc := ItemSetDeathmantle.CharacterHasSetBonus(&rogue.Character, 2)

	ability := rogue.newAbility(EviscerateActionID, rogue.eviscerateEnergyCost, SpellFlagFinisher, core.ProcMaskMeleeMHSpecial)
	ability.Effect.OnSpellHit = func(sim *core.Simulation, spellCast *core.SpellCast, spellEffect *core.SpellEffect) {
		if spellEffect.Landed() {
			rogue.ApplyFinisher(sim, spellCast.ActionID)
		} else {
			if refundAmount > 0 {
				rogue.AddEnergy(sim, spellCast.Cost.Value*refundAmount, core.ActionID{SpellID: 31245})
			}
		}
	}
	ability.Effect.WeaponInput.CalculateDamage = func(attackPower float64, bonusWeaponDamage float64) float64 {
		comboPoints := rogue.ComboPoints()
		base := 60.0 + 185.0*float64(comboPoints)
		if hasDeathmantle2pc {
			base += 40.0 * float64(comboPoints)
		}
		roll := sim.RandomFloat("Eviscerate") * 120.0
		return base + roll + (attackPower*0.03)*float64(comboPoints) + bonusWeaponDamage
	}

	// cp. backstab
	ability.Effect.StaticDamageMultiplier += 0.05 * float64(rogue.Talents.ImprovedEviscerate)
	ability.Effect.StaticDamageMultiplier += 0.02 * float64(rogue.Talents.Aggression)
	if rogue.Talents.SurpriseAttacks {
		ability.SpellExtras |= core.SpellExtrasCannotBeDodged
	}

	return core.NewSimpleSpellTemplate(ability)
}

func (rogue *Rogue) NewEviscerate(_ *core.Simulation, target *core.Target) *core.SimpleSpell {
	comboPoints := rogue.ComboPoints()
	if comboPoints == 0 {
		panic("Eviscerate requires combo points!")
	}

	ev := &rogue.eviscerate
	rogue.eviscerateTemplate.Apply(ev)

	// Set dynamic fields, i.e. the stuff we couldn't precompute.
	ev.ActionID.Tag = comboPoints
	ev.Effect.Target = target
	if rogue.deathmantle4pcProc {
		ev.Cost.Value = 0
		rogue.deathmantle4pcProc = false
	}

	return ev
}
