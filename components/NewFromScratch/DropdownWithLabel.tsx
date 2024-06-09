import { useEffect, useRef, useState } from 'react'
import { prefix } from '@/utils/prefix'

export type ValueObject = {
  name: string
  value: string
  imageSrc?: string
  imageStyle?: string
}

interface ModalI {
  options: ValueObject[]
  onValueChange(value: ValueObject): void
  label: string
  optionSelected?: ValueObject
  placeholder?: string
  isDisable?: boolean
}

const DropdownWithLabel = ({
  options,
  onValueChange,
  label,
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
      className={`relative ${isOpen && 'border-primary'} my-auto w-[400px] ${
        !isDisable && 'cursor-pointer'
      } rounded-[5px] border border-[#C1C1C1] px-[18px] py-[15px] text-[14px] font-normal`}
      ref={dropdownRef}
    >
      <div className={`flex items-center justify-between`}>
        <div className="flex justify-between gap-x-[10px]">
          {optionSelected?.imageSrc && (
            <img
              src={
                optionSelected.imageSrc.startsWith('https://')
                  ? optionSelected.imageSrc
                  : `${prefix}${optionSelected.imageSrc}`
              }
              alt="image"
              className={optionSelected.imageStyle}
            />
          )}

          <div>{optionSelected?.name ?? placeholder}</div>
        </div>
        <img
          alt="ethereum avatar"
          src={`${prefix}/images/header/line.svg`}
          className={`transition-transform duration-200 ${
            isOpen && 'rotate-180'
          }`}
        ></img>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-0 z-50 w-full translate-y-[60px] rounded-[5px] border border-[#cfd3d8] bg-white transition">
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
                    src={
                      option.imageSrc.startsWith('https://')
                        ? option.imageSrc
                        : `${prefix}${option.imageSrc}`
                    }
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
      <div className="absolute -top-3 left-2 z-50 bg-white px-[10px] text-[16px] font-normal">
        {label}
      </div>
    </div>
  )
}

export default DropdownWithLabel
