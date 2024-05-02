import { sql, db } from '@vercel/postgres'
import { unstable_noStore as noStore } from 'next/cache'
import {
  LibraryTable,
  LibraryFormTable,
  QuestionsTable,
  UsersTable,
  UsershistoryTable,
  HistoryFormTable
} from './definitions'
const LIBRARY_ITEMS_PER_PAGE = 10
const HISTORY_ITEMS_PER_PAGE = 10
//---------------------------------------------------------------------
//  Library totals
//---------------------------------------------------------------------
export async function fetchLibraryPages(query: string) {
  noStore()
  try {
    let sqlWhere = buildWhere_Library(query)
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
    let sqlWhere = buildWhere_Library(query)
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
    LEFT JOIN ownergroup ON lrgid = oggid
     ${sqlWhere}
      ORDER BY lrref
      LIMIT ${LIBRARY_ITEMS_PER_PAGE} OFFSET ${offset}
     `
    const client = await db.connect()
    const data = await client.query<LibraryFormTable>(sqlQuery)
    client.release()
    const rows = data.rows
    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch library.')
  }
}
//---------------------------------------------------------------------
//  Library where clause
//---------------------------------------------------------------------
export function buildWhere_Library(query: string) {
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
  if (lid !== 0) whereClause += `lrlid = ${lid} AND `
  if (ref !== '') whereClause += `lrref ILIKE '%${ref}%' AND `
  if (desc !== '') whereClause += `lrdesc ILIKE '%${desc}%' AND `
  if (who !== '') whereClause += `lrwho ILIKE '%${who}%' AND `
  if (type !== '') whereClause += `lrtype ILIKE '%${type}%' AND `
  if (owner !== '') whereClause += `lrowner ILIKE '%${owner}%' AND `
  if (group !== '') whereClause += `lrgroup ILIKE '%${group}%' AND `
  if (gid !== 0) whereClause += `lrgid = ${gid} AND `
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
    const row = data.rows[0]
    return row
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
    const rows = data.rows
    return rows
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
//  History totals
//---------------------------------------------------------------------
export async function fetchHistoryPages(query: string) {
  noStore()
  try {
    let sqlWhere = buildWhere_History(query)
    const sqlQuery = `
    SELECT COUNT(*)
    FROM usershistory
    ${sqlWhere}`

    const client = await db.connect()
    const result = await client.query(sqlQuery)
    const count = result.rows[0].count
    client.release()

    const totalPages = Math.ceil(count / HISTORY_ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch usershistory items.')
  }
}
//---------------------------------------------------------------------
//  History data
//---------------------------------------------------------------------
export async function fetchFilteredHistory(query: string, currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * HISTORY_ITEMS_PER_PAGE
  try {
    let sqlWhere = buildWhere_History(query)
    const sqlQuery = `
    SELECT
      r_hid,
      r_group,
      r_totalpoints,
      r_maxpoints,
      r_correctpercent,
      r_questions,
      r_gid,
      ogtitle
    FROM usershistory
    LEFT JOIN ownergroup ON r_gid = oggid
     ${sqlWhere}
      ORDER BY r_hid DESC
      LIMIT ${HISTORY_ITEMS_PER_PAGE} OFFSET ${offset}
     `
    const client = await db.connect()
    const data = await client.query<HistoryFormTable>(sqlQuery)
    client.release()
    const rows = data.rows
    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch usershistory.')
  }
}
//---------------------------------------------------------------------
//  History where clause
//---------------------------------------------------------------------
export function buildWhere_History(query: string) {
  //
  //  Empty search
  //
  let whereClause = ''
  if (!query) return whereClause
  //
  // Initialize variables
  //
  let hid = 0
  let owner = ''
  let group = ''
  let cnt = 0
  let uid = 0
  let correct = 0
  let gid = 0
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
        case 'hid':
          hid = parseInt(value, 10)
          break
        case 'uid':
          uid = parseInt(value, 10)
          break
        case 'correct':
          correct = parseInt(value, 10)
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
          group = value
          break
      }
    } else {
      group = part
    }
  })
  //
  // Add conditions for each variable if not empty or zero
  //
  if (hid !== 0) whereClause += `r_hid = ${hid} AND `
  if (uid !== 0) whereClause += `r_uid = ${uid} AND `
  if (owner !== '') whereClause += `lrowner ILIKE '%${owner}%' AND `
  if (group !== '') whereClause += `lrgroup ILIKE '%${group}%' AND `
  if (cnt !== 0) whereClause += `ogcntquestions >= ${cnt} AND `
  if (correct !== 0) whereClause += `r_correctpercent >= ${correct} AND `
  if (gid !== 0) whereClause += `lrgid::text ILIKE '%${gid}%' AND `
  //
  // Remove the trailing 'AND' if there are conditions
  //
  if (whereClause !== '') {
    whereClause = `WHERE ${whereClause.slice(0, -5)}`
  }
  return whereClause
}
//---------------------------------------------------------------------
//  History data by ID
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
    const row = data.rows[0]
    return row
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch history.')
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
    const row = userrecord.rows[0]
    return row
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch user.')
  }
}
