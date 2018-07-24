import React from 'react'

import RadioCheck from './radio-check'
import SallyAreaCheck from './sally-area-check'
import {
  lvOptions,
  lockedOptions,
  expeditionOptions,
  modernizationOptions,
  remodelOptions,
  rawValueOptions,
  inFleetOptions,
  sparkleOptions,
  exSlotOptions,
  daihatsuOptions,
} from '../constants'

import TypeView from './type-view'

const ConfigView = () => (
  <div className="config-menu">
    <div className="dual-col">
      <RadioCheck
        configKey="lvRadio"
        label="Level"
        options={lvOptions}
        default={2}
      />
      <RadioCheck
        configKey="lockedRadio"
        label="Lock"
        options={lockedOptions}
        default={1}
      />
      <RadioCheck
        configKey="expeditionRadio"
        label="Expedition"
        options={expeditionOptions}
        default={0}
      />
      <RadioCheck
        configKey="inFleetRadio"
        label="In Fleet"
        options={inFleetOptions}
        default={0}
      />
      <RadioCheck
        configKey="modernizationRadio"
        label="Modernization"
        options={modernizationOptions}
        default={0}
      />
      <RadioCheck
        configKey="remodelRadio"
        label="Remodelable"
        options={remodelOptions}
        default={0}
      />
      <RadioCheck
        configKey="sparkleRadio"
        label="Sparkle"
        options={sparkleOptions}
        default={0}
      />
      <RadioCheck
        configKey="exSlotRadio"
        label="Extra Slot"
        options={exSlotOptions}
        default={0}
      />
      <RadioCheck
        configKey="daihatsuRadio"
        label="Daihatsu"
        options={daihatsuOptions}
        default={0}
      />
    </div>
    <div className="single-col">
      <SallyAreaCheck />
    </div>
    <div className="dual-col">
      <RadioCheck
        configKey="rawValue"
        label="Value Type"
        options={rawValueOptions}
        default={0}
      />
    </div>
  </div>
)

const ConfigMenu = () => (
  <div className="filter-menu">
    <TypeView />
    <ConfigView />
  </div>
)

export default ConfigMenu
