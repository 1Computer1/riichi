declare class Riichi {
    constructor(str: string, settings?: Partial<Riichi.Settings>);

    // disable calculate 牌理 (未和了の場合)
    disableHairi(): void;

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

    interface Settings {
        allLocalYaku: boolean;
        localYaku: string[];
        disabledYaku: string[];
        wyakuman: boolean;
        kuitan: boolean;
        sanma: boolean;
        sanmaBisection: boolean;
        noYakuFu: boolean;
        noYakuDora: boolean;
        doubleWindFu: boolean;
        rinshanFu: boolean;
        kiriageMangan: boolean;
        kazoeYakuman: boolean;
    }
}

export = Riichi;
