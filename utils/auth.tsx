import { useContext, useEffect, useState } from 'react'
import { hashObject } from '@/utils/functions'
import axios from 'axios'
import { AccountContext } from 'contexts/AccountContext'
import nookies, { destroyCookie, setCookie } from 'nookies'
import { Address } from 'viem'
import { signMessage } from 'wagmi/actions'

import { useUser } from '@/hooks/useUser'
import { wagmiConfig } from '@/app/providers'

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

export async function getWeb3Login(address: Address) {
  // trying web3 login
  try {
    console.log('Getting user nonce')
    let nonceUser = await getUserNonce(address)
    nonceUser = nonceUser || '0'
    console.log('hashing object')
    const hash = hashObject(`${address}-${nonceUser}`)
    console.log('message to hash')
    console.log(hash)
    const finalHash = `0x${hash}`
    const signature = await signMessage(wagmiConfig, {
      account: address,
      message: finalHash,
    })

    const res = await loginWeb3User(address, signature)
    nookies.set(null, 'userSessionToken', res.sessionToken, {
      maxAge: 10 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })
    return res
  } catch (err) {
    console.error(err)
    throw err
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

  console.log('Logged in user data: ', dado)
  console.log('Logged in user session token ', dado.sessionToken)

  return dado
}
