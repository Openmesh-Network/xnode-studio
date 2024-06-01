import ScrollUp from "@/components/Common/ScrollUp";
import Units from "@/components/Units";
import { sepolia } from "viem/chains";

export default function UnitsPage() {
  return (
    <>
      <ScrollUp />
      <Units chainId={sepolia.id} />
    </>
  );
}
