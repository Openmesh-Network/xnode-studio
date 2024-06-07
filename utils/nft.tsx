import { XnodeUnitEntitlementContract } from "@/contracts/XnodeUnitEntitlement";
import axios from "axios";

export async function getXueNfts(account) {
  // XXX: This should be replaced with an server rewrite, so the server can do the request and keep the API key secret.
  const url = `https://eth-sepolia.g.alchemy.com/nft/v3/wxMZwmicJOsN0zsmfqSN2-nc8vovL3LP/getNFTsForOwner?owner=${account.address}&contractAddresses[]=${XnodeUnitEntitlementContract.address}&withMetadata=false`
  const response = await axios.get(url).then(res => res.data as { ownedNfts: {tokenId: string}[]});

  return response.ownedNfts.map(nft => BigInt(nft.tokenId))
}

