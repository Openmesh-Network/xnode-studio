/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unknown-property */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'

// import { useState } from 'react'
import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from 'react'

const GetEquinixAPIKey = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center font-normal text-[#000] ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      } transition-opacity duration-300`}
    >
      <div className="absolute inset-0 bg-[#646464] opacity-50"></div>
      <div className="relative z-50 w-[250px] rounded-md bg-[#fff] p-8 md:w-[500px]">
        <div
          onClick={onClose}
          className="absolute right-5 top-2 cursor-pointer text-[20px] font-light text-[#000] hover:text-[#121212]"
        >
          x
        </div>
        <div className="mb-8">
          <h2 className="mb-1 text-lg text-[#000]">
            How to get my Equinix api key?
          </h2>
        </div>
        <div className="text-[#565555]">
          <div>1 - Create your Equinix Bare Metal account</div>
          <a
            href="https://console.equinix.com/sign-up"
            target="_blank"
            rel="noreferrer"
            className="w-fit"
          >
            <div className="ml-[35px] mt-[9px] w-fit text-[14px] text-[#0354EC] hover:text-[#0243bb]">
              Sign up
            </div>
          </a>
        </div>
        <div className="mt-[35px] text-[#565555]">
          <div>2 - Create your Read/Write API key</div>
          <a
            href="https://deploy.equinix.com/developers/docs/metal/accounts/api-keys/#:~:text=Your%20API%20keys%20are%20listed,user%2Fapi%2Dkeys%20endpoint"
            target="_blank"
            rel="noreferrer"
            className="w-fit"
          >
            <div className="ml-[35px] mt-[9px] w-fit text-[14px] text-[#0354EC] hover:text-[#0243bb]">
              Create api key
            </div>
          </a>
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }/images/signup/equinix.png`}
            alt="image"
            className="mt-[20px] w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default GetEquinixAPIKey
