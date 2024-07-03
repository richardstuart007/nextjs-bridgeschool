import { fetchUsersFiltered } from '@/app/lib/data'
export default async function UsersTable({
  query,
  currentPage
}: {
  query: string
  currentPage: number
}) {
  //
  //  Fetch Data
  //
  const users = await fetchUsersFiltered(query, currentPage)
  return (
    <div className='mt-2 md:mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
          <table className='min-w-full text-gray-900 table-fixed table'>
            <thead className='rounded-lg text-left  font-normal text-sm'>
              <tr>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Id
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Name
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {users?.map(user => (
                <tr
                  key={user.u_uid}
                  className='w-full border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='px-2 py-1 text-sm '>{user.u_uid}</td>
                  <td className='px-2 py-1 text-sm '>{user.u_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
