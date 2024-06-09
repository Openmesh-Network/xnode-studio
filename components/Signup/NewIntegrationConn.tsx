import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import 'react-toastify/dist/ReactToastify.css'

import { prefix } from '@/utils/prefix'
import { Eye, EyeSlash } from 'phosphor-react'
import { useUser } from '@/hooks/useUser'

type EquinixAPIForm = {
  apiKey: string
}

const NewIntegrationConn = () => {
  const [showTooltipCloudProvider, setShowTooltipCloudProvider] =
    useState<boolean>(false)
  const { setConnections, templateSelected } = useContext(AccountContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)
  const [isCreatingNewChannel, setIsCreatingNewChannel] = useState(false)

  const [ user, setUser ] = useUser()

  const validSchema = Yup.object().shape({
    apiKey: Yup.string().max(500).required('Key is required'),
  })
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<EquinixAPIForm>({
    resolver: yupResolver<any>(validSchema),
  })

  const closeModal = () => {
    setIsCreatingNewChannel(false)
  }

  async function connectEquinix(data: any) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/connectEquinixAPI`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'X-Parse-Session-Token': user.sessionToken,
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

  async function onSubmit(data: EquinixAPIForm) {
    setIsLoading(true)
    const finalData = {
      ...data,
    }
    try {
      // TODO: Actually implement this later ofc. Removing now for testing internally.
      toast.success('Success')

      console.log(data)
      const finalUser = user
      finalUser.apiKey = data.apiKey
      setUser(finalUser)
      setConnections(true)

      setIsEditing(false)
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      toast.error(`Error: ${err.response.data.message}`)
      setIsLoading(false)
    }
  }

  const includedIntegrations = [
    {
      name: 'Google BigQuery',
      description:
        'BigQuery is a fully managed, AI-ready data analytics platform that helps you maximize value from your data and is designed to be multi-engine, multi-format, and multi-cloud.',
    },
  ]

  return (
    <>
      <h1 className="text-4xl font-semibold text-black"> Perform connections </h1>
      <div className="mt-12"/>

      <div className="rounded-[10px] border border-black px-[10px] py-[8px] text-black">
        <div className="relative flex gap-x-[10px]">
          {/* <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]"> */}
          {/*   Connect to{' '} */}
          {/*   {templateSelected ? templateSelected?.providerName : 'Equinix'} to deploy the application. */}
          {/* </div> */}

          {showTooltipCloudProvider && (
            <div className="absolute left-[130px] top-0 w-full max-w-[270px] rounded-[10px] bg-black px-[17px] py-[14px] text-[11px] font-medium !leading-[19px] text-white ">
              <div>If you have any third party that needs connection</div>
            </div>
          )}
        </div>
        <div className="justify-between">

          {includedIntegrations?.length > 0 && (
            <div className="rounded-md px-[8px] py-[5px]">
              <div className="flex gap-x-[50px]">
                <div className="flex items-center">
                  <img
                    src={`${prefix}/images/signup/xnode-conn.svg`}
                    alt="image"
                    className=""
                  />{' '}
                  <div className="ml-[11px] pt-[5px] text-[16px]">
                    {templateSelected
                      ? templateSelected?.providerName
                      : 'Equinix'}
                  </div>
                </div>
              </div>


              <div className="flex-rows flex items-center justify-center">
                {
                  user?.apiKey ? (
                    <>
                      <button className="inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={ () => { 
                          let newUser = user
                          newUser.apiKey = null
                          setUser(newUser)
                          setConnections(false)
                        }}> 
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="">
                        <div className="flex gap-x-[20px]">
                          <input
                            disabled={isLoading}
                            className="mt-[10px] h-[25px] w-[200px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:h-[30px] md:w-[250px] lg:h-[35px] lg:w-[350px] xl:h-[40px] xl:w-[400px] 2xl:h-[50px] 2xl:w-[500px]"
                            type={passwordVisibility ? 'password' : 'text'}
                            maxLength={500}
                            placeholder=""
                            {...register('apiKey')}
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

                      {!isLoading && (
                        <button className="inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          onClick={handleSubmit(onSubmit)}> 
                          Connect
                        </button>
                      )}

                    </>
                  )
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NewIntegrationConn
