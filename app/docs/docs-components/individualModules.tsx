interface IndividualModulesProps {
  title: string
  strongTitle: string
  subTitle: string
  listItem: { title: string; href: string }[]
  icon: string
}

export default function IndividualModules(props: IndividualModulesProps) {
  const { title, strongTitle, subTitle, listItem, icon } = props
  return (
    <>
      <div>
        <div>
          <div className="ml-[18px] mt-[78px] flex h-[61px] w-[81px] flex-col items-center justify-between gap-[]">
            <img
              className="mr-[10px]"
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }${icon}`}
              alt="cuboimage"
            />
            <h2 className="font inter mt-[4px] text-[16px] font-medium text-black">
              {title}
            </h2>
          </div>
          <hr className="ml-[10px] mt-[20px] w-[344px] border-[0.5px] border-[#D9D9D9]" />
          <div className="ml-[16px] mt-[30px] flex flex-col items-start">
            <a className="font-inter text-[16px] font-bold leading-[18px] text-[#0354EC]">
              {strongTitle}
            </a>
            <a className="mt-[24px] font-inter text-[16px] font-normal leading-[24px] text-[#0354EC]">
              {subTitle}
            </a>
          </div>
          <div>
            <ul className="ml-[40px] list-disc font-inter text-[16px] text-[#0354EC]">
              {listItem.map((item, index) => (
                <li key={index}>
                  <a
                    href={`${item.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-justify font-inter text-[16px] font-medium leading-[24px]"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
