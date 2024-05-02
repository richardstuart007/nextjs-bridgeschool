import Pagination from '@/app/ui/general/pagination'
import Search from '@/app/ui/search'
import Table from '@/app/ui/history/table'
import { lusitana } from '@/app/ui/fonts'
import { LibraryTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { fetchHistoryPages } from '@/app/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'History'
}

export default async function Page({
  searchParams
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchHistoryPages(query)
  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>History</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Search history...' />
      </div>
      <Suspense key={query + currentPage} fallback={<LibraryTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
