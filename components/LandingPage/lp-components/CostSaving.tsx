const CostSaving = () => {
  const options = [
    {
      value: 27,
      title: 'Speed for Build: Speeds up development and deployment',
    },
    {
      value: 6,
      title: 'Cost Saving: Lowers overall expenses, no extra fees',
    },
    {
      value: 5,
      title: 'Access to Third Parties: Wide-ranging external data access',
    },
    {
      value: 8,
      title:
        'Composability: Easy integration and customization with other systems',
    },
  ]
  return (
    <>
      <div className="mt-[25px] grid h-[94px] grid-cols-2 justify-around gap-[50px] md:mt-[60px]  md:flex md:w-[614px] md:flex-row md:gap-[60px] lg:mt-[70px] lg:w-[716px] lg:gap-[70px] xl:mt-[80px] xl:w-[820px] xl:gap-[80px] 2xl:mt-[100px] 2xl:w-[1024px] 2xl:gap-[100px]">
        {options.map((option, index) => (
          <div className="flex flex-col items-center gap-y-5" key={index}>
            <h1 className="text-[25px] font-bold  leading-[60.51px] text-black  md:text-[30px] lg:text-[35px] xl:text-[40px] 2xl:text-[50px]">
              {option.value}X
            </h1>
            <h2 className="w-[110px] text-center text-[10px] font-normal leading-[16.94px] text-black md:w-[132px] md:text-[12px] lg:w-[154px] lg:text-[14px] xl:w-[176px] xl:text-[16px] 2xl:w-[220px] 2xl:text-[20px]">
              {option.title}
            </h2>
          </div>
        ))}
      </div>
    </>
  )
}
export default CostSaving
