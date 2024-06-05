import { useEffect, useRef, useState } from 'react'

export type ValueObject = {
  name: string
  value: string
  imageSrc?: string
  imageStyle?: string
}

interface ModalI {
  options: ValueObject[]
  onValueChange(value: ValueObject): void
  optionSelected?: ValueObject
  placeholder?: string
  isDisable?: boolean
}

const Dropdown = ({
  options,
  onValueChange,
  optionSelected,
  placeholder,
  isDisable,
}: ModalI) => {
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef(null)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      onClick={() => {
        if (isDisable) {
          return
        }
        setIsOpen(!isOpen)
      }}
      className={`relative ${isOpen && 'border-primary'} my-auto w-[256px] ${
        !isDisable && 'cursor-pointer'
      } rounded-[5px] border border-[#cfd3d8] px-[12px] py-[15px] text-[13px] font-medium 2xl:text-[16px]`}
      ref={dropdownRef}
    >
      <div className={`flex items-center justify-between`}>
        <div className="flex justify-between gap-x-[10px]">
          {optionSelected?.imageSrc && (
            <img
              src={optionSelected.imageSrc}
              alt="image"
              className={optionSelected.imageStyle}
            />
          )}

          <div>{optionSelected?.name ?? placeholder}</div>
        </div>
        <img
          alt="ethereum avatar"
          src={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? process.env.NEXT_PUBLIC_BASE_PATH
              : ''
          }/images/header/line.svg`}
          className={`transition-transform duration-200 ${
            isOpen && 'rotate-180'
          }`}
        ></img>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-0 z-50 w-full translate-y-[60px] rounded-[5px] border border-[#cfd3d8] bg-[#fff] transition">
          <div className="grid gap-y-[5px] p-1">
            {options?.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false)
                  onValueChange(option)
                }}
                className={`flex cursor-pointer gap-x-[10px] rounded-md px-6 py-2 hover:bg-[#dbdbdb55] ${
                  optionSelected?.value === option.value && 'bg-[#dbdbdb1e]'
                }`}
              >
                {option.imageSrc && (
                  <img
                    src={option.imageSrc}
                    alt="image"
                    className={option.imageStyle}
                  />
                )}

                <div>{option.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
