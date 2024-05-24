
const Header = () => {
    return (
        <>
            <div className="w-full bg-[#1f1f1f] h-14">
                {/* <div> */}
                {/*   <img */}
                {/*     className="inline-block invert h-fit" */}
                {/*     src={`${ */}
                {/*       process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' */}
                {/*         ? process.env.NEXT_PUBLIC_BASE_PATH */}
                {/*         : '' */}
                {/*     }/images/logo/xnode-new-logo.svg`} */}
                {/*     alt="images" */}
                {/*   ></img> */}
                {/* </div> */}

                {/* <div className="float-right flex justify-center px-3 items-center flex-col h-full w-fit align-text-middle bg-[#0059ff]" onClick={console.log("")}> */}
                <div className="bg-[#0059ff] float-right flex justify-center px-3 items-center flex-col h-full w-fit">
                    <div className="flex h-fit w-fit justify-center gap-x-[8px]">
                        <img
                            src={`${
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                    ? process.env.NEXT_PUBLIC_BASE_PATH
                                    : ''
                            }/images/header/storm.svg`}
                            alt="image"
                            className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
                        />
                        <div>Create Service and Deploy</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
