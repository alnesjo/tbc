import { ActionId } from '/tbc/core/proto_utils/action_id.js';
import { TristateEffect } from '/tbc/core/proto/common.js';
import { IndividualSimIconPickerConfig } from '/tbc/core/individual_sim_ui.js';
import { Party } from '/tbc/core/party.js';
import { Player } from '/tbc/core/player.js';
import { Raid } from '/tbc/core/raid.js';
import { Target } from '/tbc/core/target.js';
import { EventID, TypedEvent } from '/tbc/core/typed_event.js';
export declare const ArcaneBrilliance: IndividualSimIconPickerConfig<Raid, boolean>;
export declare const DivineSpirit: IndividualSimIconPickerConfig<Raid, number>;
export declare const GiftOfTheWild: IndividualSimIconPickerConfig<Raid, number>;
export declare const AtieshMage: IndividualSimIconPickerConfig<Party, number>;
export declare const AtieshWarlock: IndividualSimIconPickerConfig<Party, number>;
export declare const BattleChickens: IndividualSimIconPickerConfig<Party, number>;
export declare const Bloodlust: IndividualSimIconPickerConfig<Party, number>;
export declare const BraidedEterniumChain: IndividualSimIconPickerConfig<Party, boolean>;
export declare const ChainOfTheTwilightOwl: IndividualSimIconPickerConfig<Party, boolean>;
export declare const DraeneiRacialCaster: IndividualSimIconPickerConfig<Party, boolean>;
export declare const DraeneiRacialMelee: IndividualSimIconPickerConfig<Party, boolean>;
export declare const EyeOfTheNight: IndividualSimIconPickerConfig<Party, boolean>;
export declare const FerociousInspiration: IndividualSimIconPickerConfig<Party, number>;
export declare const JadePendantOfBlasting: IndividualSimIconPickerConfig<Party, boolean>;
export declare const LeaderOfThePack: IndividualSimIconPickerConfig<Party, number>;
export declare const ManaSpringTotem: IndividualSimIconPickerConfig<Party, number>;
export declare const ManaTideTotem: IndividualSimIconPickerConfig<Party, number>;
export declare const MoonkinAura: IndividualSimIconPickerConfig<Party, number>;
export declare const SanctityAura: IndividualSimIconPickerConfig<Party, number>;
export declare const TotemOfWrath: IndividualSimIconPickerConfig<Party, number>;
export declare const TrueshotAura: IndividualSimIconPickerConfig<Party, boolean>;
export declare const WrathOfAirTotem: IndividualSimIconPickerConfig<Party, number>;
export declare const DrumsOfBattleBuff: IndividualSimIconPickerConfig<Party, boolean>;
export declare const DrumsOfRestorationBuff: IndividualSimIconPickerConfig<Party, boolean>;
export declare const BlessingOfKings: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const BlessingOfWisdom: IndividualSimIconPickerConfig<Player<any>, number>;
export declare const BlessingOfMight: IndividualSimIconPickerConfig<Player<any>, number>;
export declare const Innervate: IndividualSimIconPickerConfig<Player<any>, number>;
export declare const PowerInfusion: IndividualSimIconPickerConfig<Player<any>, number>;
export declare const UnleashedRage: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const BloodFrenzy: IndividualSimIconPickerConfig<Target, boolean>;
export declare const HuntersMark: IndividualSimIconPickerConfig<Target, number>;
export declare const ImprovedScorch: IndividualSimIconPickerConfig<Target, boolean>;
export declare const ImprovedSealOfTheCrusader: IndividualSimIconPickerConfig<Target, boolean>;
export declare const JudgementOfWisdom: IndividualSimIconPickerConfig<Target, boolean>;
export declare const Misery: IndividualSimIconPickerConfig<Target, boolean>;
export declare const CurseOfElements: IndividualSimIconPickerConfig<Target, number>;
export declare const CurseOfRecklessness: IndividualSimIconPickerConfig<Target, boolean>;
export declare const FaerieFire: IndividualSimIconPickerConfig<Target, number>;
export declare const ExposeArmor: IndividualSimIconPickerConfig<Target, number>;
export declare const SunderArmor: IndividualSimIconPickerConfig<Target, boolean>;
export declare const WintersChill: IndividualSimIconPickerConfig<Target, boolean>;
export declare const BattleChicken: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const FlaskOfBlindingLight: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const FlaskOfMightyRestoration: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const FlaskOfPureDeath: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const FlaskOfRelentlessAssault: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const FlaskOfSupremePower: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const AdeptsElixir: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfDemonslaying: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfMajorAgility: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfMajorFirePower: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfMajorFrostPower: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfMajorShadowPower: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfMajorStrength: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfTheMongoose: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfDraenicWisdom: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ElixirOfMajorMageblood: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const MainHandElementalSharpeningStone: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const MainHandBrilliantWizardOil: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const MainHandSuperiorWizardOil: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const OffHandElementalSharpeningStone: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const MainHandAdamantiteSharpeningStone: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const MainHandAdamantiteWeightstone: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const OffHandAdamantiteSharpeningStone: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const OffHandAdamantiteWeightstone: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const BlackenedBasilisk: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const GrilledMudfish: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const RavagerDog: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const RoastedClefthoof: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const SpicyHotTalbuk: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const SkullfishSoup: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const KiblersBits: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const KreegsStoutBeatdown: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DefaultDestructionPotion: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DefaultHastePotion: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DefaultMightyRagePotion: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DefaultSuperManaPotion: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DefaultDarkRune: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DefaultFlameCap: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ScrollOfAgilityV: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ScrollOfSpiritV: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const ScrollOfStrengthV: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const PetScrollOfAgilityV: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const PetScrollOfStrengthV: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DrumsOfBattleConsume: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const DrumsOfRestorationConsume: IndividualSimIconPickerConfig<Player<any>, boolean>;
export declare const GraceOfAirTotem: {
    id: ActionId;
    states: number;
    improvedId: ActionId;
    changedEvent: (party: Party) => TypedEvent<void>;
    getValue: (party: Party) => TristateEffect;
    setValue: (eventID: EventID, party: Party, newValue: number) => void;
};
export declare const StrengthOfEarthTotem: {
    id: ActionId;
    states: number;
    improvedId: ActionId;
    improvedId2: ActionId;
    changedEvent: (party: Party) => TypedEvent<void>;
    getValue: (party: Party) => number;
    setValue: (eventID: EventID, party: Party, newValue: number) => void;
};
export declare const WindfuryTotem: {
    id: ActionId;
    states: number;
    improvedId: ActionId;
    changedEvent: (party: Party) => TypedEvent<void>;
    getValue: (party: Party) => 1 | 0 | 2;
    setValue: (eventID: EventID, party: Party, newValue: number) => void;
};
export declare const BattleShout: {
    id: ActionId;
    states: number;
    improvedId: ActionId;
    improvedId2: ActionId;
    changedEvent: (party: Party) => TypedEvent<void>;
    getValue: (party: Party) => number;
    setValue: (eventID: EventID, party: Party, newValue: number) => void;
};
