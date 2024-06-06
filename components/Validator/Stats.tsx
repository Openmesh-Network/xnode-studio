'use client'

import { formatAddress } from '@/utils/functions'
import { format, formatDistanceToNow } from 'date-fns'

import { Xnode } from '@/types/node'

interface ModalProps {
  totalValidators: number
  totalStakeAmount: number
  totalAverageReward: number
  averagePayoutPeriod: string
  nodes: Xnode[]
}

const Stats = ({ ...data }: ModalProps) => {
  function formatDeadline(dateReceived: string) {
    if (dateReceived) {
      const date = new Date(dateReceived)
      let difference = formatDistanceToNow(date)

      // Aqui estamos tratando a frase para exibir 'today' se a task foi criada no mesmo dia
      difference = `${difference.charAt(0).toUpperCase()}${difference.slice(
        1
      )} ago`
      return difference
    } else {
      return ''
    }
  }

  function formatDeadline2(dateString) {
    if (dateString) {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy')
    } else {
      return ''
    }
  }

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-normal md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[11px] xl:text-[8.8px] lg:text-[7.7px] md:text-[6.6px] text-[5.5px]'

  const renderTable = () => {
    return (
      <div className="mx-auto flex w-full justify-between text-black xl:w-[1052px] 2xl:w-[1315px]">
        <table className="mx-auto w-full">
          <thead className="">
            <tr>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Validator ID{' '}
              </th>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Validator public address
              </th>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Creation Date
              </th>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Location
              </th>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Staked amount
              </th>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Earned rewards
              </th>
              <th
                scope="col"
                className="text-left text-[9px] font-normal tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Status
              </th>
            </tr>
          </thead>
          <div className="mt-[25px]"></div>
          <tbody className="">
            {data.nodes.map((node) => (
              <tr key={node.id}>
                <td className={`${commonClasses}`}>
                  <div>{formatAddress(node.id)}</div>
                </td>
                <td className={commonClasses}>0x73554...4745</td>
                <td className={commonClasses}>
                  {`${formatDeadline(node.createdAt)}, ${formatDeadline2(
                    node.createdAt
                  )}`}
                </td>
                <td className={commonClasses}>{node.location}</td>
                <td className={commonClasses}>52,000 OPEN</td>
                <td className={commonClasses}>52,000 OPEN</td>
                <td className={commonClasses}>
                  {/* XXX: Maybe re enable this stuff? Not sure if we'll keep a lot of this code really. */}
                  {/* node.status === 'Running' ? (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/validator/green.svg`}
                      alt="image"
                      className={`mx-auto ml-[15px] w-[8px] md:w-[9.6px] lg:w-[11.2px] xl:w-[12.8px] 2xl:ml-[20px] 2xl:w-[16px]`}
                    />
                  ) : (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/validator/red.svg`}
                      alt="image"
                      className={`mx-auto ml-[15px] w-[8px] md:w-[9.6px] lg:w-[11.2px] xl:w-[12.8px] 2xl:ml-[20px] 2xl:w-[16px]`}
                    />
                    ) */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <section className="mx-auto w-full overflow-x-auto font-normal text-black">
      <div className="mx-auto flex w-full justify-between xl:w-[992px] 2xl:w-[1240px] 2xl:gap-x-[10px]">
        <div>
          <div className="text-[9px] md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            Total Validators
          </div>
          <div className="mt-px text-[15px] md:mt-px md:text-[18px] lg:mt-[2px] lg:text-[21px] xl:mt-[3px] xl:text-[24px] 2xl:mt-[5px] 2xl:text-[30px]">
            {data.totalValidators}
          </div>
        </div>
        <div>
          <div className="text-[9px] md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            Total Stake amount
          </div>
          <div className="mt-px text-[15px] md:mt-px md:text-[18px] lg:mt-[2px] lg:text-[21px] xl:mt-[3px] xl:text-[24px] 2xl:mt-[5px] 2xl:text-[30px]">
            {data.totalStakeAmount}
          </div>
        </div>
        <div>
          <div className="text-[9px] md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            Average rewards
          </div>
          <div className="mt-px text-[15px] md:mt-px md:text-[18px] lg:mt-[2px] lg:text-[21px] xl:mt-[3px] xl:text-[24px] 2xl:mt-[5px] 2xl:text-[30px]">
            {data.totalAverageReward}
          </div>
        </div>
        <div>
          <div className="text-[9px] md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            Average payout period
          </div>
          <div className="mt-px text-[15px] md:mt-px md:text-[18px] lg:mt-[2px] lg:text-[21px] xl:mt-[3px] xl:text-[24px] 2xl:mt-[5px] 2xl:text-[30px]">
            {data.averagePayoutPeriod}
          </div>
        </div>
      </div>
      <div className="mx-auto w-fit">
        <div className="-ml-3 mt-[45px] text-[10px] md:mt-[54px] md:text-[12px] lg:mt-[63px] lg:text-[14px] xl:mt-[72px] xl:text-[16px] 2xl:ml-[-15px] 2xl:mt-[90px] 2xl:text-[20px]">
          Active validators
        </div>
        <div className="mt-[24px] md:mt-[29px] lg:mt-[34px] xl:mt-[38px] 2xl:mt-[48px]">
          {renderTable()}
        </div>
      </div>
    </section>
  )
}

export default Stats
