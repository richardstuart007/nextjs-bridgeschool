'use client'
import { useEffect, useState } from 'react'
import {
  BuildingLibraryIcon,
  HomeIcon,
  ArchiveBoxIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useUserContext } from '@/UserContext'

export default function NavLinks() {
  const [links, setLinks] = useState([
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Library', href: '/dashboard/library', icon: BuildingLibraryIcon },
    { name: 'History', href: '/dashboard/history', icon: ArchiveBoxIcon },
    { name: 'Preferences', href: '/dashboard', icon: UserIcon },
    { name: 'Session', href: '/dashboard/session', icon: UserIcon }
  ])
  //
  //  Get path name
  //
  const pathname = usePathname()
  //
  //  Update Links
  //
  const { session } = useUserContext()
  const { bsuid } = session
  useEffect(() => {
    updateLinks()
    // eslint-disable-next-line
  }, [session])
  //--------------------------------------------------------------------------------
  //  First Time
  //--------------------------------------------------------------------------------
  function updateLinks() {
    //
    //  Update the link to this user
    //
    const updatedLinks = [...links]
    updatedLinks[3].href = `/dashboard/preferences/${bsuid}/preferences`
    setLinks(updatedLinks)
  }
  //--------------------------------------------------------------------------------
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
