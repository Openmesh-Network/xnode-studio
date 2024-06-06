"use client";

import { XnodeUnitEntitlementContract } from "@/contracts/XnodeUnitEntitlement";
import { useEffect, useState } from "react";
import {
  Address,
  BaseError,
  ContractFunctionRevertedError,
  Hex,
  Signature,
  keccak256,
  toBytes,
  zeroAddress,
} from "viem";
import {
  useAccount,
  useDisconnect,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import axios from "axios";
import { XnodeUnitEntitlementClaimerContract } from "@/contracts/XnodeUnitEntitlementClaimer";
import { reviver } from "@/utils/json";


function popup() {
  return (
    <div className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    </div>
  )
}


const Claim = ({chainId} : {chainId: number}) => {
  const [code, setCode] = useState<string>("");
  const [invalidCode, setInvalidCode] = useState<string | undefined>(undefined);
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  useEffect(() => {
    // Check if semantics of the code are valid
    if (code.length != 9) {
      setInvalidCode("Code must be 9 characters long.");
      return;
    }

    // Check if the code has already been used
    const checkAlreadyMinted = async () => {
      const nftId = BigInt(keccak256(toBytes(code)));
      const owner = await publicClient
        .readContract({
          abi: XnodeUnitEntitlementContract.abi,
          address: XnodeUnitEntitlementContract.address,
          functionName: "ownerOf",
          args: [nftId],
        })
        .catch((err) => {
          console.error(err);
          return zeroAddress; // On error, assume it's not owned
        });
      if (owner !== zeroAddress) {
        return "Code has already been used.";
      }
      return undefined; // Success
    };

    checkAlreadyMinted().then(setInvalidCode);
  }, [code]);

  const redeemCode = async () => {
    if (!walletClient) {
      alert("WalletClient undefined.");
      return;
    }

    const response = await axios
      .post("/xue-signer/getSig", {
        code: code,
        receiver: account.address,
      })
      .then(
        (res) =>
          JSON.parse(JSON.stringify(res.data), reviver) as {
            message: { receiver: Address; codeHash: Hex; claimBefore: number };
            signature: Signature;
          },
      )
      .catch((err: { response: { data: string } }) => {
        console.error(err);
        return err.response.data;
      });

    if (typeof response === "string") {
      // An error has occurred, likely an invalid code
      alert(response);
      return;
    }

    const transactionRequest = await publicClient
      .simulateContract({
        account: walletClient.account,
        abi: XnodeUnitEntitlementClaimerContract.abi,
        address: XnodeUnitEntitlementClaimerContract.address,
        functionName: "claim",
        args: [
          response.message.receiver,
          response.message.codeHash,
          response.message.claimBefore,
          Number(response.signature.v),
          response.signature.r,
          response.signature.s,
        ],
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

  const redeemWithWarn = () => {
    if (confirm("Warning, activating an Xnode is irreversible and will begin the expiration timer. You can still trade your token at this time. Are you sure you want to proceed?")) {
      redeemCode().catch(console.error)
    }
  };

  return (
    <>
      <p className="text-[32px] font-semibold"> Claim your Xnode </p>
      <p> Unleash the power of Xnode, your gateway to building a personalized server in minutes instead of weeks. </p>

      <br/>

      <div className="flex flex-row justify-between">
        <div className="">
          <p className="font-semibold"> Step 01. </p>
          <p> Connect your wallet. </p>
          <p><a href="https://richardlennox.com"> How to get a web3 wallet </a></p>
        </div>
        <div className="">
          <span className="flex flex-row">
            {account.address !== undefined && (
              <p
                className="ml-[8px] text-[10px] font-normal"
                onClick={() => disconnect()}
              >
                Disconnect
              </p>
            )}
          </span>

          {account.address !== undefined ? (
            <input
              className="h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] m-0 font-normal outline-0"
              type="text"
              value={account.address ?? ""}
              readOnly={true}
            />
          ) : (
            <w3m-connect-button />
          )}
        </div>
      </div>

      <br/>
      <br/>
      <br/>

      <div className="flex flex-row justify-between">
        <div>
          <p className="font-semibold"> Step 02. </p>
          <p> Enter your pin from the Xnode card. </p>
          <p className="underline"> <a onClick={ () => { alert("deluxe popup") } }> What is that, I&apos;m dumb? </a> </p>
        </div>

        <div className="">
          {/* <span className="flex flex-row"> */}
            {/* <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] "> */}
              {/* {invalidCode !== undefined ? "* " + invalidCode : "" } */}
            {/* </p> */}
          {/* </span> */}
          <input
            className="mt-[10px] h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </div>

      <br/>
      <br/>
      <br/>

      <div className="flex flex-row justify-between">
        <div>
          <p className="font-semibold"> Step 03. </p>
          <p> Claim your Xnode. </p>
          <p className="underline"> <a onClick={ () => { alert("deluxe popup") } }> What is that, I&apos;m dumb? </a> </p>
        </div>

        <div className="">
          <button
            className="cursor-pointer items-center rounded-[5px] border border-[#0059FF] bg-[#0059FF] py-[8px] px-[25px] text-[13px] font-bold !leading-[19px] text-[#FFFFFF] hover:bg-[#064DD2] lg:text-[16px]"
            disabled={invalidCode !== undefined || walletClient === undefined || account.address !== undefined}
            onClick={() => redeemCode().catch(console.error)}
          >
            Claim
          </button>
          </div>
      </div>

      <br/>
      <br/>
      <br/>


      {
        popup()
      }

      <br/>
    </>
  );
};

export default Claim;
