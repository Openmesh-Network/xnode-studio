'use client'

import NodesFlow from '../NodesFlow'

const Workspace = () => {
  return (
    <>
      <div className="mx-auto mb-[50px] h-[calc(100svh-4rem)] rounded-[10px] bg-[#F9F9F9] 2xl:mb-[100px]">
        <NodesFlow fromScratch={false} />
      </div>
    </>
  )
}

export default Workspace
