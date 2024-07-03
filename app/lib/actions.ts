'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import {
  getCookieSessionId,
  UpdateSessions,
  navsignout,
  writeUser,
  writeUsersOwner,
  writeUsersPwd
} from '@/app/lib/data'
import bcrypt from 'bcryptjs'
import type { UsersTable } from '@/app/lib/definitions'
// ----------------------------------------------------------------------
//  loginUser Login
// ----------------------------------------------------------------------
//
//  Define the schema for zod
//
const FormSchemaLogin = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string()
})
//
//  Define the state type
//
export type StateLogin = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string | null
}

const Login = FormSchemaLogin

export async function loginUser(prevState: StateLogin | undefined, formData: FormData) {
  //
  //  Validate the fields using Zod
  //
  const validatedFields = Login.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })
  //
  // If form validation fails, return errors early. Otherwise, continue.
  //
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Login.'
    }
  }
  //
  // Unpack form data
  //
  const { email, password } = validatedFields.data
  try {
    await signIn('credentials', { email, password })
  } catch (error) {
    if (error instanceof AuthError) {
      let errorMessage: string
      switch (error.type) {
        case 'CallbackRouteError':
          const credentialsError = error.cause?.err
          errorMessage = credentialsError?.message || 'Invalid email or password'
          break
        case 'CredentialsSignin':
          errorMessage = 'Invalid email or password'
          break
        default:
          errorMessage = 'Something went wrong - unknown error'
      }
      return { ...prevState, message: errorMessage }
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
  //
  //  Validate the fields using Zod
  //
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
  const name = email.split('@')[0]
  const provider = 'email'
  //
  //  Write User
  //
  try {
    const userRecord = (await writeUser(provider, email, name)) as UsersTable | undefined
    if (!userRecord) {
      console.log('registerUser: Write User Error:')
      throw Error('registerUser: Write User Error')
    }
    //
    //  Get inserted record
    //
    const userid = userRecord.u_uid
    //
    //  Write the userspwd data
    //
    const uphash = await bcrypt.hash(password, 10)
    await writeUsersPwd(userid, uphash, email)
    //
    //  Write the usersowner data
    //
    await writeUsersOwner(userid)
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
  //  Get session id
  //
  const cookie = await getCookieSessionId()
  let sessionId = 0
  //
  //  Update the session
  //
  if (cookie) {
    sessionId = parseInt(cookie, 10)
    await UpdateSessions(sessionId, bsdftmaxquestions, bssortquestions, bsskipcorrect)
  }
  //
  //  Update the session
  //
  await UpdateSessions(sessionId, bsdftmaxquestions, bssortquestions, bsskipcorrect)
  //
  // Revalidate the cache and redirect the user.
  //
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
// ----------------------------------------------------------------------
//  Sign out
// ----------------------------------------------------------------------
export async function serverSignout() {
  await navsignout()
  await signOut()
}
