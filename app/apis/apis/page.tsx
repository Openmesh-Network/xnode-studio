import { codeToHtml } from 'shiki'

import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'

export default async function ApisPage() {
  const codeString = `{
    "feed": <Name of the feed>,
    "exchange": <Exchange the message is from>,
    "symbol": <What symbol the message is for>,
    "data": [
        ...
    ]
  }
  `

  const html = await codeToHtml(codeString, {
    lang: 'python',
    theme: 'aurora-x',
  })
  return <div className="text-sm" dangerouslySetInnerHTML={{ __html: html }} />

  return (
    <Section>
      <Header level={1}>Websockets</Header>
      <p className="text-lg">Subscribe to live-streamed market events</p>

      <div className="mt-12">
        <Header level={2}>Overview</Header>
        <p>
          The websocket API streams market updates at low latency for use cases
          that require monitoring of the market in real time. It supports all
          feeds, symbols, and exchanges for L3 Atom. Messages will be of the
          form:
        </p>
      </div>
    </Section>
  )
}
