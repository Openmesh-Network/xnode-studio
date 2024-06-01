"use client";

import { XnodeUnitEntitlementContract } from "@/contracts/XnodeUnitEntitlement";
import { useEffect, useState } from "react";
import {
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import axios from "axios";

const Activate = ({chainId} : {chainId: number}) => {
  const [nfts, setNfts] = useState<bigint[]>([]);
  const [selectedNft, setSelectedNft] = useState<bigint | undefined>(undefined);
  const account = useAccount();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  useEffect(() => {
    const getNfts = async () => {
      if (!account?.address) {
        setNfts([]);
        return;
      }

      // This should be replaced with an server rewrite, so the server can do the request and keep the API key secret.
      const response = await axios.get(`https://eth-sepolia.g.alchemy.com/nft/v3/wxMZwmicJOsN0zsmfqSN2-nc8vovL3LP/getNFTsForOwner?owner=${account.address}&contractAddresses[]=${XnodeUnitEntitlementContract.address}&withMetadata=false`).then(res => res.data as { ownedNfts: {tokenId: string}[]});
      setNfts(response.ownedNfts.map(nft => BigInt(nft.tokenId)))
    }

    getNfts().catch(console.error)
  }, [account?.address])

  useEffect(() => {
    // This can be replaced with a dropdown, but will look more intimidating to the user and most will only own a single NFT.
    setSelectedNft(nfts.at(0));
  }, [nfts])

  const activeNFT = async () => {
    if (!selectedNft) {
      alert("No NFT selected.");
      return;
    }
    if (!walletClient) {
      alert("WalletClient undefined.");
      return;
    }

    const transactionRequest = await publicClient
      .simulateContract({
        account: walletClient.account,
        abi: XnodeUnitEntitlementContract.abi,
        address: XnodeUnitEntitlementContract.address,
        functionName: "activate",
        args: [selectedNft],
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof BaseError) {
          let errorName = err.shortMessage ?? "Simulation failed.";
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError,
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            errorName += ` -> ${revertError.data?.errorName}` ?? "";
          }
          return errorName;
        }
        return "Simulation failed.";
      });
    if (typeof transactionRequest === "string") {
      alert(transactionRequest);
      return;
    }
    const transactionHash = await walletClient
      .writeContract(transactionRequest.request)
      .catch((err) => {
        console.error(err);
        return undefined;
      });
    if (!transactionHash) {
      alert("Transaction rejected.");
      return;
    }

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });

    alert(`Success: ${receipt.transactionHash}`);
  };

  if (selectedNft === undefined) {
    return <></>
  }

  return (
    <div className="mx-auto flex w-fit justify-center rounded-[8px] p-[10px] md:border md:border-[#cacaca] md:p-[50px] lg:p-[100px]">
      <div className="space-y-5">
        <w3m-button />
        <button
          className=" cursor-pointer items-center rounded-[5px] border  border-[#000] bg-transparent py-[8px] px-[25px] text-[13px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec] lg:text-[16px]"
          disabled={selectedNft === undefined}
          onClick={() => activeNFT().catch(console.error)}
        >
          Activate
        </button>
      </div>
    </div>
  );
};

export default Activate;
