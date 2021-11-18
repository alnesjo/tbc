import { BalanceDruid_Rotation_PrimarySpell as PrimarySpell } from '/tbc/core/proto/druid.js';
import { RaidTarget } from '/tbc/core/proto/common.js';
import { NO_TARGET } from '/tbc/core/proto_utils/utils.js';
// Configuration for spec-specific UI elements on the settings tab.
// These don't need to be in a separate file but it keeps things cleaner.
export const SelfInnervate = {
    id: { spellId: 29166 },
    states: 2,
    changedEvent: (player) => player.specOptionsChangeEmitter,
    getValue: (player) => player.getSpecOptions().innervateTarget?.targetIndex != NO_TARGET,
    setBooleanValue: (player, newValue) => {
        const newOptions = player.getSpecOptions();
        newOptions.innervateTarget = RaidTarget.create({
            targetIndex: newValue ? 0 : NO_TARGET,
        });
        player.setSpecOptions(newOptions);
    },
};
export const BalanceDruidRotationConfig = {
    inputs: [
        {
            type: 'enum', cssClass: 'primary-spell-enum-picker',
            getModObject: (simUI) => simUI.player,
            config: {
                label: 'Primary Spell',
                labelTooltip: 'If set to \'Adaptive\', will dynamically adjust rotation based on available mana.',
                values: [
                    {
                        name: 'Adaptive', value: PrimarySpell.Adaptive,
                    },
                    {
                        name: 'Starfire', value: PrimarySpell.Starfire,
                    },
                    {
                        name: 'Starfire R6', value: PrimarySpell.Starfire6,
                    },
                    {
                        name: 'Wrath', value: PrimarySpell.Wrath,
                    },
                ],
                changedEvent: (player) => player.rotationChangeEmitter,
                getValue: (player) => player.getRotation().primarySpell,
                setValue: (player, newValue) => {
                    const newRotation = player.getRotation();
                    newRotation.primarySpell = newValue;
                    player.setRotation(newRotation);
                },
            },
        },
        {
            type: 'boolean',
            cssClass: 'moonfire-picker',
            getModObject: (simUI) => simUI.player,
            config: {
                label: 'Use Moonfire',
                labelTooltip: 'Use Moonfire as the next cast after the dot expires.',
                changedEvent: (player) => player.rotationChangeEmitter,
                getValue: (player) => player.getRotation().moonfire,
                setValue: (player, newValue) => {
                    const newRotation = player.getRotation();
                    newRotation.moonfire = newValue;
                    player.setRotation(newRotation);
                },
                enableWhen: (player) => player.getRotation().primarySpell != PrimarySpell.Adaptive,
            },
        },
        {
            type: 'boolean',
            cssClass: 'faerie-fire-picker',
            getModObject: (simUI) => simUI.player,
            config: {
                label: 'Use Faerie Fire',
                labelTooltip: 'Keep Faerie Fire active on the primary target.',
                changedEvent: (player) => player.rotationChangeEmitter,
                getValue: (player) => player.getRotation().faerieFire,
                setValue: (player, newValue) => {
                    const newRotation = player.getRotation();
                    newRotation.faerieFire = newValue;
                    player.setRotation(newRotation);
                },
            },
        },
        {
            type: 'boolean',
            cssClass: 'insect-swarm-picker',
            getModObject: (simUI) => simUI.player,
            config: {
                label: 'Use Insect Swarm',
                labelTooltip: 'Keep Insect Swarm active on the primary target.',
                changedEvent: (player) => player.rotationChangeEmitter,
                getValue: (player) => player.getRotation().insectSwarm,
                setValue: (player, newValue) => {
                    const newRotation = player.getRotation();
                    newRotation.insectSwarm = newValue;
                    player.setRotation(newRotation);
                },
                enableWhen: (player) => player.getTalents().insectSwarm,
            },
        },
    ],
};
