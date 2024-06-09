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

import GetEquinixAPIKey from './GetEquinixAPIKey'

type EquinixAPIForm = {
  apiKey: string
}

const EquinixConnection = () => {
  const [showTooltipCloudProvider, setShowTooltipCloudProvider] =
    useState<boolean>(false)
  const { setConnections, templateSelected } = useContext(AccountContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { user, setUser } = useContext(AccountContext)
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)
  const [isCreatingNewChannel, setIsCreatingNewChannel] = useState(false)

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
      // TODO: reintroduce this at some point OFC!
      // const res = await connectEquinix(finalData)
      toast.success('Success')
      const finalUser = user
      finalUser.apiKey = data.apiKey
      setUser(finalUser)
      setIsEditing(false)
      setIsLoading(false)
    } catch (err) {
      toast.error(`Error: ${err.response.data.message}`)
      setIsLoading(false)
    }
  }

  if (user?.apiKey) {
    return (
      <div className="relative rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] pb-[60px] pr-[100px] text-black md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[20px] xl:pb-[80px] xl:pr-[192px] 2xl:px-[20px] 2xl:py-[25px] 2xl:pb-[100px] 2xl:pr-[240px]">
        <div className="relative flex gap-x-[10px]">
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            You will also need to connect to{' '}
            {templateSelected ? templateSelected?.providerName : 'Equinix'} 3rd
            party service to deploy the application.
          </div>
          <img
            src={`${prefix}/images/firstStep/question-mark.svg`}
            alt="image"
            className="size-[9px] cursor-pointer transition-transform hover:scale-105 md:size-[11px] lg:size-[12px] xl:size-[14px] 2xl:size-[18px]"
            onMouseEnter={() => setShowTooltipCloudProvider(true)}
            onMouseLeave={() => setShowTooltipCloudProvider(false)}
          />
          {showTooltipCloudProvider && (
            <div className="absolute left-0 top-[40px] w-full max-w-[270px] rounded-[10px] bg-black px-[13px] py-[10px] text-[8px] font-medium text-white md:left-[162px] md:px-[15px] md:py-[12px] md:text-[9px] lg:left-[189px] lg:px-[17px] lg:py-[14px] lg:text-[11px] lg:!leading-[19px] xl:left-[216px] xl:px-[20px] xl:py-[16px] xl:text-[13px] 2xl:left-[500px] 2xl:px-[25px] 2xl:py-[20px] 2xl:text-[16px]">
              <div>If you have any third party that needs connection</div>
            </div>
          )}
        </div>
        <div className="ml-[112px] mt-[56px] 2xl:ml-[140px] 2xl:mt-[70px]">
          <div className="flex gap-x-[50px]">
            <div className="flex items-center">
              <img
                src={`${prefix}/images/signup/xnode-conn.svg`}
                alt="image"
                className=""
              />{' '}
              <div className="ml-[11px] pt-[5px] text-[16px]">
                {templateSelected ? templateSelected?.providerName : 'Equinix'}
              </div>
            </div>
            <div
              onClick={() => {
                setIsCreatingNewChannel(true)
              }}
              className="cursor-pointer text-[10px] text-[#0354EC] hover:text-[#0243bb] xl:text-[12px]"
            >
              How to get my API key?
            </div>
          </div>

          {isEditing && (
            <div>
              <div className="mt-[25px] md:mt-[30px] lg:mt-[35px] xl:mt-[40px] 2xl:mt-[50px]">
                <span className="flex flex-row">
                  Project API Key
                  <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                    {errors.apiKey?.message}
                  </p>
                </span>
                <input
                  disabled={isLoading}
                  className="mt-[10px] h-[25px] w-[200px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:h-[30px] md:w-[250px] lg:h-[35px] lg:w-[350px] xl:h-[40px] xl:w-[400px] 2xl:h-[50px] 2xl:w-[500px]"
                  type="text"
                  maxLength={500}
                  placeholder=""
                  {...register('apiKey')}
                />
              </div>
              {!isLoading && (
                <div
                  onClick={handleSubmit(onSubmit)}
                  className="mt-[41px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-white hover:bg-[#0e2e69] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:mt-[65px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]"
                >
                  <div>Connect</div>
                </div>
              )}
              {isLoading && (
                <div className="mt-[41px] flex size-fit justify-center gap-x-[8px] rounded-[5px] bg-[#719be9] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-white md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:mt-[65px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]">
                  <div>Connect</div>
                </div>
              )}
            </div>
          )}

          {!isEditing && (
            <div className="mb-[10px] mt-[25px] grid gap-y-[20px] md:mt-[30px] lg:mt-[35px] xl:mt-[40px] 2xl:mt-[50px]">
              <div className="text-[12px] text-[#12AD50] md:text-[14px] lg:text-[16px] xl:text-[20px] 2xl:text-[24px]">
                Connected
              </div>
              <div
                onClick={() => {
                  setIsEditing(true)
                }}
                className="cursor-pointer text-[9px] font-medium text-[#0354EC] underline underline-offset-1 hover:text-[#276ff7] lg:text-[10px] xl:text-[12px] 2xl:text-[16px]"
              >
                Edit
              </div>
            </div>
          )}
          {isEditing && (
            <div className="mb-[10px] mt-[25px] flex gap-x-[20px] md:mt-[30px] lg:mt-[35px] xl:mt-[40px] 2xl:mt-[50px]">
              <div
                onClick={() => {
                  setIsEditing(false)
                }}
                className="cursor-pointer font-medium text-[#777777] underline underline-offset-1 hover:text-[#bebebe]"
              >
                Cancel
              </div>
            </div>
          )}
        </div>
        <GetEquinixAPIKey isOpen={isCreatingNewChannel} onClose={closeModal} />
      </div>
    )
  }

  return (
    <div className="relative rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] pb-[60px] pr-[100px] text-black md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[20px] xl:pb-[80px] xl:pr-[192px] 2xl:px-[20px] 2xl:py-[25px] 2xl:pb-[100px] 2xl:pr-[240px]">
      <div className="relative flex gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          You will also need to connect to{' '}
          {templateSelected ? templateSelected?.providerName : 'Equinix'} 3rd
          party service to deploy the application.
        </div>
        <img
          src={`${prefix}/images/firstStep/question-mark.svg`}
          alt="image"
          className="size-[9px] cursor-pointer transition-transform hover:scale-105 md:size-[11px] lg:size-[12px] xl:size-[14px] 2xl:size-[18px]"
          onMouseEnter={() => setShowTooltipCloudProvider(true)}
          onMouseLeave={() => setShowTooltipCloudProvider(false)}
        />
        {showTooltipCloudProvider && (
          <div className="absolute left-[130px] top-0 w-full max-w-[270px] rounded-[10px] bg-black px-[13px] py-[10px] text-[8px] font-medium text-white md:left-[162px] md:px-[15px] md:py-[12px] md:text-[9px] lg:left-[189px] lg:px-[17px] lg:py-[14px] lg:text-[11px] lg:!leading-[19px] xl:left-[216px] xl:px-[20px] xl:py-[16px] xl:text-[13px] 2xl:left-[270px] 2xl:px-[25px] 2xl:py-[20px] 2xl:text-[16px]">
            <div>If you have any third party that needs connection</div>
          </div>
        )}
      </div>
      <div className="mt-[25px] md:ml-[70px] md:mt-[35px] lg:ml-[90px] lg:mt-[42px] xl:ml-[112px] xl:mt-[56px] 2xl:ml-[140px] 2xl:mt-[70px]">
        <div className="flex gap-x-[50px]">
          <div className="flex items-center">
            <img
              src={`${prefix}/images/signup/xnode-conn.svg`}
              alt="image"
              className=""
            />{' '}
            <div className="ml-[11px] pt-[5px] text-[16px]">
              {templateSelected ? templateSelected?.providerName : 'Equinix'}
            </div>
          </div>

          <div
            onClick={() => {
              setIsCreatingNewChannel(true)
            }}
            className="cursor-pointer text-[10px] text-[#0354EC] hover:text-[#0243bb] xl:text-[12px]"
          >
            How to get my API key?
          </div>
        </div>
        <div className="mt-[25px] md:mt-[30px] lg:mt-[35px] xl:mt-[40px] 2xl:mt-[50px]">
          <span className="flex flex-row">
            Project API Key
            <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
              {errors.apiKey?.message}
            </p>
          </span>
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
          <div
            onClick={handleSubmit(onSubmit)}
            className="mb-[20px] mt-[21px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-white hover:bg-[#0e2e69] md:mt-[32px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[40px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:mb-0 xl:mt-[65px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]"
          >
            <div>Connect</div>
          </div>
        )}
        {isLoading && (
          <div className="mb-[20px] mt-[21px] flex size-fit justify-center gap-x-[8px] rounded-[5px] bg-[#719be9] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-white md:mt-[32px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[40px] lg:px-[42px] lg:py-[8.75px] lg:text-[10px] xl:mb-0 xl:mt-[65px] xl:px-[48px] xl:py-[10px] xl:text-[11.2px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[60px] 2xl:py-[12.5px] 2xl:text-[14px]">
            <div>Connect</div>
          </div>
        )}
      </div>
      <GetEquinixAPIKey isOpen={isCreatingNewChannel} onClose={closeModal} />
    </div>
  )
}

export default EquinixConnection
