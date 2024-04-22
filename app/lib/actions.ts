'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'
import type { Userrecord, NewUsershistoryTable, NewUserssessionsTable } from '@/app/lib/definitions'
import { cookies } from 'next/headers'
//
//  Register
//
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
    const userrecord = await sql<Userrecord>`SELECT * FROM users WHERE u_email=${email}`
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
  // Prepare data for insertion into the database
  //
  const u_email = email
  const u_hash = await bcrypt.hash(password, 10)
  const u_user = email
  const u_name = email
  const u_joined = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const u_fedid = 'dummy'
  const u_admin = false
  const u_showprogress = true
  const u_showscore = true
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
    INSERT INTO users (u_email, u_hash, u_user, u_name, u_joined, u_fedid, u_admin, u_showprogress, u_showscore, u_sortquestions, u_skipcorrect, u_dftmaxquestions, u_fedcountry, u_dev)
    VALUES (${u_email}, ${u_hash}, ${u_user}, ${u_name}, ${u_joined}, ${u_fedid}, ${u_admin}, ${u_showprogress}, ${u_showscore}, ${u_sortquestions}, ${u_skipcorrect}, ${u_dftmaxquestions}, ${u_fedcountry}, ${u_dev})
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
export async function writeUsershistory(history: NewUsershistoryTable) {
  try {
    //
    //  Get the user from cookie
    //
    let r_uid = 0
    const BridgeSchool_Session = cookies().get('BridgeSchool_Session')
    if (BridgeSchool_Session) {
      const decodedCookie = decodeURIComponent(BridgeSchool_Session.value)
      const JSON_BridgeSchool_Session = JSON.parse(decodedCookie)
      if (JSON_BridgeSchool_Session && JSON_BridgeSchool_Session.u_uid) {
        r_uid = JSON_BridgeSchool_Session.u_uid
      }
    } else {
      console.log('ACTIONS: No cookie found')
    }

    console.log('ACTIONS: r_uid:', r_uid)
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
      r_points,
      r_maxpoints,
      r_totalpoints,
      r_correctpercent,
      r_gid
    } = history

    const r_qid_string = `{${r_qid.join(',')}}`
    const r_ans_string = `{${r_ans.join(',')}}`
    const r_points_string = `{${r_points.join(',')}}`

    const { rows } = await sql`INSERT INTO Usershistory
    (r_datetime, r_owner, r_group, r_questions, r_qid, r_ans, r_uid, r_points,
       r_maxpoints, r_totalpoints, r_correctpercent, r_gid)
    VALUES (${r_datetime}, ${r_owner},${r_group},${r_questions},${r_qid_string},${r_ans_string},${r_uid},${r_points_string},
      ${r_maxpoints},${r_totalpoints},${r_correctpercent},${r_gid})
    RETURNING *`

    console.log('ACTIONS: rows:', rows)
    return rows[0]
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
