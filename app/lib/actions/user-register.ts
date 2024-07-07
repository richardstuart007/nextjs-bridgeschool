'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeUser, writeUsersOwner, writeUsersPwd } from '@/app/lib/data'
import bcrypt from 'bcryptjs'
import type { UsersTable } from '@/app/lib/definitions'
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
