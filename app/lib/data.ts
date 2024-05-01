import { sql, db } from '@vercel/postgres'
import { unstable_noStore as noStore } from 'next/cache'
import {
  LibraryTable,
  LibraryFormTable,
  QuestionsTable,
  UsersTable,
  UsershistoryTable
} from './definitions'
const LIBRARY_ITEMS_PER_PAGE = 10
//---------------------------------------------------------------------
//  Library totals
//---------------------------------------------------------------------
export async function fetchLibraryPages(query: string) {
  noStore()
  try {
    let sqlWhere = buildWhere(query)
    const sqlQuery = `SELECT COUNT(*) FROM library
    LEFT JOIN ownergroup ON lrowner = ogowner and lrgroup = oggroup
    ${sqlWhere}`

    const client = await db.connect()
    const result = await client.query(sqlQuery)
    const count = result.rows[0].count
    client.release()

    const totalPages = Math.ceil(count / LIBRARY_ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch library items.')
  }
}

//---------------------------------------------------------------------
//  Library data
//---------------------------------------------------------------------
export async function fetchFilteredLibrary(query: string, currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * LIBRARY_ITEMS_PER_PAGE
  try {
    let sqlWhere = buildWhere(query)
    const sqlQuery = `SELECT
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
     ${sqlWhere}
      ORDER BY lrref
      LIMIT ${LIBRARY_ITEMS_PER_PAGE} OFFSET ${offset}
     `
    const client = await db.connect()
    const library = await client.query<LibraryFormTable>(sqlQuery)
    client.release()
    return library.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch library.')
  }
}
//---------------------------------------------------------------------
//  Library data
//---------------------------------------------------------------------
export function buildWhere(query: string) {
  //
  //  Empty search
  //
  let whereClause = ''
  if (!query) return whereClause
  //
  // Initialize variables
  //
  let lid = 0
  let ref = ''
  let desc = ''
  let who = ''
  let type = ''
  let owner = ''
  let group = ''
  let gid = 0
  let cnt = 0
  //
  // Split the search query into parts based on spaces
  //
  const parts = query.split(/\s+/).filter(part => part.trim() !== '')
  //
  // Loop through each part to extract values using switch statement
  //
  parts.forEach(part => {
    if (part.includes(':')) {
      const [key, value] = part.split(':')
      switch (key) {
        case 'lid':
          lid = parseInt(value, 10)
          break
        case 'ref':
          ref = value
          break
        case 'desc':
          desc = value
          break
        case 'who':
          who = value
          break
        case 'type':
          type = value
          break
        case 'owner':
          owner = value
          break
        case 'group':
          group = value
          break
        case 'gid':
          gid = parseInt(value, 10)
          break
        case 'cnt':
          cnt = parseInt(value, 10)
          cnt = isNaN(cnt) ? 0 : cnt
          break
        default:
          desc = value
          break
      }
    } else {
      // Default to 'desc' if no key is provided
      desc = part
    }
  })
  //
  // Add conditions for each variable if not empty or zero
  //
  if (lid !== 0) whereClause += `lrlid::text ILIKE '%${lid}%' AND `
  if (ref !== '') whereClause += `lrref ILIKE '%${ref}%' AND `
  if (desc !== '') whereClause += `lrdesc ILIKE '%${desc}%' AND `
  if (who !== '') whereClause += `lrwho ILIKE '%${who}%' AND `
  if (type !== '') whereClause += `lrtype ILIKE '%${type}%' AND `
  if (owner !== '') whereClause += `lrowner ILIKE '%${owner}%' AND `
  if (group !== '') whereClause += `lrgroup ILIKE '%${group}%' AND `
  if (gid !== 0) whereClause += `lrgid::text ILIKE '%${gid}%' AND `
  if (cnt !== 0) whereClause += `ogcntquestions >= ${cnt} AND `
  //
  // Remove the trailing 'AND' if there are conditions
  //
  if (whereClause !== '') {
    whereClause = `WHERE ${whereClause.slice(0, -5)}`
  }
  return whereClause
}
//---------------------------------------------------------------------
//  Library data by ID
//---------------------------------------------------------------------
export async function fetchLibraryById(lrlid: number) {
  noStore()
  try {
    const data = await sql<LibraryTable>`
      SELECT *
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
      SELECT *
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
//  Questions data by ID
//---------------------------------------------------------------------
export async function fetchQuestionsByGid(qgid: number) {
  noStore()
  try {
    const data = await sql<QuestionsTable>`
      SELECT *
      FROM questions
      WHERE qgid = ${qgid}
      ORDER BY qgid, qseq;
    `
    //
    //  Return rows
    //
    const rows = data.rows
    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch questions.')
  }
}
//---------------------------------------------------------------------
//  Users History data by ID
//---------------------------------------------------------------------
export async function fetchHistoryById(r_hid: number) {
  noStore()
  try {
    const data = await sql<UsershistoryTable>`
      SELECT *
      FROM usershistory
      WHERE r_hid = ${r_hid};
    `
    //
    //  Return rows
    //
    const rows = data.rows
    return rows[0]
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
