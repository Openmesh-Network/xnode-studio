import { Position } from 'reactflow'

export const nodes = [
  //   {
  //     id: '1',
  //     type: 'input',
  //     data: {
  //       label: 'Input Node',
  //     },
  //     position: { x: 250, y: 0 },
  //   },
  //   {
  //     id: '2',
  //     data: {
  //       label: 'Default Node',
  //     },
  //     position: { x: 100, y: 100 },
  //   },
  //   {
  //     id: '3',
  //     type: 'output',
  //     data: {
  //       label: 'Output Node',
  //     },
  //     position: { x: 400, y: 100 },
  //   },
  {
    id: '11',
    type: 'server',
    position: { x: 500, y: 200 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      defaultValueServerType: 'Small c3.x86 x 1',
      defaultValueLocation: 'US East',
    },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '12',
    type: 'api',
    position: { x: 170, y: -50 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      name: 'WebSocket API',
    },
  },
  {
    id: '13',
    type: 'data',
    position: { x: 150, y: 150 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      name: 'Crypto Exchanges',
      lists: [
        {
          icon: '/images/subNavBarData/binance.svg',
          title: 'Binance',
        },
        {
          icon: '/images/subNavBarData/coinbase.svg',
          title: 'Coinbase',
        },
      ],
    },
  },
  {
    id: '14',
    type: 'utility',
    position: { x: 120, y: 400 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      title: 'Observability',
      name: 'Grafana',
      icon: '/images/subNavBarUtility/grafana.svg',
    },
  },
  {
    id: '15',
    type: 'rpc',
    position: { x: 150, y: 550 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      name: 'ValidationCloud',
      icon: '/images/subNavBarRPC/validateCloud.svg',
    },
  },
  {
    id: '16',
    type: 'analytics',
    position: { x: 450, y: 570 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      name: 'Pythia Pro',
      icon: '/images/subNavBarAnalytics/pythia-logo.svg',
    },
  },
]

export const edges = [
  {
    id: 'e12-e11',
    source: '12',
    target: '11',
    animated: true,
    style: { stroke: '#000' },
  },
  {
    id: 'e13-e11',
    source: '13',
    target: '11',
    animated: true,
    style: { stroke: '#000' },
  },
  {
    id: 'e14-e11',
    source: '14',
    target: '11',
    animated: true,
    style: { stroke: '#000' },
  },
  {
    id: 'e15-e11',
    source: '15',
    target: '11',
    animated: true,
    style: { stroke: '#000' },
  },
  {
    id: 'e16-e11',
    source: '16',
    target: '11',
    animated: true,
    style: { stroke: '#000' },
  },
]
