/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'

import {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  FC,
  useContext,
  useMemo,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AccountContext } from '@/contexts/AccountContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  nodes as initialNodes,
  edges as initialEdges,
} from './initial-elements'
import {
  nodes as initialNodesScratch,
  edges as initialEdgesScratch,
} from './initial-elements-fromscratch'
import CustomNode from './CustomNode'

import './overview.css'
import ServerNode from './ServerNode'
import APINode from './APINode'
import UtilityNode from './UtilityNode'
import RPCNode from './RPCNode'
import AnalyticsNode from './AnalyticsNode'
import OpenmeshNode from './OpenmeshNode'
import withProps from './withProps'
import DataNodeStreaming from './DataNodeStreaming'
import DataNodeHistorical from './DataNodeHistorical'
import MLNode from './MLNode'
import StorageNode from './StorageNode'
import DataManagementNode from './DataManagementNode'
import ComputeNode from './ComputeNode'
import TradingNode from './TradingNode'
import { categoriesOptions } from '@/utils/constants'
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
  fromScratch: boolean
}

const onInit = (reactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance)

const NodesFlow = ({ ...dataM }: ModalProps) => {
  const handleNodeRemove = (nodeIdToRemove) => {
    if (xnodeType !== 'validator') {
      setNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== nodeIdToRemove),
      )
    }
  }

  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    changeNodes,
    setFinalNodes,
    finalNodes,
    setIsWorkspace,
    xnodeType,
    setXnodeType,
    setTagXnode,
    setSignup,
    updateDataNode,
    setFinalBuild,
    removeNodes,
    setChangeNodes,
    selectCurrentMenuDataType,
  } = useContext(AccountContext)
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    !dataM.fromScratch ? initialNodes : initialNodesScratch,
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    !dataM.fromScratch ? initialEdges : initialEdgesScratch,
  )
  const [isInitialized, setIsInitialized] = useState(false)

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: '#000' } }, eds),
      ),
    [],
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
        (node) => node.data.name === changeNodes?.name,
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
    // if (changeNodes?.type === "data") {
    //   const existingNodeIndex = nodes.findIndex(
    //     (node) =>
    //       node.type === "data" && node.data.lists && node.data.lists.length > 0
    //   );

    //   if (existingNodeIndex !== -1) {
    //     const existingNode = nodes[existingNodeIndex];

    //     const existsTitle = existingNode.data.lists.some(
    //       (data) => data.title === changeNodes?.name
    //     );

    //     if (existsTitle) {
    //       return;
    //     }

    //     existingNode.data.lists.push({
    //       icon: changeNodes?.icon,
    //       title: changeNodes?.name,
    //     });

    //     const updatedNodes = [...nodes];
    //     updatedNodes[existingNodeIndex] = existingNode;

    //     setNodes((nds) =>
    //       nds.map((node) => {
    //         if (node.type === "data") {
    //           node.data = {
    //             ...node.data,
    //             lists: existingNode.data.lists,
    //           };
    //         }

    //         return node;
    //       })
    //     );
    //   } else {
    //     const newNode = {
    //       id: uuidv4(),
    //       type: "data",
    //       position: { x: 670, y: 500 },
    //       data: {
    //         selects: {
    //           "handle-0": "smoothstep",
    //           "handle-1": "smoothstep",
    //         },
    //         lists: [
    //           {
    //             title: changeNodes?.name,
    //             icon: changeNodes?.icon,
    //           },
    //         ],
    //       },
    //     };
    //     setNodes((prevNodes) => [...prevNodes, newNode]);
    //   }
    // }
    // for historical
    if (changeNodes?.type === 'dataHistorical') {
      const existingNodeIndex = nodes.findIndex(
        (node) =>
          node.type === 'dataHistorical' &&
          node.data.lists &&
          node.data.lists.length > 0,
      )

      if (existingNodeIndex !== -1) {
        const existingNode = nodes[existingNodeIndex]

        const existsTitle = existingNode.data.lists.some(
          (data) => data.title === changeNodes?.name,
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
          }),
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
          node.data.lists.length > 0,
      )

      if (existingNodeIndex !== -1) {
        const existingNode = nodes[existingNodeIndex]

        const existsTitle = existingNode.data.lists.some(
          (data) => data.title === changeNodes?.name,
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
          }),
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
  }, [changeNodes])

  useEffect(() => {
    console.log('heyyy chamado fui')
    const existingNodeIndex = nodes.findIndex(
      (node) =>
        node.type === 'dataStreaming' &&
        node.data.lists &&
        node.data.lists.length > 0,
    )

    if (existingNodeIndex !== -1) {
      const existingNode = nodes[existingNodeIndex]

      const filteredLists = existingNode.data.lists.filter(
        (data) => data.title !== 'dataOption.title',
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
        index === existingNodeIndex ? updatedNode : node,
      )

      setNodes(updatedNodes)
    }
  }, [updateDataNode])

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
    [],
  )

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('nodes', JSON.stringify(nodes))
      localStorage.setItem('edges', JSON.stringify(edges))
    }
    setFinalNodes(nodes)
  }, [nodes, edges, isInitialized])

  useEffect(() => {
    setSignup(false)
    setFinalBuild(false)
    setIsWorkspace(true)
    const savedNodes = localStorage.getItem('nodes')
    const savedEdges = localStorage.getItem('edges')
    const savedXnodeType = localStorage.getItem('xnodeType')

    if (savedNodes) {
      setNodes(JSON.parse(savedNodes))
      setIsWorkspace(true)
    } else setNodes(!dataM.fromScratch ? initialNodes : initialNodesScratch)

    if (savedEdges) {
      setEdges(JSON.parse(savedEdges))
      setIsWorkspace(true)
    } else setEdges(!dataM.fromScratch ? initialEdges : initialEdgesScratch)

    if (savedXnodeType === 'validator') {
      setXnodeType('validator')
      setTagXnode('Validator')
    } else {
      setXnodeType('')
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (removeNodes && removeNodes.length > 0) {
      if (removeNodes[1] === 'dataStreaming') {
        const existingNodeIndex = nodes.findIndex(
          (node) =>
            node.type === 'dataStreaming' &&
            node.data.lists &&
            node.data.lists.length > 0,
        )
        if (existingNodeIndex !== -1) {
          const existingNode = nodes[existingNodeIndex]
          const filteredLists = existingNode.data.lists.filter(
            (data) => data.title !== removeNodes[0],
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
            index === existingNodeIndex ? updatedNode : node,
          )
          setNodes(updatedNodes)
        }
      }
      if (removeNodes[1] === 'dataHistorical') {
        const existingNodeIndex = nodes.findIndex(
          (node) =>
            node.type === 'dataHistorical' &&
            node.data.lists &&
            node.data.lists.length > 0,
        )

        if (existingNodeIndex !== -1) {
          const existingNode = nodes[existingNodeIndex]

          const filteredLists = existingNode.data.lists.filter(
            (data) => data.title !== removeNodes[0],
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
            index === existingNodeIndex ? updatedNode : node,
          )

          setNodes(updatedNodes)
        }
      }
    }
  }, [removeNodes])

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodesAmounts}
        edges={edgesWithUpdatedTypes}
        proOptions={{
          hideAttribution: true,
        }}
        onNodesChange={(value) => {
          console.log('chamado fuii')
          console.log(nodesAmounts)
          // validator type of nodes cannot be edited
          if (xnodeType !== 'validator') {
            console.log('entrei nao')
            onNodesChange(value)
          }
        }}
        onEdgesChange={(value) => {
          // validator type of nodes cannot be edited
          console.log('chamado fuii')
          if (xnodeType !== 'validator') {
            console.log('entrei nao')
            onEdgesChange(value)
          }
        }}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
      >
        <div className="absolute right-0 top-[75px] md:top-[90px] lg:top-[105px] xl:top-[120px] 2xl:top-[150px]">
          <MiniMap style={minimapStyle} zoomable pannable />
        </div>
        <div className="absolute top-[80px] left-[25px] md:top-[96px] md:left-[30px] lg:top-[112px] lg:left-[35px] xl:top-[128px] xl:left-[40px] 2xl:top-[160px] 2xl:left-[50px]">
          <Controls />
        </div>
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  )
}

export default NodesFlow
