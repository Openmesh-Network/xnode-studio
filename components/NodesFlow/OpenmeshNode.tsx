/* eslint-disable no-unused-vars */
import React, { memo, useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { Handle, Position, useReactFlow, useStoreApi } from 'reactflow'

import withProps from './withProps'

const options = [
  {
    value: 'smoothstep',
    label: 'Smoothstep',
  },
  {
    value: 'step',
    label: 'Step',
  },
  {
    value: 'default',
    label: 'Bezier (default)',
  },
  {
    value: 'straight',
    label: 'Straight',
  },
]

function Select({ value, handleId, nodeId }) {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()

  const onChange = (evt) => {
    const { nodeInternals } = store.getState()
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            selects: {
              ...node.data.selects,
              [handleId]: evt.target.value,
            },
          }
        }
        return node
      })
    )
  }

  return (
    <div className="custom-node__select">
      <div>Edge Type</div>
      <select
        className="nodrag rounded-[6px] bg-[#D9D9D9]"
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Handle type="source" position={Position.Right} id={handleId} />
    </div>
  )
}

function Options({ handleId, name, optionsSelection }) {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()
  const [selected, setSelected] = useState<any>()

  return (
    <div className="">
      <select
        className="nodrag min-w-[85px] rounded-[6px] bg-[#D9D9D9] font-normal md:min-w-[104px] lg:min-w-[120px] xl:min-w-[138px] 2xl:min-w-[172px]"
        onChange={(option) => setSelected(option.target.value)}
        value={selected}
      >
        {optionsSelection.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function OpenmeshNode({ id, data, handleNodeRemove }) {
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(true)
  const { selectionSideNavBar, setSelectionSideNavBar } =
    useContext(AccountContext)
  const handleClick = () => {
    handleNodeRemove(id)
  }
  return (
    <>
      <div className="relative rounded-[10px] border-[0.5px] border-[#C1C1C1] bg-[#fff] px-[10px] py-[7px] pb-[10px] pr-[22.5px] text-[8px] text-[#000] md:rounded-[12px] md:px-[12px] md:py-[8.4px] md:pb-[12px] md:pr-[27px] md:text-[9.6px] lg:rounded-[14px] lg:px-[14px] lg:py-[10px] lg:pb-[14px] lg:pr-[31.5px] lg:text-[11.2px] xl:rounded-[16px] xl:px-[16px] xl:py-[11.2px] xl:pb-[16px] xl:pr-[36px] xl:text-[12.8px] 2xl:rounded-[20px] 2xl:px-[20px] 2xl:py-[14px] 2xl:pb-[20px] 2xl:pr-[45px] 2xl:text-[16px]">
        <button
          onClick={() => {
            handleClick()
          }}
          className="absolute right-[5px] top-2 font-bold md:right-[6px] lg:right-[7px] xl:right-[8px] 2xl:right-[10px]"
        >
          X
        </button>
        <div className="flex items-center gap-x-[5px]">
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }/images/nodesFlow/openmesh-new.svg`}
            alt="image"
            className={
              'w-[16px] md:w-[20px] lg:w-[22.5px] xl:w-[25.5px] 2xl:w-[32px]'
            }
          />
          <div className="font-normal text-black lg:!leading-[19px]">
            Openmesh Core
          </div>
        </div>

        <div className="absolute left-0 h-[0.5px] w-full bg-[#C1C1C1] lg:mt-[10px] 2xl:mt-[12px]"></div>
        <div className="mt-[10px] max-w-[90px] text-[7px] md:mt-[12px] md:max-w-[108px] md:text-[8.4px] lg:mt-[14px] lg:max-w-[126px] lg:text-[9.8px] xl:mt-[16px] xl:max-w-[144px] xl:text-[11.2px] 2xl:mt-[20px] 2xl:max-w-[180px] 2xl:text-[14px]">
          <a
            href="https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/openmesh-overview"
            target="_blank"
            rel="noreferrer"
          >
            <div>Openmesh Consensus Client</div>{' '}
          </a>
          <a
            href="https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/openmesh-overview"
            target="_blank"
            rel="noreferrer"
          >
            <div className="mt-[10px] md:mt-[12px] lg:mt-[14px] xl:mt-[16px] 2xl:mt-[20px]">
              BitTorrent Filesharing Protocol
            </div>
          </a>
          <a
            href="https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/openmesh-overview"
            target="_blank"
            rel="noreferrer"
          >
            <div className="mt-[7px] text-[6px] text-[#0354EC] md:mt-[8.4px] md:text-[7.2px] lg:mt-[10px] lg:text-[8.4px] xl:mt-[11.2px] xl:text-[9.6px] 2xl:mt-[14px] 2xl:text-[12px]">
              Why I can’t remove this?
            </div>
          </a>
        </div>
        <Handle type="source" position={Position.Bottom} id={'1'} />
      </div>
    </>
  )
}

export default withProps(OpenmeshNode, ['handleNodeRemove'])
