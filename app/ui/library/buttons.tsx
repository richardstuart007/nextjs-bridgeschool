'use client'

import { TrophyIcon, BookOpenIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
//-------------------------------------------------------------------------------------
//  BookView Button
//-------------------------------------------------------------------------------------
interface BookViewProps {
  lrtype: string
  lrlink: string
}
export function BookView({ lrtype, lrlink }: BookViewProps) {
  return (
    <>
      <Button className='bg-white hover:bg-gray-200' onClick={() => window.open(lrlink, '_blank')}>
        {lrtype === 'youtube' ? (
          <VideoCameraIcon className='w-5 h-5 text-black bg-white' />
        ) : (
          <BookOpenIcon className='w-5 h-5 text-black bg-white' />
        )}
      </Button>
    </>
  )
}
//-------------------------------------------------------------------------------------
//  Book Quiz Button
//-------------------------------------------------------------------------------------
export function BookQuiz({ lrgid }: { lrgid: number }) {
  return (
    <Link href={`/dashboard/quiz/${lrgid}/quiz`} className='hover:bg-gray-200'>
      <TrophyIcon className='w-5' />
    </Link>
  )
}
