'use server'

import { z } from 'zod'
import { writeLibrary, fetch_ownergroup1 } from '@/app/lib/data'
import validateLibrary from '@/app/lib/actions/admin-library-validate'
// ----------------------------------------------------------------------
//  Update Library Setup
// ----------------------------------------------------------------------
//
//  Form Schema for validation
//
const FormSchemaSetup = z.object({
  lrdesc: z.string().min(1),
  lrlink: z.string().min(1),
  lrwho: z.string(),
  lrtype: z.string(),
  lrowner: z.string(),
  lrref: z.string().min(1),
  lrgroup: z.string()
})
//
//  Errors and Messages
//
export type StateSetup = {
  errors?: {
    lrdesc?: string[]
    lrlink?: string[]
    lrwho?: string[]
    lrtype?: string[]
    lrowner?: string[]
    lrref?: string[]
    lrgroup?: string[]
  }
  message?: string | null
  databaseUpdated?: boolean
}

const Setup = FormSchemaSetup

export async function LibraryAdd(prevState: StateSetup, formData: FormData): Promise<StateSetup> {
  //
  //  Validate form data
  //
  const validatedFields = Setup.safeParse({
    lrdesc: formData.get('lrdesc'),
    lrlink: formData.get('lrlink'),
    lrwho: formData.get('lrwho'),
    lrtype: formData.get('lrtype'),
    lrowner: formData.get('lrowner'),
    lrref: formData.get('lrref'),
    lrgroup: formData.get('lrgroup')
  })
  //
  // If form validation fails, return errors early. Otherwise, continue.
  //
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid or missing fields'
    }
  }
  //
  // Unpack form data
  //
  const { lrdesc, lrlink, lrwho, lrtype, lrowner, lrref, lrgroup } = validatedFields.data
  //
  // Validate fields
  //
  const LibraryTable = {
    lrlid: 0,
    lrref: lrref,
    lrdesc: lrdesc,
    lrlink: lrlink,
    lrwho: lrwho,
    lrtype: lrtype,
    lrowner: lrowner,
    lrgroup: lrgroup,
    lrgid: 0
  }
  const errorMessages = await validateLibrary(LibraryTable)
  if (errorMessages.message) {
    return {
      errors: errorMessages.errors,
      message: errorMessages.message,
      databaseUpdated: false
    }
  }
  //
  // Update data into the database
  //
  try {
    //
    //  Get the ownergroup id
    //
    const ownergroup = await fetch_ownergroup1(lrowner, lrgroup)
    const lrgid = ownergroup.oggid
    //
    //  Update the library
    //
    const library = await writeLibrary(
      lrdesc,
      lrlink,
      lrwho,
      lrtype,
      lrowner,
      lrref,
      lrgroup,
      lrgid
    )
    const lid = library.lrlid
    return {
      message: `Library ${lid} written successfully.`,
      errors: undefined,
      databaseUpdated: true
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Write Library.',
      errors: undefined,
      databaseUpdated: false
    }
  }
}
