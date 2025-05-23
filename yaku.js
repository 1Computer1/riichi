/*
 * Copyright (C) https://github.com/takayama-lily/riichi
 */
'use strict'
const agari = require('agari')
const MPSZ = ['m', 'p', 's', 'z']
const checkAllowed = (o, allowed)=>{
    for (let v of o.hai)
        if (!allowed.includes(v))
            return false
    for (let v of o.furo)
        for (let vv of v)
            if (!allowed.includes(vv))
                return false
    return true
}
const checkChanta = (o, allow)=>{
    let hasJyuntsu = false
    for (let v of o.currentPattern) {
        if (typeof v === 'string') {
            if (!allow.includes(v))
                return false
        } else if (v.length <= 2 || v[0] === v[1]) {
            if (!allow.includes(v[0]))
                return false
        } else {
            hasJyuntsu = true
            let add = parseInt(v[0]) + parseInt(v[1]) + parseInt(v[2])
            if (add > 6 && add < 24)
                return false
        }
    }
    return hasJyuntsu
}
const checkYakuhai = (o, pos)=>{
    for (let v of o.currentPattern) {
        if (typeof v !== 'string' && v[0] === pos + 'z')
            return true
    }
    return false
}

const YAKU =
{
    "国士無双十三面待ち":{"yakuman":2, "isMenzenOnly":true, "check":(o)=>{
        return agari.check13(o.haiArray) && o.hai.reduce((total, v)=>{
            return v === o.agari ? ++total : total
        }, 0) === 2
    }},
    "国士無双":{"yakuman":1, "isMenzenOnly":true, "check":(o)=>{
        return agari.check13(o.haiArray) && o.hai.reduce((total, v)=>{
            return v === o.agari ? ++total : total
        }, 0) === 1
    }},
    "純正九蓮宝燈":{"yakuman":2, "isMenzenOnly":true, "check":(o)=>{
        let i = MPSZ.indexOf(o.agari[1])
        let arr = o.haiArray[i].concat()
        if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
            return false
        return [2, 4].includes(arr[parseInt(o.agari)-1])
    }},
    "九蓮宝燈":{"yakuman":1, "isMenzenOnly":true, "check":(o)=>{
        let i = MPSZ.indexOf(o.agari[1])
        let arr = o.haiArray[i].concat()
        if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
            return false
        return [1, 3].includes(arr[parseInt(o.agari)-1])
    }},
    "四暗刻単騎待ち":{"yakuman":2, "isMenzenOnly":true, "check":(o)=>{
        let res = 0
        for (let v of o.currentPattern) {
            if (typeof v === 'string' && v !== o.agari)
                return false
            if (typeof v !== 'string' && v.length <= 2)
                res++
        }
        return res === 4
    }},
    "四暗刻":{"yakuman":1, "isMenzenOnly":true, "check":(o)=>{
        let res = 0
        for (let v of o.currentPattern) {
            if (typeof v === 'string' && v === o.agari)
                return false
            if (typeof v !== 'string' && v.length <= 2)
                res++
        }
        return res === 4
    }},
    "大四喜":{"yakuman":2, "check":(o)=>{
        let need = ['1z', '2z', '3z', '4z']
        let res = 0
        for (let v of o.currentPattern) {
            if (typeof v === 'object' && need.includes(v[0]))
                res++
        }
        return res === 4
    }},
    "小四喜":{"yakuman":1, "check":(o)=>{
        let need = ['1z', '2z', '3z', '4z']
        let res = 0
        for (let v of o.currentPattern) {
            if (typeof v === 'string' && !need.includes(v))
                return false
            if (typeof v === 'object' && need.includes(v[0]))
                res++
        }
        return res === 3
    }},
    "大三元":{"yakuman":1, "check":(o)=>{
        let need = ['5z', '6z', '7z']
        let res = 0
        for (let v of o.currentPattern) {
            if (typeof v === 'object' && need.includes(v[0]))
                res++
        }
        return res === 3
    }},
    "字一色":{"yakuman":1, "check":(o)=>{
        if ((o.settings.allLocalYaku || o.settings.localYaku.includes('大七星')) && YAKU['大七星'].check(o))
            return false
        let allow = ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
        return checkAllowed(o, allow)
    }},
    "緑一色":{"yakuman":1, "check":(o)=>{
        let allow = ['2s', '3s', '4s', '6s', '8s', '6z']
        if (o.settings.ryuuiisouHatsu) {
            let need = ['6z']
            let found = false
            for (let v of o.currentPattern) {
                if (typeof v === 'string' && need.includes(v) || typeof v === 'object' && need.includes(v[0])) {
                    found = true
                    break
                }
            }
           return checkAllowed(o, allow) && found
        }
        return checkAllowed(o, allow)
    }},
    "紅孔雀":{"yakuman":1, "isLocal": true, "check":(o)=>{
        let allow = ['1s', '5s', '7s', '9s', '7z']
        return checkAllowed(o, allow)
    }},
    "黒一色":{"yakuman":1, "isLocal": true, "check":(o)=>{
        let allow = ['2p', '4p', '8p', '1z', '2z', '3z', '4z']
        return checkAllowed(o, allow)
    }},
    "百万石":{"yakuman":1, "isLocal": true, "check":(o)=>{
        let count = 0
        for (let v of o.hai) {
            if (v[1] !== 'm') {
                return false
            }
            count += parseInt(v)
        }
        for (let v of o.furo) {
            for (let vv of v) {
                if (vv[1] !== 'm') {
                    return false
                }
                count += parseInt(v)
            }
        }
        return count >= 100
    }},
    "清老頭":{"yakuman":1, "check":(o)=>{
        let allow = ['1m', '9m', '1p', '9p', '1s', '9s']
        return checkAllowed(o, allow)
    }},
    "四槓子":{"yakuman":1, "check":(o)=>{
        let res = 0
        for (let v of o.currentPattern)
            if (typeof v !== 'string' && (v.length === 2 || v.length === 4))
                res++
        return res === 4
    }},
    "天和":{"yakuman":1, "isMenzenOnly":true, "check":(o)=>{
        return o.extra.includes('t') && o.isTsumo && o.isOya && !o.furo.length && !o.nukidora
    }},
    "地和":{"yakuman":1, "isMenzenOnly":true, "check":(o)=>{
        return o.extra.includes('t') && o.isTsumo && !o.isOya && !o.furo.length && !o.nukidora
    }},
    "人和":{"yakuman":1, "isMenzenOnly":true, "isLocal":true, "check":(o)=>{
        return o.extra.includes('t') && !o.isTsumo && !o.isOya && !o.furo.length && !o.nukidora
    }},
    "大七星":{"yakuman":2, "isMenzenOnly":true, "isLocal":true, "check":(o)=>{
        let allow = ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
        return checkAllowed(o, allow) && YAKU['七対子'].check(o)
    }},
    "大数隣":{"yakuman":1, "isMenzenOnly":true, "isLocal":true, "check":(o)=>{
        let allow = ['2m', '3m', '4m', '5m', '6m', '7m', '8m']
        return checkAllowed(o, allow) && agari.check7(o.haiArray)
    }},
    "大車輪":{"yakuman":1, "isMenzenOnly":true, "isLocal":true, "check":(o)=>{
        let allow = ['2p', '3p', '4p', '5p', '6p', '7p', '8p']
        return checkAllowed(o, allow) && agari.check7(o.haiArray)
    }},
    "大竹林":{"yakuman":1, "isMenzenOnly":true, "isLocal":true, "check":(o)=>{
        let allow = ['2s', '3s', '4s', '5s', '6s', '7s', '8s']
        return checkAllowed(o, allow) && agari.check7(o.haiArray)
    }},
    "清一色":{"han":6, "isFuroMinus":true, "check":(o)=>{
        let must = o.agari[1]
        let allow = []
        for (let i = 1; i <= 9; i++)
            allow.push(i + must)
        return checkAllowed(o, allow)
    }},
    "混一色":{"han":3, "isFuroMinus":true, "check":(o)=>{
        let allow = ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
        let d = ''
        for (let v of o.hai) {
            if (['m', 'p', 's'].includes(v[1])) {
                d = v[1]
                break
            }
        }
        if (!d) {
            for (let v of o.furo) {
                for (let vv of v) {
                    if (['m', 'p', 's'].includes(vv[1])) {
                        d = vv[1]
                        break
                    }
                }
            }
        }
        if (!d)
            return false
        for (let i = 1; i <= 9; i++)
            allow.push(i + d)
        return checkAllowed(o, allow) && !YAKU['清一色'].check(o)
    }},
    "二盃口":{"han":3, "isMenzenOnly":true, "check":(o)=>{
        let arr = []
        for (let v of o.currentPattern) {
            if (typeof v === 'string')
                continue
            if (v.length !== 3 || v[0] === v[1])
                return false
            arr.push(v[0])
        }
        return arr[0]+arr[2] === arr[1]+arr[3]
    }},
    "純全帯么九":{"han":3, "isFuroMinus":true, "check":(o)=>{
        let allow = ['1m', '9m', '1p', '9p', '1s', '9s']
        return checkChanta(o, allow)
    }},
    "一色三順":{"han":3, "isLocal":true, "isFuroMinus":true, "check":(o)=>{
        let arr = []
        for (let v of o.currentPattern) {
            if (typeof v === 'string')
                continue
            if (v.length !== 3 || v[0] === v[1])
                return false
            arr.push(v[0])
        }
        return arr.some(x => arr.filter(y => x === y).length === 3)
    }},
    "混全帯么九":{"han":2, "isFuroMinus":true, "check":(o)=>{
        let allow = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z']
        return checkChanta(o, allow) && !YAKU['純全帯么九'].check(o)
    }},
    "対々和":{"han":2, "check":(o)=>{
        let res = 0
        for (let v of o.currentPattern)
            if (v.length === 1 || v[0] === v[1])
                res++
        return res === 4
    }},
    "混老頭":{"han":2, "check":(o)=>{
        let allow = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z']
        return checkAllowed(o, allow)
    }},
    "三槓子":{"han":2, "check":(o)=>{
        let res = 0
        for (let v of o.currentPattern)
            if (typeof v !== 'string' && (v.length === 2 || v.length === 4))
                res++
        return res === 3
    }},
    "小三元":{"han":2, "check":(o)=>{
        let need = ['5z', '6z', '7z']
        let res = 0
        for (let v of o.currentPattern) {
            if (typeof v === 'string' && !need.includes(v))
                return false
            if (typeof v === 'object' && need.includes(v[0]))
                res++
        }
        return res === 2
    }},
    "三色同刻":{"han":2, "check":(o)=>{
        let res = [0,0,0,0,0,0,0,0,0]
        for (let v of o.currentPattern) {
            if ((v.length === 1 || v[0] === v[1]) && !v[0].includes('z'))
                res[parseInt(v[0])-1]++
            else
                continue
        }
        return res.includes(3)
    }},
    "三暗刻":{"han":2, "check":(o)=>{
        let res = 0
        for (let v of o.currentPattern)
            if (typeof v !== 'string' && v.length <= 2)
                res++
        return res === 3
    }},
    "七対子":{"han":2, "isMenzenOnly":true, "check":(o)=>{
        return agari.check7(o.haiArray) && !YAKU['二盃口'].check(o)
    }},
    "ダブル立直":{"han":2, "isMenzenOnly":true, "check":(o)=>{
        return o.extra.includes('w')
    }},
    "三連刻":{"han":2, "isLocal":true, "check":(o)=>{
        let res = {
            m:[0,0,0,0,0,0,0,0,0],
            p:[0,0,0,0,0,0,0,0,0],
            s:[0,0,0,0,0,0,0,0,0],
        }
        for (let v of o.currentPattern) {
            if ((v.length === 1 || v[0] === v[1]) && !v[0].includes('z'))
                res[v[0][1]][parseInt(v[0])-1]++
            else
                continue
        }
        for (let suit of ['m', 'p', 's']) {
            for (let i = 0; i < 7; i++) {
                if (res[suit][i] && res[suit][i+1] && res[suit][i+2]) {
                    return true;
                }
            }
        }
        return false;
    }},
    "五門斉":{"han":2, "isLocal":true, "check":(o)=>{
        let suits = new Set()
        for (let v of o.currentPattern) {
            let suit
            if (typeof v === 'string') {
                suit = v[1];
            } else if (typeof v === 'object') {
                suit = v[0][1]
            }
            if (suit === 'z' && parseInt(v) > 4) {
                suits.add('d')
            } else {
                suits.add(suit)
            }
        }
        return suits.size === 5
    }},
    "一気通貫":{"han":2, "isFuroMinus":true, "check":(o)=>{
        let res = [0,0,0,0,0,0,0,0,0]
        for (let v of o.currentPattern) {
            if (v.length <= 2 || v[0] === v[1])
                continue
            if ([1,4,7].includes(parseInt(v[0]))) {
                let i = MPSZ.indexOf(v[0][1])*3 + (parseInt(v[0])-1)/3
                res[i]++
            }
        }
        return (res[0] && res[1] && res[2]) || (res[3] && res[4] && res[5]) || (res[6] && res[7] && res[8])
    }},
    "三色同順":{"han":2, "isFuroMinus":true, "check":(o)=>{
        let res = [];
        for (let v of o.currentPattern) {
            if (v.length <= 2 || v[0] === v[1] || v[0].includes('z')) continue;

            let value = parseInt(v[0]);
            res[value] = res[value] ? res[value] : new Set();
            res[value].add(v[0][1]);
        }
        return res.some((value) => value.size === 3);
    }},
    "断么九":{"han":1, "check":(o)=>{
        for (let v of o.furo)
            if (!o.settings.kuitan && v.length !== 2)
                return false
        let allow = ['2m', '3m', '4m', '5m', '6m', '7m', '8m', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '2s', '3s', '4s', '5s', '6s', '7s', '8s']
        return checkAllowed(o, allow)
    }},
    "平和":{"han":1, "isMenzenOnly":true, "check":(o)=>{
        let hasAgariFu = true
        for (let v of o.currentPattern) {
            if (typeof v === 'string')  {
                if (v.includes('z') && ([o.bakaze, o.jikaze, 5, 6, 7].includes(parseInt(v)) || o.settings.otakazePei && parseInt(v) === 4))
                    return false
            } else if (v.length !== 3 || v[0] === v[1]) {
                return false
            } else if ((v[0] === o.agari && parseInt(v[2]) !== 9) || (v[2] === o.agari && parseInt(v[0]) !== 1)) {
                hasAgariFu = false
            }
        }
        return !hasAgariFu
    }},
    "一盃口":{"han":1, "isMenzenOnly":true, "check":(o)=>{
        if (YAKU['二盃口'].check(o))
            return false
        if ((o.settings.allLocalYaku || o.settings.localYaku.includes('一色三順')) && YAKU['一色三順'].check(o))
            return false
        for (let i in o.currentPattern) {
            i = parseInt(i)
            let v = o.currentPattern[i]
            if (v.length === 3 && v[0] != v[1]) {
                while (i < 4) {
                    i++
                    if (v.toString() == o.currentPattern[i]) {
                      return true
                    }
                }
            }
        }
        return false
    }},
    "門前清自摸和":{"han":1, "isMenzenOnly":true, "check":(o)=>{
        return o.isTsumo
    }},
    "立直":{"han":1, "isMenzenOnly":true, "check":(o)=>{
        return (YAKU['一発'].check(o) || (o.extra.includes('r') || o.extra.includes('l'))) && !YAKU['ダブル立直'].check(o)
    }},
    "一発":{"han":1, "isMenzenOnly":true, "check":(o)=>{
        return o.extra.includes('i') || o.extra.includes('y')
    }},
    "嶺上開花":{"han":1, "check":(o)=>{
        let hasKantsu = false
        for (let v of o.furo) {
            if (v.length === 2 || v.length === 4) {
                hasKantsu = true
                break
            }
        }
        return (hasKantsu || o.nukidora) && o.extra.includes('k') && !o.extra.includes('h') && o.isTsumo && !YAKU['一発'].check(o)
    }},
    "十二落抬":{"han": 1, "isLocal":true, check:(o) => {
        let opens = 0
        for (let v of o.furo) {
            if (v.length !== 2) {
                opens++
            }
        }
        return opens === 4
    }},
    "搶槓":{"han":1, "check":(o)=>{
        return o.extra.includes('k') && !o.extra.includes('h') && !o.isTsumo
    }},
    "海底摸月":{"han":1, "check":(o)=>{
        return o.extra.includes('h') && o.isTsumo
    }},
    "河底撈魚":{"han":1, "check":(o)=>{
        return o.extra.includes('h') && !o.isTsumo && !YAKU['一発'].check(o)
    }},
    "場風東":{"han":1, "check":(o)=>{
        return o.bakaze === 1 && checkYakuhai(o, 1)
    }},
    "場風南":{"han":1, "check":(o)=>{
        return o.bakaze === 2 && checkYakuhai(o, 2)
    }},
    "場風西":{"han":1, "check":(o)=>{
        return o.bakaze === 3 && checkYakuhai(o, 3)
    }},
    "場風北":{"han":1, "check":(o)=>{
        return o.bakaze === 4 && checkYakuhai(o, 4)
    }},
    "自風東":{"han":1, "check":(o)=>{
        return o.jikaze === 1 && checkYakuhai(o, 1)
    }},
    "自風南":{"han":1, "check":(o)=>{
        return o.jikaze === 2 && checkYakuhai(o, 2)
    }},
    "自風西":{"han":1, "check":(o)=>{
        return o.jikaze === 3 && checkYakuhai(o, 3)
    }},
    "自風北":{"han":1, "check":(o)=>{
        return o.jikaze === 4 && checkYakuhai(o, 4)
    }},
    "客風北":{"han":1, "check":(o)=>{
        return o.settings.otakazePei && checkYakuhai(o, 4)
    }},
    "役牌白":{"han":1, "check":(o)=>{
        return checkYakuhai(o, 5)
    }},
    "役牌発":{"han":1, "check":(o)=>{
        return checkYakuhai(o, 6)
    }},
    "役牌中":{"han":1, "check":(o)=>{
        return checkYakuhai(o, 7)
    }},
}
module.exports = YAKU
