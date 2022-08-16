declare class Riichi {
    constructor(str: string);

    // disable 二倍役満
    disableWyakuman(): void;

    // disable 喰断
    disableKuitan(): void;

    // disable 赤dora
    disableAka(): void;

    // disable calculate 牌理 (未和了の場合)
    disableHairi(): void;

    enableLocalYaku(name: "大七星" | "人和"): void;
    disableYaku(name: string): void;

    enableSanma(bisection?: boolean): void;
    enableNoYakuFu(): void;
    enableNoYakuDora(): void;

    calc(): Riichi.Result;
}

declare namespace Riichi {
    interface Result {
        isAgari: boolean,
        yakuman: number,
        yaku: { [k: string]: string },
        noYaku: boolean,
        han: number,
        fu: number,
        ten: number,
        name: string,
        text: string,
        oya: number[],
        ko: number[],
        error: boolean,
        hairi?: any,
        hairi7and13?: any,
    }
}

export = Riichi;
