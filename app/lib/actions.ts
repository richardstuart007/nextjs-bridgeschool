'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.'
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string()
})

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

const FormSchemaRegister = z.object({
  email: z.string().email(),
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
      console.log('error-type:', error.type)
      switch (error.type) {
        case 'CallbackRouteError':
          return 'Invalid credentials. CallbackRouteError'
        case 'CredentialsSignin':
          return 'Invalid credentials. CredentialsSignin'
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
  console.log('Register User - start')
  const validatedFields = Register.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })
  //
  // If form validation fails, return errors early. Otherwise, continue.
  //
  if (!validatedFields.success) {
    console.log('Register User - field errors')
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Register.'
    }
  }
  //
  // Prepare data for insertion into the database
  //
  const { email, password } = validatedFields.data
  const u_email = email
  const u_hash = password
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
    console.log('Register User - database errors')
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
// ----------------------------------------------------------------------
//  Create Invoice
// ----------------------------------------------------------------------
const CreateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.'
    }
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  // Insert data into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.'
    }
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.'
    }
  }

  // Prepare data for update into the database
  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.'
    }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.'
    }
  }
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
