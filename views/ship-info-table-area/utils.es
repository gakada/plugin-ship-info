import { clone } from 'lodash'
import memoize from 'fast-memoize'
import { repairFactor, sokuInterpretation, sokuStyles } from '../constants'

export const getTimePerHP = memoize((api_lv = 1, api_stype = 1) => {
  let factor = 0
  if (repairFactor[api_stype] != null ) factor = repairFactor[api_stype].factor || 0

  if (factor == 0) return 0

  if (api_lv < 12) {
    return api_lv * 10 * factor * 1000
  }
  else {
    return (api_lv * 5 + (Math.floor(Math.sqrt(api_lv - 11)) * 10 + 50))* factor * 1000
  }
})

export const getShipInfoData = (ship, $ship, equips, $shipTypes, rawValue=false) => {
  if(!(typeof ship === 'object' && $ship && typeof ship === 'object' && ship)) return
  const shipInfo = {
    id: ship.api_id,
    type_id: $ship.api_stype,
    type: ($shipTypes[$ship.api_stype] || {} ).api_name,
    name: $ship.api_name,
    yomi: $ship.api_yomi,
    sortno: $ship.api_sortno,
    lv:  ship.api_lv,
    cond: ship.api_cond,
    karyoku: ship.api_karyoku,
    houg: $ship.api_houg,
    raisou: ship.api_raisou,
    raig: $ship.api_raig,
    taiku: ship.api_taiku,
    tyku: $ship.api_tyku,
    soukou: ship.api_soukou,
    souk: $ship.api_souk,
    lucky: ship.api_lucky,
    luck: $ship.api_luck,
    kyouka: ship.api_kyouka,
    kaihi: ship.api_kaihi[0],
    taisen: ship.api_taisen[0],
    sakuteki: ship.api_sakuteki[0],
    slot: clone(ship.api_slot),
    exslot: ship.api_slot_ex,
    locked: ship.api_locked,
    nowhp: ship.api_nowhp,
    maxhp: ship.api_maxhp,
    losshp: ship.api_maxhp - ship.api_nowhp,
    repairtime: parseInt (ship.api_ndock_time / 1000.0),
    after: $ship.api_aftershipid,
    sallyArea: ship.api_sally_area,
    soku: ship.api_soku,
  }

  // Attention, this will overwrite some original properties
  const karyokuNow = shipInfo.houg[0] + shipInfo.kyouka[0]
  const karyokuMax = shipInfo.karyoku[1]
  const karyoku = rawValue ? karyokuNow : shipInfo.karyoku[0]

  const raisouNow = shipInfo.raig[0] + shipInfo.kyouka[1]
  const raisouMax = shipInfo.raisou[1]
  const raisou = rawValue ? raisouNow : shipInfo.raisou[0]

  const taikuNow = shipInfo.tyku[0] + shipInfo.kyouka[2]
  const taikuMax = shipInfo.taiku[1]
  const taiku = rawValue ? taikuNow : shipInfo.taiku[0]

  const soukouNow = shipInfo.souk[0] + shipInfo.kyouka[3]
  const soukouMax = shipInfo.soukou[1]
  const soukou = rawValue ? soukouNow : shipInfo.soukou[0]

  const luckyNow = shipInfo.luck[0] + shipInfo.kyouka[4]
  const luckyMax = shipInfo.lucky[1]
  const lucky = rawValue ? luckyNow : shipInfo.lucky[0]

  const isCompleted = karyokuNow >= karyokuMax &&
            raisouNow >= raisouMax &&
            taikuNow >= taikuMax &&
            soukouNow >= soukouMax
  
  let {kaihi, taisen, sakuteki} = shipInfo
  // get raw kaihi, taisen and sakuteki value by substracting effects of equipments
  if (rawValue) {
    equips.forEach(equip => {
      if (typeof equip == 'undefined') return
      const $equip = equip[1] || {}
      kaihi -= $equip.api_houk || 0
      taisen -= $equip.api_tais || 0
      sakuteki -= $equip.api_saku || 0
    })
  }

  return ({
    ...shipInfo,
    karyokuNow,
    karyokuMax,
    karyoku,
    raisouNow,
    raisouMax,
    raisou,
    taikuNow,
    taikuMax,
    taiku,
    soukouNow,
    soukouMax,
    soukou,
    luckyNow,
    luckyMax,
    lucky,
    isCompleted,
    kaihi,
    taisen,
    sakuteki,
  })

}

const collator = new Intl.Collator()
const jpCollator = new Intl.Collator("ja-JP")

export const nameCompare = (a, b) => {
  if (a.yomi == b.yomi) {
    return a.lv == b.lv ? collator.compare(a.id, b.id) : collator.compare(a.lv, b.lv)
  } else {
    return jpCollator.compare(a.yomi, b.yomi)
  }
}

export const extractShipInfo = (shipInfo) => {
  const {
    karyokuNow,
    karyokuMax,
    karyoku,
    raisouNow,
    raisouMax,
    raisou,
    taikuNow,
    taikuMax,
    taiku,
    soukouNow,
    soukouMax,
    soukou,
    luckyNow,
    luckyMax,
    lucky,
    lv,
    nowhp,
    maxhp,
    losshp,
    repairtime,
    locked,
    id,
    type,
    type_id, 
    name, 
    sallyArea, 
    cond, 
    kaihi, 
    taisen, 
    sakuteki, 
    slot, 
    exslot,
    soku,
  } = shipInfo


  let karyokuClass = 'td-karyoku'
  let raisouClass = 'td-raisou'
  let taikuClass = 'td-taiku'
  let soukouClass = 'td-soukou'
  let luckyClass = 'td-lucky'

  const karyokuToInc = karyokuMax - karyokuNow
  let karyokuString = '+' + karyokuToInc
  const raisouToInc = raisouMax - raisouNow
  let raisouString = '+' + raisouToInc
  const taikuToInc = taikuMax - taikuNow
  let taikuString = '+' + taikuToInc
  const soukouToInc = soukouMax - soukouNow
  let soukouString = '+' + soukouToInc
  const luckyToInc = luckyMax - luckyNow
  let luckyString = '+' + luckyToInc

  if (karyokuNow >= karyokuMax) {
    karyokuClass = 'td-karyoku-max'
    karyokuString = 'MAX'
  }
  if (raisouNow >= raisouMax) {
    raisouClass = 'td-raisou-max'
    raisouString = 'MAX'
  }
  if (taikuNow >= taikuMax) {
    taikuClass = 'td-taiku-max'
    taikuString = 'MAX'
  }
  if (soukouNow >= soukouMax) {
    soukouClass = 'td-soukou-max'
    soukouString = 'MAX'
  }
  if (luckyNow >= luckyMax) {
    luckyClass = 'td-lucky-max'
    luckyString = 'MAX'
  }

  let repairColor = ''
  if (nowhp * 4 <= maxhp) {
    repairColor = 'rgba(255, 0, 0, 0.4)'
  } else if (nowhp * 2 <= maxhp) {
    repairColor = 'rgba(255, 65, 0, 0.4)'
  } else if (nowhp * 4 <= maxhp * 3) {
    repairColor = 'rgba(255, 255, 0, 0.4)'
  } else {
    repairColor = 'transparent'
  }

  let condColor = ''
  if (shipInfo.cond >= 0 && shipInfo.cond < 20) {
    condColor = 'rgba(255, 0, 0, 0.4)'
  } else if (shipInfo.cond >= 20 && shipInfo.cond < 30) {
    condColor = 'rgba(255, 165, 0, 0.4)'
  } else if (shipInfo.cond >= 50 && shipInfo.cond <= 100){
    condColor = 'rgba(255, 255, 0, 0.4)'
  } else {
    condColor = 'transparent'
  }

  const sokuString = sokuInterpretation[soku] || 'Unknown'
  const sokuStyle = sokuStyles[soku] || {}

  return ({
    karyokuNow,
    karyokuMax,
    karyoku,
    raisouNow,
    raisouMax,
    raisou,
    taikuNow,
    taikuMax,
    taiku,
    soukouNow,
    soukouMax,
    soukou,
    luckyNow,
    luckyMax,
    lucky,
    lv,
    nowhp,
    maxhp,
    losshp,
    repairtime,
    locked,
    id,
    type,
    type_id, 
    name, 
    sallyArea, 
    cond, 
    kaihi, 
    taisen, 
    sakuteki, 
    slot, 
    exslot,
    karyokuClass,
    karyokuString,
    raisouClass,
    raisouString,
    taikuClass,
    taikuString,
    soukouClass,
    soukouString,
    luckyClass,
    luckyString,
    repairColor,
    condColor,
    sokuString,
    sokuStyle,
  })

}

// just to confirm that table sorting requires so much data, which is almost all data used in display
export const getTableInfoData = (ship, $ship) => {
  if(!(typeof ship === 'object' && $ship && typeof ship === 'object' && ship)) return
  const shipInfo = {
    id: ship.api_id, //
    type_id: $ship.api_stype, //
    name: $ship.api_name,
    yomi: $ship.api_yomi, //
    sortno: $ship.api_sortno, //
    lv:  ship.api_lv, //
    cond: ship.api_cond, //
    karyoku: ship.api_karyoku, //
    houg: $ship.api_houg, //
    raisou: ship.api_raisou, //
    raig: $ship.api_raig, //
    taiku: ship.api_taiku, //
    tyku: $ship.api_tyku, //
    soukou: ship.api_soukou, //
    souk: $ship.api_souk, //
    lucky: ship.api_lucky, //
    luck: $ship.api_luck, //
    kyouka: ship.api_kyouka, //
    kaihi: ship.api_kaihi[0], //
    taisen: ship.api_taisen[0], //
    sakuteki: ship.api_sakuteki[0], //
    slot: clone(ship.api_slot),
    exslot: ship.api_slot_ex,
    locked: ship.api_locked, //
    nowhp: ship.api_nowhp,
    maxhp: ship.api_maxhp,
    losshp: ship.api_maxhp - ship.api_nowhp,
    repairtime: parseInt (ship.api_ndock_time / 1000.0), //
    after: $ship.api_aftershipid, //
    sallyArea: ship.api_sally_area, //
  }

  // Attention, this will overwrite some original properties
  const karyokuNow = shipInfo.houg[0] + shipInfo.kyouka[0]
  const karyokuMax = shipInfo.karyoku[1]
  const karyoku = shipInfo.karyoku[0]
  const raisouNow = shipInfo.raig[0] + shipInfo.kyouka[1]
  const raisouMax = shipInfo.raisou[1]
  const raisou = shipInfo.raisou[0]
  const taikuNow = shipInfo.tyku[0] + shipInfo.kyouka[2]
  const taikuMax = shipInfo.taiku[1]
  const taiku = shipInfo.taiku[0]
  const soukouNow = shipInfo.souk[0] + shipInfo.kyouka[3]
  const soukouMax = shipInfo.soukou[1]
  const soukou = shipInfo.soukou[0]
  const luckyNow = shipInfo.luck[0] + shipInfo.kyouka[4]
  const luckyMax = shipInfo.lucky[1]
  const lucky = shipInfo.lucky[0]

  const isCompleted = karyokuNow >= karyokuMax &&
              raisouNow >= raisouMax &&
              taikuNow >= taikuMax &&
              soukouNow >= soukouMax

  return ({
    ...shipInfo,
    karyoku,
    raisou,
    taiku,
    soukou,
    lucky,
    isCompleted,
  })

}