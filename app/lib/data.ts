'use server'

import { sql, db } from '@vercel/postgres'
import { unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'
import {
  LibraryTable,
  LibraryGroupTable,
  QuestionsTable,
  UsersTable,
  UsershistoryTable,
  HistoryGroupTable,
  UsershistoryTopResults,
  UsershistoryRecentResults,
  NewUsershistoryTable,
  NewSessionsTable,
  SessionsTable,
  SessionInfo
} from './definitions'
const LIBRARY_ITEMS_PER_PAGE = 10
const HISTORY_ITEMS_PER_PAGE = 10
//---------------------------------------------------------------------
//  Library totals
//---------------------------------------------------------------------
export async function fetchLibraryPages(query: string) {
  // noStore()
  try {
    let sqlWhere = await buildWhere_Library(query)
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
  // noStore()
  const offset = (currentPage - 1) * LIBRARY_ITEMS_PER_PAGE
  try {
    let sqlWhere = await buildWhere_Library(query)
    const sqlQuery = `SELECT *
    FROM library
    LEFT JOIN ownergroup ON lrgid = oggid
     ${sqlWhere}
      ORDER BY lrref
      LIMIT ${LIBRARY_ITEMS_PER_PAGE} OFFSET ${offset}
     `
    const client = await db.connect()
    const data = await client.query<LibraryGroupTable>(sqlQuery)
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
export async function buildWhere_Library(query: string) {
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
      //
      //  Check for empty values
      //
      if (value === '') return
      //
      // Process each part
      //
      switch (key) {
        case 'lid':
          if (!isNaN(Number(value))) {
            lid = parseInt(value, 10)
          }
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
          if (!isNaN(Number(value))) {
            gid = parseInt(value, 10)
          }
          break
        case 'cnt':
          if (!isNaN(Number(value))) {
            cnt = parseInt(value, 10)
          }
          break
        default:
          desc = value
          break
      }
    } else {
      // Default to 'desc' if no key is provided
      if (desc === '') {
        desc = part
      }
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
  // noStore()
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
  // noStore()
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
  // noStore()
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
  // noStore()
  try {
    let sqlWhere = await buildWhere_History(query)
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
  // noStore()
  const offset = (currentPage - 1) * HISTORY_ITEMS_PER_PAGE
  try {
    let sqlWhere = await buildWhere_History(query)
    const sqlQuery = `
    SELECT *
    FROM usershistory
    LEFT JOIN ownergroup ON r_gid = oggid
    LEFT JOIN users ON r_uid = u_uid
     ${sqlWhere}
      ORDER BY r_hid DESC
      LIMIT ${HISTORY_ITEMS_PER_PAGE} OFFSET ${offset}
     `
    const client = await db.connect()
    const data = await client.query<HistoryGroupTable>(sqlQuery)
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
export async function buildWhere_History(query: string) {
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
      //
      //  Check for empty values
      //
      if (value === '') return
      //
      // Process each part
      //
      switch (key) {
        case 'hid':
          if (!isNaN(Number(value))) {
            hid = parseInt(value, 10)
          }
          break
        case 'uid':
          if (!isNaN(Number(value))) {
            uid = parseInt(value, 10)
          }
          break
        case 'correct':
          if (!isNaN(Number(value))) {
            correct = parseInt(value, 10)
          }
          break
        case 'owner':
          owner = value
          break
        case 'group':
          group = value
          break
        case 'gid':
          if (!isNaN(Number(value))) {
            gid = parseInt(value, 10)
          }
          break
        case 'cnt':
          if (!isNaN(Number(value))) {
            cnt = parseInt(value, 10)
          }
          break
        default:
          group = value
          break
      }
    } else {
      // Default to 'group' if no key is provided
      if (group === '') {
        group = part
      }
    }
  })
  //
  // Add conditions for each variable if not empty or zero
  //
  if (hid !== 0) whereClause += `r_hid = ${hid} AND `
  if (uid !== 0) whereClause += `r_uid = ${uid} AND `
  if (owner !== '') whereClause += `r_owner ILIKE '%${owner}%' AND `
  if (group !== '') whereClause += `r_group ILIKE '%${group}%' AND `
  if (cnt !== 0) whereClause += `ogcntquestions >= ${cnt} AND `
  if (correct !== 0) whereClause += `r_correctpercent >= ${correct} AND `
  if (gid !== 0) whereClause += `r_gid = ${gid} AND `
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
  // noStore()
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
    throw new Error('Failed to fetch user by email.')
  }
}
//---------------------------------------------------------------------
//  Fetch User by ID
//---------------------------------------------------------------------
export async function fetchUserById(uid: number): Promise<UsersTable | undefined> {
  noStore()
  try {
    const userrecord = await sql<UsersTable>`SELECT * FROM users WHERE u_uid=${uid}`
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
    throw new Error('Failed to fetch user by Id.')
  }
}
//---------------------------------------------------------------------
//  Top results data
//---------------------------------------------------------------------
export async function fetchTopResultsData() {
  // noStore()
  // ????????????
  // await new Promise(resolve => setTimeout(resolve, 3000))
  try {
    const data = await sql<UsershistoryTopResults>`
      SELECT
        r_uid,
        u_name,
        COUNT(*) AS record_count,
        SUM(r_totalpoints) AS total_points,
        SUM(r_maxpoints) AS total_maxpoints,
        CASE
          WHEN SUM(r_maxpoints) > 0 THEN ROUND((SUM(r_totalpoints) / CAST(SUM(r_maxpoints) AS NUMERIC)) * 100)::INTEGER
          ELSE 0
        END AS percentage
      FROM
        usershistory
      JOIN
        users ON r_uid = u_uid
      GROUP BY
        r_uid, u_name
      HAVING
        COUNT(*) >= 3
      ORDER BY
        percentage DESC
      LIMIT 5;
    `
    //
    //  Return rows
    //
    const rows = data.rows
    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch top results.')
  }
}
//---------------------------------------------------------------------
//  Recent result data last
//---------------------------------------------------------------------
export async function fetchRecentResultsData1() {
  // noStore()
  // ????????????
  // await new Promise(resolve => setTimeout(resolve, 3000))
  try {
    const data = await sql<UsershistoryRecentResults>`
  SELECT
    r_hid, r_uid, u_name, r_totalpoints, r_maxpoints, r_correctpercent
  FROM (
          SELECT
            r_hid,
            r_uid,
            u_name,
            r_totalpoints,
            r_maxpoints,
            r_correctpercent,
            ROW_NUMBER()
            OVER (PARTITION BY r_uid ORDER BY r_hid DESC) AS rn
          FROM usershistory
          JOIN users
            ON r_uid = u_uid
        )
  AS ranked
  WHERE rn = 1
  ORDER BY
    r_hid DESC
  LIMIT 5;
    `
    //
    //  Return rows
    //
    const rows = data.rows
    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch recent results.')
  }
}
//---------------------------------------------------------------------
//  Recent results data
//---------------------------------------------------------------------
export async function fetchRecentResultsData5(userIds: number[]) {
  // noStore()
  // ????????????
  // await new Promise(resolve => setTimeout(resolve, 3000))
  try {
    const [id1, id2, id3, id4, id5] = userIds

    const data = await sql<UsershistoryRecentResults>`
SELECT r_hid, r_uid, u_name, r_totalpoints, r_maxpoints, r_correctpercent
FROM (
    SELECT
        r_hid, r_uid, u_name, r_totalpoints, r_maxpoints, r_correctpercent,
        ROW_NUMBER() OVER (PARTITION BY r_uid ORDER BY r_hid DESC) AS rn
    FROM usershistory
    JOIN users ON r_uid = u_uid
       WHERE r_uid IN (${id1}, ${id2}, ${id3}, ${id4}, ${id5})
) AS ranked
WHERE rn <= 5
ORDER BY r_uid;
    `
    //
    //  Return rows
    //
    const rows = data.rows
    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch recent results.')
  }
}
//---------------------------------------------------------------------
//  Write User History
//---------------------------------------------------------------------
export async function writeUsershistory(NewUsershistoryTable: NewUsershistoryTable) {
  try {
    //
    //  Deconstruct history
    //
    const {
      r_datetime,
      r_owner,
      r_group,
      r_questions,
      r_qid,
      r_ans,
      r_uid,
      r_points,
      r_maxpoints,
      r_totalpoints,
      r_correctpercent,
      r_gid,
      r_sid
    } = NewUsershistoryTable

    const r_qid_string = `{${r_qid.join(',')}}`
    const r_ans_string = `{${r_ans.join(',')}}`
    const r_points_string = `{${r_points.join(',')}}`

    const { rows } = await sql`INSERT INTO Usershistory
    (r_datetime, r_owner, r_group, r_questions, r_qid, r_ans, r_uid, r_points,
       r_maxpoints, r_totalpoints, r_correctpercent, r_gid, r_sid)
    VALUES (${r_datetime}, ${r_owner},${r_group},${r_questions},${r_qid_string},${r_ans_string},${r_uid},${r_points_string},
      ${r_maxpoints},${r_totalpoints},${r_correctpercent},${r_gid},${r_sid})
    RETURNING *`
    const UsershistoryTable = rows[0]
    return UsershistoryTable
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to write user history.')
  }
}
//---------------------------------------------------------------------
//  Write User Sessions
//---------------------------------------------------------------------
export async function writeSessions(usersessions: NewSessionsTable) {
  try {
    const { rows } = await sql`
    INSERT INTO sessions (
      s_datetime,
      s_uid
    ) VALUES (
      ${usersessions.s_datetime},
      ${usersessions.s_uid}
    ) RETURNING *
  `
    return rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to write sessions.')
  }
}
//---------------------------------------------------------------------
//  Update Sessions to signed out
//---------------------------------------------------------------------
export async function SessionsSignout(s_id: number) {
  try {
    await sql`
    UPDATE sessions
    SET
      s_signedin = false
    WHERE s_id = ${s_id}
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update session.'
    }
  }
}
//---------------------------------------------------------------------
//  Update User Sessions to signed out - ALL
//---------------------------------------------------------------------
export async function SessionsSignoutAll() {
  try {
    await sql`
    UPDATE sessions
    SET
      s_signedin = false
    WHERE 
      s_signedin = true AND
      s_datetime < NOW() - INTERVAL '3 HOURS'
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update ssession.'
    }
  }
}
//---------------------------------------------------------------------
//  sessions data by ID
//---------------------------------------------------------------------
export async function fetchSessionsById(s_id: number) {
  noStore()
  try {
    const data = await sql<SessionsTable>`
      SELECT *
      FROM sessions
      WHERE s_id = ${s_id};
    `
    const row = data.rows[0]
    return row
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch sessions.')
  }
}
//---------------------------------------------------------------------
//  Update Sessions to signed out
//---------------------------------------------------------------------
export async function UpdateSessions(
  s_id: number,
  s_dftmaxquestions: number,
  s_sortquestions: boolean,
  s_skipcorrect: boolean
) {
  try {
    await sql`
    UPDATE sessions
    SET
      s_dftmaxquestions = ${s_dftmaxquestions},
      s_sortquestions = ${s_sortquestions},
      s_skipcorrect = ${s_skipcorrect}
    WHERE s_id = ${s_id}
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update session.'
    }
  }
}
//---------------------------------------------------------------------
//  Fetch SessionInfo data by ID
//---------------------------------------------------------------------
export async function fetchSessionInfo(sessionId: number) {
  // noStore()
  try {
    const data = await sql`
      SELECT 
        u_uid,
        u_name,
        u_email,
        s_id,
        s_signedin,
        s_sortquestions,
        s_skipcorrect,
        s_dftmaxquestions
      FROM sessions
      JOIN users
      ON   s_uid = u_uid
      WHERE s_id = ${sessionId};
    `

    const row = data.rows[0]
    const SessionInfo: SessionInfo = {
      bsuid: row.u_uid,
      bsname: row.u_name,
      bsemail: row.u_email,
      bsid: row.s_id,
      bssignedin: row.s_signedin,
      bssortquestions: row.s_sortquestions,
      bsskipcorrect: row.s_skipcorrect,
      bsdftmaxquestions: row.s_dftmaxquestions
    }
    return SessionInfo
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch SessionInfo.')
  }
}
// ----------------------------------------------------------------------
//  Update Cookie information
// ----------------------------------------------------------------------
export async function updateCookieSessionId(sessionId: number) {
  try {
    //
    //  Cookiename
    //
    const cookieName = 'SessionId'
    //
    //  Write the cookie
    //
    const JSON_cookie = JSON.stringify(sessionId)
    cookies().set(cookieName, JSON_cookie, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/'
    })
  } catch (error) {
    throw new Error('Failed to update Session cookie info.')
  }
}
// ----------------------------------------------------------------------
//  Delete Cookie
// ----------------------------------------------------------------------
export async function deleteCookie(cookieName: string = 'SessionId') {
  try {
    cookies().delete(cookieName)
  } catch (error) {
    throw new Error('Failed to delete cookie.')
  }
}
// ----------------------------------------------------------------------
//  Get Cookie information
// ----------------------------------------------------------------------
export async function getCookieSessionId(cookieName: string = 'SessionId'): Promise<string | null> {
  try {
    const cookie = cookies().get(cookieName)
    if (!cookie) return null
    //
    //  Get value
    //
    const decodedCookie = decodeURIComponent(cookie.value)
    if (!decodedCookie) return null
    //
    //  Convert to JSON
    //
    const JSON_cookie = JSON.parse(decodedCookie)
    if (!JSON_cookie) return null
    //
    //  Return JSON
    //
    return JSON_cookie
  } catch (error) {
    console.error('Failed to get cookie info.')
    return null
  }
}
// ----------------------------------------------------------------------
//  Nav signout
// ----------------------------------------------------------------------
export async function navsignout() {
  try {
    //
    //  Get the Bridge School session cookie
    //
    const sessionId = await getCookieSessionId()
    if (!sessionId) return
    //
    //  Update the session to signed out
    //
    const s_id = parseInt(sessionId, 10)
    await SessionsSignout(s_id)
    //
    //  Delete the cookie
    //
    await deleteCookie('SessionId')
    //
    //  Errors
    //
  } catch (error) {
    throw new Error('Failed to sign out.')
  }
}
