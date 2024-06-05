'use client'

import NodesFlow from '../NodesFlow'

const Workspace = () => {
  return (
    <>
      <div className="px-[50px] xl:px-[70px] 2xl:px-[100px]">
        <div className="mx-auto mb-[50px] h-[1300px] max-w-[300px] rounded-[10px] bg-[#F9F9F9] md:max-w-[600px] lg:max-w-[950px] xl:max-w-[1200px] 2xl:mb-[100px] 2xl:max-w-[1500px] 4xl:max-w-full">
          <NodesFlow fromScratch={false} />
        </div>
      </div>
    </>
  )
}

export default Workspace
