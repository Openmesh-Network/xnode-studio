"use client";

import Activate from "./Activate";
import EnterCode from "./EnterCode";

const Units = ({chainId} : {chainId: number}) => {
  return (
    <section className="mt-12 mb-[0px] px-[20px] pt-[50px]  text-[11px] font-medium !leading-[17px] text-[#000000] lg:mb-24 lg:px-[100px]  lg:text-[14px]">
      <EnterCode chainId={chainId} />
      <Activate chainId={chainId} />
    </section>
  );
};

export default Units;
