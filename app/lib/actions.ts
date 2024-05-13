'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'
import type { UsersTable, NewUsershistoryTable, NewUserssessionsTable } from '@/app/lib/definitions'
import { cookies } from 'next/headers'
//---------------------------------------------------------------------
//  Validate Register
//---------------------------------------------------------------------
const FormSchemaRegister = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string()
})

export type StateRegister = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string | null
}
// ----------------------------------------------------------------------
//  Authenticate Login
// ----------------------------------------------------------------------
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CallbackRouteError':
          return 'CallbackRouteError'
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
// ----------------------------------------------------------------------
//  Register
// ----------------------------------------------------------------------
const Register = FormSchemaRegister

export async function registerUser(prevState: StateRegister, formData: FormData) {
  const validatedFields = Register.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })
  //
  // If form validation fails, return errors early. Otherwise, continue.
  //
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Register.'
    }
  }
  //
  // Unpack form data
  //
  const { email, password } = validatedFields.data
  //
  // Check if email exists already
  //
  try {
    const userrecord = await sql<UsersTable>`SELECT * FROM users WHERE u_email=${email}`
    if (userrecord.rowCount > 0) {
      return {
        message: 'Email already exists.'
      }
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to check User.'
    }
  }
  //---------------------------------------------------------------------
  //  Write Users
  //---------------------------------------------------------------------
  const u_email = email
  const u_hash = await bcrypt.hash(password, 10)
  const u_user = email
  const u_name = email.split('@')[0]
  const u_joined = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const u_fedid = 'dummy'
  const u_admin = false
  const u_sortquestions = true
  const u_skipcorrect = true
  const u_dftmaxquestions = 20
  const u_fedcountry = 'NZ'
  const u_dev = false
  //
  // Insert data into the database
  //
  try {
    await sql`
    INSERT INTO users (u_email, u_hash, u_user, u_name, u_joined, u_fedid, u_admin, u_sortquestions, u_skipcorrect, u_dftmaxquestions, u_fedcountry, u_dev)
    VALUES (${u_email}, ${u_hash}, ${u_user}, ${u_name}, ${u_joined}, ${u_fedid}, ${u_admin}, ${u_sortquestions}, ${u_skipcorrect}, ${u_dftmaxquestions}, ${u_fedcountry}, ${u_dev})
  `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Register User.'
    }
  }
  //
  // Revalidate the cache and redirect the user.
  //
  revalidatePath('/login')
  redirect('/login')
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
export async function writeUserssessions(usersessions: NewUserssessionsTable) {
  try {
    const { rows } = await sql`
    INSERT INTO Userssessions (
      usdatetime,
      usuid,
      ususer
    ) VALUES (
      ${usersessions.usdatetime},
      ${usersessions.usuid},
      ${usersessions.ususer}
    ) RETURNING *
  `
    return rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to write user sessions.')
  }
}
// ----------------------------------------------------------------------
//  Write Cookie information
// ----------------------------------------------------------------------
export async function writeCookieBSsession(userRecord: UsersTable, usid: number) {
  try {
    //
    //  Create session cookie (dropping u_hash)
    //
    const newUserRecord = { ...userRecord, u_hash: undefined, usid: usid }
    const JSONnewUserRecord = JSON.stringify(newUserRecord)
    // const expires = new Date(Date.now() + 10000)
    cookies().set('BS_session', JSONnewUserRecord, {
      httpOnly: false,
      secure: false,
      // expires: expires,
      sameSite: 'lax',
      path: '/'
    })
    // console.log('actions: BS_session Cookie written')
  } catch (error) {
    throw new Error('Failed to write cookie info.')
  }
}
// ----------------------------------------------------------------------
//  Delete Cookie
// ----------------------------------------------------------------------
export async function deleteCookie(cookieName: string) {
  try {
    cookies().delete(cookieName)
    // console.log(`actions: ${cookieName} Cookie deleted`)
  } catch (error) {
    throw new Error('Failed to delete cookie.')
  }
}
// ----------------------------------------------------------------------
//  Get Cookie information
// ----------------------------------------------------------------------
export async function getCookieInfo(cookieName: string) {
  try {
    const cookie = cookies().get(cookieName)
    if (!cookie) throw new Error('No cookie found.')
    //
    //  Get value
    //
    const decodedCookie = decodeURIComponent(cookie.value)
    if (!decodedCookie) throw new Error('No cookie value.')
    //
    //  Convert to JSON
    //
    const JSON_cookie = JSON.parse(decodedCookie)
    if (!JSON_cookie) throw new Error('No cookie JSON error.')
    //
    //  Return JSON
    //
    return JSON_cookie
  } catch (error) {
    throw new Error('Failed to get cookie info.')
  }
}
