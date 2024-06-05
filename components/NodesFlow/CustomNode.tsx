import { useState } from 'react'
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
      <select className="nodrag bg-white" onChange={onChange} value={value}>
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
    <div className="custom-node__select">
      <div>{name}</div>
      <select
        className="nodrag bg-white"
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

function CustomNode({ id, data, handleNodeRemove }) {
  const handleClick = () => {
    handleNodeRemove(id)
  }

  return (
    <>
      <div className="custom-node__header">
        Set your <strong>Xnode</strong>
      </div>
      <button
        onClick={() => {
          handleClick()
        }}
        className="absolute right-3 top-2"
      >
        X
      </button>
      <div className="grid gap-x-[10px] p-[10px]">
        <Options
          handleId={1}
          name={'Cloud provider'}
          optionsSelection={['Equinix', 'AWS']}
        />
        <Options
          handleId={1}
          name={'Service region'}
          optionsSelection={['US East', 'US West', 'Asia Pacific']}
        />
        <Options
          handleId={1}
          name={'Latency preference'}
          optionsSelection={['Low', 'Med', 'High']}
        />
      </div>
      <Handle type="source" position={Position.Right} id={'1'} />
    </>
  )
}

export default withProps(CustomNode, ['handleNodeRemove'])
