'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'
import type {
  UsersTable,
  NewUsershistoryTable,
  NewUserssessionsTable,
  BS_session
} from '@/app/lib/definitions'
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
    const userrecord = await sql<UsersTable>`SELECT *
      FROM users
      WHERE u_email=${email}`

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
  // Insert data into the database
  //
  const u_email = email
  const u_hash = await bcrypt.hash(password, 10)
  const u_user = email.split('@')[0]
  const u_joined = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const u_fedid = 'dummy'
  const u_admin = false
  const u_fedcountry = 'NZ'
  const u_dev = false
  try {
    await sql`
    INSERT
      INTO users
       (
        u_email,
        u_hash,
        u_user,
        u_joined,
        u_fedid,
        u_admin,
        u_fedcountry,
        u_dev)
    VALUES (
      ${u_email},
      ${u_hash},
      ${u_user},
      ${u_joined},
      ${u_fedid},
      ${u_admin},
      ${u_fedcountry},
      ${u_dev})
  `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Register User.'
    }
  }
  //
  // Revalidate the cache and redirect the user.
  //
  revalidatePath('/dashboard')
  redirect('/dashboard')
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
//---------------------------------------------------------------------
//  Update User Sessions to signed out
//---------------------------------------------------------------------
export async function UserssessionsSignout(usid: number) {
  try {
    await sql`
    UPDATE userssessions
    SET
      ussignedin = false
    WHERE usid = ${usid}
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Userssession.'
    }
  }
}
// ----------------------------------------------------------------------
//  Update Cookie information
// ----------------------------------------------------------------------
export async function updateCookie(Bssession_updates: Partial<BS_session>) {
  try {
    //
    //  Get the Bridge School session cookie
    //
    let BSsession = await getCookie()
    //
    // Initialize BSsession if it doesn't exist
    //
    if (!BSsession) {
      BSsession = {
        bsuid: 0,
        bsname: '',
        bsemail: '',
        bsid: 0,
        bssignedin: false,
        bssortquestions: false,
        bsskipcorrect: false,
        bsdftmaxquestions: 0
      }
    }
    //
    // Update or add the fields from Bssession_updates
    //
    Object.assign(BSsession, Bssession_updates)
    //
    //  Write the cookie
    //
    const JSON_BSsession = JSON.stringify(BSsession)
    cookies().set('BS_session', JSON_BSsession, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/'
    })
  } catch (error) {
    throw new Error('Failed to update cookie info.')
  }
}
// ----------------------------------------------------------------------
//  Delete Cookie
// ----------------------------------------------------------------------
export async function deleteCookie() {
  try {
    cookies().delete('BS_session')
  } catch (error) {
    throw new Error('Failed to delete cookie.')
  }
}
// ----------------------------------------------------------------------
//  Get Cookie information
// ----------------------------------------------------------------------
export async function getCookie(): Promise<BS_session | null> {
  try {
    const cookie = cookies().get('BS_session')
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
//  Update User Setup
// ----------------------------------------------------------------------
//
//  Form Schema for validation
//
const FormSchemaSetup = z.object({
  u_uid: z.string(),
  u_name: z.string(),
  u_fedid: z.string(),
  u_fedcountry: z.string()
})
//
//  Errors and Messages
//
export type StateSetup = {
  errors?: {
    u_uid?: string[]
    u_name?: string[]
    u_fedid?: string[]
    u_fedcountry?: string[]
  }
  message?: string | null
}

const Setup = FormSchemaSetup

export async function SetupUser(prevState: StateSetup, formData: FormData) {
  //
  //  Validate form data
  //
  const validatedFields = Setup.safeParse({
    u_uid: formData.get('u_uid'),
    u_name: formData.get('u_name'),
    u_fedid: formData.get('u_fedid'),
    u_fedcountry: formData.get('u_fedcountry')
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
  const { u_uid, u_name, u_fedid, u_fedcountry } = validatedFields.data
  //
  // Update data into the database
  //
  try {
    await sql`
    UPDATE users
    SET
      u_name = ${u_name},
      u_fedid = ${u_fedid},
      u_fedcountry = ${u_fedcountry}
    WHERE u_uid = ${u_uid}
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update User.'
    }
  }
  //
  //  Update the cookie name
  //
  await updateCookie({ bsname: u_name })
  //
  // Revalidate the cache and redirect the user.
  //
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
// ----------------------------------------------------------------------
//  Update Session
// ----------------------------------------------------------------------
//
//  Form Schema for validation
//
const FormSchemaSession = z.object({
  bsdftmaxquestions: z.number().min(5).max(100),
  bssortquestions: z.boolean(),
  bsskipcorrect: z.boolean()
})
//
//  Errors and Messages
//
export type StateSession = {
  errors?: {
    bsdftmaxquestions?: string[]
    bssortquestions?: string[]
    bsskipcorrect?: string[]
  }
  message?: string | null
}

const Session = FormSchemaSession

export async function sessionUser(prevState: StateSession, formData: FormData) {
  //
  //  Validate form data
  //
  const validatedFields = Session.safeParse({
    bsdftmaxquestions: Number(formData.get('bsdftmaxquestions')),
    bssortquestions: formData.get('bssortquestions') === 'true', // Convert string to boolean
    bsskipcorrect: formData.get('bsskipcorrect') === 'true' // Convert string to boolean
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
  const { bsdftmaxquestions, bssortquestions, bsskipcorrect } = validatedFields.data
  //
  //  Update the cookie name
  //
  await updateCookie({
    bsdftmaxquestions: bsdftmaxquestions,
    bssortquestions: bssortquestions,
    bsskipcorrect: bsskipcorrect
  })
  //
  // Revalidate the cache and redirect the user.
  //
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
// ----------------------------------------------------------------------
//  Nav signout
// ----------------------------------------------------------------------
export async function navsignout() {
  try {
    //
    //  Get the Bridge School session cookie
    //
    const bssession = await getCookie()
    if (!bssession) return
    //
    //  Delete the cookie
    //
    await deleteCookie()
    //
    //  Update the session to signed out
    //
    const bsid = bssession.bsid
    await UserssessionsSignout(bsid)
    //
    //  Errors
    //
  } catch (error) {
    throw new Error('Failed to sign out.')
  }
}
