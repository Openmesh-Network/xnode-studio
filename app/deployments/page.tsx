import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import DeploymentsList from './deployments-list'

export default function DeploymentsPage() {
  const sessionCookie = cookies().get('userSessionToken')
  if (!sessionCookie) {
    redirect('/login?redirect=/deployments')
  }

  return (
    <div className="container my-12 max-w-none space-y-4">
      <h1 className="text-xl font-bold">Deployed Nodes</h1>
      <DeploymentsList sessionToken={sessionCookie.value} />
      {/* <Deployments /> */}
    </div>
  )
}
