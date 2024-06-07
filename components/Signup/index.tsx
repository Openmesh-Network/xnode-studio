import { useContext, useEffect } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import nookies, { parseCookies, setCookie } from 'nookies'
import { toast } from 'react-toastify'

// import { getWeb3Login } from 'utils/auth'

import LogIn from './LogIn'

import 'react-toastify/dist/ReactToastify.css'

import axios from 'axios'
import { useAccount } from 'wagmi'

import { Separator } from '../ui/separator'
import EquinixConnection from './EquinixConnecton'

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

  const { address } = useAccount()

  const tryLogin = async () => {
    console.log('Login initiated!')
    try {
      // const res = await getWeb3Login(address)
      // if (res) {
      //   setCookie(null, 'userSessionToken', res.sessionToken)
      //   nookies.set(null, 'userSessionToken', res.sessionToken)
      //   setUser(res)
      // }
    } catch (err) {
      console.log('Error loging in with Web3', err)
      toast.error(err)
      return
    }
    console.log('Login over!')
  }

  return (
    <section id="home">
      <h1 className="text-center text-3xl font-medium">
        Connect <span className="text-primary">your wallet</span>
      </h1>
      <p>Connect your wallet to deploy</p>
      <div className="flex flex-col">
        <div>
          <h3 className="text-3xl font-bold">
            Connect your wallet to continue
          </h3>
          <p>
            Integrate APIs from different exchanges, allowing seamless data flow
            on the L3A platform.
          </p>
          <w3m-button />
          <button
            className="cursor-pointer items-center rounded-[5px] border border-[#0059FF] bg-[#0059FF] px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#FFFFFF] hover:bg-[#064DD2] lg:text-[16px]"
            onClick={() => tryLogin()}
          >
            {' '}
            Actually attempt login.{' '}
          </button>
        </div>
        <Separator className="my-4" />
        <div>
          <h3 className="text-xl font-medium">Not a web3 user?</h3>
          <LogIn />
        </div>
      </div>
      {/* <div>
        <div className="text-[18px] font-bold tracking-[-2%] text-black md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
          Connect your wallet
        </div>
        <div className="mb-[30px] mt-[15px]">
          <w3m-button />
        </div>{' '}
        <div className="my-[30px] text-black">or</div>
        <div className="text-[18px] font-bold tracking-[-2%] text-black md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
          Signin for Xnode
        </div>
        <div className="mt-[15px] text-[18px] font-normal tracking-[-2%] text-[#C8C8C8] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:mt-[15px] 2xl:text-[32px]">
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
            className="mt-[41px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#787d86] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-white hover:bg-[#5d6066] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px] lg:py-[8.75px] lg:text-[10px] xl:mt-[65px] xl:px-[17px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]"
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
            className={`mt-[41px] flex size-fit justify-center gap-x-[8px] rounded-[5px] ${
              !user
                ? 'bg-[#578ae9]'
                : 'cursor-pointer bg-[#0354EC] hover:bg-[#0e2e69]'
            } px-[11px] py-[6.2px] text-center text-[7px] font-medium text-white md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px] lg:py-[8.75px] lg:text-[10px] xl:mt-[65px] xl:px-[17px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]`}
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
      </div> */}
    </section>
  )
}

export default Signup
