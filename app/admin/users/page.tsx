import Pagination from '@/app/ui/utils/pagination'
import Search from '@/app/ui/utils/search'
import Table from '@/app/admin/users/table'
import { lusitana } from '@/app/ui/fonts'
import { fetchUsersTotalPages } from '@/app/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users'
}
//
//  Interfaces
//
interface SearchParams {
  query?: string
  page?: string
}
//
//  Exported Function
//
export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  //
  //  Destructure Parameters
  //
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  //
  //  Fetch Data
  //
  const totalPages = await fetchUsersTotalPages(query)

  return (
    <div className='w-full md:p-6'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='uid:23  name:richard ' />
      </div>
      <Table query={query} currentPage={currentPage} />
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
