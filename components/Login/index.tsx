'use client'
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeSlash } from 'phosphor-react'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import nookies, { setCookie } from 'nookies'
import { AccountContext } from '../../contexts/AccountContext'

import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { baseURL } from '@/utils/baseUrls'
import Link from 'next/link'

const loginSchema = zod.object({
  email: zod
    .string()
    .includes('@', {
      message: 'Invalid email',
    })
    .min(5, 'Invalid email')
    .max(99),
  password: zod
    .string()
    .min(8, 'Password must contains at least 8 characters')
    .max(99),
})

type LoginSchemaData = zod.infer<typeof loginSchema>

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)

  const { push } = useRouter()

  const { setUser } = useContext(AccountContext)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function loginUser(data: any) {
    const config = {
      method: 'post' as const,
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

  async function onSubmit(data: LoginSchemaData) {
    const finalData = {
      ...data,
    }
    try {
      const res = await loginUser(finalData)
      setCookie(null, 'userSessionToken', res.sessionToken)
      setUser(res)
      push(baseURL)
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  ;<div className="mt-[30px] md:mt-[40px] lg:mt-[50px]">
    Does not have an account yet?{' '}
    <a
      target="_blank"
      rel="noreferrer"
      href={`https://www.openmesh.network/oec/register`}
      className="border-b-1 cursor-pointer border-b text-[#3253FE]"
    >
      Create account
    </a>
  </div>

  const actionLinks = [
    {
      label: 'Does not have an account yet?',
      callToAction: 'Create account',
      href: 'https://www.openmesh.network/oec/register',
    },
    {
      label: 'Forgot your password?',
      callToAction: 'Recover password',
      href: 'https://www.openmesh.network/oec/recover-password',
    },
  ]

  return (
    <>
      <section className="px-4 pt-12 lg:px-24">
        <div className="flex w-full flex-col rounded-[8px] p-3 md:border md:border-[#cacaca] lg:p-16">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div id="emailId" className="">
              <div className="">
                <span className="flex flex-row">
                  Email
                  <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                    {errors.email?.message}
                  </p>
                </span>
                <input
                  disabled={isSubmitting}
                  className="mt-[10px] h-[50px] w-[180px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:w-[280px] lg:w-[500px]"
                  type="text"
                  maxLength={500}
                  placeholder=""
                  {...register('email')}
                />
              </div>
              <div className="mt-[20px]">
                <span className="flex flex-row">
                  Password
                  <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                    {errors.password?.message}
                  </p>
                </span>
                <div className="flex">
                  <input
                    disabled={isSubmitting}
                    className="mr-[20px] mt-[10px] h-[50px] w-[180px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:w-[280px] lg:w-[500px]"
                    type={passwordVisibility ? 'password' : 'text'}
                    maxLength={500}
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
                </div>
              </div>
            </div>

            <div className="mt-[30px]">
              <button
                type="submit"
                className=" cursor-pointer items-center rounded-[5px] border  border-[#000] bg-transparent px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec] lg:text-[16px]"
                onClick={handleSubmit(onSubmit)}
              >
                <span className="">Sign in</span>
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-2 lg:mt-12">
            {actionLinks.map(({ callToAction, href, label }) => {
              return (
                <div key={label} className="text-sm">
                  <span>{label}</span>{' '}
                  <Link
                    href={href}
                    target="_blank"
                    className="border-b-1 cursor-pointer border-b text-[#3253FE]"
                    rel="noreferrer"
                  >
                    {callToAction}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
