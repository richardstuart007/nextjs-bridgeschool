import { BookView, BookQuiz } from '@/app/ui/library/buttons'
import { fetchFilteredLibrary } from '@/app/lib/data'

export default async function LibraryTable({
  query,
  currentPage
}: {
  query: string
  currentPage: number
}) {
  const library = await fetchFilteredLibrary(query, currentPage)

  return (
    <div className='mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
          <div className='md:hidden'>
            {library?.map(library => (
              <div key={library.lrlid} className='mb-2 w-full rounded-md bg-white p-4'>
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <div className='mb-2 flex items-center'>
                      <p>{library.lrref}</p>
                    </div>
                    <p className='text-sm text-gray-500'>{library.lrdesc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className='hidden min-w-full text-gray-900 md:table'>
            <thead className='rounded-lg text-left text-sm font-normal'>
              <tr>
                <th scope='col' className='px-4 py-5 font-medium'>
                  Id
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Reference
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Description
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Who
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Owner
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Book/Video
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Questions
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Type
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  View
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Quiz
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {library?.map(library => (
                <tr
                  key={library.lrlid}
                  className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='whitespace-nowrap px-3 py-3'>{library.lrlid}</td>
                  <td className='whitespace-nowrap px-3 py-3'>{library.lrref}</td>
                  <td className='whitespace-nowrap px-3 py-3'>{library.lrdesc}</td>
                  <td className='whitespace-nowrap px-3 py-3'>{library.lrwho}</td>
                  <td className='whitespace-nowrap px-3 py-3'>{library.lrowner}</td>
                  <td className='whitespace-nowrap px-3 py-3'>{library.ogcntlibrary}</td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {library.ogcntquestions > 0 ? library.ogcntquestions : null}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>{library.lrtype}</td>
                  <td className='whitespace-nowrap px-3 h-5'>
                    <BookView lrtype={library.lrtype} lrlink={library.lrlink} />
                  </td>
                  <td className='whitespace-nowrap px-3'>
                    {library.ogcntquestions > 0 ? <BookQuiz lrlid={library.lrlid} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
