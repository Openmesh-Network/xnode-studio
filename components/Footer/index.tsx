'use client'

import Image from 'next/image'
import Link from 'next/link'
import discord from '@/assets/discord.svg'
import twitter from '@/assets/twitter.svg'
import linkedin from '@/assets/linkedin.svg'
import logo from '@/public/images/logo/openmesh-latest-logo.svg'

export function Footer() {
  const footerItems = [
    { 
      label: 'Discord', 
      icon: discord,
      href: `https://discord.com/invite/openmesh`,
      
    },
    {
      label: 'Twitter',
      icon: twitter,
      href: `https://x.com/OpenmeshNetwork`,
    },
    {
      label: 'LinkedIn',
      icon: linkedin,
      href: `https://www.linkedin.com/company/openmesh/`,
    }
  ]
  return (
    <footer className="z-50 flex h-16 w-full items-center justify-between bg-[#19161C] pl-6 pr-6 pt-3 pb-3 md:pr-0">
      <div className="flex items-center">
        <Image src={logo} alt="Openmesh Logo" width={160} height={40} />
        <div className="hidden md:flex items-center text-sm text-gray-300 ml-6">
          Building open-source decentralized data infrastructure in Web2 and Web3 data
        </div>
      </div>

      <nav className="flex items-center gap-x-3 ml-32">
        {footerItems.map((option, index) => (
          <Link
            key={index}
            href={option.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-full p-1 h-[35px] w-[35px] bg-white"
          >
            {option.icon && <Image src={option.icon} alt={`${option.label} Icon`} width={18} height={18} />}
          </Link>
        ))}
      </nav>
        <div className="text-xs text-gray-300 md:mr-20 ml:auto">
          Openmesh 2024
        </div>
    </footer>
  );
}

export default Footer;
