import axios from 'axios'
import { hashObject } from '@/utils/functions'
import { wagmiConfig } from '@/app/providers'
import { signMessage } from '@wagmi/core'

async function getUserNonce(userAddress: string) {
  const config = {
    method: 'post' as const,
    url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/getUserNonce`,
    headers: {
      'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      'Content-Type': 'application/json',
    },
    data: {
      address: userAddress,
    },
  }
  let dado

  await axios(config).then(function (response) {
    if (response.data) {
      dado = response.data
    }
  })
  return dado
}


export async function getWeb3Login(address) {
  if (address) {
    // trying web3 login
    try {
      let nonceUser = await getUserNonce(address)
      nonceUser = nonceUser || '0'
      const hash = hashObject(`${address}-${nonceUser}`)
      console.log('message to hash')
      console.log(hash)
      const finalHash = `0x${hash}`
      const signature = await signMessage(wagmiConfig, {
        account: address,
        message: finalHash,
      })

      const res = await loginWeb3User(address, signature)
      return res;
    } catch (err) {
      throw err;
    }
  }
}

async function loginWeb3User(userAddress: string, signature: string) {
  const config = {
    method: 'post' as const,
    url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/loginByWeb3Address`,
    headers: {
      'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
    },
    data: {
      address: userAddress,
      signature,
    },
  }

  let dado

  await axios(config).then(function (response) {
    if (response.data) {
      dado = response.data
    }
  })

  return dado
}

