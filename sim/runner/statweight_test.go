package runner

import (
	"reflect"
	"testing"

	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/stats"
	"github.com/wowsims/tbc/sim/shaman"
)

func TestCalcStatWeight(t *testing.T) {
	options := basicOptions
	options.Iterations = 5000
	options.Encounter = shortEncounter

	params := IndividualParams{
		Equip:       gearFromStrings(p1Gear),
		Race:        core.RaceBonusTypeTroll10,
		Consumes:    fullConsumes,
		Buffs:       fullBuffs,
		Options:     options,
		Spec:        shaman.ElementalSpec{Talents: shamTalents, Totems: shamTotems, AgentID: shaman.AgentTypeAdaptive},
		CustomStats: []float64{},
	}

	tests := []struct {
		name   string
		params IndividualParams
		want   StatWeightsResult
	}{
		{name: "First Test", params: params, want: StatWeightsResult{}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CalcStatWeight(tt.params, []stats.Stat{stats.SpellPower, stats.SpellHit, stats.Intellect, stats.SpellCrit}, stats.SpellPower); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CalcStatWeight() = %v, want %v", got, tt.want)
			}
		})
	}
}
