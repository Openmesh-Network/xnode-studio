import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

const SubBarAnalytics = ({ onValueChange }) => {
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
      title: 'Pythia Pro',
      desc: 'Data Streaming service',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAnalytics/pythia-logo.svg',
      style: '2xl:w-[26px] xl:w-[20.8px] lg:w-[18.2px] md:w-[15.6px] w-[13px]',
      isFree: true,
      enabled: true,
      thirdParty: false,
    },
    {
      title: 'Pythia',
      desc: 'A node service provider, that provides.',
      link: 'Arbitrum, BNB Chain, Ethereum, Polygon, Multichain, Solana',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAnalytics/pythia-logo.svg',
      style: '2xl:w-[26px] xl:w-[20.8px] lg:w-[18.2px] md:w-[15.6px] w-[13px]',
      isFree: true,
      enabled: true,
      thirdParty: false,
    },
    {
      title: 'Snowflake',
      desc: 'One-stop blockchain infrastructure and service provider.',
      link: 'Ethereum, Polygon, Avalanche, BNB Chain, Optimism, Arbitrum, Solana',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAnalytics/snowflake.svg',
      style: '2xl:w-[27px] xl:w-[21.6px] lg:w-[19px] md:w-[16.2px] w-[13px]',
      isFree: true,
      enabled: true,
      thirdParty: true,
    },
    {
      title: 'Databricks',
      desc: 'One-stop blockchain infrastructure and service provider.',
      link: 'Ethereum, Polygon, Avalanche, BNB Chain, Optimism, Arbitrum, Solana',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAnalytics/databricks.svg',
      style: '2xl:w-[25px] xl:w-[20px] lg:w-[17.5px] md:w-[15px] w-[12.5px]',
      isFree: false,
      enabled: true,
      thirdParty: true,
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

  function renderOptions(type: boolean) {
    return (
      <div className="mt-[32px] grid min-w-[220px] gap-y-[35px] md:mt-[38px] md:gap-y-[48px] lg:mt-[45px] lg:gap-y-[40px] xl:mt-[51px] xl:gap-y-[47px] 2xl:mt-[64px] 2xl:min-w-[290px] 2xl:gap-y-[58px]">
        {categoriesOptions
          .filter((option) => option.thirdParty === type)
          .map((option, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (option.enabled) {
                    handleButtonClick(option.title)
                  }
                }}
                className={`relative text-[9px] font-normal md:text-[10px] lg:mt-[19.5px] lg:text-[11px] xl:text-[13px] 2xl:text-[16px]`}
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
                  <div className="font-semibold">{option.title}</div>
                  {option.isFree && (
                    <div className="absolute right-[-27px] top-[-14px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                      Free
                    </div>
                  )}
                </div>
                <div
                  className={`mt-[9px] ${
                    option.enabled ? 'text-black' : 'text-[#A1A0A0]'
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
                    setChangeNodes({
                      type: 'analytics',
                      name: option.title,
                      icon: option.src,
                    })
                  }}
                  className={`absolute ${
                    option.enabled
                      ? 'cursor-pointer bg-[#0354EC] hover:bg-[#123981]'
                      : 'bg-[#898989]'
                  } right-0 top-[-2px] rounded-[5px] px-[7px] py-[3px] text-[6.5px] font-medium text-white md:text-[7px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]`}
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
      <div className="z-100 relative bg-white px-[16px] py-[21px] text-black shadow-[0_0px_5px_0px_rgba(0,0,0,0.12)] md:px-[20px] md:py-[26px] lg:px-[23px] lg:py-[30px] xl:px-[26.5px] xl:py-[35px] 2xl:px-[33px] 2xl:py-[43px]">
        <img
          src={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? process.env.NEXT_PUBLIC_BASE_PATH
              : ''
          }/images/subNavBarAnalytics/pythia.svg`}
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="w-[45px] md:w-[47px] lg:w-[61px] xl:w-[70px] 2xl:w-[87px]"
        />
        <div className="mt-[7.5px] max-w-[140px] text-[9px] font-light md:mt-[9px] md:max-w-[167px] md:text-[11px] lg:mt-[10.5px] lg:max-w-[195px] lg:text-[12.5px] lg:!leading-[22px] xl:mt-[12px] xl:max-w-[223px] xl:text-[14.5px] 2xl:mt-[15px] 2xl:max-w-[279px] 2xl:text-[18px]">
          Design, build, visualize, deploy and store powerful crypto and web3
          data products directly in your web3 wallet.{' '}
        </div>
        {/* <img
          src="/images/lateralNavBar/close.svg"
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="absolute top-[15px] flex w-[8px] cursor-pointer items-center lg:right-[24px] lg:w-[9px] 2xl:right-[30px] 2xl:w-[11px]"
        /> */}
        {renderOptions(false)}
        <div className="mt-[37px] h-px w-full bg-[#C6C6C6] md:mt-[45px] lg:mt-[52px] xl:mt-[60px] 2xl:mt-[74px]"></div>
        {renderOptions(true)}
        <a
          href={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode/data-products?category=Analytics`
              : `/data-products?category=Analytics`
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

export default SubBarAnalytics
