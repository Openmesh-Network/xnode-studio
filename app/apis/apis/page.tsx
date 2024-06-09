import { codeToHtml } from 'shiki'

import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'

export default async function ApisPage() {
  const code1String = `{
    "feed": "<Name of the feed>",
    "exchange": "<Exchange the message is from>",
    "symbol": "<What symbol the message is for>",
    "data": [
        "..."
    ]
}`
  const code1 = await codeToHtml(code1String, {
    lang: 'json',
    theme: 'one-light',
  })

  const code2String = `{
    "...",
    "event_timestamp": "2022-11-10T02:46:35.255000Z",
    "atom_timestamp": 1668048395421519
}`
  const code2 = await codeToHtml(code2String, {
    lang: 'json',
    theme: 'one-light',
  })

  const code3 = await codeToHtml(`wss://ws.yobp0j.tech.openmesh.network`, {
    lang: 'text',
    theme: 'one-light',
  })

  const code4 = await codeToHtml(
    `import sys
import websockets
import asyncio
import json
from datetime import datetime
import argparse

# connects to endpoint ENDPOINT`,
    {
      lang: 'python',
      theme: 'one-light',
    }
  )

  return (
    <Section className="py-20">
      <Header level={1}>Websockets</Header>
      <p className="mt-2 text-lg">Subscribe to live-streamed market events</p>

      <div className="mt-16">
        <Header level={2}>Overview</Header>
        <p className="mt-1">
          The websocket API streams market updates at low latency for use cases
          that require monitoring of the market in real time. It supports all
          feeds, symbols, and exchanges for L3 Atom. Messages will be of the
          form:
        </p>
        <div
          className="mt-4 rounded-lg bg-card p-6 text-sm"
          dangerouslySetInnerHTML={{ __html: code1 }}
        />
        <p className="mt-4">
          in cases where you specify the feed, exchange, and symbol in the
          subscription message. In other types of feeds, you will see a similar
          structure, but you may not see an exchange or symbol field if it is
          not relevant. data is an array of the market updates / events, whose
          format is dependent on the feed. However, each entry in data will have
          one of the following structures:
        </p>
        <div
          className="mt-4 rounded-lg bg-card p-6 text-sm"
          dangerouslySetInnerHTML={{ __html: code2 }}
        />
      </div>
      <div className="mt-16">
        <Header level={2}>Base Endpoint</Header>
        <div
          className="mt-4 rounded-lg bg-card p-6 text-sm"
          dangerouslySetInnerHTML={{ __html: code3 }}
        />
      </div>
      <div className="mt-16">
        <Header level={2}>Quickstart</Header>
        <p className="mt-1">
          The following code shows an example of how you can interact with this
          API:
        </p>
        <div
          className="mt-4 rounded-lg bg-card p-6 text-sm"
          dangerouslySetInnerHTML={{ __html: code4 }}
        />
      </div>
    </Section>
  )
}
