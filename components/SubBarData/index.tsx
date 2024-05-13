/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react'
import Dropdown from '../Dropdown'
import LatencySelector from '../LatencySelector'
import { title } from 'process'
import { AccountContext } from '@/contexts/AccountContext'
import { categoriesOptions } from '@/utils/constants'

/* eslint-disable react/no-unescaped-entities */
const SubBarData = ({ onValueChange }) => {
  const [presetId, setPresetId] = useState(0)
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    setChangeNodes,
    setRemoveNodes,
    setselectCurrentMenuDataType,
  } = useContext(AccountContext)
  const [selectionSubBar, setSelectionSubBar] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [currentDataMenuSelect, setCurrentDataMenuSelect] =
    useState<string>('Streaming Data')

  const dataUseCase = {
    'Financial Analysis':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/dV24UPM1pxtu3arLSfCk/getting-started/about-openmesh',
    Github: 'https://github.com/L3A-Protocol',
    'Blockchain Transactions':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/supported-feeds-and-symbols',
    'DEXs and CEXs':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/schema-reference',
    'Gas Optimization':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/query-service/overview',
    'Crypto Liquidity':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/infrastructure/data-flow',
  }

  function handleButtonClick(title: string) {
    if (title === selectionSubBar) {
      setSelectionSubBar('')
    } else {
      setSelectionSubBar(title)
    }
  }

  function renderSubOptions(option: any) {
    return (
      <div className="mt-[6.5px] mb-[25px] grid gap-y-[15px] pl-[19px] md:mt-[7.5px] md:mb-[30px] md:gap-y-[18px] md:pl-[22px] lg:mt-[8.5px] lg:mb-[35px] lg:gap-y-[21px] lg:pl-[27px] xl:mt-[10px] xl:mb-[40px] xl:gap-y-[24px] xl:pl-[30px]  2xl:mt-[12px]  2xl:mb-[50px]  2xl:gap-y-[30px] 2xl:pl-[38px]">
        {option.dataOptions.map((dataOption, index) => (
          <div key={index} className="relative flex text-[#000]">
            <div className="flex gap-x-[9px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }${dataOption.icon}`}
                alt="image"
                className={`w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]`}
              />
              <a
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/xnode${dataOption.href}`
                    : `${dataOption.href}`
                }`}
              >
                <div className="cursor-pointer text-[7.5px] font-light text-[#0354EC] underline underline-offset-[2.5px] hover:font-normal md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                  {dataOption.title}
                </div>
              </a>
            </div>
            <div
              onClick={() => {
                if (dataOption.enabled) {
                  setChangeNodes({
                    type:
                      currentDataMenuSelect === 'Historical Data'
                        ? 'dataHistorical'
                        : 'dataStreaming',
                    name: dataOption.title,
                    icon: dataOption.icon,
                    categorie: option.title,
                    dictionary: categoriesOptions,
                  })
                }
              }}
              className={`absolute ${
                dataOption.enabled
                  ? 'cursor-pointer bg-[#0354EC] hover:bg-[#123981]'
                  : 'bg-[#999999]'
              } right-0 -top-[2px]  rounded-[5px] px-[7px] py-[3px]  text-[6.5px] font-medium text-[#fff]   md:text-[7px] lg:py-[2.8px] lg:px-[6px] lg:text-[8.5px] lg:!leading-[15px] xl:py-[3.2px] xl:px-[6.8px] xl:text-[9.5px]  2xl:py-[4px] 2xl:px-[8.5px] 2xl:text-[12px]`}
            >
              <div>Add</div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  useEffect(() => {
    setselectCurrentMenuDataType(currentDataMenuSelect)
  }, [currentDataMenuSelect])
  return (
    <>
      <div className="z-100 relative min-w-[300px] bg-[#fff] px-[18px] py-[29px] pr-[33px] text-[#000] shadow-[0_0px_5px_0px_rgba(0,0,0,0.12)] md:px-[20px] md:py-[34.5px] md:pr-[40px] lg:px-[23px] lg:py-[40px] lg:pr-[47px] xl:px-[27px] xl:py-[45.5px] xl:pr-[54px] 2xl:min-w-[370px] 2xl:py-[57px] 2xl:pl-[33px] 2xl:pr-[67px]">
        {/* <div className="text-[9px] font-bold md:text-[11px] lg:text-[12.5px] xl:text-[14.5px] 2xl:text-[18px]">
          Categories
        </div> */}
        <div className="flex w-full flex-row  text-[12px] 2xl:text-[16px]">
          <button
            onClick={(e) => {
              if (e.target instanceof HTMLElement) {
                setCurrentDataMenuSelect(e.target.innerText)
              }
            }}
            className={`  p-[10px] ${
              currentDataMenuSelect === 'Streaming Data'
                ? `bg-[#E0E0E0]`
                : `bg-[#F5F5F5]`
            }`}
          >
            Streaming Data
          </button>

          <button
            onClick={(e) => {
              if (e.target instanceof HTMLElement) {
                setCurrentDataMenuSelect(e.target.innerText)
              }
            }}
            className={`  p-[10px] ${
              currentDataMenuSelect === 'Historical Data'
                ? `bg-[#E0E0E0]`
                : `bg-[#F5F5F5]`
            }`}
          >
            Historical Data
          </button>
        </div>
        <>
          {currentDataMenuSelect === 'Streaming Data' && (
            <div className="">
              {categoriesOptions.map((option, index) => (
                <div key={index}>
                  <div
                    onClick={() => {
                      if (option.enabled) {
                        handleButtonClick(option.title)
                      }
                    }}
                    className={`relative mt-[14px] flex w-fit ${
                      option.enabled
                        ? 'cursor-pointer hover:text-[#5b5b5b]'
                        : 'text-[#959595]'
                    } ${
                      selectionSubBar === option.title
                        ? 'underline underline-offset-[3px]'
                        : ''
                    }  gap-x-[9px] text-[9px] font-normal  md:mt-[17px] md:text-[10px] lg:mt-[19.5px] lg:text-[11px] lg:!leading-[300%] xl:mt-[22.5px] xl:text-[13px] 2xl:mt-[28px] 2xl:text-[16px]`}
                  >
                    {selectionSubBar === option.title ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/lateralNavBar/seta-baixo.svg`}
                        alt="image"
                        className="flex w-[8px] items-center lg:w-[9px] 2xl:w-[11px]" // Adicionando uma transição de 2 segundos
                      />
                    ) : (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/lateralNavBar/seta-lado.svg`}
                        alt="image"
                        className="flex w-[7px] items-center lg:w-[7px] 2xl:w-[9px]" // Adicionando uma transição de 2 segundos
                      />
                    )}
                    <div>{option.title}</div>
                    {option.isFree && (
                      <div className="absolute -top-[14px] -right-[27px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                        Free
                      </div>
                    )}
                  </div>

                  {selectionSubBar === option.title && renderSubOptions(option)}
                </div>
              ))}
            </div>
          )}
          {currentDataMenuSelect === 'Historical Data' && (
            <div className="">
              {categoriesOptions.map((option, index) => (
                <div key={index}>
                  <div
                    onClick={() => {
                      if (option.enabled) {
                        handleButtonClick(option.title)
                      }
                    }}
                    className={`relative mt-[14px] flex w-fit ${
                      option.enabled
                        ? 'cursor-pointer hover:text-[#5b5b5b]'
                        : 'text-[#959595]'
                    } ${
                      selectionSubBar === option.title
                        ? 'underline underline-offset-[3px]'
                        : ''
                    }  gap-x-[9px] text-[9px] font-normal  md:mt-[17px] md:text-[10px] lg:mt-[19.5px] lg:text-[11px] lg:!leading-[300%] xl:mt-[22.5px] xl:text-[13px] 2xl:mt-[28px] 2xl:text-[16px]`}
                  >
                    {selectionSubBar === option.title ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/lateralNavBar/seta-baixo.svg`}
                        alt="image"
                        className="flex w-[8px] items-center lg:w-[9px] 2xl:w-[11px]" // Adicionando uma transição de 2 segundos
                      />
                    ) : (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/lateralNavBar/seta-lado.svg`}
                        alt="image"
                        className="flex w-[7px] items-center lg:w-[7px] 2xl:w-[9px]" // Adicionando uma transição de 2 segundos
                      />
                    )}
                    <div>{option.title}</div>
                    {option.isFree && (
                      <div className="absolute -top-[14px] -right-[27px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                        Free
                      </div>
                    )}
                  </div>

                  {selectionSubBar === option.title && renderSubOptions(option)}
                </div>
              ))}
            </div>
          )}
        </>

        <a
          href={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode/data-products?category=Data`
              : `/data-products?category=Data`
          }`}
        >
          <div className="mt-[35px] flex w-full justify-center  text-[8px] font-medium hover:text-[#3a3a3a] md:mt-[41px] md:text-[9.6px] lg:mt-[48px]  lg:text-[11.5px] lg:!leading-[300%] xl:mt-[55px] xl:text-[13px] 2xl:mt-[69px] 2xl:text-[16px]">
            View More
          </div>
        </a>
        {/* <div className="mt-[15px] pl-[5px] text-[8px] text-[#000] md:mt-[14px] md:w-fit md:text-[10px] lg:mt-[16px] lg:text-[11px] xl:mt-[18px] xl:text-[13px] 2xl:mt-[23px] 2xl:text-[16px]">
          <div className="font-bold ">Use Cases</div>
          <div className="mt-[7.5px] grid font-normal md:mt-[9px] lg:mt-[10.5px] lg:!leading-[300%] xl:mt-[12px] 2xl:mt-[15px]">
            {Object.entries(dataUseCase).map(([key, value], index, array) => (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
              >
                <div className={`w-fit cursor-pointer hover:text-[#0354EC]`}>
                  {key}
                </div>
              </a>
            ))}
          </div>
        </div> */}
        <div className="mt-[21px] max-w-[110px] text-[9px] md:mt-[25px] md:max-w-[132px] md:text-[10px] lg:mt-[30px]  lg:max-w-[154px]  lg:text-[11px]  xl:mt-[34px] xl:max-w-[176px] xl:text-[13px] 2xl:mt-[43px] 2xl:max-w-[220px] 2xl:text-[16px]">
          <div className="border-b-[1px] border-t-[1px] border-[#D9D9D9] pb-[8px]  pt-[7.5px]  md:pt-[9px] lg:pb-[12px] lg:pt-[10.5px] xl:pt-[12px] 2xl:pb-[15px] 2xl:pt-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Support articles
            </div>
            <div className=" lg:!leading-[150%]">
              <a
                href={'https://www.openmesh.network/oec/register'}
                target="_blank"
                className="border-b-[1px] font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Join our community and let us know what you’d like to add!
              </a>
            </div>
          </div>
          <div className="mt-[8px] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Provide a data source
            </div>
            <div className=" lg:!leading-[150%]">
              {' '}
              <a
                href={
                  'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases'
                }
                target="_blank"
                className="border-b-[1px] font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Run an Xnode today{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubBarData
