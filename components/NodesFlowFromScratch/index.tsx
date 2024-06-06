'use client'

import { useCallback, useContext, useEffect } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import 'reactflow/dist/style.css'

import CustomNode from './CustomNode'
import {
  edges as initialEdges,
  nodes as initialNodes,
} from './initial-elements'

import './overview.css'

import AnalyticsNode from './AnalyticsNode'
import APINode from './APINode'
import DataNode from './DataNode'
import RPCNode from './RPCNode'
import ServerNode from './ServerNode'
import UtilityNode from './UtilityNode'

const nodeTypes = {
  custom: CustomNode,
  server: ServerNode,
  api: APINode,
  data: DataNode,
  utility: UtilityNode,
  rpc: RPCNode,
  analytics: AnalyticsNode,
}

const minimapStyle = {
  height: 120,
}

const onInit = (reactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance)

const NodesFlow = (fromScratch: boolean) => {
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    changeNodes,
    setFinalNodes,
    finalNodes,
  } = useContext(AccountContext)
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    !fromScratch ? initialNodes : null
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    !fromScratch ? initialEdges : null
  )
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: '#000' } }, eds)
      ),
    [setEdges]
  )

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === 'server')?.data
        ?.selects?.edge?.sourceHandle
      edge.type = edgeType
    }

    return edge
  })

  useEffect(() => {
    console.log('bib bop entrei')
    console.log(changeNodes)

    if (changeNodes?.type === 'api') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )
      console.log(nodes)
      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'api',
          position: { x: 670, y: 550 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            name: changeNodes?.name,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }

    if (changeNodes?.type === 'rpc') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )
      console.log(nodes)
      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'rpc',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            name: changeNodes?.name,
            icon: changeNodes?.icon,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }

    if (changeNodes?.type === 'analytics') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )
      console.log(nodes)
      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'analytics',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            name: changeNodes?.name,
            icon: changeNodes?.icon,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }

    if (changeNodes?.type === 'utility') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )
      console.log(nodes)
      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'utility',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            title: changeNodes?.title,
            name: changeNodes?.name,
            icon: changeNodes?.icon,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }
    if (changeNodes?.type === 'data') {
      const existingNodeIndex = nodes.findIndex(
        (node) =>
          node.type === 'data' && node.data.lists && node.data.lists.length > 0
      )

      if (existingNodeIndex !== -1) {
        // O nó 'data' já existe, então vamos adicionar o novo objeto a ele
        // antes verificar se nao existe o title, se existir nao prosseguimos
        const existingNode = nodes[existingNodeIndex]

        const existsTitle = existingNode.data.lists.some(
          (data) => data.title === changeNodes?.name
        )

        if (existsTitle) {
          return
        }

        existingNode.data.lists.push({
          icon: changeNodes?.icon,
          title: changeNodes?.name,
        })

        // Atualize o array de nós
        const updatedNodes = [...nodes]
        updatedNodes[existingNodeIndex] = existingNode
        console.log(existingNode)
        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'data') {
              // when you update a simple type you can just update the value
              node.data = {
                ...node.data,
                lists: existingNode.data.lists,
              }
            }

            return node
          })
        )
      } else {
        // O nó 'data' não existe, então vamos criar um novo nó
        const newNode = {
          id: uuidv4(),
          type: 'data',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            lists: [
              {
                title: changeNodes?.name,
                icon: changeNodes?.icon,
              },
            ],
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }
    if (changeNodes?.type === 'server') {
      const nodeExists = nodes.some((node) => node.type === 'server')
      console.log(nodes)
      if (!nodeExists) {
        console.log(changeNodes?.defaultValueServerType)
        console.log(changeNodes?.defaultValueLocation)
        const newNode = {
          id: uuidv4(),
          type: 'server',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            defaultValueServerType: changeNodes?.defaultValueServerType,
            defaultValueLocation: changeNodes?.defaultValueLocation,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }
  }, [changeNodes, nodes, setNodes])

  useEffect(() => {
    setFinalNodes(nodes)
  }, [nodes, setFinalNodes])

  return (
    <div className="h-[1500px]">
      <ReactFlow
        nodes={nodes}
        edges={edgesWithUpdatedTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
      >
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  )
}

export default NodesFlow
