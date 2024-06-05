'use client'

import { useContext, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import nookies, { destroyCookie, setCookie } from 'nookies'
import { Eye, EyeSlash } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { AccountContext } from '../../contexts/AccountContext'

import 'react-toastify/dist/ReactToastify.css'

type LoginForm = {
  email: string
  password: string
}

const LogIn = () => {
  const [showTooltipCloudProvider, setShowTooltipCloudProvider] =
    useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)
  const { user, setUser } = useContext(AccountContext)

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
    control,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver<any>(validSchema),
  })

  async function loginUser(data: any) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/loginOpenRD`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      },
      data,
    }

    let dado

    await axios(config).then(function (response) {
      if (response.data) {
        dado = response.data
      }
    })

    return dado
  }

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    const finalData = {
      ...data,
    }
    try {
      const res = await loginUser(finalData)
      setCookie(null, 'userSessionToken', res.sessionToken)
      nookies.set(null, 'userSessionToken', res.sessionToken)
      toast.success('Success')
      setUser(res)
      setIsLoading(false)
    } catch (err) {
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
      console.log(err.response.data.message)
      setIsLoading(false)
    }
  }
  function signOutUser() {
    destroyCookie(undefined, 'userSessionToken')
    nookies.destroy(null, 'userSessionToken')
    setUser(null)
  }
  if (user?.sessionToken) {
    return (
      <>
        <div className="mt-[25px] flex items-center gap-x-[10px] text-[16px] text-[#000]">
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }/images/reviewYourBuild/user-circle.svg`}
            alt="image"
            className="w-[25px] md:w-[30px] lg:w-[35px] xl:w-[40px] 2xl:w-[40px]"
          />
          <div>{user.email}</div>
        </div>
        <div
          onClick={signOutUser}
          className="mt-[10px] cursor-pointer text-[5px] font-normal text-[#838383] underline underline-offset-1 hover:text-[#5f5f5f] md:text-[8.4px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]"
        >
          Sign out
        </div>
      </>
    )
  }

  return (
    <div className="rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] pb-[60px] pr-[100px] text-[#000] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[20px] xl:pb-[80px] xl:pr-[192px] 2xl:px-[20px] 2xl:py-[25px] 2xl:pb-[100px] 2xl:pr-[140px]">
      <div className="relative flex gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          Sign in section{' '}
        </div>
        <img
          src={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? process.env.NEXT_PUBLIC_BASE_PATH
              : ''
          }/images/firstStep/question-mark.svg`}
          alt="image"
          className="size-[9px] cursor-pointer transition-transform hover:scale-105 md:size-[11px] lg:size-[12px] xl:size-[14px] 2xl:size-[18px]"
          onMouseEnter={() => setShowTooltipCloudProvider(true)}
          onMouseLeave={() => setShowTooltipCloudProvider(false)}
        />
        {showTooltipCloudProvider && (
          <div className="absolute left-[100px] top-0 w-full max-w-[270px] rounded-[10px] bg-[#000] px-[13px] py-[10px] text-[8px] font-medium text-[#fff] md:left-[120px] md:px-[15px] md:py-[12px] md:text-[9px] lg:left-[140px] lg:px-[17px] lg:py-[14px] lg:text-[11px] lg:!leading-[19px] xl:left-[180px] xl:px-[20px] xl:py-[16px] xl:text-[13px] 2xl:left-[200px] 2xl:px-[25px] 2xl:py-[20px] 2xl:text-[16px]">
            <div className="">Sign in to proceed with the Xnode deployment</div>
          </div>
        )}
      </div>
      <div className="grid gap-y-[20px] md:flex md:gap-x-[30px] lg:gap-x-[60px] xl:gap-x-[120px] 2xl:gap-x-[200px]">
        <div className="mt-[30px] md:ml-[50px] md:mt-[35px] lg:ml-[70px] lg:mt-[40px] xl:ml-[112px] xl:mt-[56px] 2xl:ml-[140px] 2xl:mt-[70px]">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="">
              <div>
                <div id="emailId" className="">
                  <div className="">
                    <span className="flex flex-row">
                      Email
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                        {errors.email?.message}
                      </p>
                    </span>
                    <input
                      disabled={isLoading}
                      className="mt-[10px] h-[25px] w-[200px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:h-[30px] md:w-[250px] lg:h-[35px] lg:w-[350px] xl:h-[40px] xl:w-[400px] 2xl:h-[50px] 2xl:w-[500px]"
                      type="text"
                      maxLength={500}
                      placeholder=""
                      {...register('email')}
                    />
                  </div>
                  <div className="mt-[20px]">
                    <span className="flex flex-row">
                      Password
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                        {errors.password?.message}
                      </p>
                    </span>
                    <div className="flex">
                      <input
                        disabled={isLoading}
                        className="mt-[10px] h-[25px] w-[200px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:h-[30px] md:w-[250px] lg:h-[35px] lg:w-[350px] xl:h-[40px] xl:w-[400px] 2xl:h-[50px] 2xl:w-[500px]"
                        type={passwordVisibility ? 'password' : 'text'}
                        maxLength={500}
                        placeholder=""
                        {...register('password')}
                      />
                      {passwordVisibility ? (
                        <div
                          onClick={() => setPasswordVisibility(false)}
                          className="ml-[10px] flex cursor-pointer items-center text-center"
                        >
                          <EyeSlash className="cursor-pointer" />
                        </div>
                      ) : (
                        <div
                          onClick={() => setPasswordVisibility(true)}
                          className="flex cursor-pointer items-center text-center"
                        >
                          <Eye className="ml-[10px] cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-[20px] flex gap-x-[35px] xl:mb-0">
              {!isLoading && (
                <div
                  onClick={handleSubmit(onSubmit)}
                  className="mt-[41px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] hover:bg-[#0e2e69] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:mt-[65px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]"
                >
                  <div>Sign in</div>
                </div>
              )}
              {isLoading && (
                <div className="mt-[41px] flex size-fit justify-center gap-x-[8px] rounded-[5px] bg-[#719be9] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:mt-[65px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]">
                  <div>Sign in</div>
                </div>
              )}
              <a
                className="mt-auto"
                href="https://www.openmesh.network/oec/recover-password"
                target="_blank"
                rel="noreferrer"
              >
                <div className="text-[9px] font-normal text-[#838383] underline underline-offset-1 hover:text-[#5f5f5f] md:text-[10.8px] lg:text-[12.5px] xl:text-[14.5px] 2xl:text-[18px]">
                  Forgot Password
                </div>
              </a>
            </div>
          </form>
        </div>
        <div className="my-auto">
          {' '}
          <a
            href="https://www.openmesh.network/oec/register"
            target="_blank"
            rel="noreferrer"
            className="my-auto"
          >
            <div className="my-auto flex h-fit w-[125px] cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] hover:bg-[#0e2e69] md:w-[150px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:w-[175px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:w-[200px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:w-[250px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/header/storm.svg`}
                alt="image"
                className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
              />
              <div onClick={() => {}}>Sign up</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default LogIn
