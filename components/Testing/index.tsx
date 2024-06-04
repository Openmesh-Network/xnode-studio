/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'

// import { useState } from 'react'
import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'

import 'reactflow/dist/style.css'

import CustomNode from './CustomNode'
import {
  edges as initialEdges,
  nodes as initialNodes,
} from './initial-elements'

import './overview.css'

const nodeTypes = {
  custom: CustomNode,
}

const minimapStyle = {
  height: 120,
}

const onInit = (reactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance)

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === 'custom').data
        .selects[edge.sourceHandle]
      edge.type = edgeType
    }

    return edge
  })

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

export default OverviewFlow
