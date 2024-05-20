/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react'
import { getAPI, getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TemplatesProducts } from '@/types/dataProvider'
import { SmileySad } from 'phosphor-react'
import Filter from '@/components/Filter'
import { TextField, Autocomplete } from '@mui/material'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import ProductsList from '../ProductsList'
import { AccountContext } from '@/contexts/AccountContext'
import Footer from '../Footer'

const NewLandingPage = () => {
  const { push } = useRouter()

  return (
    <section className="relative z-10 pt-[30px] lg:pt-[155px]">
      <div className="mx-auto max-w-[1380px] px-[20px] text-center text-[14px] font-normal text-[#000]">
        <div className="text-[62px] font-semibold leading-[64px] -tracking-[1.92px]">
          The Xnode Studio <br /> Revolution{' '}
          <span className="text-[#0059ff]">is Here</span>
        </div>
        <div className="mt-[19.5px] text-[16px] font-normal leading-[26px] -tracking-[0.32px] text-[#4d4d4d]">
          Unleash the Power of Xnode: Your Gateway to Building Personalized{' '}
          <br /> Data Ecosystems in minutes,{' '}
          <span className="italic">instead of weeks.</span>
        </div>
        <div
          onClick={() => {
            push(
              `${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? `/xnode/template-products`
                  : `/template-products`
              }`,
            )
          }}
          className="mx-auto mt-[46px] w-fit cursor-pointer rounded-[12px] bg-[#0059ff] px-[38.5px] py-[13px] text-[16px] font-bold leading-[150%] text-[#fff] hover:bg-[#014cd7]"
        >
          Start now
        </div>
        <div className="mt-[119px] text-[28px] font-bold">
          Maximize Efficiency & Savings
        </div>
        <div className="mx-auto mt-[46px] flex w-fit gap-x-[80px]">
          <div className="">
            <div className="text-[28px] font-bold leading-[28px] text-[#0059ff]">
              27X
            </div>
            <div className="text-[18px] font-semibold leading-[28px] text-[#000]">
              Faster Development{' '}
            </div>
            <div className="mt-[7px] text-[14px] font-light leading-[20px] text-[#4d4d4d]">
              Accelerate both development <br /> and deployment, pushing your{' '}
              <br /> projects to completion quicker <br /> than ever.
            </div>
          </div>
          <div className="">
            <div className="text-[28px] font-bold leading-[28px] text-[#0059ff]">
              6X
            </div>
            <div className="text-[18px] font-semibold leading-[28px] text-[#000]">
              Reduction Cost{' '}
            </div>
            <div className="mt-[7px] text-[14px] font-light leading-[20px] text-[#4d4d4d]">
              Dramatically cut costs without <br />
              hidden fees, making efficiency <br />
              affordable.
            </div>
          </div>
          <div className="">
            <div className="text-[28px] font-bold leading-[28px] text-[#0059ff]">
              5X
            </div>
            <div className="text-[18px] font-semibold leading-[28px] text-[#000]">
              Expanded Access{' '}
            </div>
            <div className="mt-[7px] text-[14px] font-light leading-[20px] text-[#4d4d4d]">
              Broaden your horizons with <br /> extensive access to external{' '}
              <br /> data.
            </div>
          </div>
          <div className="">
            <div className="text-[28px] font-bold leading-[28px] text-[#0059ff]">
              8X
            </div>
            <div className="text-[18px] font-semibold leading-[28px] text-[#000]">
              Enhanced Composability{' '}
            </div>
            <div className="mt-[7px] text-[14px] font-light leading-[20px] text-[#4d4d4d]">
              Seamlessly integrate and <br /> customize with other systems,{' '}
              <br /> simplifying complexity.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[79px] w-full bg-[#fafafa] px-[20px] py-[60px]">
        <div className="mx-auto flex max-w-[1380px] justify-center gap-x-[160px]">
          <div>
            <div className="text-[28px] font-bold leading-[48px] text-[#000]">
              Data Cloud Management{' '}
            </div>
            <div className="mt-[6px] w-full max-w-[479px] text-[14px] font-normal leading-[20px] text-[#4d4d4d]">
              Create your infrastructure quickly with our drag-and-drop design
              framework. Instead of spending weeks coding and integrating
              services and applications, you can now build your infrastructure
              in the region of your choice, with the workloads and applications
              you need, all in just minutes.
            </div>
            <div className="mt-[39px]">
              <div className="text-[18px] font-semibold leading-[28px] text-[#000]">
                Cost
              </div>
              <div className="relative mt-[9px] h-[6px] w-full max-w-[479px] rounded-[8px] bg-[#e5eefc]">
                <div className="h-full w-[50%] rounded-[8px] bg-[#0059ff]"></div>
                <div className="absolute -top-[5.5px] left-[48%] h-[16px] w-[16px] rounded-full bg-[#0059ff]"></div>
              </div>
              <div className="mt-[25px] text-[18px] font-semibold leading-[28px] text-[#000]">
                Speed to production
              </div>
              <div className="relative mt-[9px] h-[6px] w-full max-w-[479px] rounded-[8px] bg-[#e5eefc]">
                <div className="h-full w-[85%] rounded-[8px] bg-[#0059ff]"></div>
                <div className="absolute -top-[5.5px] left-[83%] h-[16px] w-[16px] rounded-full bg-[#0059ff]"></div>
              </div>
              <div className="mt-[25px] text-[18px] font-semibold leading-[28px] text-[#000]">
                Ongoing cost
              </div>
              <div className="relative mt-[9px] h-[6px] w-full max-w-[479px] rounded-[8px] bg-[#e5eefc]">
                <div className="h-full w-[12%] rounded-[8px] bg-[#0059ff]"></div>
                <div className="absolute -top-[5.5px] left-[10%] h-[16px] w-[16px] rounded-full bg-[#0059ff]"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[28px] font-bold leading-[48px] text-[#000]">
              Explore Possibilities{' '}
            </div>
            <div className="mt-[6px] w-full max-w-[479px] text-[14px] font-normal leading-[20px] text-[#4d4d4d]">
              Our modularized design allows you to quickly design, combine, and
              provision web2 and web3 infrastructure products. This includes
              connecting to data feeds, building APIs, linking to blockchains
              (RPC nodes), and accessing compute, storage, databases, analytics,
              and developer tools. Deploy in seconds and only pay for compute
              and storage, saving thousands.
            </div>
            <div className="mt-[106px] flex gap-x-[60px]">
              <div className="flex items-start gap-x-[28px]">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/template/cube.svg`}
                  alt="image"
                />
                <div>
                  <div className="text-[18px] font-semibold leading-[22px] text-[#000]">
                    Blockchain and <br /> Smart Contracts
                  </div>
                  <div className="mt-[3px] text-[12px] font-light leading-[20px] text-[#4d4d4d]">
                    Democratizing Data: <br /> Free Immutable Data to the World
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-x-[28px]">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/template/cube.svg`}
                  alt="image"
                />
                <div>
                  <div className="text-[18px] font-semibold leading-[22px] text-[#000]">
                    Many Integrations. <br /> Endless Possibilities{' '}
                  </div>
                  <div className="mt-[3px] text-[12px] font-light leading-[20px] text-[#4d4d4d]">
                    Xnode's modularized design <br /> and SDKs{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#fff] px-[20px] pt-[60px] pb-[111px]">
        <div className="mx-auto flex max-w-[1380px] justify-center gap-x-[132px]">
          <div className="flex gap-x-[56px]">
            <div className="text-[28px] font-bold leading-[38px]  text-[#000]">
              Scale with Confidence, <br />
              <span className="text-[28px] font-light italic leading-[38px]">
                Build with Speed
              </span>
            </div>
            <div
              onClick={() => {
                push(
                  `${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? `/xnode/start-here`
                      : `/start-here`
                  }`,
                )
              }}
              className="h-fit cursor-pointer rounded-[12px] bg-[#0059ff] px-[38.5px] py-[13px] text-[16px] font-bold leading-[150%] hover:bg-[#014cd7]"
            >
              Start now
            </div>
          </div>
          <div className="flex gap-x-[115px] text-[14px] text-[#000]">
            <div>
              <div className="font-semibold leading-[26px]">
                Understanding Xnode
              </div>
              <div className="text-[14px] font-normal leading-[20px] text-[#0059ff]">
                An introduction to xNode's role in <br /> decentralizing data
                infrastructure.
              </div>
            </div>
            <div>
              <div className="font-semibold leading-[26px]">Setting Up </div>
              <ul className="text-[14px] font-normal leading-[20px] text-[#0059ff]">
                <li className="cursor-pointer underline underline-offset-[3.5px]">
                  Step-by-step guide to deploying an xNode.
                </li>
                <li className="cursor-pointer underline underline-offset-[3.5px]">
                  Technical design
                </li>
                <li className="cursor-pointer underline underline-offset-[3.5px]">
                  Developer support and resources
                </li>
                <li className="cursor-pointer underline underline-offset-[3.5px]">
                  Docs & Research
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default NewLandingPage
