'use client'

import { formatDistanceToNow } from 'date-fns'

interface ModalProps {
  onValueChange(string): void
  nodeId: string
  createdAt: string
}

const Congratulations = ({ ...data }: ModalProps) => {
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

  return (
    <section className="mx-auto text-center text-[#000] xl:max-w-[605.6px] 2xl:max-w-[757px]">
      <img
        src={`${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? process.env.NEXT_PUBLIC_BASE_PATH
            : ''
        }/images/validator/validator.svg`}
        alt="image"
        className={`mx-auto w-[48px] md:w-[57.6px] lg:w-[67.2px] xl:w-[76.8px] 2xl:w-[96px]`}
      />
      <div className="mt-[15px] text-[8px] font-bold md:mt-[18px] md:text-[9.6px] lg:mt-[21px] lg:text-[11.2px] xl:mt-[24px] xl:text-[12.8px] 2xl:mt-[30px] 2xl:text-[16px]">
        Validator Node #{data.nodeId}
      </div>
      <div className="mt-[10px] text-[7px] font-normal md:mt-[12px] md:text-[8.4px] lg:mt-[14px] lg:text-[9.8px] xl:mt-[16px] xl:text-[11.2px] 2xl:mt-[20px] 2xl:text-[14px]">
        Activated {formatDeadline(data.createdAt)}
      </div>
      <div className="mt-[28.5px] md:mt-[34.2px] lg:mt-[39.9px] xl:mt-[45.6px] 2xl:mt-[57px]">
        <div className="text-[20px] font-bold md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[40px]">
          Congratulations!
        </div>
        <div className="!lg:leading-[30px] mt-[6px] text-[10px] font-normal md:mt-[7.2px] md:text-[12px] lg:mt-[8.4px] lg:text-[14px] xl:mt-[9.6px] xl:text-[16px] 2xl:mt-[12px] 2xl:text-[20px]">
          Your validator node is now active, marking a significant step towards
          empowering the Openmesh Network. You have become a committed member of
          a pioneering community dedicated to maintaining a worldwide open data
          network and securely storing important global data without the need
          for a middleman. We thank you for supporting our mission to
          democratize data and address information asymmetry.
        </div>
      </div>
      <div
        onClick={data.onValueChange}
        className="mx-auto mt-[33px] w-fit cursor-pointer rounded-[5px] bg-[#0354EC] px-[30px] py-[8.25px] text-[8px] text-[#fff] hover:bg-[#033797] md:mt-[39.6px] md:px-[36px] md:py-[9.9px] md:text-[9.6px] lg:mt-[46.2px] lg:px-[42px] lg:py-[11.55px] lg:text-[11.2px] xl:mt-[52.8px] xl:px-[48px] xl:py-[12px] xl:text-[12.8px] 2xl:mt-[66px] 2xl:px-[60px] 2xl:py-[14px] 2xl:text-[16px]"
      >
        Initiate Staking
      </div>
    </section>
  )
}

export default Congratulations
