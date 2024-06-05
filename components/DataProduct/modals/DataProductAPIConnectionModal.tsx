import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import 'react-toastify/dist/ReactToastify.css'

import { Eye, EyeSlash } from 'phosphor-react'

type EquinixAPIForm = {
  apiKey: string
}

export interface ModalI {
  title: string
  imageSrc: string
  helpLink: string
  connectionEndpoint: string
  userApiKey: string
}

const DataProductAPIConnection = ({
  title,
  connectionEndpoint,
  helpLink,
  imageSrc,
  userApiKey,
}: ModalI) => {
  const [showTooltipCloudProvider, setShowTooltipCloudProvider] =
    useState<boolean>(false)
  const { setConnections } = useContext(AccountContext)
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

  async function connectApiKey(data: any) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/${connectionEndpoint}`,
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
      const res = await connectApiKey(finalData)
      toast.success('Success')
      const finalUser = user
      finalUser[userApiKey] = data.apiKey
      setUser(finalUser)
      setIsEditing(false)
      setIsLoading(false)
    } catch (err) {
      toast.error(`Error: ${err.response.data.message}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] pb-[20px] pr-[100px] text-[#000] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[20px] xl:pr-[192px] 2xl:px-[20px] 2xl:py-[25px] 2xl:pb-[40px] 2xl:pr-[240px]">
      <div className="relative flex w-fit gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          {title}
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
          <div className="absolute right-0 w-full max-w-[270px] translate-x-[105%] rounded-[10px] bg-[#000] px-[11px] py-[8px] text-[12px] font-medium text-[#fff] lg:!leading-[19px] 2xl:px-[15px] 2xl:py-[10px] 2xl:text-[14px]">
            <div>
              Utilize the Validation Cloud data in your Xnode by connecting it
              with your API key.
            </div>
          </div>
        )}
      </div>
      <div className="ml-[20px] mt-[20px] 2xl:mt-[30px]">
        <div className="flex gap-x-[50px]">
          {/* <img
            //   src={`${
            //     process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            //       ? process.env.NEXT_PUBLIC_BASE_PATH
            //       : ''
            //   }/images/signup/equinix-xnode.svg`}
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }${imageSrc}`}
            alt="image"
            className="w-[145px] md:w-[174px] lg:w-[203px] xl:w-[232px] 2xl:w-[290px]"
          />{' '} */}
          <a href={helpLink} target="_blank" rel="noreferrer">
            <div
              //   onClick={() => {
              //     setIsCreatingNewChannel(true)
              //   }}
              className="cursor-pointer text-[10px] text-[#0354EC] hover:text-[#0243bb] xl:text-[12px]"
            >
              How to get my API key?
            </div>
          </a>
        </div>
        {user?.[userApiKey] ? (
          <div>
            {isEditing ? (
              <div>
                <div className="mt-[10px]">
                  <span className="flex flex-row">
                    API Key
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                      {errors.apiKey?.message}
                    </p>
                  </span>
                  <input
                    disabled={isLoading}
                    className="mt-[10px] h-[30px] w-[200px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:w-[250px] lg:w-[350px] xl:w-[400px] 2xl:h-[40px] 2xl:w-[500px]"
                    type="text"
                    maxLength={500}
                    placeholder=""
                    {...register('apiKey')}
                  />
                </div>

                <div
                  onClick={handleSubmit(onSubmit)}
                  className={`${
                    isLoading
                      ? 'bg-[#4b83ec]'
                      : 'bg-[#0354EC] hover:bg-[#0e2e69]'
                  } mb-[20px] mt-[25px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] px-[20px] py-[5px] text-center text-[12px] font-medium text-[#fff] 2xl:mt-[40px] 2xl:gap-x-[10px] 2xl:px-[30px] 2xl:py-[6px] 2xl:text-[14px]`}
                >
                  <div>Connect</div>
                </div>
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
              </div>
            ) : (
              <div className="mb-[10px] mt-[25px] grid gap-y-[20px] md:mt-[30px] lg:mt-[35px] xl:mt-[40px] 2xl:mt-[50px]">
                <div className="text-[16px] text-[#12AD50] 2xl:text-[21px]">
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
                {userApiKey === 'aivenAPIKey' && (
                  <div className="mt-[25px]">
                    {user.aivenAPIServiceUriParams}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mt-[10px]">
              <span className="flex flex-row">
                API Key
                <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
                  {errors.apiKey?.message}
                </p>
              </span>
              <div className="flex gap-x-[20px]">
                <input
                  disabled={isLoading}
                  className="mt-[10px] h-[30px] w-[200px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0 md:w-[250px] lg:w-[350px] xl:w-[400px] 2xl:h-[40px] 2xl:w-[500px]"
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

            <div
              onClick={handleSubmit(onSubmit)}
              className={`${
                isLoading ? 'bg-[#4b83ec]' : 'bg-[#0354EC] hover:bg-[#0e2e69]'
              } mb-[20px] mt-[25px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] px-[20px] py-[5px] text-center text-[12px] font-medium text-[#fff] 2xl:mt-[40px] 2xl:gap-x-[10px] 2xl:px-[30px] 2xl:py-[6px] 2xl:text-[14px]`}
            >
              <div>Connect</div>
            </div>
          </div>
        )}
      </div>
      {/* <GetEquinixAPIKey isOpen={isCreatingNewChannel} onClose={closeModal} /> */}
    </div>
  )
}

export default DataProductAPIConnection
