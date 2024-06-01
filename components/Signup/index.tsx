/* eslint-disable no-unused-vars */
import { useEffect, useContext } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import LogIn from './LogIn'
import nookies, { parseCookies, setCookie } from 'nookies'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EquinixConnection from './EquinixConnecton'
import {
  optionsServerLocationToValue,
  optionsServerNumberToValue,
} from '@/utils/constants'
import {
  findAPIisWebsocket,
  findFeatures,
  findServerDefaultType,
  findServerDefaultValueLocation,
} from '../FinalBuild'
import { CoreServices } from '@/types/node'
import { useWeb3ModalTheme, useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import axios from 'axios'

import { signMessage, disconnect } from '@wagmi/core'
import { hashObject } from '@/utils/functions'

import { config } from '@/app/providers'

/* eslint-disable react/no-unescaped-entities */
const Signup = () => {
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    reviewYourBuild,
    setReviewYourBuild,
    setFinalBuild,
    finalNodes,
    setSignup,
    tagXnode,
    user,
    setIndexerDeployerStep,
    projectName,
    xnodeType,
    setUser,
  } = useContext(AccountContext)

  const cookies = parseCookies()
  const userHasAnyCookie = cookies.userSessionToken

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

  function handleFinalBuild() {
    if (!user) {
      toast.error('Please log in before proceeding')
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else if (!user.apiKey) {
      toast.error('Please connect your equinix api before proceeding')
      window.scrollTo({
        top: 40,
        behavior: 'smooth',
      })
    } else {
      setFinalBuild(true)
      setIndexerDeployerStep(2)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
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

  const { address } = useAccount()

  useEffect(() => {
    async function getWeb3Login() {
      if (address && !user && !userHasAnyCookie) {
        // trying web3 login
        try {
          let nonceUser = await getUserNonce(address)
          nonceUser = nonceUser || '0'
          const hash = hashObject(`${address}-${nonceUser}`)
          console.log('message to hash')
          console.log(hash)
          const finalHash = `0x${hash}`
          const signature = await signMessage(config, {
            account: address,
            message: finalHash,
          })
          const res = await loginWeb3User(address, signature)
          setCookie(null, 'userSessionToken', res.sessionToken)
          nookies.set(null, 'userSessionToken', res.sessionToken)
          setUser(res)
        } catch (err) {
          toast.error(err)
          console.log('error loging user')
        }
      }
    }

    getWeb3Login()
  }, [address])

  return (
    <>
      <section
        id="home"
        className={`w-full bg-[#fff] px-[48px] pb-[1000px] pt-[88px] 2xl:px-[60px] 2xl:pt-[110px]`}
      >
        <div>
          <div className="text-[18px]  font-bold -tracking-[2%] text-[#000000] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
            Connect your wallet
          </div>
          <div className="mb-[30px] mt-[15px]">
            <w3m-button />
          </div>{' '}
          <div className="my-[30px] text-[#000]">or</div>
          <div className="text-[18px]  font-bold -tracking-[2%] text-[#000000] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
            Signin for Xnode
          </div>
          <div className="mt-[15px] text-[18px] font-normal -tracking-[2%] text-[#C8C8C8] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:mt-[15px] 2xl:text-[32px]">
            Finalise your integrations easily
          </div>
          <div className="mt-[15px]">
            <LogIn />
          </div>
          {user && (
            <div className="mt-[50px] md:mt-[60px] lg:mt-[70px] xl:mt-[80px] 2xl:mt-[100px]">
              <EquinixConnection />
            </div>
          )}
          <div className="flex gap-x-[25px]">
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setSignup(false)
                setIndexerDeployerStep(1)
              }}
              className="mt-[41px] flex h-fit w-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#787d86] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] hover:bg-[#5d6066] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px]  lg:py-[8.75px] lg:text-[10px]   xl:mt-[65px] xl:px-[17px]    xl:py-[10px]  xl:text-[11.2px]  2xl:mt-[82px] 2xl:gap-x-[10px]  2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]"
            >
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/header/arrow-left-new.svg`}
                alt="image"
                className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[12px]`}
              />
              <div>Back</div>
            </div>

            <div
              onClick={() => {
                console.log(finalNodes)
                handleFinalBuild()
              }}
              className={`mt-[41px] flex h-fit w-fit justify-center gap-x-[8px] rounded-[5px] ${
                !user
                  ? 'bg-[#578ae9]'
                  : 'cursor-pointer bg-[#0354EC] hover:bg-[#0e2e69] '
              } px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff]  md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px]  lg:py-[8.75px] lg:text-[10px]   xl:mt-[65px] xl:px-[17px]    xl:py-[10px]  xl:text-[11.2px]  2xl:mt-[82px] 2xl:gap-x-[10px]  2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]`}
            >
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/header/storm.svg`}
                alt="image"
                className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
              />
              <div>Deploy</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Signup
