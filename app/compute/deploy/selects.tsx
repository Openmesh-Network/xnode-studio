'use client'

import { useState } from 'react'

import ComboBox from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'

const nameData = [
  'Instance-20240603-11135',
  'Instance-50234233-11135',
  'Instance-21234123-11135',
  'Instance-64657503-11135',
  'Instance-13545683-11135',
  'Instance-93456214-11135',
]

export function NameDropdown() {
  const [name, setName] = useState<string>(nameData[0])
  return (
    <div>
      <Label>Name</Label>
      <ComboBox
        className="w-full"
        data={nameData}
        selectedItem={name}
        setItemSelect={setName}
      />
    </div>
  )
}

const regions = [
  'us-west4 (Las Vegas)',
  'us-east1 (Moncks Corner)',
  'us-east4 (Ashburn)',
  'us-west1 (The Dalles)',
  'us-west2 (Los Angeles)',
  'us-west3 (Seattle)',
]

export function RegionDropdown() {
  const [region, setRegion] = useState<string>(regions[0])
  return (
    <div className="w-full">
      <Label>Region*</Label>
      <ComboBox
        className="w-full"
        data={nameData}
        selectedItem={region}
        setItemSelect={setRegion}
      />
    </div>
  )
}

const zones = [
  'us-west4-a',
  'us-east1-b',
  'us-east4-c',
  'us-west1-d',
  'us-west2-e',
  'us-west3-f',
]

export function ZoneDropdown() {
  const [zone, setZone] = useState<string>(zones[0])
  return (
    <div className="w-full">
      <Label className="">Zone*</Label>
      <ComboBox
        className="w-full"
        data={zones}
        selectedItem={zone}
        setItemSelect={setZone}
      />
    </div>
  )
}
