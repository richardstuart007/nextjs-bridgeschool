'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'
import type { UsersTable, NewUsershistoryTable, NewUserssessionsTable } from '@/app/lib/definitions'
import { cookies } from 'next/headers'
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
  //
  //  Write Users
  //
  const u_email = email
  const u_hash = await bcrypt.hash(password, 10)
  const u_user = email
  const fedid = email.split('@')[0]
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
    INSERT INTO users (u_email, u_hash, u_user, fedid, u_joined, u_fedid, u_admin, u_sortquestions, u_skipcorrect, u_dftmaxquestions, u_fedcountry, u_dev)
    VALUES (${u_email}, ${u_hash}, ${u_user}, ${fedid}, ${u_joined}, ${u_fedid}, ${u_admin}, ${u_sortquestions}, ${u_skipcorrect}, ${u_dftmaxquestions}, ${u_fedcountry}, ${u_dev})
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
    //  Create session cookie
    //
    const BS_session = {
      bsuid: userRecord.u_uid,
      bsname: userRecord.u_name,
      bsemail: userRecord.u_email,
      bsid: usid
    }

    const JSON_BS_session = JSON.stringify(BS_session)
    // const expires = new Date(Date.now() + 10000)
    cookies().set('BS_session', JSON_BS_session, {
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
// ----------------------------------------------------------------------
//  Update User Preferences
// ----------------------------------------------------------------------
//
//  Form Schema for validation
//
const FormSchemaPreferences = z.object({
  u_uid: z.string(),
  u_name: z.string(),
  u_fedid: z.string(),
  u_fedcountry: z.string(),
  u_dftmaxquestions: z.number().min(5).max(100),
  u_sortquestions: z.boolean(),
  u_skipcorrect: z.boolean()
})
//
//  Errors and Messages
//
export type StatePreferences = {
  errors?: {
    u_uid?: string[]
    u_name?: string[]
    u_fedid?: string[]
    u_fedcountry?: string[]
    u_dftmaxquestions?: string[]
    u_sortquestions?: string[]
    u_skipcorrect?: string[]
  }
  message?: string | null
}

const Preferences = FormSchemaPreferences

export async function preferencesUser(prevState: StatePreferences, formData: FormData) {
  //
  //  Validate form data
  //
  const validatedFields = Preferences.safeParse({
    u_uid: formData.get('u_uid'),
    u_name: formData.get('u_name'),
    u_fedid: formData.get('u_fedid'),
    u_fedcountry: formData.get('u_fedcountry'),
    u_dftmaxquestions: Number(formData.get('u_dftmaxquestions')),
    u_sortquestions: formData.get('u_sortquestions') === 'true', // Convert string to boolean
    u_skipcorrect: formData.get('u_skipcorrect') === 'true' // Convert string to boolean
  })
  //
  // If form validation fails, return errors early. Otherwise, continue.
  //
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.'
    }
  }
  //
  // Unpack form data
  //
  const {
    u_uid,
    u_name,
    u_fedid,
    u_fedcountry,
    u_dftmaxquestions,
    u_sortquestions,
    u_skipcorrect
  } = validatedFields.data
  //
  // Update data into the database
  //
  try {
    await sql`
    UPDATE users
    SET
      u_name = ${u_name},
      u_fedid = ${u_fedid},
      u_fedcountry = ${u_fedcountry},
      u_dftmaxquestions = ${u_dftmaxquestions},
      u_sortquestions = ${u_sortquestions},
      u_skipcorrect = ${u_skipcorrect}
    WHERE u_uid = ${u_uid}
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update User.'
    }
  }
  //
  // Revalidate the cache and redirect the user.
  //
  revalidatePath('/login')
  redirect('/login')
}
