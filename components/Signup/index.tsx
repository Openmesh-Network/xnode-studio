import { useContext, useEffect } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import nookies, { parseCookies, setCookie } from 'nookies'
import { toast } from 'react-toastify'
import { getWeb3Login } from 'utils/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { UserProps } from '@/contexts/AccountContext'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import 'react-toastify/dist/ReactToastify.css'

import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useAccount } from 'wagmi'
import { Eye, EyeSlash } from 'phosphor-react'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

const Signup = () => {
  const {
    setFinalBuild,
    indexerDeployerStep,
    setIndexerDeployerStep,
  } = useContext(AccountContext)

  const [ user, setUser ] = useUser()

  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)
  type LoginForm = {
    email: string
    password: string
  }
  const validSchema = Yup.object().shape({
    email: Yup.string().max(500).required('Email is required'),
    password: Yup.string()
      .min(8, 'Min of 8 digits')
      .max(500)
      .required('Password is required'),
  })
  const {
    register,
    handleSubmit,
    setValue,
    control, // Adicione esta linha
    // eslint-disable-next-line no-unused-vars
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver<any>(validSchema),
  })

  const account = useAccount()

  const tryLogin = async () => {
    console.log('Login initiated!')
    try {
      const res = await getWeb3Login(account.address)
      if (res) {
        setUser(res)
      }
    } catch (err) {
      console.log('Error loging in with Web3', err)
      toast.error(err)
      return
    }
    console.log('Login over!')
  }

  async function loginUser(data: any) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/loginOpenRD`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      },
      data,
    }

    try {
      let res = await axios(config)
      setUser(res.data as UserProps)
      return res.data
    } catch(err) {
      toast.error("Error logging in: ", err)
      return null
    }
  }


  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    const finalData = {
      ...data,
    }
    try {
      const res = await loginUser(finalData)
      setUser(res.data as UserProps)
      setIsLoading(false)

      // push(
      //   `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
      // )
    } catch (err) {
      setIsLoading(false)

      if (err.response.data.message === 'Unconfirmed Email') {
        toast.error('Unconfirmed email')
      } else if (err.response.data.message === 'User disabled') {
        toast.error(
          'Please allow 24 to 48 hours for the community to approve your application'
        )
      } else {
        toast.error('Incorrect credentials')
      }
      const element = document.getElementById('emailId')
      element.scrollIntoView({ behavior: 'smooth' })
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   // XXX: This is a stub, to remove ugly UI for video demo.
  //   if (user) {
  //     setIndexerDeployerStep(indexerDeployerStep + 1)
  //   }
  // }, [ user ]);


  return (
    <section id="home">
      {/* <h1 className="text-4xl font-semibold text-black"> Sign in </h1> */}
      <h1 className="text-center text-3xl font-medium">
        Connect <span className="text-primary">your wallet</span>
      </h1>

      <p className="text-center">Connect your wallet to deploy</p>


      <div className="mt-16"/>
      {/* Two column layout */}

      <div className="flex flex-row">
        {
          user ? (
            <>
              { /* XXX: Show some account info? Possibly make into component later. */ }
              <p> Logged in </p>

              { /* XXX: Add better sign out button. */ }

              <p onClick={ () => { setUser(null) } }> Log out </p>

            </>
          )
          : (
            <>
            <div className="w-1/2 border-r">
              <div className="mx-auto w-fit">
                <h3 className="text-2xl font-semibold">
                  Connect your wallet to continue
                </h3>

                <div className="mt-5"/>

                <w3m-button />
                {
                  account?.isConnected && (
                    <div>
                      {
                        <button
                          className="cursor-pointer items-center rounded-[5px] border border-blue-500 bg-blue-500 px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-white hover:bg-[#064DD2] lg:text-[16px]"
                          onClick={() => tryLogin()}
                        >
                          {' '}
                          Verify wallet{' '}
                        </button>
                      }
                    </div>
                  )
                }
              </div>
            </div>

            <div className="w-1/2 border-l">
              <div className="m-auto w-min">
                <div className="flex-cols mt-5 flex w-fit text-xl font-medium">Not a web3 user?</div>

                <Dialog>
                  <DialogTrigger className=" mt-5 inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary/95 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"> Openmesh Expert Login </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log in</DialogTitle>
                      <DialogDescription>
                        {  }
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="">
                      <span className="flex flex-row">
                        Email
                        <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                          {errors.email?.message}
                        </p>
                      </span>
                      <input
                        className="mt-[10px] h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                        type="text"
                        maxLength={500}
                        placeholder=""
                        {...register('email')}
                      />
                      <div className="mt-[20px]">
                        <span className="flex flex-row">
                          Password
                          <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                            {errors.password?.message}
                          </p>
                        </span>
                        <div className="flex">
                          <input
                            className="mr-[20px] mt-[10px] h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                            type={passwordVisibility ? 'password' : 'text'}
                            maxLength={120}
                            placeholder=""
                            {...register('password')}
                          />
                          {passwordVisibility ? (
                            <div
                              onClick={() => setPasswordVisibility(false)}
                              className="flex cursor-pointer items-center text-center"
                            >
                              <EyeSlash className="cursor-pointer" />
                            </div>
                          ) : (
                            <div
                              onClick={() => setPasswordVisibility(true)}
                              className="flex cursor-pointer items-center text-center"
                            >
                              <Eye className="cursor-pointer" />
                            </div>
                          )}
                          <button
                            type="submit"
                            className="cursor-pointer items-center rounded-[5px] border border-black bg-transparent px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec] lg:text-[16px]"
                            onClick={handleSubmit(onSubmit)}
                          >
                            <span className="">Sign in</span>
                          </button>
                        </div>
                      </div>
                    </form>

                  </DialogContent>
                </Dialog>

              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.openmesh.network/oec/register`}
                className="border-b-1 cursor-pointer text-[#3253FE]"
              >
                <button className="mt-5 inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"> 
                  Register
                </button>
                </a>
              </div>
            </div>
            </>
          )
        }


      </div>
    </section>
  )
}

export default Signup
