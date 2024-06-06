import ScrollUp from '@/components/Common/ScrollUp'
import NodesFlow from '@/components/NodesFlow'
import WorkspaceSidebar from '@/components/SubBar/workspace-sidebar'

export default function Tasks() {
  return (
    <>
      <ScrollUp />
      <div className="flex size-full">
        <NodesFlow />
        <WorkspaceSidebar />
      </div>
    </>
  )
}
