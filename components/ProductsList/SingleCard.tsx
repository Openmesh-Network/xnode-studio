/* eslint-disable no-unused-vars */
'use client'

import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { DataProvider } from '@/types/dataProvider'

import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/navigation'
import { optionServerLocation } from '@/utils/constants'
import { prefix } from '@/utils/prefix'

export const categoriesOptionsRPC = {
  ValidationCloud: '/images/subNavBarRPC/validateCloud.svg',
  NodeReal: '/images/subNavBarRPC/node.svg',
}

export const categoriesOptionsUtility = {
  Grafana: '/images/subNavBarUtility/grafana.svg',
  Prometheus: '/images/subNavBarUtility/prometheus.svg',
  Ascend: '/images/subNavBarUtility/ascend.svg',
  Databricks: '/images/subNavBarUtility/prometheus.svg',
  InfraAdmin: '/images/subNavBarAnalytics/databricks.svg',
}

const SingleCard = ({
  id,
  name,
  description,
  createdAt,
  company,
  sql,
  logoURL,
  tags,
  updatedAt,
  live,
  download,
  isThirdParty,
  addToXnodeMessage,
}: DataProvider) => {
  let timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
  timeAgo = timeAgo.replace('about', '').trim()

  const [addVisible, setAddVisible] = useState<Boolean>(false)
  const [isLoading, setIsLoading] = useState<Boolean>(false)

  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    setChangeNodes,
  } = useContext(AccountContext)

  const { push } = useRouter()

  const serverOptions = ['Equinix', 'AWS']
  const rpcOptions = ['Validationcloud', 'NodeReal']
  const dataOptions = [
    'Binance',
    'Coinbase',
    'Bybit',
    'Bitfinex',
    'Kraken',
    'Ethereum',
  ]

  // Implement workflwo to add a product into the workspace, first check if already has a localstorage with savedNodes, then add the new node
  function handleAddProduct(title: string) {
    console.log('aqui a minha url nmow')
    console.log(logoURL)

    setIsLoading(true)
    let finalNodes = []
    const savedNodes = localStorage.getItem('nodes')

    if (savedNodes) {
      finalNodes = JSON.parse(savedNodes)
    }

    if (serverOptions.includes(title)) {
      const nodeExists = finalNodes.some((node) => node.type === 'server')

      if (!nodeExists) {
        const productToAdd = {
          id: uuidv4(),
          type: 'server',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            defaultValueServerType: `Medium c2.x86 x 1`,
            defaultValueLocation: optionServerLocation[0],
            defaultValueCloudProvider: title,
          },
        }
        finalNodes.push(productToAdd)
        localStorage.setItem('nodes', JSON.stringify(finalNodes))
        setNext(true)
        push(
          `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
        )
      } else {
        toast.error('You cannot add more than one server per x-node')
      }
    } else if (rpcOptions.includes(title)) {
      const nodeExists = finalNodes.some((node) => node.data.name === title)

      if (!nodeExists) {
        const productToAdd = {
          id: uuidv4(),
          type: 'rpc',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            name: title,
            icon: categoriesOptionsRPC[title],
          },
        }
        finalNodes.push(productToAdd)
        localStorage.setItem('nodes', JSON.stringify(finalNodes))
        setNext(true)
        push(
          `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
        )
      } else {
        toast.error('You already have this product in your x-node')
      }
    } else if (dataOptions.includes(title)) {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/workspace`
            : `/workspace`
        }`
      )
    } else {
      const nodeExists = finalNodes.some((node) => node.data.name === title)

      if (!nodeExists) {
        const productToAdd = {
          id: uuidv4(),
          type: 'utility',
          position: { x: 670, y: 500 },
          data: {
            selects: {
              'handle-0': 'smoothstep',
              'handle-1': 'smoothstep',
            },
            title: 'Data Pipeline Automation',
            name: title,
            icon: categoriesOptionsUtility[title],
          },
        }
        finalNodes.push(productToAdd)
        localStorage.setItem('nodes', JSON.stringify(finalNodes))
        setNext(true)
        push(
          `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
        )
      } else {
        toast.error('You already have this product in your x-node')
      }
    }
    setIsLoading(false)
  }

  return (
    <div
      onMouseEnter={() => setAddVisible(true)}
      onMouseLeave={() => setAddVisible(false)}
      className="flex justify-start gap-x-[10px] rounded-[5px] border-[0.5px] border-[#D9D9D9] px-[7px] py-[15px] text-start text-black shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] md:max-w-[600px] lg:p-[21px] xl:gap-x-[20px] xl:p-[24px] 2xl:max-w-[1000px] 2xl:gap-x-[25px] 2xl:p-[30px]"
    >
      <div className="grow-1 size-[52px] 2xl:size-[64px]">
        {logoURL ? (
          <img
            src={
              logoURL.startsWith('https://') ? logoURL : `${prefix}${logoURL}`
            }
            alt="image"
            className={`mx-auto flex rounded-[5px] p-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]`}
          />
        ) : (
          <img
            src={`${prefix}/openmesh-ico-logo.png`}
            alt="image"
            className={`mx-auto flex size-[25px] rounded-[5px] p-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] lg:size-[30px] lg:p-[7px] xl:size-[40px]`}
          />
        )}

        {isThirdParty && (
          <div className="mx-auto mt-[7px] flex justify-center xl:mt-[8px] 2xl:mt-[10px]">
            <img
              src={`${prefix}/images/dataset/third.svg`}
              alt="image"
              className={`w-[46.5] 2xl:w-[58px]`}
            />
          </div>
        )}
        {!isThirdParty && (
          <div className="mx-auto mt-[4px] flex justify-center text-[7px] font-semibold text-[#12AD50] lg:!leading-[17px] xl:mt-[8px] xl:text-[11px] 2xl:mt-[10px] 2xl:text-[14px]">
            Free
          </div>
        )}
      </div>
      <div className="grow-0">
        <div>
          <div className="flex gap-x-[5px] lg:gap-x-[8px] 2xl:gap-x-[10px]">
            <a
              href={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? `/xnode/data-product/${id}`
                  : `data-product/${id}`
              }`}
            >
              <div
                className={`text-[10px] font-bold text-[#313131] hover:text-black hover:underline md:text-[12px] lg:text-[14px] lg:!leading-[22px] 2xl:text-[18px]`}
              >
                {name}
              </div>
            </a>
            <div className="h-fit rounded-[5px] border border-[#FFC946] bg-[#FFE9B2] px-[4px] py-[2] text-[5px] font-semibold lg:px-[5px] lg:py-[4px] lg:text-[8px] 2xl:px-[7px] 2xl:py-[5px] 2xl:text-[10px] 2xl:!leading-[12px]">
              NEW!
            </div>
            {addToXnodeMessage === 'Add to Xnode' ? (
              <div className="ml-auto flex">
                {isLoading ? (
                  <div className="">
                    <div className="size-8 animate-spin rounded-full border-b-2 border-[#0354EC]"></div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      handleAddProduct(name)
                      // window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`ml-auto flex cursor-pointer rounded-[5px] bg-[#0354EC] px-[7px] py-[3px] text-[6.5px] font-medium text-white hover:bg-[#123981] md:text-[7px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]`}
                  >
                    <div>Add</div>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => {
                  // setNext(true)
                  // window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`ml-auto flex rounded-[5px] bg-[#B4B7BB] px-[7px] py-[3px] text-[6.5px] font-medium text-white md:text-[7px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]`}
              >
                <div>Soon</div>
              </div>
            )}
          </div>
          <div className="lg::mt-[8px] mt-[5px] text-[8px] font-semibold text-[#505050] lg:text-[13px] lg:!leading-[19px] 2xl:mt-[10px] 2xl:text-[16px]">
            {company} •{' '}
            <span className="text-[7px] font-medium lg:text-[11px] 2xl:text-[14px]">
              Updated {timeAgo}
            </span>
          </div>

          <div
            title={description}
            className="mt-[8px] line-clamp-3 overflow-hidden text-[8px] font-medium text-[#959595] md:text-[10px] lg:mt-[12px] lg:text-[12px] lg:!leading-[19px] xl:max-w-[480px] 2xl:mt-[15px] 2xl:max-w-[600px] 2xl:text-[16px]"
          >
            {description}
          </div>
          <div className="mt-[10px] flex max-w-[800px] flex-wrap gap-x-[5px] gap-y-[3px] lg:gap-[10px] 2xl:mt-[12px]">
            {tags &&
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="w-fit rounded-[20px] border border-[#D9D9D9] bg-[#F6F6F6] px-[7px] py-[4px] text-[5px] font-medium text-[#575757] md:text-[8px] lg:px-[12px] lg:py-[6px] lg:!leading-[12px] 2xl:px-[15px] 2xl:py-[7px] 2xl:text-[10px]"
                >
                  {tag}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCard
