'use client'

import { useEffect, useState } from 'react'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { XnodeUnitEntitlementClaimerContract } from '@/contracts/XnodeUnitEntitlementClaimer'
import { reviver } from '@/utils/json'
import axios from 'axios'
import {
  Address,
  BaseError,
  ContractFunctionRevertedError,
  Hex,
  keccak256,
  Signature,
  toBytes,
  zeroAddress,
} from 'viem'
import {
  useAccount,
  useDisconnect,
  usePublicClient,
  useWalletClient,
} from 'wagmi'

const EnterCode = ({ chainId }: { chainId: number }) => {
  const [code, setCode] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<string | undefined>(undefined)
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  useEffect(() => {
    // Check if semantics of the code are valid
    if (code.length != 9) {
      setInvalidCode('Code must be 9 characters long.')
      return
    }

    // Check if the code has already been used
    const checkAlreadyMinted = async () => {
      const nftId = BigInt(keccak256(toBytes(code)))
      const owner = await publicClient
        .readContract({
          abi: XnodeUnitEntitlementContract.abi,
          address: XnodeUnitEntitlementContract.address,
          functionName: 'ownerOf',
          args: [nftId],
        })
        .catch((err) => {
          console.error(err)
          return zeroAddress // On error, assume it's not owned
        })
      if (owner !== zeroAddress) {
        return 'Code has already been used.'
      }
      return undefined // Success
    }

    checkAlreadyMinted().then(setInvalidCode)
  }, [code, publicClient])

  const redeemCode = async () => {
    if (!walletClient) {
      alert('WalletClient undefined.')
      return
    }

    const response = await axios
      .post('/xue-signer/getSig', {
        code: code,
        receiver: account.address,
      })
      .then(
        (res) =>
          JSON.parse(JSON.stringify(res.data), reviver) as {
            message: { receiver: Address; codeHash: Hex; claimBefore: number }
            signature: Signature
          }
      )
      .catch((err: { response: { data: string } }) => {
        console.error(err)
        return err.response.data
      })

    if (typeof response === 'string') {
      // An error has occurred, likely an invalid code
      alert(response)
      return
    }

    const transactionRequest = await publicClient
      .simulateContract({
        account: walletClient.account,
        abi: XnodeUnitEntitlementClaimerContract.abi,
        address: XnodeUnitEntitlementClaimerContract.address,
        functionName: 'claim',
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
        console.error(err)
        if (err instanceof BaseError) {
          let errorName = err.shortMessage ?? 'Simulation failed.'
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError
          )
          if (revertError instanceof ContractFunctionRevertedError) {
            errorName += ` -> ${revertError.data?.errorName}` ?? ''
          }
          return errorName
        }
        return 'Simulation failed.'
      })
    if (typeof transactionRequest === 'string') {
      alert(transactionRequest)
      return
    }
    const transactionHash = await walletClient
      .writeContract(transactionRequest.request)
      .catch((err) => {
        console.error(err)
        return undefined
      })
    if (!transactionHash) {
      alert('Transaction rejected.')
      return
    }

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    alert(`Success: ${receipt.transactionHash}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="flex flex-row">
          Receiver{' '}
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
            className="mt-[10px] h-[50px] w-[180px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:w-[280px] lg:w-[500px]"
            type="text"
            value={account.address ?? ''}
            readOnly={true}
          />
        ) : (
          <w3m-connect-button />
        )}
      </div>
      <div>
        <span className="flex flex-row">
          Code
          <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
            {invalidCode !== undefined ? '* ' + invalidCode : ''}
          </p>
        </span>
        <input
          className="mt-[10px] h-[50px] w-[180px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:w-[280px] lg:w-[500px]"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button
        className="cursor-pointer items-center rounded-[5px] border border-black bg-transparent px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec] lg:text-[16px]"
        disabled={invalidCode !== undefined && account.address !== undefined}
        onClick={() => redeemCode().catch(console.error)}
      >
        Redeem
      </button>
    </div>
  )
}

export default EnterCode
