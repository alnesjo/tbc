import { Gem } from '/tbc/core/proto/common.js';
import { GemColor } from '/tbc/core/proto/common.js';
export declare function gemMatchesSocket(gem: Gem, socketColor: GemColor): boolean;
export declare function gemEligibleForSocket(gem: Gem, socketColor: GemColor): boolean;
export declare function isMetaGemActive(metaGem: Gem, numRed: number, numYellow: number, numBlue: number): boolean;
export declare function getMetaGemConditionDescription(metaGem: Gem): string;
export declare const BRACING_EARTHSTORM_DIAMOND = 25897;
export declare const BRUTAL_EARTHSTORM_DIAMOND = 25899;
export declare const CHAOTIC_SKYFIRE_DIAMOND = 34220;
export declare const DESTRUCTIVE_SKYFIRE_DIAMOND = 25890;
export declare const EMBER_SKYFIRE_DIAMOND = 35503;
export declare const ENIGMATIC_SKYFIRE_DIAMOND = 25895;
export declare const IMBUED_UNSTABLE_DIAMOND = 32641;
export declare const INSIGHTFUL_EARTHSTORM_DIAMOND = 25901;
export declare const MYSTICAL_SKYFIRE_DIAMOND = 25893;
export declare const POTENT_UNSTABLE_DIAMOND = 32640;
export declare const POWERFUL_EARTHSTORM_DIAMOND = 25896;
export declare const RELENTLESS_EARTHSTORM_DIAMOND = 32409;
export declare const SWIFT_SKYFIRE_DIAMOND = 25894;
export declare const SWIFT_STARFIRE_DIAMOND = 28557;
export declare const SWIFT_WINDFIRE_DIAMOND = 28556;
export declare const TENACIOUS_EARTHSTORM_DIAMOND = 25898;
export declare const THUNDERING_SKYFIRE_DIAMOND = 32410;
export declare const INSCRIBED_NOBLE_TOPAZ = 24058;
export declare const POTENT_NOBLE_TOPAZ = 24059;
export declare const POTENT_PYRESTONE = 32218;
export declare const VEILED_NOBLE_TOPAZ = 31867;
export declare const VEILED_PYRESTONE = 32221;
export declare const GLOWING_NIGHTSEYE = 24056;
export declare const SOVEREIGN_NIGHTSEYE = 24054;
export declare const GLOWING_SHADOWSONG_AMETHYST = 32215;
export declare const RUNED_CRIMSON_SPINEL = 32196;
export declare const BOLD_LIVING_RUBY = 24027;
export declare const RUNED_LIVING_RUBY = 24030;
export declare const RUNED_ORNATE_RUBY = 28118;
export declare const BRILLIANT_DAWNSTONE = 24047;
export declare const BRILLIANT_LIONSEYE = 32204;
export declare function setGemSocketCssClass(elem: HTMLElement, color: GemColor): void;
export declare function getEmptyGemSocketIconUrl(color: GemColor): string;
