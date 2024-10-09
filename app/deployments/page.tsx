import { cookies } from 'next/headers'

import DeploymentsList from './deployments-list'

export default function DeploymentsPage() {
  const { value: sessionToken } = cookies().get('userSessionToken')
  return (
    <div className="container my-12 max-w-none space-y-4">
      <h1 className="text-xl font-bold">Deployed Nodes</h1>
      <DeploymentsList sessionToken={sessionToken} />
      {/* <Deployments /> */}
    </div>
  )
}
