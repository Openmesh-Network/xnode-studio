'use client'

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import {
  edges as initialEdgesScratch,
  nodes as initialNodesScratch,
} from './initial-elements-fromscratch'

import './overview.css'

import AnalyticsNode from './AnalyticsNode'
import APINode from './APINode'
import ComputeNode from './ComputeNode'
import DataManagementNode from './DataManagementNode'
import DataNodeHistorical from './DataNodeHistorical'
import DataNodeStreaming from './DataNodeStreaming'
import MLNode from './MLNode'
import OpenmeshNode from './OpenmeshNode'
import RPCNode from './RPCNode'
import ServerNode from './ServerNode'
import StorageNode from './StorageNode'
import TradingNode from './TradingNode'
import UtilityNode from './UtilityNode'
import withProps from './withProps'

// const getNodeTypes = (handleNodeRemove): NodeTypes => ({
//   custom: CustomNode,
//   server: ServerNode,
//   api: APINode,
//   data: DataNode,
//   utility: UtilityNode,
//   rpc: RPCNode,
//   analytics: withProps(AnalyticsNode, { handleNodeRemove }),
// });
const nodeAmount = [
  { type: 'server', amount: 1 },
  { type: 'dataStreaming', amount: 1 },
  { type: 'dataHistorical', amount: 1 },
  { type: 'api', amount: 5 },
  { type: 'utility', amount: 5 },
  { type: 'rpc', amount: 5 },
  { type: 'analytics', amount: 5 },
  { type: 'openmesh', amount: 5 },
  { type: 'ml', amount: 5 },
  { type: 'storage', amount: 5 },
  { type: 'dataManagement', amount: 5 },
  { type: 'compute', amount: 5 },
  { type: 'trading', amount: 5 },
]
const minimapStyle = {
  height: 120,
}
interface ModalProps {
  fromScratch?: boolean
}

const onInit = (reactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance)

const NodesFlow = ({ fromScratch = false }: ModalProps) => {
  const {
    changeNodes,
    setFinalNodes,
    xnodeType,
    setXnodeType,
    setTagXnode,
    setSignup,
    setFinalBuild,
    removeNodes,
    setChangeNodes,
    setRemoveNodes,
  } = useContext(AccountContext)
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    !fromScratch ? initialNodes : initialNodesScratch
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    !fromScratch ? initialEdges : initialEdgesScratch
  )
  const [isInitialized, setIsInitialized] = useState(false)

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
    const savedXnodeType = localStorage.getItem('xnodeType')
    if (savedXnodeType === 'validator') {
      // validators node cannot have changes
      return
    }
    if (changeNodes?.type === 'api') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )

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
            chain: changeNodes?.chain,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }

    if (changeNodes?.type === 'ml') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )

      console.log(nodeExists)

      console.log(changeNodes?.name)
      console.log(nodes)

      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'ml',
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

    if (changeNodes?.type === 'storage') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )

      console.log(nodeExists)

      console.log(changeNodes?.name)
      console.log(nodes)

      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'storage',
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

    if (changeNodes?.type === 'compute') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )

      console.log(nodeExists)

      console.log(changeNodes?.name)
      console.log(nodes)

      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'compute',
          position: { x: 670, y: 100 },
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

    if (changeNodes?.type === 'trading') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )

      console.log(nodeExists)

      console.log(changeNodes?.name)
      console.log(nodes)

      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'trading',
          position: { x: 670, y: 100 },
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

    if (changeNodes?.type === 'dataManagement') {
      const nodeExists = nodes.some(
        (node) => node.data.name === changeNodes?.name
      )

      console.log(nodeExists)

      console.log('nodes')
      console.log(changeNodes?.name)
      console.log(nodes)

      if (!nodeExists) {
        const newNode = {
          id: uuidv4(),
          type: 'dataManagement',
          position: { x: 770, y: 100 },
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
    // data
    // for historical
    if (changeNodes?.type === 'dataHistorical') {
      const existingNodeIndex = nodes.findIndex(
        (node) =>
          node.type === 'dataHistorical' &&
          node.data.lists &&
          node.data.lists.length > 0
      )

      if (existingNodeIndex !== -1) {
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

        const updatedNodes = [...nodes]
        updatedNodes[existingNodeIndex] = existingNode

        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'dataHistorical') {
              node.data = {
                ...node.data,
                lists: existingNode.data.lists,
              }
            }

            return node
          })
        )
      } else {
        const newNode = {
          id: uuidv4(),
          type: 'dataHistorical',
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
    // for streaming
    if (changeNodes?.type === 'dataStreaming') {
      const existingNodeIndex = nodes.findIndex(
        (node) =>
          node.type === 'dataStreaming' &&
          node.data.lists &&
          node.data.lists.length > 0
      )

      if (existingNodeIndex !== -1) {
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

        const updatedNodes = [...nodes]
        updatedNodes[existingNodeIndex] = existingNode

        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'dataStreaming') {
              node.data = {
                ...node.data,
                lists: existingNode.data.lists,
              }
            }

            return node
          })
        )
      } else {
        const newNode = {
          id: uuidv4(),
          type: 'dataStreaming',
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

      if (!nodeExists) {
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
            defaultValueCloudProvider: changeNodes?.defaultValueCloudProvider,
          },
        }
        setNodes((prevNodes) => [...prevNodes, newNode])
      }
    }
  }, [changeNodes, nodes, setNodes])

  // useEffect(() => {
  //   console.log('heyyy chamado fui')
  //   const existingNodeIndex = nodes.findIndex(
  //     (node) =>
  //       node.type === 'dataStreaming' &&
  //       node.data.lists &&
  //       node.data.lists.length > 0
  //   )

  //   if (existingNodeIndex !== -1) {
  //     const existingNode = nodes[existingNodeIndex]

  //     const filteredLists = existingNode.data.lists.filter(
  //       (data) => data.title !== 'dataOption.title'
  //     )

  //     if (filteredLists.length === existingNode.data.lists.length) {
  //       return
  //     }

  //     const updatedNode = {
  //       ...existingNode,
  //       data: {
  //         ...existingNode.data,
  //         lists: filteredLists,
  //       },
  //     }

  //     const updatedNodes = nodes.map((node, index) =>
  //       index === existingNodeIndex ? updatedNode : node
  //     )

  //     setNodes(updatedNodes)
  //   }
  // }, [nodes, setNodes, updateDataNode])

  const nodesToAdd = [...nodes]

  // verify node type and node amount for the selected nodes and return an array with the max node amount,
  const createNewArray = (nodesToAdd, nodeAmount) => {
    const nodeCount = {}
    for (const { type, amount } of nodeAmount) {
      nodeCount[type] = amount
    }
    const newArray = nodesToAdd.filter((node) => {
      const type = node.type
      if (nodeCount[type] > 0) {
        nodeCount[type]--

        return true
      }
      return false
    })
    return newArray
  }

  const nodesAmounts = createNewArray(nodesToAdd, nodeAmount)

  const handleNodeRemove = useCallback(
    (nodeIdToRemove) => {
      if (xnodeType !== 'validator') {
        setChangeNodes({})
        setNodes((prevNodes) =>
          prevNodes.filter((node) => node.id !== nodeIdToRemove)
        )
      }
    },
    [setChangeNodes, setNodes, xnodeType]
  )

  const nodeTypes = useMemo(
    () => ({
      custom: withProps(CustomNode, { handleNodeRemove }),
      server: withProps(ServerNode, { handleNodeRemove }),
      api: withProps(APINode, { handleNodeRemove }),
      dataStreaming: withProps(DataNodeStreaming, { handleNodeRemove }),
      dataHistorical: withProps(DataNodeHistorical, { handleNodeRemove }),
      utility: withProps(UtilityNode, { handleNodeRemove }),
      rpc: withProps(RPCNode, { handleNodeRemove }),
      analytics: withProps(AnalyticsNode, { handleNodeRemove }),
      openmesh: withProps(OpenmeshNode, { handleNodeRemove }),
      ml: withProps(MLNode, { handleNodeRemove }),
      storage: withProps(StorageNode, { handleNodeRemove }),
      dataManagement: withProps(DataManagementNode, { handleNodeRemove }),
      compute: withProps(ComputeNode, { handleNodeRemove }),
      trading: withProps(TradingNode, { handleNodeRemove }),
    }),
    [handleNodeRemove]
  )

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('nodes', JSON.stringify(nodes))
      localStorage.setItem('edges', JSON.stringify(edges))
    }
    setFinalNodes(nodes)
  }, [nodes, edges, isInitialized, setFinalNodes])

  useEffect(() => {
    setSignup(false)
    setFinalBuild(false)
    const savedNodes = localStorage.getItem('nodes')
    const savedEdges = localStorage.getItem('edges')
    const savedXnodeType = localStorage.getItem('xnodeType')

    if (savedNodes) {
      setNodes(JSON.parse(savedNodes))
    } else setNodes(!fromScratch ? initialNodes : initialNodesScratch)

    if (savedEdges) {
      setEdges(JSON.parse(savedEdges))
    } else setEdges(!fromScratch ? initialEdges : initialEdgesScratch)

    if (savedXnodeType === 'validator') {
      setXnodeType('validator')
      setTagXnode('Validator')
    } else {
      setXnodeType('')
    }

    setIsInitialized(true)
  }, [
    fromScratch,
    setEdges,
    setFinalBuild,
    setNodes,
    setSignup,
    setTagXnode,
    setXnodeType,
  ])

  useEffect(() => {
    if (removeNodes && removeNodes.length > 0) {
      console.log('removeNodes', removeNodes)
      console.log('changeNodes', changeNodes)
      if (removeNodes[1] === 'dataStreaming') {
        const existingNodeIndex = nodes.findIndex(
          (node) =>
            node.type === 'dataStreaming' &&
            node.data.lists &&
            node.data.lists.length > 0
        )
        if (existingNodeIndex !== -1) {
          const existingNode = nodes[existingNodeIndex]
          const filteredLists = existingNode.data.lists.filter(
            (data) => data.title !== removeNodes[0]
          )
          if (filteredLists.length === existingNode.data.lists.length) {
            return
          }
          const updatedNode = {
            ...existingNode,
            data: {
              ...existingNode.data,
              lists: filteredLists,
            },
          }
          const updatedNodes = nodes.map((node, index) =>
            index === existingNodeIndex ? updatedNode : node
          )
          setNodes(updatedNodes)
        }
      }
      if (removeNodes[1] === 'dataHistorical') {
        const existingNodeIndex = nodes.findIndex(
          (node) =>
            node.type === 'dataHistorical' &&
            node.data.lists &&
            node.data.lists.length > 0
        )

        if (existingNodeIndex !== -1) {
          const existingNode = nodes[existingNodeIndex]

          const filteredLists = existingNode.data.lists.filter(
            (data) => data.title !== removeNodes[0]
          )

          if (filteredLists.length === existingNode.data.lists.length) {
            return
          }

          const updatedNode = {
            ...existingNode,
            data: {
              ...existingNode.data,
              lists: filteredLists,
            },
          }

          const updatedNodes = nodes.map((node, index) =>
            index === existingNodeIndex ? updatedNode : node
          )

          setNodes(updatedNodes)
        }
      }
      setChangeNodes({})
      setRemoveNodes([])
    }
  }, [nodes, removeNodes, setChangeNodes, setNodes, setRemoveNodes])

  return (
    <div className="relative h-full flex-1">
      <ReactFlow
        nodes={nodesAmounts}
        edges={edgesWithUpdatedTypes}
        proOptions={{
          hideAttribution: true,
        }}
        onNodesChange={(value) => {
          // validator type of nodes cannot be edited
          if (xnodeType !== 'validator') {
            onNodesChange(value)
          }
        }}
        onEdgesChange={(value) => {
          // validator type of nodes cannot be edited
          if (xnodeType !== 'validator') {
            onEdgesChange(value)
          }
        }}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
      >
        <MiniMap position="top-left" />

        <Controls position="top-right" />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  )
}

export default NodesFlow
