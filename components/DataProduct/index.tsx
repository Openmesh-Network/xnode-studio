'use client'

import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-toastify/dist/ReactToastify.css'

import { getData } from '@/utils/data'
import Prism from 'prismjs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'sql-formatter'

import { DataProvider } from '@/types/dataProvider'

import 'prismjs/themes/prism.css'

import { AccountContext } from '@/contexts/AccountContext'
import { prefix } from '@/utils/prefix'
import { differenceInDays, formatDistanceToNow } from 'date-fns'

import DataProductAPIConnectionMain from './modals/DataProductAPIConnectionMain'

const DataProduct = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<DataProvider>()
  const [tasksSearchBar, setTasksSearchBar] = useState('')
  const { user, setUser } = useContext(AccountContext)

  const { push } = useRouter()

  const getDataInfo = useCallback(async (id: any) => {
    try {
      const res = await getData(id)
      setData(res)
    } catch (err) {
      toast.error(`An error occurred`)
      //   push('/community')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    if (id) {
      getDataInfo(id.id)
    } else {
      push(
        `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
      )
    }
  }, [getDataInfo, id, push])

  let formattedSQL
  let formattedCode
  if (data?.sql) {
    formattedSQL = format(data?.sql || '', {
      tabWidth: 4,
      linesBetweenQueries: 4,
    })

    formattedCode = Prism.highlight(
      data?.sql,
      Prism.languages.javascript,
      'javascript'
    )
  }

  function transformText(text) {
    return text.replace(/\s+/g, ' ').trim()
  }

  function calculateUpdateTime(updatedAt: Date) {
    const timeAgo = formatDistanceToNow(new Date(updatedAt), {
      addSuffix: true,
    })
    return timeAgo
  }

  function isNew(createdAt: Date): boolean {
    const today = new Date()
    const difference = differenceInDays(today, new Date(createdAt))
    return difference <= 7
  }

  const dataJson = {
    'Established data': data?.createdAt,
    'Size of the data': '124 TB',
    Coverage: 'Spots, futures',
    Size: '124 TB',
    'File formats': 'JSON, CVS',
    'Scheme type': 'JSON, CVS',
  }

  const dataHelp = {
    Overview:
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/dV24UPM1pxtu3arLSfCk/getting-started/about-openmesh',
    Github: 'https://github.com/L3A-Protocol',
    'Supported Feeds and Symbols':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/supported-feeds-and-symbols',
    'Schema Reference':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/schema-reference',
    'Query Service':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/query-service/overview',
    'Data Flow':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/infrastructure/data-flow',
  }

  const dataJsonDetails = [
    [
      'AAVE.USDT-PERP',
      'L2 LOB, Ticker, Funding rate',
      'HFDSAFHASFHASFHA#',
      '23MB',
    ],
    [
      'AAVE.USDT-PERP',
      'L2 LOB, Ticker, Funding rate',
      'HFDSAFHASFHASFHA#',
      '23MB',
    ],
    [
      'AAVE.USDT-PERP',
      'L2 LOB, Ticker, Funding rate',
      'HFDSAFHASFHASFHA#',
      '23MB',
    ],
    [
      'AAVE.USDT-PERP',
      'L2 LOB, Ticker, Funding rate',
      'HFDSAFHASFHASFHA#',
      '23MB',
    ],
    [
      'AAVE.USDT-PERP',
      'L2 LOB, Ticker, Funding rate',
      'HFDSAFHASFHASFHA#',
      '23MB',
    ],
    [
      'AAVE.USDT-PERP',
      'L2 LOB, Ticker, Funding rate',
      'HFDSAFHASFHASFHA#',
      '23MB',
    ],
  ]

  const dataJsonSimilarProducts = [
    [
      '1213213213-213213213-12312312-3213123',
      'Economy Data Atlas',
      'Coinbase#',
    ],
    [
      '1213213213-213213213-12312312-3213123',
      'Economy Data Atlas',
      'Coinbase#',
    ],
    [
      '1213213213-213213213-12312312-3213123',
      'Economy Data Atlas',
      'Coinbase#',
    ],
  ]

  const customStyle = {
    ...solarizedlight,
    'pre[class*="language-"]': {
      ...solarizedlight['pre[class*="language-"]'],
      backgroundColor: '#f8f8f8', // Cor de fundo preta
      width: '100%', // Ajustando a largura para 100%
      overflowX: 'auto', // Adicionando barra de rolagem se o conteúdo exceder a largura
      border: '1px solid #d8d6d6',
    },
  }

  const copyToClipboard = () => {
    if (data) {
      navigator.clipboard.writeText(data?.sql)
    }
  }

  const handleSearchBarInput = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const value = input.value

    if (tasksSearchBar.length + value.length > 100) {
      return
    }

    setTasksSearchBar(value)

    if (value === '') {
      updateUrl('searchBar', value)
    }
  }

  const updateUrl = (param: string, value: string | null) => {
    if (param !== 'page') {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
      }
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (value) {
        url.searchParams.set(param, value)
        push(
          `${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode?searchBar=${value}`
              : `?searchBar=${value}`
          }`
        )
      } else {
        url.searchParams.delete(param)
      }

      window.history.pushState({}, '', url.toString())
    }
  }

  const dataHelpDynamic = {
    'Developer Docs': data?.linkDevelopersDocs,
    Products: data?.linkProducts,
    Careers: data?.linkCareers,
    Twitter: data?.linkTwitter,
    Contact: data?.linkContact,
    'About Us': data?.linkAboutUs,
    Medium: data?.linkMedium,
    Linkedin: data?.linkLinkedin,
    Github: data?.linkGithub,
  }

  if (isLoading) {
    return (
      <section className="px-[30px] pb-[50px] pt-[46px] text-black md:pl-[90px] md:pr-[130px] lg:min-w-[800px] xl:min-w-[1200px] 2xl:min-w-[1200px]">
        <div className="container hidden h-60 animate-pulse px-0 pb-12 md:flex">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="container h-60 animate-pulse px-0 pb-12 md:hidden">
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[20px] h-32 w-full animate-pulse bg-[#dfdfdf]"></div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[1600px] px-[20px] pb-[100px] sm:pl-[25px] md:flex md:justify-between md:px-[50px] md:pl-[30px] lg:px-[60px] xl:px-[80px] xl:pl-[40px] 2xl:px-[100px] 2xl:pl-[50px]">
        <div>
          <div className="mt-[40px] flex h-[32px] min-w-[150px] max-w-[250px] rounded-[5px] border border-[#D9D9D9] bg-white px-[5px] md:h-[40px] md:max-w-[500px] md:px-[15px] md:py-[10px] lg:!leading-[30px] 2xl:mt-[50px] 2xl:h-[50px] 2xl:max-w-[600px]">
            <img
              src={`${prefix}/images/hero/searchVector.svg`}
              alt="image"
              onClick={() => {
                updateUrl('searchBar', tasksSearchBar)
              }}
              className={`my-auto mr-[10px] cursor-pointer transition-transform hover:scale-110 md:size-[18px]`}
            />
            <input
              type="text"
              placeholder="Search Data Products"
              onInput={handleSearchBarInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  updateUrl('searchBar', tasksSearchBar)
                }
              }}
              className="w-full bg-white text-[8px] font-medium text-black outline-none placeholder:text-[#737373] md:text-[14px] 2xl:text-[16px]"
            />
          </div>
          <div className="pl-[10px] md:pl-[12px] lg:pl-[14px] xl:pl-[16px] 2xl:pl-[20px]">
            <div className="flex gap-x-[11px] pt-[40px] md:gap-x-[13px] md:pt-[56px] lg:gap-x-[16px] lg:pt-[65px] xl:gap-x-[18px] xl:pt-[74px] 2xl:gap-x-[23px] 2xl:pt-[94px]">
              <div className="">
                {data?.logoURL ? (
                  <img
                    src={`${data?.logoURL}`}
                    alt="image"
                    className={`mx-auto flex size-[30px] rounded-[5px] p-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] lg:size-[40px] lg:p-[7px] 2xl:size-[77px]`}
                  />
                ) : (
                  <img
                    src={`${prefix}/openmesh-ico-logo.png`}
                    alt="image"
                    className={`mx-auto flex size-[30px] rounded-[5px] p-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] lg:size-[40px] lg:p-[7px] 2xl:size-[77px]`}
                  />
                )}
                {data?.isThirdParty && (
                  <div className="mx-auto mt-[7px] flex justify-center xl:mt-[12px] 2xl:mt-[15px]">
                    <img
                      src={`${prefix}/images/dataset/third.svg`}
                      alt="image"
                      className={`w-[46.5] 2xl:w-[58px]`}
                    />
                  </div>
                )}
                {data?.free && (
                  <div className="mx-auto mt-[7px] flex justify-center text-[7px] font-semibold text-[#12AD50] lg:!leading-[17px] xl:mt-[12px] xl:text-[11px] 2xl:mt-[15px] 2xl:text-[14px]">
                    Free
                  </div>
                )}
              </div>
              <div>
                <div>
                  <div className="flex gap-x-[10px] pt-[4px] text-[#313131] lg:gap-x-[12px] lg:pt-[6px] 2xl:gap-x-[23px] 2xl:pt-[8px]">
                    <div className="text-[12px] font-bold md:text-[14px] lg:text-[16px] xl:text-[19px] xl:!leading-[29px] 2xl:text-[24px]">
                      {data?.name}
                    </div>
                    {isNew(data?.createdAt) && (
                      <div className="mb-[2px] mt-auto h-fit rounded-[5px] border border-[#FFC946] bg-[#FFE9B2] px-[4px] py-[2px] text-[5px] font-semibold text-black lg:px-[5px] lg:text-[6px] xl:mt-0 xl:py-[4px] xl:text-[8px] 2xl:px-[7px] 2xl:py-[5px] 2xl:text-[10px] 2xl:!leading-[12px]">
                        NEW!
                      </div>
                    )}
                  </div>
                  <div className="mt-[2px] text-[8px] font-semibold text-[#505050] md:text-[11px] lg:text-[11px] lg:!leading-[19px] xl:mt-[6px] xl:text-[13px] 2xl:mt-[7px] 2xl:text-[16px]">
                    {data?.company}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[18px] max-w-[357px] text-[8px] font-medium text-[#959595] md:mt-[26px] md:max-w-[430px] md:text-[10px] lg:mt-[29px] lg:max-w-[500px] lg:text-[11px] lg:!leading-[19px] xl:max-w-[572px] xl:text-[13px] 2xl:mt-[37px] 2xl:max-w-[715px] 2xl:text-[16px]">
              {data?.description}
            </div>
            <div className="mt-[20px] text-[8px] font-bold text-[#959595] md:mt-[37px] md:text-[10px] lg:mt-[43px] lg:text-[12px] lg:!leading-[19px] 2xl:mt-[54px] 2xl:text-[16px]">
              Tags
            </div>
            <div className="mt-[10px] flex max-w-[800px] flex-wrap gap-x-[5px] gap-y-[3px] md:mt-[14px] lg:mt-[16px] lg:gap-[10px] 2xl:mt-[20px]">
              {data?.tags &&
                data?.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="w-fit max-w-[500px] rounded-[20px] border border-[#D9D9D9] bg-[#F6F6F6] px-[7px] py-[4px] text-[5px] font-medium text-[#575757] md:text-[8px] lg:px-[12px] lg:py-[6px] lg:!leading-[12px] 2xl:px-[15px] 2xl:py-[7px] 2xl:text-[10px]"
                  >
                    {tag}
                  </div>
                ))}
            </div>
            <div className="mt-[20px] text-[8px] font-bold text-[#959595] md:mt-[36px] md:text-[10px] lg:mt-[42px] lg:text-[12px] lg:!leading-[19px] 2xl:mt-[52px] 2xl:text-[16px]">
              Use cases
            </div>
            <div className="mt-[10px] flex max-w-[800px] flex-wrap gap-x-[5px] gap-y-[3px] md:mt-[14px] lg:mt-[16px] lg:gap-[10px] 2xl:mt-[20px]">
              {data?.useCases &&
                data?.useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="w-fit max-w-[500px] rounded-[20px] border border-[#D9D9D9] bg-[#F6F6F6] px-[7px] py-[4px] text-[5px] font-medium text-[#575757] md:text-[8px] lg:px-[12px] lg:py-[6px] lg:!leading-[12px] 2xl:px-[15px] 2xl:py-[7px] 2xl:text-[10px]"
                  >
                    {useCase}
                  </div>
                ))}
            </div>
            {user && <DataProductAPIConnectionMain dataProductId={data?.id} />}
            {data?.specification && (
              <>
                <div className="mt-[26px] text-[8px] font-bold text-[#959595] md:mt-[36px] md:text-[10px] lg:mt-[42px] lg:text-[12px] lg:!leading-[19px] 2xl:mt-[52px] 2xl:text-[16px]">
                  Specification
                </div>
                <div className="mt-[10px] grid grid-cols-[auto,1fr] gap-0 text-[8px] text-[#959595] md:mt-[14px] md:text-[10px] lg:mt-[16px] lg:text-[11px] lg:!leading-[19px] 2xl:mt-[20px] 2xl:text-[13px]">
                  {Object.entries(dataJson).map(
                    ([key, value], index, array) => (
                      <>
                        <div
                          className={
                            index === array.length - 1
                              ? 'border border-r-0 border-[#D9D9D9] p-[20px] py-[10px] pl-[8px] text-left md:py-[20px] md:pr-[120px]'
                              : 'border-b-0 border-l border-r-0 border-t border-[#D9D9D9] p-[20px] py-[10px] pl-[8px] text-left md:py-[20px] md:pr-[120px]'
                          }
                        >
                          {key}
                        </div>
                        <div
                          className={
                            index === array.length - 1
                              ? 'border border-[#D9D9D9] p-[20px] py-[10px] text-left md:py-[20px] md:pl-[30px]'
                              : 'border-x border-b-0 border-t border-[#D9D9D9] p-[20px] py-[10px] text-left md:py-[20px] md:pl-[30px]'
                          }
                        >
                          {String(value)}
                        </div>
                      </>
                    )
                  )}
                </div>
              </>
            )}
            {data?.details && (
              <>
                <div className="mt-[35px] text-[8px] font-bold text-[#959595] md:mt-[53px] md:text-[10px] lg:mt-[60px] lg:text-[12px] lg:!leading-[19px] 2xl:mt-[76px] 2xl:text-[16px]">
                  Details
                </div>
                <div className="mt-[10px] grid grid-cols-3 gap-0 overflow-x-auto text-[8px] text-[#959595] md:mt-[14px] md:grid-cols-[auto,1fr,1fr] md:text-[10px] lg:mt-[16px] lg:text-[11px] lg:!leading-[19px] 2xl:mt-[20px] 2xl:text-[13px]">
                  {dataJsonDetails.map(
                    ([value1, value2, value3, value4], index, array) => (
                      <>
                        <div
                          className={
                            index === array.length - 1
                              ? 'min-w-[100px] border border-r-0 border-[#D9D9D9] p-[10px] pl-[8px] text-left md:p-[20px] md:pr-[60px]'
                              : 'min-w-[100px] border-b-0 border-l border-r-0 border-t border-[#D9D9D9] p-[10px] pl-[8px] text-left md:p-[20px] md:pr-[60px]'
                          }
                        >
                          {value1}
                        </div>
                        <div
                          className={
                            index === array.length - 1
                              ? 'min-w-[100px] border border-r-0 border-[#D9D9D9] p-[10px] text-left md:p-[20px] md:pl-[30px] md:pr-[60px]'
                              : 'min-w-[100px] border-b-0 border-l border-r-0 border-t border-[#D9D9D9] p-[10px] text-left md:p-[20px] md:pl-[30px] md:pr-[60px]'
                          }
                        >
                          {value2}
                        </div>
                        <div
                          className={
                            index === array.length - 1
                              ? 'min-w-[150px] justify-between border border-[#D9D9D9] p-[10px] text-left md:flex md:p-[20px] md:pl-[30px]'
                              : 'min-w-[150px] justify-between border-x border-b-0 border-t border-[#D9D9D9] p-[10px] text-left md:flex md:p-[20px] md:pl-[30px]'
                          }
                        >
                          <div>{value3}</div>
                          <div>{value4}</div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </>
            )}

            {data?.sql && (
              <div className="">
                <div className="mt-[35px] flex justify-between text-[8px] font-bold text-[#959595] md:mt-[53px] md:text-[10px] lg:mt-[60px] lg:text-[12px] lg:!leading-[19px] 2xl:mt-[76px] 2xl:text-[16px]">
                  <div className="">Query</div>
                  <img
                    src={`${prefix}/images/dataset/copy.svg`}
                    alt="image"
                    onClick={copyToClipboard}
                    className="size-[10px] cursor-pointer md:size-[22px]"
                  />
                </div>
                {data?.sql && (
                  <div className="overflow-auto 2xl:mt-[17px]">
                    <SyntaxHighlighter language="sql" style={customStyle}>
                      {data?.sql}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="pt-[35px] md:pt-[96px] lg:pt-[112px] xl:pt-[128px] 2xl:pt-[160px]">
          <div className="grid gap-y-[35px] md:gap-y-[25px]">
            {data?.download && (
              <div className="items-center rounded-[5px] border-[0.5px] border-[#D9D9D9] px-[27px] pb-[16px] pt-[15px] text-center shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] md:px-[10px] md:pb-[26px] md:pt-[21px] lg:px-[20px] lg:pb-[32px] lg:pt-[24px] xl:px-[40px] xl:pb-[52px] 2xl:px-[58px] 2xl:pb-[66px] 2xl:pt-[30px]">
                <div className="flex justify-center gap-x-[7px]">
                  <img
                    src={`${prefix}/images/dataset/ellipse-grey.svg`}
                    alt="image"
                  />
                  <div className="text-[9px] font-medium text-[#2E2E2E] md:text-[12px] lg:text-[14px] lg:!leading-[22px] 2xl:text-[18px]">
                    Historical
                  </div>
                </div>
                <div className="mt-[12.5px] text-[7px] font-semibold text-[#B7B7B7] md:mt-[17.5px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[17px] 2xl:mt-[25px] 2xl:text-[14px]">
                  REST APIs
                </div>
                <div className="mt-[12.5px] w-full bg-[#F2F2F2] p-[5px] text-[9px] font-medium text-[#505050] md:mt-[17.5px] md:text-[12px] lg:mt-[20px] lg:text-[14px] lg:!leading-[22px] 2xl:mt-[25px] 2xl:text-[18px]">
                  {data?.dataSpace}
                </div>
                <a
                  href={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? `/xnode/${data?.downloadCSVLink}`
                      : `${data?.downloadCSVLink}`
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="mx-auto mt-[12.5px] flex w-fit cursor-pointer justify-center gap-x-[10px] rounded-[5px] bg-black px-[9px] py-[8px] text-[9px] font-medium text-white hover:bg-[#1f1f1f] md:mt-[17.5px] md:w-full md:px-[13px] md:py-[11px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[19px] xl:text-[14px] 2xl:mt-[25px] 2xl:px-[17px] 2xl:py-[14.5px] 2xl:text-[16px]">
                    <div>Download .csv </div>
                    <img
                      src={`${prefix}/images/dataset/download.svg`}
                      alt="image"
                    />
                  </div>
                </a>
              </div>
            )}
            {data?.isThirdParty && (
              <div className="items-center rounded-[5px] border-[0.5px] border-[#D9D9D9] px-[15px] pb-[47px] pt-[33px] text-center shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] md:px-[21px] md:pb-[56px] md:pt-[40px] lg:px-[20px] lg:pb-[65px] lg:pt-[46px] xl:px-[48px] xl:pb-[75px] xl:pt-[53px] 2xl:px-[60px] 2xl:pb-[93px] 2xl:pt-[66px]">
                <div className="text-[7px] font-semibold text-[#B7B7B7] md:text-[10px] lg:text-[12px] lg:!leading-[17px] 2xl:text-[14px]">
                  3rd Party Intergration
                </div>
                {data?.addToXnodeMessage === 'Add to Xnode' ? (
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? `/xnode/${data?.liveLink}`
                        : `${data?.liveLink}`
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="mx-auto mt-[12.5px] flex w-fit max-w-[179px] cursor-pointer justify-center gap-x-[10px] rounded-[5px] bg-[#0354EC] px-[8px] py-[5px] text-[8px] font-medium text-white hover:bg-[#2061d8] md:mt-[17.5px] md:w-full md:px-[11px] md:py-[7px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[19px] xl:px-[16.5px] xl:py-[11.6px] xl:text-[14px] 2xl:mt-[25px] 2xl:px-[20.5px] 2xl:py-[14.5px] 2xl:text-[16px]">
                      <div>Add to Xnode</div>
                      <img
                        src={`${prefix}/images/dataset/bolas.svg`}
                        alt="image"
                        className="my-auto w-[12px] xl:w-[13.6px] 2xl:w-[17px]"
                      />
                    </div>
                  </a>
                ) : (
                  <div className="mx-auto mt-[12.5px] flex w-fit max-w-[179px] justify-center gap-x-[10px] rounded-[5px] bg-[#8f8e8e] px-[8px] py-[5px] text-[8px] font-medium text-white md:mt-[17.5px] md:w-full md:px-[11px] md:py-[7px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[19px] xl:px-[16.5px] xl:py-[11.6px] xl:text-[14px] 2xl:mt-[25px] 2xl:px-[20.5px] 2xl:py-[14.5px] 2xl:text-[16px]">
                    <div>Coming Soon...</div>
                  </div>
                )}

                <a href={`${data?.website}`} target="_blank" rel="noreferrer">
                  <div className="mt-[12.5px] text-[7px] font-semibold text-[#B7B7B7] underline underline-offset-1 hover:text-[#a3a3a3] md:mt-[17.5px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[17px] 2xl:mt-[25px] 2xl:text-[14px]">
                    Website
                  </div>
                </a>
              </div>
            )}
            {data?.live && (
              <div className="items-center rounded-[5px] border-[0.5px] border-[#D9D9D9] px-[15px] pb-[16px] pt-[15px] text-center shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] md:px-[21px] md:pb-[26px] md:pt-[21px] lg:px-[20px] lg:pb-[32px] lg:pt-[24px] xl:px-[40px] xl:pb-[52px] 2xl:px-[30px] 2xl:pb-[66px] 2xl:pt-[30px]">
                <div className="flex justify-center gap-x-[7px]">
                  <img
                    src={`${prefix}/images/dataset/ellipse-green.svg`}
                    alt="image"
                  />
                  <div className="text-[9px] font-medium text-[#2E2E2E] md:text-[12px] lg:text-[14px] lg:!leading-[22px] 2xl:text-[18px]">
                    Live
                  </div>
                </div>
                <div className="mt-[12.5px] text-[7px] font-semibold text-[#B7B7B7] md:mt-[17.5px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[17px] 2xl:mt-[25px] 2xl:text-[14px]">
                  Base Endpoint
                </div>
                <div className="mt-[12.5px] w-full bg-[#F2F2F2] p-[5px] text-[8px] font-medium text-[#505050] md:mt-[17.5px] md:text-[11px] lg:mt-[20px] lg:text-[13px] lg:!leading-[21px] 2xl:mt-[25px] 2xl:text-[16px]">
                  {data?.liveLink}
                </div>
                <a
                  href={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? `/xnode/${data?.liveLink}`
                      : `${data?.liveLink}`
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="mx-auto mt-[12.5px] flex w-fit max-w-[179px] cursor-pointer justify-center gap-x-[10px] rounded-[5px] bg-[#0354EC] px-[8px] py-[5px] text-[8px] font-medium text-white hover:bg-[#2061d8] md:mt-[17.5px] md:w-full md:px-[11px] md:py-[7px] md:text-[10px] lg:mt-[20px] lg:text-[12px] lg:!leading-[19px] xl:text-[14px] 2xl:mt-[25px] 2xl:px-[15px] 2xl:py-[10px] 2xl:text-[16px]">
                    <div>Free to Access </div>
                    <img
                      src={`${prefix}/images/dataset/arrow.svg`}
                      alt="image"
                      className="my-auto size-[9px] md:h-[15px] md:w-[15.4px]"
                    />
                  </div>
                </a>
              </div>
            )}
          </div>
          <div className="mt-[35px] justify-center text-[7px] font-medium text-[#959595] md:mt-[35px] md:text-[10px] lg:mt-[40px] lg:text-[11px] lg:!leading-[17px] 2xl:mt-[51px] 2xl:text-[14px]">
            {data?.dataCloudName && data?.dataCloudName && (
              <a
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/xnode/${data?.dataCloudLink}`
                    : `${data?.dataCloudLink}`
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0354EC]"
              >
                <div className="flex items-center justify-center gap-x-[15px]">
                  <img src={`${prefix}/images/dataset/cloud.svg`} alt="image" />
                  <div>{data?.dataCloudName}</div>
                </div>
              </a>
            )}
            {data?.dataGithubLink && data?.dataGithubName && (
              <a
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/xnode/${data?.dataGithubLink}`
                    : `${data?.dataGithubLink}`
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0354EC]"
              >
                <div className="mt-[12px] flex items-center justify-center gap-x-[15px] md:mt-[16px] 2xl:mt-[24px]">
                  <img
                    src={`${prefix}/images/dataset/github.svg`}
                    alt="image"
                  />
                  <div>{data?.dataGithubName}</div>
                </div>
              </a>
            )}
            {data?.location && (
              <div className="mt-[12px] flex items-center justify-center gap-x-[15px] md:mt-[16px] 2xl:mt-[24px]">
                <img
                  src={`${prefix}/images/dataset/pin.svg`}
                  className="w-[12px] md:w-[14.5px] lg:w-[17px] xl:w-[19px] 2xl:w-[24px]"
                  alt="image"
                />
                <div>{data?.location}</div>
              </div>
            )}
            {data?.foundingYear && (
              <div className="mt-[12px] flex items-center justify-center gap-x-[15px] md:mt-[16px] 2xl:mt-[24px]">
                <img
                  src={`${prefix}/images/dataset/house.svg`}
                  className="w-[8px] md:w-[9px] lg:w-[10px] xl:w-[13px] 2xl:w-[16px]"
                  alt="image"
                />
                <div>{data?.foundingYear}</div>
              </div>
            )}
          </div>
          <div className="mx-auto mt-[35px] grid max-w-[230px] justify-center rounded-[5px] border-[0.5px] border-[#D9D9D9] bg-[#F9F9F9] p-[15px] text-center md:mt-[54px] md:px-[21px] md:py-[7px] lg:mt-[63px] lg:px-[24px] lg:py-[8px] xl:mt-[72px] 2xl:mt-[90px] 2xl:px-[30px] 2xl:py-[10px]">
            <img
              src={`${prefix}/images/dataset/pythia.png`}
              alt="image"
              className="mx-auto"
            />
            <div className="mt-[8px] max-w-[170px] justify-center text-center text-[6px] font-normal text-[#959595] md:mt-[10px] md:text-[8px] lg:mt-[12px] lg:text-[9px] lg:!leading-[15px] 2xl:mt-[15px] 2xl:text-[12px]">
              Build data products like this? Try our Open source query engine &
              data develop platform
            </div>
            <a
              href="https://query.tech.l3a.xyz/search/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="mx-auto mt-[12px] flex w-fit cursor-pointer gap-x-[10px] rounded-[5px] bg-[#0354EC] px-[8px] py-[3px] text-[8px] font-medium text-white hover:bg-[#2061d8] md:mt-[10px] md:px-[11px] md:py-[4px] md:text-[7px] lg:mt-[12px] lg:text-[8px] lg:!leading-[19px] 2xl:mt-[15px] 2xl:px-[15px] 2xl:py-[6.5px] 2xl:text-[10px]">
                <div>Try Now</div>
                <img
                  src={`${prefix}/images/dataset/arrow.svg`}
                  alt="image"
                  className="my-auto size-[9px] md:h-[15px] md:w-[15.4px]"
                />
              </div>
            </a>
          </div>
          <div className="mt-[32px] pl-[15px] text-[8px] text-black md:mx-auto md:mt-[44px] md:w-fit md:pl-[14px] md:text-[10px] lg:mt-[50px] lg:pl-[16px] lg:text-[11px] lg:!leading-[200%] xl:text-[13px] 2xl:mt-[63px] 2xl:pl-[20px] 2xl:text-[16px]">
            <div className="font-bold">Help</div>
            <div className="mt-[5px] grid gap-y-[12px] font-normal">
              {Object.entries(dataHelpDynamic).map(
                ([key, value], index, array) =>
                  value && (
                    <a
                      href={`${`${value}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={index}
                    >
                      <div
                        className={`w-fit cursor-pointer border-b border-black hover:border-[#0354EC] hover:text-[#0354EC] lg:!leading-tight`}
                      >
                        {key}
                      </div>
                    </a>
                  )
              )}
            </div>
          </div>
          <div className="mt-[32px] pl-[15px] md:mx-auto md:mt-[54px] md:w-fit lg:mt-[63px] xl:mt-[72px] 2xl:mt-[90px]">
            <div className="text-[8px] font-bold text-[#959595] md:text-[10px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:text-[16px]">
              Similar data products
            </div>
            <div className="mt-[18px] grid gap-y-[31px] md:mt-[21px] md:gap-y-[37px] lg:mt-[25px] lg:gap-y-[44px] xl:mt-[29px] xl:gap-y-[50px] 2xl:mt-[36px] 2xl:gap-y-[63px]">
              {dataJsonSimilarProducts.map(
                ([value1, value2, value3], index, array) => (
                  <>
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/xnode/dataset/${value1}`
                          : `/dataset/${value1}`
                      }`}
                      className="transition-transform hover:scale-105"
                    >
                      <div className="flex gap-x-[6px] lg:gap-x-[8px] 2xl:gap-x-[12px]">
                        <div className="">
                          <img
                            src={`${prefix}/openmesh-ico-logo.png`}
                            alt="image"
                            className={`mx-auto flex size-[25px] rounded-[5px] p-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] lg:size-[30px] lg:p-[7px] xl:size-[40px] 2xl:size-[48px]`}
                          />
                        </div>
                        <div>
                          <div className="flex h-full items-center">
                            <div className="text-[#313131]">
                              <div className="text-[8px] font-bold md:text-[10px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:text-[16px]">
                                {value2}
                              </div>
                              <div className="mt-[2px] text-[7px] font-semibold text-[#505050] lg:text-[10px] xl:text-[11px] xl:!leading-[17px] 2xl:mt-[4px] 2xl:text-[14px]">
                                {value3}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </>
                )
              )}
            </div>
          </div>
          <div className="mt-[66px] max-w-[240px] pl-[15px] text-[8px] md:mx-auto md:mt-[67px] md:max-w-[220px] md:text-[10px] lg:mt-[78px] lg:text-[12px] xl:mt-[90px] xl:text-[13px] 2xl:mt-[112px] 2xl:text-[16px]">
            <div className="mt-[8px] border-y border-[#D9D9D9] pb-[8px] lg:py-[12px] 2xl:py-[15px]">
              <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
                Suggest a new feature
              </div>
              <div className="lg:!leading-[150%]">
                <a
                  href={'https://www.openmesh.network/oec/register'}
                  target="_blank"
                  className="border-b font-medium text-[#0354EC]"
                  rel="noreferrer"
                >
                  Join our community and let us know what you’d like to add!
                </a>
              </div>
            </div>
            <div className="mt-[8px] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
              <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
                Encounter any issue?
              </div>
              <div className="lg:!leading-[150%]">
                {' '}
                <a
                  href={'https://calendly.com/openmesh/30min'}
                  target="_blank"
                  className="border-b font-medium text-[#0354EC]"
                  rel="noreferrer"
                >
                  Schedule a call with an Openmesh Expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DataProduct
