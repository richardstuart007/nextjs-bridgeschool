import { sql } from '@vercel/postgres'
import { unstable_noStore as noStore } from 'next/cache'
import { LibraryTable, QuestionsTable, UsersTable } from './definitions'
const LIBRARY_ITEMS_PER_PAGE = 10
//---------------------------------------------------------------------
//  Library totals
//---------------------------------------------------------------------
export async function fetchLibraryPages(query: string) {
  noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM library
    WHERE
      lrlid::text ILIKE ${`%${query}%`} OR
      lrref ILIKE ${`%${query}%`} OR
      lrdesc ILIKE ${`%${query}%`} OR
      lrwho ILIKE ${`%${query}%`} OR
      lrowner ILIKE ${`%${query}%`} OR
      lrgroup ILIKE ${`%${query}%`}
  `
    const totalPages = Math.ceil(Number(count.rows[0].count) / LIBRARY_ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of library items.')
  }
}
//---------------------------------------------------------------------
//  Library data
//---------------------------------------------------------------------
export async function fetchFilteredLibrary(query: string, currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * LIBRARY_ITEMS_PER_PAGE

  try {
    const library = await sql<LibraryTable>`
      SELECT
      lrlid,
      lrref,
      lrdesc,
      lrwho,
      lrtype,
      lrowner,
      lrgroup,
      lrlink,
      ogcntquestions,
      ogcntlibrary,
      lrgid
    FROM library
    LEFT JOIN ownergroup ON lrowner = ogowner and lrgroup = oggroup
    WHERE
      lrlid::text ILIKE ${`%${query}%`} OR
      lrref ILIKE ${`%${query}%`} OR
      lrdesc ILIKE ${`%${query}%`} OR
      lrwho ILIKE ${`%${query}%`} OR
      lrowner ILIKE ${`%${query}%`} OR
      lrgroup ILIKE ${`%${query}%`}
      ORDER BY lrref
      LIMIT ${LIBRARY_ITEMS_PER_PAGE} OFFSET ${offset}
    `
    return library.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch library.')
  }
}
//---------------------------------------------------------------------
//  Library data by ID
//---------------------------------------------------------------------
export async function fetchLibraryById(lrlid: number) {
  noStore()
  try {
    const data = await sql<LibraryTable>`
      SELECT
      lrlid,
      lrref,
      lrdesc,
      lrwho,
      lrtype,
      lrowner,
      lrgroup,
      lrgid,
      FROM library
      WHERE lrlid = ${lrlid};
    `

    const library = data.rows
    return library[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch library.')
  }
}
//---------------------------------------------------------------------
//  Questions data by Owner/Group
//---------------------------------------------------------------------
export async function fetchQuestionsByOwnerGroup(qowner: string, qgroup: string) {
  noStore()
  try {
    const data = await sql<QuestionsTable>`
      SELECT
        qqid,
        qowner,
        qdetail,
        qgroup,
        qpoints,
        qans,
        qseq,
        qrounds,
        qnorth,
        qeast,
        qsouth,
        qwest,
        qgid
      FROM questions
      WHERE qowner = ${qowner} and qgroup = ${qgroup}
      ORDER BY qowner, qgroup, qseq;
    `
    //
    //  Return rows
    //
    const questions = data.rows
    return questions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch questions.')
  }
}
//---------------------------------------------------------------------
//  Questions data by Owner/Group - ID
//---------------------------------------------------------------------
export async function fetchQuestionsByGid(qgid: number) {
  noStore()
  try {
    const data = await sql<QuestionsTable>`
      SELECT
        qqid,
        qowner,
        qdetail,
        qgroup,
        qpoints,
        qans,
        qseq,
        qrounds,
        qnorth,
        qeast,
        qsouth,
        qwest,
        qgid
      FROM questions
      WHERE qgid = ${qgid}
      ORDER BY qgid, qseq;
    `
    //
    //  Return rows
    //
    const questions = data.rows
    return questions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch questions.')
  }
}
//---------------------------------------------------------------------
//  Fetch User by email
//---------------------------------------------------------------------
export async function fetchUserByEmail(email: string): Promise<UsersTable | undefined> {
  noStore()
  try {
    const userrecord = await sql<UsersTable>`SELECT * FROM users WHERE u_email=${email}`
    //
    //  Not found
    //
    if (userrecord.rowCount === 0) {
      return undefined
    }
    //
    //  Return data
    //
    const user = userrecord.rows[0]
    return user
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch user.')
  }
}
