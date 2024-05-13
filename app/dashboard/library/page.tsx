import Pagination from '@/app/ui/general/pagination'
import Search from '@/app/ui/search'
import Table from '@/app/ui/library/table'
import { lusitana } from '@/app/ui/fonts'
import { TableSkeleton } from '@/app/ui/library/skeleton'
import { Suspense } from 'react'
import { fetchLibraryPages } from '@/app/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Library'
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
  const totalPages = await fetchLibraryPages(query)
  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Library</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='lid:123  ref:leb desc: leb who:hugger type:youtube  owner:richard  group:leb  gid:123 cnt:' />
      </div>
      <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
