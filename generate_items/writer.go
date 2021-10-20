package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"

	"github.com/wowsims/tbc/sim/core/proto"
	"github.com/wowsims/tbc/sim/core/stats"
)

var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
var matchAllCap = regexp.MustCompile("([a-z0-9])([A-Z])")

func ToSnakeCase(str string) string {
	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}

// Converts proto.Spec_SpecElementalShaman into 'elemental_shaman'
func SpecToFileName(spec *proto.Spec) string {
	if spec == nil {
		return "all"
	}

	return ToSnakeCase(spec.String()[4:])
}

func specInSlice(a proto.Spec, list []proto.Spec) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

func writeItemFile(outDir string, itemDeclarations []ItemDeclaration, itemResponses []WowheadItemResponse, spec *proto.Spec) {
	err := os.MkdirAll(outDir, os.ModePerm)
	if err != nil {
		panic(err)
	}

	specStr := SpecToFileName(spec)
	file, err := os.Create(fmt.Sprintf("%s/%s.go", outDir, specStr))
	if err != nil {
		panic(err)
	}
	defer file.Close()

	if spec == nil {
		// all.go should be used when none of the spec tags are specified
		for specVal, _ := range proto.Spec_name {
			spec := proto.Spec(specVal)
			file.WriteString(fmt.Sprintf("// +build !%s\n", SpecToFileName(&spec)))
		}
		file.WriteString("\n")
	} else {
		file.WriteString(fmt.Sprintf("// +build %s\n\n", specStr))
	}

	file.WriteString(`// DO NOT EDIT. This file is auto-generated by the item generator tool. Use that to make edits.
	
package items
	
import (
	"github.com/wowsims/tbc/sim/core/proto"
	"github.com/wowsims/tbc/sim/core/stats"
)

var Items = []Item{
`)

	for idx, itemDeclaration := range itemDeclarations {
		if spec == nil || specInSlice(*spec, itemDeclaration.Specs) {
			itemResponse := itemResponses[idx]
			file.WriteString(fmt.Sprintf("\t%s,\n", itemToGoString(itemDeclaration, itemResponse)))
		}
	}

	file.WriteString("}\n")

	file.Sync()
}

func itemToGoString(itemDeclaration ItemDeclaration, itemResponse WowheadItemResponse) string {
	itemStr := "{"

	itemStr += fmt.Sprintf("Name:\"%s\", ", itemResponse.Name)
	itemStr += fmt.Sprintf("ID:%d, ", itemDeclaration.ID)

	itemStr += fmt.Sprintf("Type:proto.ItemType_%s, ", itemResponse.GetItemType().String())

	armorType := itemResponse.GetArmorType()
	if armorType != proto.ArmorType_ArmorTypeUnknown {
		itemStr += fmt.Sprintf("ArmorType:proto.ArmorType_%s, ", armorType.String())
	}

	weaponType := itemResponse.GetWeaponType()
	if weaponType != proto.WeaponType_WeaponTypeUnknown {
		itemStr += fmt.Sprintf("WeaponType:proto.WeaponType_%s, ", weaponType.String())

		handType := itemResponse.GetHandType()
		if handType == proto.HandType_HandTypeUnknown {
			panic("Unknown hand type for item: " + itemResponse.Tooltip)
		}
		itemStr += fmt.Sprintf("HandType:proto.HandType_%s, ", handType.String())
	} else {
		rangedWeaponType := itemResponse.GetRangedWeaponType()
		if rangedWeaponType != proto.RangedWeaponType_RangedWeaponTypeUnknown {
			itemStr += fmt.Sprintf("RangedWeaponType:proto.RangedWeaponType_%s, ", rangedWeaponType.String())
		}
	}

	itemStr += fmt.Sprintf("Phase:%d, ", itemResponse.GetPhase())
	itemStr += fmt.Sprintf("Quality:proto.ItemQuality_%s, ", proto.ItemQuality(itemResponse.Quality).String())

	if itemResponse.GetUnique() {
		itemStr += fmt.Sprintf("Unique:true, ")
	}

	itemStr += fmt.Sprintf("Stats: %s, ", statsToGoString(itemResponse.GetStats()))

	gemSockets := itemResponse.GetGemSockets()
	if len(gemSockets) > 0 {
		itemStr += "GemSockets: []proto.GemColor{"
		for _, gemColor := range gemSockets {
			itemStr += fmt.Sprintf("proto.GemColor_%s,", gemColor.String())
		}
		itemStr += "}, "
	}

	itemStr += fmt.Sprintf("SocketBonus: %s", statsToGoString(itemResponse.GetSocketBonus()))

	itemStr += "}"
	return itemStr
}

func statsToGoString(statlist Stats) string {
	statsStr := "stats.Stats{"

	for stat, value := range statlist {
		if value > 0 {
			statsStr += fmt.Sprintf("stats.%s:%.0f,", stats.Stat(stat).StatName(), value)
		}
	}

	statsStr += "}"
	return statsStr
}
