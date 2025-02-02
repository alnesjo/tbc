package core

import (
	"time"

	"github.com/wowsims/tbc/sim/core/proto"
)

func applyDebuffEffects(target *Target, debuffs proto.Debuffs) {
	if debuffs.Misery {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return MiseryAura(sim, 5)
		})
	}

	if debuffs.JudgementOfWisdom {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return JudgementOfWisdomAura(sim)
		})
	}

	if debuffs.ImprovedSealOfTheCrusader {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return JudgementOfTheCrusaderAura(sim, 3)
		})
	}

	if debuffs.CurseOfElements != proto.TristateEffect_TristateEffectMissing {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return CurseOfElementsAura(debuffs.CurseOfElements)
		})
	}

	if debuffs.IsbUptime > 0.0 {
		uptime := MinFloat(1.0, debuffs.IsbUptime)
		target.AddPermanentAuraWithOptions(PermanentAura{
			AuraFactory: func(sim *Simulation) Aura {
				return ImprovedShadowBoltAura(uptime)
			},
			UptimeMultiplier: uptime,
		})
	}

	if debuffs.ImprovedScorch {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return ImprovedScorchAura(sim, 5)
		})
	}

	if debuffs.WintersChill {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return WintersChillAura(sim, 5)
		})
	}

	if debuffs.BloodFrenzy {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return BloodFrenzyAura()
		})
	}

	if debuffs.Mangle {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return MangleAura()
		})
	}

	if debuffs.ExposeArmor != proto.TristateEffect_TristateEffectMissing {
		points := int32(0)
		if debuffs.ExposeArmor == proto.TristateEffect_TristateEffectImproved {
			points = 2
		}
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return ExposeArmorAura(sim, target, points)
		})
	} else if debuffs.SunderArmor {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return SunderArmorAura(0, target, 5)
		})
	}

	if debuffs.FaerieFire != proto.TristateEffect_TristateEffectMissing {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return FaerieFireAura(0, target, debuffs.FaerieFire == proto.TristateEffect_TristateEffectImproved)
		})
	}

	if debuffs.CurseOfRecklessness {
		target.AddPermanentAura(func(sim *Simulation) Aura {
			return CurseOfRecklessnessAura(0, target)
		})
	}

	if debuffs.ExposeWeaknessUptime > 0 && debuffs.ExposeWeaknessHunterAgility > 0 {
		multiplier := MinFloat(1.0, debuffs.ExposeWeaknessUptime)
		target.AddPermanentAuraWithOptions(PermanentAura{
			AuraFactory: func(sim *Simulation) Aura {
				return ExposeWeaknessAura(0, debuffs.ExposeWeaknessHunterAgility, multiplier)
			},
			UptimeMultiplier: multiplier,
		})
	}

	if debuffs.HuntersMark != proto.TristateEffect_TristateEffectMissing {
		if debuffs.HuntersMark == proto.TristateEffect_TristateEffectImproved {
			target.AddPermanentAura(func(sim *Simulation) Aura {
				return HuntersMarkAura(5, true)
			})
		} else {
			target.AddPermanentAura(func(sim *Simulation) Aura {
				return HuntersMarkAura(0, true)
			})
		}
	}
}

var MiseryDebuffID = NewDebuffID()

func MiseryAura(sim *Simulation, numPoints int32) Aura {
	multiplier := 1.0 + 0.01*float64(numPoints)

	return Aura{
		ID:       MiseryDebuffID,
		ActionID: ActionID{SpellID: 33195},
		Expires:  sim.CurrentTime + time.Second*24,
		Stacks:   numPoints,
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellCast.SpellSchool.Matches(SpellSchoolMagic) {
				spellEffect.DamageMultiplier *= multiplier
			}
		},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if spellCast.SpellSchool.Matches(SpellSchoolMagic) {
				*tickDamage *= multiplier
			}
		},
	}
}

var ShadowWeavingDebuffID = NewDebuffID()

func ShadowWeavingAura(sim *Simulation, numStacks int32) Aura {
	multiplier := 1.0 + 0.02*float64(numStacks)

	return Aura{
		ID:       ShadowWeavingDebuffID,
		ActionID: ActionID{SpellID: 15334},
		Expires:  sim.CurrentTime + time.Second*15,
		Stacks:   numStacks,
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellCast.SpellSchool.Matches(SpellSchoolShadow) {
				spellEffect.DamageMultiplier *= multiplier
			}
		},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if spellCast.SpellSchool.Matches(SpellSchoolShadow) {
				*tickDamage *= multiplier
			}
		},
	}
}

var JudgementOfWisdomDebuffID = NewDebuffID()

func JudgementOfWisdomAura(sim *Simulation) Aura {
	const mana = 74 / 2 // 50% proc
	actionID := ActionID{SpellID: 27164}
	var aura Aura
	aura = Aura{
		ID:       JudgementOfWisdomDebuffID,
		ActionID: actionID,
		Expires:  sim.CurrentTime + time.Second*20,
		OnSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect) {
			// TODO: This check is purely to maintain behavior during refactoring. Should be removed when possible.
			if !spellEffect.ProcMask.Matches(ProcMaskMeleeOrRanged) && !spellEffect.Landed() {
				return
			}
			if spellCast.IsPhantom {
				return // Phantom spells (Romulo's, Lightning Capacitor, etc) don't proc JoW.
			}

			character := spellCast.Character
			if character.HasManaBar() {
				character.AddMana(sim, mana, actionID, false)
			}

			if spellCast.ActionID.SpellID == 35395 {
				aura.Expires = sim.CurrentTime + time.Second*20
				spellEffect.Target.ReplaceAura(sim, aura)
			}
		},
	}
	return aura
}

var ImprovedSealOfTheCrusaderDebuffID = NewDebuffID()

func JudgementOfTheCrusaderAura(sim *Simulation, level float64) Aura {
	bonusSPCrit := level * SpellCritRatingPerCritChance
	bonusMCrit := level * MeleeCritRatingPerCritChance
	var aura Aura
	aura = Aura{
		ID:       ImprovedSealOfTheCrusaderDebuffID,
		ActionID: ActionID{SpellID: 27159},
		Expires:  sim.CurrentTime + time.Second*20,
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellCast.SpellSchool.Matches(SpellSchoolHoly) {
				spellEffect.BonusSpellPower += 219
			}
			spellEffect.BonusSpellCritRating += bonusSPCrit
			spellEffect.BonusCritRating += bonusMCrit

			if spellCast.ActionID.SpellID == 35395 {
				aura.Expires = sim.CurrentTime + time.Second*20
				spellEffect.Target.ReplaceAura(sim, aura)
			}
		},
	}
	return aura
}

var CurseOfElementsDebuffID = NewDebuffID()

func CurseOfElementsAura(coe proto.TristateEffect) Aura {
	mult := 1.1
	level := int32(0)
	if coe == proto.TristateEffect_TristateEffectImproved {
		mult = 1.13
		level = 3
	}

	return Aura{
		ID:       CurseOfElementsDebuffID,
		ActionID: ActionID{SpellID: 27228},
		Stacks:   level, // Use stacks to store talent level for detection by other code.
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellCast.SpellSchool.Matches(SpellSchoolArcane | SpellSchoolFire | SpellSchoolFrost | SpellSchoolShadow) {
				spellEffect.DamageMultiplier *= mult
			}
		},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if spellCast.SpellSchool.Matches(SpellSchoolArcane | SpellSchoolFire | SpellSchoolFrost | SpellSchoolShadow) {
				*tickDamage *= mult
			}
		},
	}
}

var ImprovedShadowBoltID = NewDebuffID()

func ImprovedShadowBoltAura(uptime float64) Aura {
	mult := (1 + uptime*0.2)
	return Aura{
		ID:       ImprovedShadowBoltID,
		ActionID: ActionID{SpellID: 17803},
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if !spellCast.SpellSchool.Matches(SpellSchoolShadow) {
				return // does not apply to these schools
			}
			spellEffect.DamageMultiplier *= mult
		},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if !spellCast.SpellSchool.Matches(SpellSchoolShadow) {
				return // does not apply to these schools
			}
			*tickDamage *= mult
		},
	}
}

var BloodFrenzyDebuffID = NewDebuffID()

func BloodFrenzyAura() Aura {
	return Aura{
		ID:       BloodFrenzyDebuffID,
		ActionID: ActionID{SpellID: 29859},
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if !spellCast.SpellSchool.Matches(SpellSchoolPhysical) {
				return
			}
			spellEffect.DamageMultiplier *= 1.04
		},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if !spellCast.SpellSchool.Matches(SpellSchoolPhysical) {
				return
			}
			*tickDamage *= 1.04
		},
	}
}

var MangleDebuffID = NewDebuffID()

func MangleAura() Aura {
	return Aura{
		ID:       MangleDebuffID,
		ActionID: ActionID{SpellID: 33876},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if !spellCast.SpellSchool.Matches(SpellSchoolPhysical) {
				return
			}
			*tickDamage *= 1.3
		},
	}
}

var ImprovedScorchDebuffID = NewDebuffID()

func ImprovedScorchAura(sim *Simulation, numStacks int32) Aura {
	multiplier := 1.0 + 0.03*float64(numStacks)

	return Aura{
		ID:       ImprovedScorchDebuffID,
		ActionID: ActionID{SpellID: 12873},
		Expires:  sim.CurrentTime + time.Second*30,
		Stacks:   numStacks,
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellCast.SpellSchool.Matches(SpellSchoolFire) {
				spellEffect.DamageMultiplier *= multiplier
			}
		},
		OnBeforePeriodicDamage: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect, tickDamage *float64) {
			if spellCast.SpellSchool.Matches(SpellSchoolFire) {
				*tickDamage *= multiplier
			}
		},
	}
}

var WintersChillDebuffID = NewDebuffID()

func WintersChillAura(sim *Simulation, numStacks int32) Aura {
	bonusCrit := 2 * float64(numStacks) * SpellCritRatingPerCritChance

	return Aura{
		ID:       WintersChillDebuffID,
		ActionID: ActionID{SpellID: 28595},
		Expires:  sim.CurrentTime + time.Second*15,
		Stacks:   numStacks,
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellCast.SpellSchool.Matches(SpellSchoolFrost) {
				spellEffect.BonusSpellCritRating += bonusCrit
			}
		},
	}
}

var FaerieFireDebuffID = NewDebuffID()

func FaerieFireAura(currentTime time.Duration, target *Target, improved bool) Aura {
	const hitBonus = 3 * MeleeHitRatingPerHitChance
	target.AddArmor(-610)
	aura := Aura{
		ID:       FaerieFireDebuffID,
		ActionID: ActionID{SpellID: 26993},
		Expires:  currentTime + time.Second*40,
		OnExpire: func(sim *Simulation) {
			target.AddArmor(610)
		},
	}
	if improved {
		aura.OnBeforeSpellHit = func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			spellEffect.BonusHitRating += hitBonus
		}
	}

	return aura
}

var SunderArmorDebuffID = NewDebuffID()

func SunderArmorAura(currentTime time.Duration, target *Target, stacks int) Aura {
	armorReduction := 520.0 * float64(stacks)
	target.AddArmor(-armorReduction)

	aura := Aura{
		ID:       SunderArmorDebuffID,
		ActionID: ActionID{SpellID: 25225},
		Expires:  currentTime + time.Second*30,
		OnExpire: func(sim *Simulation) {
			target.AddArmor(armorReduction)
		},
	}

	return aura
}

var ExposeArmorDebuffID = NewDebuffID()

func ExposeArmorAura(sim *Simulation, target *Target, talentPoints int32) Aura {
	armorReduction := 2050.0 * (1.0 + 0.25*float64(talentPoints))

	if !target.HasAura(ExposeArmorDebuffID) {
		target.AddArmor(-armorReduction)

		if target.HasAura(SunderArmorDebuffID) {
			target.RemoveAura(sim, SunderArmorDebuffID)
		}
	}

	return Aura{
		ID:       ExposeArmorDebuffID,
		ActionID: ActionID{SpellID: 26866},
		Expires:  sim.CurrentTime + time.Second*30,
		OnExpire: func(sim *Simulation) {
			target.AddArmor(armorReduction)
		},
	}
}

var CurseOfRecklessnessDebuffID = NewDebuffID()

func CurseOfRecklessnessAura(currentTime time.Duration, target *Target) Aura {
	armorReduction := 800.0
	target.AddArmor(-armorReduction)

	aura := Aura{
		ID:       CurseOfRecklessnessDebuffID,
		ActionID: ActionID{SpellID: 27226},
		Expires:  currentTime + time.Minute*2,
		OnExpire: func(sim *Simulation) {
			target.AddArmor(armorReduction)
		},
	}

	return aura
}

var ExposeWeaknessDebuffID = NewDebuffID()

// Multiplier is for accomodating uptime %. For a real hunter, always pass 1.0
func ExposeWeaknessAura(currentTime time.Duration, hunterAgility float64, multiplier float64) Aura {
	apBonus := hunterAgility * 0.25 * multiplier

	return Aura{
		ID:       ExposeWeaknessDebuffID,
		ActionID: ActionID{SpellID: 34503},
		Expires:  currentTime + time.Second*7,
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			spellEffect.BonusAttackPowerOnTarget += apBonus
		},
	}
}

var HuntersMarkDebuffID = NewDebuffID()

func HuntersMarkAura(points int32, fullyStacked bool) Aura {
	const baseRangedBonus = 110.0
	const bonusPerStack = 11.0
	const maxStacks = 30
	meleeBonus := baseRangedBonus * 0.2 * float64(points)

	stacks := 0
	if fullyStacked {
		stacks = maxStacks
	}

	rangedBonus := baseRangedBonus + bonusPerStack*float64(stacks)

	return Aura{
		ID:       HuntersMarkDebuffID,
		ActionID: ActionID{SpellID: 14325},
		Stacks:   points, // Use this to check whether to override in hunter/hunter.go
		OnBeforeSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellHitEffect) {
			if spellEffect.ProcMask.Matches(ProcMaskMelee) {
				spellEffect.BonusAttackPowerOnTarget += meleeBonus
			} else {
				spellEffect.BonusAttackPowerOnTarget += rangedBonus
			}
		},
		OnSpellHit: func(sim *Simulation, spellCast *SpellCast, spellEffect *SpellEffect) {
			if !spellCast.OutcomeRollCategory.Matches(OutcomeRollCategoryRanged) || !spellEffect.Landed() {
				return
			}
			if stacks < maxStacks {
				stacks++
				rangedBonus = baseRangedBonus + bonusPerStack*float64(stacks)
			}
		},
	}
}
