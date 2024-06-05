import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

/* eslint-disable react/no-unescaped-entities */
const SubBarUtility = ({ onValueChange }) => {
  const [presetId, setPresetId] = useState(0)
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    setChangeNodes,
  } = useContext(AccountContext)
  const [selectionSubBar, setSelectionSubBar] = useState<string>('')

  const categoriesOptions = [
    {
      title: 'Grafana',
      desc: 'Data Streaming service',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarUtility/grafana.svg',
      pageRef: '/data-product/574434a8-f2ff-4e66-b7ca-798def52725d',
      style: '2xl:w-[21px] xl:w-[17px] lg:w-[14.5px] md:w-[12.6px] w-[10.5px]',
      isFree: true,
      enabled: true,
      thirdParty: false,
      type: 'Observability',
    },
    {
      title: 'Aiven - Grafana',
      desc: 'Data Infrastructure',
      link: 'Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarUtility/aiven.png',
      pageRef: '/data-product/31e30a64-a2c4-4bbe-b4ec-8cc4416c8494',
      style: '2xl:w-[21px] xl:w-[17px] lg:w-[14.5px] md:w-[12.6px] w-[10.5px]',
      isFree: true,
      enabled: true,
      thirdParty: false,
      type: 'Observability',
    },
    {
      title: 'Prometheus',
      desc: 'A node service provider, that provides.',
      link: 'Arbitrum, BNB Chain, Ethereum, Polygon, Multichain, Solana',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      pageRef: '/data-product/84db4ac6-1ebe-443c-b88d-6cb057c08c56',
      src: '/images/subNavBarUtility/prometheus.svg',
      style: '2xl:w-[20px] xl:w-[16px] lg:w-[14px] md:w-[12px] w-[10px]',
      isFree: true,
      enabled: true,
      thirdParty: false,
      type: 'Observability',
    },
    {
      title: 'Ascend',
      desc: "Data Pipeline Automation for building the world's most intelligent data pipelines.",
      link: 'Data Pipeline, Data Engineering,  Propagate Change',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      pageRef: '/data-product/45309a27-a618-4a7e-9321-f2d22a148832',
      src: '/images/subNavBarUtility/ascend.svg',
      style: '2xl:w-[31px] xl:w-[25px] lg:w-[22px] md:w-[19px] w-[16px]',
      isFree: true,
      enabled: true,
      thirdParty: true,
      type: 'Data Pipeline Automation',
    },
    {
      title: 'Databricks',
      desc: 'Combines data warehouses & data lakes into a lakehouse architecture.',
      link: 'Ethereum, Polygon, Avalanche, BNB Chain, Optimism, Arbitrum, Solana',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      pageRef: '/data-product/42cd6280-3c37-4cf2-b53e-ffa6dee2fac6',
      src: '/images/subNavBarAnalytics/databricks.svg',
      style: '2xl:w-[25px] xl:w-[20px] lg:w-[17.5px] md:w-[15px] w-[12.5px]',
      isFree: false,
      enabled: true,
      thirdParty: true,
      type: 'Data Pipeline Automation',
    },
    {
      title: 'InfraAdmin',
      desc: 'One-stop blockchain infrastructure and service provider.',
      link: 'Ethereum, Polygon, Avalanche, BNB Chain, Optimism, Arbitrum, Solana',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      pageRef: '/data-product',
      src: '/images/subNavBarAnalytics/databricks.svg',
      style: '2xl:w-[25px] xl:w-[20px] lg:w-[17.5px] md:w-[15px] w-[12.5px]',
      isFree: false,
      enabled: true,
      thirdParty: true,
      type: 'Admin Tools',
    },
  ]

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
    console.log('nothing')
  }

  function renderOptions(type: string) {
    return (
      <div className="mt-[28px] grid min-w-[220px] gap-y-[35px] md:mt-[33px] md:gap-y-[48px] lg:mt-[40px] lg:gap-y-[40px] xl:mt-[45px] xl:gap-y-[47px] 2xl:mt-[56px] 2xl:min-w-[290px] 2xl:gap-y-[58px]">
        {categoriesOptions
          .filter((option) => option.type === type)
          .map((option, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (option.enabled) {
                    handleButtonClick(option.title)
                  }
                }}
                className={`relative text-[9px] font-normal md:text-[10px] lg:text-[11px] xl:text-[13px] 2xl:text-[16px]`}
              >
                <div
                  className={` ${
                    option.enabled
                      ? 'cursor-pointer hover:text-[#5b5b5b]'
                      : 'text-[#9A9A9A]'
                  } relative flex w-fit gap-x-[7px] md:gap-x-[8.5px] lg:gap-x-[10px] xl:gap-x-[11.2px] 2xl:gap-x-[14px]`}
                >
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }${option.src}`}
                    alt="image"
                    className={option.style} // Adicionando uma transição de 2 segundos
                  />
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? `/xnode${option.pageRef}`
                        : `${option.pageRef}`
                    }`}
                  >
                    <div className="font-semibold">{option.title}</div>
                  </a>
                  {option.isFree && (
                    <div className="absolute right-[-27px] top-[-14px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                      Free
                    </div>
                  )}
                </div>
                <div
                  className={`mt-[9px] ${
                    option.enabled ? 'text-[#000]' : 'text-[#A1A0A0]'
                  } max-w-[103px] font-light md:mt-[11px] md:max-w-[123px] lg:mt-[12.5px] lg:max-w-[145px] xl:mt-[14px] xl:max-w-[165px] 2xl:mt-[18px] 2xl:max-w-[206px]`}
                >
                  {option.desc}
                </div>
                <a href={option.linkRef} target="_blank" rel="noreferrer">
                  <div
                    className={`mt-[5.5px] ${
                      option.enabled
                        ? 'text-[#0354EC] hover:text-[#0243bd]'
                        : 'text-[#B0B0B0]'
                    } max-w-[120px] text-[6px] font-light md:mt-[6.6px] md:max-w-[144px] md:text-[7.2px] lg:mt-[6.7px] lg:max-w-[192px] lg:text-[8.4px] lg:!leading-[150%] xl:mt-[7.8px] xl:max-w-[220px] xl:text-[9.5px] 2xl:mt-[9px] 2xl:max-w-[275px] 2xl:text-[12px]`}
                  >
                    {option.link}
                  </div>
                </a>
                {option.thirdParty && (
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/subNavBarAnalytics/third.svg`}
                    alt="image"
                    className="mt-[4.5px] w-[35px] md:w-[105px] lg:w-[40px] xl:mt-[9px] xl:w-[47px] 2xl:w-[58px]"
                  />
                )}
                <div
                  onClick={() => {
                    option.title === 'ValidationCloud'
                      ? setChangeNodes({
                          type: 'utility',
                          name: option.title,
                          icon: option.src,
                          chain: 'Ethereum',
                        })
                      : setChangeNodes({
                          type: 'utility',
                          name: option.title,
                          icon: option.src,
                        })
                  }}
                  className={`absolute ${
                    option.enabled
                      ? 'cursor-pointer bg-[#0354EC] hover:bg-[#123981]'
                      : 'bg-[#898989]'
                  } -top-0.5 right-0 rounded-[5px] px-[7px] py-[3px] text-[6.5px] font-medium text-[#fff] md:text-[7px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]`}
                >
                  <div>Add</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <>
      <div className="z-100 relative bg-[#fff] px-[16px] py-[21px] text-[#000] shadow-[0_0px_5px_0px_rgba(0,0,0,0.12)] md:px-[20px] md:py-[26px] lg:px-[23px] lg:py-[30px] xl:px-[26.5px] xl:py-[35px] 2xl:px-[33px] 2xl:py-[43px]">
        {/* <img
          src="/images/lateralNavBar/close.svg"
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="absolute top-[15px] flex w-[8px] cursor-pointer items-center lg:right-[24px] lg:w-[9px] 2xl:right-[30px] 2xl:w-[11px]"
        /> */}
        <div className="text-[9px] font-bold md:text-[11px] lg:text-[12.5px] lg:!leading-[22px] xl:text-[14.5px] 2xl:text-[18px]">
          Observability
        </div>
        {renderOptions('Observability')}
        <div className="mt-[44px] text-[9px] font-bold md:mt-[53px] md:text-[11px] lg:mt-[61.5px] lg:text-[12.5px] lg:!leading-[22px] xl:mt-[71px] xl:text-[14.5px] 2xl:mt-[88px] 2xl:text-[18px]">
          Data Pipeline Automation
        </div>
        {renderOptions('Data Pipeline Automation')}
        <div className="mt-[44px] text-[9px] font-bold md:mt-[53px] md:text-[11px] lg:mt-[61.5px] lg:text-[12.5px] lg:!leading-[22px] xl:mt-[71px] xl:text-[14.5px] 2xl:mt-[88px] 2xl:text-[18px]">
          Admin Tools
        </div>
        {renderOptions('Admin Tools')}
        <a
          href={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode/data-products?category=Utility`
              : `/data-products?category=Utility`
          }`}
        >
          <div className="mt-[35px] flex w-full justify-center text-[8px] font-medium hover:text-[#3a3a3a] md:mt-[41px] md:text-[9.6px] lg:mt-[48px] lg:text-[11.5px] lg:!leading-[300%] xl:mt-[55px] xl:text-[13px] 2xl:mt-[69px] 2xl:text-[16px]">
            View More
          </div>
        </a>
        <div className="mt-[62px] max-w-[110px] text-[9px] md:mt-[75px] md:max-w-[132px] md:text-[10px] lg:mt-[87.5px] lg:max-w-[154px] lg:text-[11px] xl:mt-[100px] xl:max-w-[176px] xl:text-[13px] 2xl:mt-[125px] 2xl:max-w-[220px] 2xl:text-[16px]">
          <div className="border-y border-[#D9D9D9] pb-[8px] pt-[7.5px] md:pt-[9px] lg:pb-[12px] lg:pt-[10.5px] xl:pt-[12px] 2xl:py-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Support articles
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
              Provide a data source
            </div>
            <div className="lg:!leading-[150%]">
              {' '}
              <a
                href={
                  'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases'
                }
                target="_blank"
                className="border-b font-medium text-[#0354EC]"
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

export default SubBarUtility
