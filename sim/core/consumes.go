package core

import (
	"time"

	"github.com/wowsims/tbc/sim/core/stats"
)

type Consumes struct {
	// Buffs
	BrilliantWizardOil       bool
	MajorMageblood           bool
	FlaskOfBlindingLight     bool
	FlaskOfMightyRestoration bool
	BlackendBasilisk         bool

	// Used in rotations
	DestructionPotion bool
	SuperManaPotion   bool
	DarkRune          bool
	DrumsOfBattle     bool
}

func (c Consumes) AddStats(s stats.Stats) stats.Stats {
	if c.BrilliantWizardOil {
		s[stats.SpellCrit] += 14
		s[stats.SpellPower] += 36
	}
	if c.MajorMageblood {
		s[stats.MP5] += 16.0
	}
	if c.FlaskOfBlindingLight {
		s[stats.SpellPower] += 80
	}
	if c.FlaskOfMightyRestoration {
		s[stats.MP5] += 25
	}
	if c.BlackendBasilisk {
		s[stats.SpellPower] += 23
	}
	return s
}

func TryActivateDrums(sim *Simulation, party *Party, player *Player) {
	if !player.Consumes.DrumsOfBattle || player.IsOnCD(MagicIDDrums, sim.CurrentTime) {
		return
	}

	const hasteBonus = 80
	for _, p := range party.Players {
		p.Stats[stats.SpellHaste] += hasteBonus
		p.SetCD(MagicIDDrums, time.Minute*2+sim.CurrentTime) // tinnitus
		p.AddAura(sim, AuraStatRemoval(sim.CurrentTime, time.Second*30, hasteBonus, stats.SpellHaste, MagicIDDrums))
	}
}

func TryActivateDestructionPotion(sim *Simulation, party *Party, player *Player) {
	if !player.Consumes.DestructionPotion || player.IsOnCD(MagicIDPotion, sim.CurrentTime) {
		return
	}

	// Only use dest potion if not using mana or if we haven't used it once.
	// If we are using mana, only use destruction potion on the pull.
	if player.destructionPotionUsed && player.Consumes.SuperManaPotion {
		return
	}

	const spBonus = 120
	const critBonus = 44.16
	const dur = time.Second * 15

	player.destructionPotionUsed = true
	player.SetCD(MagicIDPotion, time.Second*120+sim.CurrentTime)
	player.Stats[stats.SpellPower] += spBonus
	player.Stats[stats.SpellCrit] += critBonus

	player.AddAura(sim, Aura{
		ID:      MagicIDDestructionPotion,
		Expires: sim.CurrentTime + dur,
		OnExpire: func(sim *Simulation, player PlayerAgent, c *Cast) {
			player.Stats[stats.SpellPower] -= spBonus
			player.Stats[stats.SpellCrit] -= critBonus
		},
	})
}

func TryActivateDarkRune(sim *Simulation, party *Party, player *Player) {
	if !player.Consumes.DarkRune || player.IsOnCD(MagicIDRune, sim.CurrentTime) {
		return
	}

	// Only pop if we have less than the max mana provided by the potion minus 1mp5 tick.
	totalRegen := player.manaRegenPerSecond() * 5
	if player.InitialStats[stats.Mana]-(player.Stats[stats.Mana]+totalRegen) < 1500 {
		return
	}

	// Restores 900 to 1500 mana. (2 Min Cooldown)
	player.Stats[stats.Mana] += 900 + (sim.Rando.Float64("dark rune") * 600)
	player.SetCD(MagicIDRune, time.Second*120+sim.CurrentTime)
	if sim.Debug != nil {
		sim.Debug("Used Dark Rune\n")
	}
}

func TryActivateSuperManaPotion(sim *Simulation, party *Party, player *Player) {
	if !player.Consumes.SuperManaPotion || player.IsOnCD(MagicIDPotion, sim.CurrentTime) {
		return
	}

	// Only pop if we have less than the max mana provided by the potion minus 1mp5 tick.
	totalRegen := player.manaRegenPerSecond() * 5
	if player.InitialStats[stats.Mana]-(player.Stats[stats.Mana]+totalRegen) < 3000 {
		return
	}

	// Restores 1800 to 3000 mana. (2 Min Cooldown)
	manaGain := 1800 + (sim.Rando.Float64("super mana") * 1200)

	if player.HasAura(MagicIDAlchStone) {
		manaGain *= 1.4
	}

	player.Stats[stats.Mana] += manaGain
	player.SetCD(MagicIDPotion, time.Second*120+sim.CurrentTime)
	if sim.Debug != nil {
		sim.Debug("Used Mana Potion\n")
	}
}
