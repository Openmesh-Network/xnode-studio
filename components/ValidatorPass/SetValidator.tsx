'use client'

import { useEffect, useState } from 'react'
import { ValidatorPassContract } from '@/contracts/ValidatorPass'
import { chain } from '@/utils/chain'
import { useEVPNfts } from 'utils/nft'
import { BaseError, ContractFunctionRevertedError } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

const SetValidator = () => {
  const account = useAccount()
  const { data: nfts } = useEVPNfts(account.address)
  const [selectedNft, setSelectedNft] = useState<bigint | undefined>(undefined)
  const publicClient = usePublicClient({ chainId: chain.id })
  const { data: walletClient } = useWalletClient({ chainId: chain.id })
  const validatorAddress = '0x<RETRIEVE VALIDATOR ADDRESS>' // should be 32 bytes or otherwise encoded as such

  useEffect(() => {
    // This can be replaced with a dropdown, but will look more intimidating to the user and most will only own a single NFT.
    setSelectedNft(nfts.at(0))
  }, [nfts])

  const setValidator = async () => {
    if (!selectedNft) {
      alert('No NFT selected.')
      return
    }
    if (!walletClient) {
      alert('WalletClient undefined.')
      return
    }

    const transactionRequest = await publicClient
      .simulateContract({
        account: walletClient.account,
        abi: ValidatorPassContract.abi,
        address: ValidatorPassContract.address,
        functionName: 'setValidator',
        args: [selectedNft, validatorAddress],
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
    <div className="mx-auto flex w-fit justify-center rounded-[8px] p-[10px] md:border md:border-[#cacaca] md:p-[50px] lg:p-[100px]">
      <div className="space-y-5">
        <w3m-button />

        <button
          className="cursor-pointer items-center rounded-[5px] border border-black bg-transparent px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec] lg:text-[16px]"
          disabled={selectedNft === undefined}
          onClick={() => setValidator().catch(console.error)}
        >
          Register Validator
        </button>
      </div>
    </div>
  )
}

export default SetValidator
