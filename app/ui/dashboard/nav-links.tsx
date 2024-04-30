'use client'
import { useEffect } from 'react'
import { BuildingLibraryIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { writeSession_BS_session } from '@/app/lib/utilsClient'

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Library', href: '/dashboard/library', icon: BuildingLibraryIcon }
]

export default function NavLinks() {
  //
  //  Get Pathname
  //
  const pathname = usePathname()
  //
  //  One time only
  //
  useEffect(() => {
    firstTime()
    // eslint-disable-next-line
  }, [])

  //--------------------------------------------------------------------------------
  //  First Time
  //--------------------------------------------------------------------------------
  function firstTime() {
    //
    //  Write Session BS_session
    //
    writeSession_BS_session()
  }
  return (
    <>
      {links.map(link => {
        const LinkIcon = link.icon
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href
              }
            )}
          >
            <LinkIcon className='w-6' />
            <p className='hidden md:block'>{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}
