'use client'

import { useEffect, useState } from 'react'
import { ValidatorPassContract } from '@/contracts/ValidatorPass'
import { chain } from '@/utils/chain'
import { useEVPNfts } from 'utils/nft'
import { Hex } from 'viem'
import { useAccount } from 'wagmi'

import { usePerformTransaction } from '@/hooks/usePerformTransaction'

const SetValidator = () => {
  const account = useAccount()
  const { data: nfts } = useEVPNfts(account.address)
  const [selectedNft, setSelectedNft] = useState<bigint | undefined>(undefined)
  const validatorAddress: Hex = '0x<RETRIEVE VALIDATOR ADDRESS>' // should be 32 bytes or otherwise encoded as such
  const { performingTransaction, performTransaction } = usePerformTransaction({
    chainId: chain.id,
  })

  useEffect(() => {
    // This can be replaced with a dropdown, but will look more intimidating to the user and most will only own a single NFT.
    setSelectedNft(nfts.at(0))
  }, [nfts])

  const setValidator = async () => {
    if (!selectedNft) {
      alert('No NFT selected.')
      return
    }

    await performTransaction({
      transactionName: 'Register Validator',
      transaction: async () => {
        return {
          abi: ValidatorPassContract.abi,
          address: ValidatorPassContract.address,
          functionName: 'setValidator',
          args: [selectedNft, validatorAddress],
        }
      },
    })
  }

  return (
    <div className="mx-auto flex w-fit justify-center rounded-[8px] p-[10px] md:border md:border-[#cacaca] md:p-[50px] lg:p-[100px]">
      <div className="space-y-5">
        <button
          className="cursor-pointer items-center rounded-[5px] border border-black bg-transparent px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec] lg:text-[16px]"
          disabled={selectedNft === undefined || performingTransaction}
          onClick={() => setValidator().catch(console.error)}
        >
          Register Validator
        </button>
      </div>
    </div>
  )
}

export default SetValidator
