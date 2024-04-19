import { sql } from '@vercel/postgres'
import { unstable_noStore as noStore } from 'next/cache'
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LibraryTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  QuestionsTable
} from './definitions'
import { formatCurrency } from './utils'

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore()

  try {
    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`

    // console.log('Data fetch revenue completed after 3 seconds.');

    return data.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

export async function fetchLatestInvoices() {
  noStore()
  try {
    // console.log('Fetching LatestInvoices data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`

    // console.log('Data fetch LatestInvoices completed after 3 seconds.');

    const latestInvoices = data.rows.map(invoice => ({
      ...invoice,
      amount: formatCurrency(invoice.amount)
    }))
    return latestInvoices
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch the latest invoices.')
  }
}

export async function fetchCardData() {
  noStore()
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`

    // console.log('Fetching Card data...');
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise
    ])

    // console.log('Data fetch Card completed after 2 seconds.');

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0')
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0')
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0')
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0')

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

const ITEMS_PER_PAGE = 6
const LIBRARY_ITEMS_PER_PAGE = 10
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `

    return invoices.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoices.')
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of invoices.')
  }
}

export async function fetchInvoiceById(id: string) {
  noStore()
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `

    const invoice = data.rows.map(invoice => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100
    }))

    return invoice[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoice.')
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `

    const customers = data.rows
    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all customers.')
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore()
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `

    const customers = data.rows.map(customer => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid)
    }))

    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`
    return user.rows[0] as User
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}
//---------------------------------------------------------------------
//  Library totals
//---------------------------------------------------------------------
export async function fetchLibraryPages(query: string) {
  noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM library
    WHERE
      lrlid::text ILIKE ${`%${query}%`} OR
      lrref ILIKE ${`%${query}%`} OR
      lrdesc ILIKE ${`%${query}%`} OR
      lrwho ILIKE ${`%${query}%`} OR
      lrowner ILIKE ${`%${query}%`} OR
      lrgroup ILIKE ${`%${query}%`}
  `
    const totalPages = Math.ceil(Number(count.rows[0].count) / LIBRARY_ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of library items.')
  }
}
//---------------------------------------------------------------------
//  Library data
//---------------------------------------------------------------------
export async function fetchFilteredLibrary(query: string, currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * LIBRARY_ITEMS_PER_PAGE

  try {
    const library = await sql<LibraryTable>`
      SELECT
      lrlid,
      lrref,
      lrdesc,
      lrwho,
      lrtype,
      lrowner,
      lrgroup,
      lrlink,
      ogcntquestions,
      ogcntlibrary
    FROM library
    LEFT JOIN ownergroup ON lrowner = ogowner and lrgroup = oggroup
    WHERE
      lrlid::text ILIKE ${`%${query}%`} OR
      lrref ILIKE ${`%${query}%`} OR
      lrdesc ILIKE ${`%${query}%`} OR
      lrwho ILIKE ${`%${query}%`} OR
      lrowner ILIKE ${`%${query}%`} OR
      lrgroup ILIKE ${`%${query}%`}
      ORDER BY lrref
      LIMIT ${LIBRARY_ITEMS_PER_PAGE} OFFSET ${offset}
    `
    return library.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch library.')
  }
}
//---------------------------------------------------------------------
//  Library data by ID
//---------------------------------------------------------------------
export async function fetchLibraryById(lrlid: number) {
  noStore()
  try {
    const data = await sql<LibraryTable>`
      SELECT
      lrlid,
      lrref,
      lrdesc,
      lrwho,
      lrtype,
      lrowner,
      lrgroup
      FROM library
      WHERE lrlid = ${lrlid};
    `

    const library = data.rows
    return library[0]
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
      SELECT
        qqid,
        qowner,
        qdetail,
        qgroup,
        qpoints,
        qans,
        qseq,
        qrounds,
        qnorth,
        qeast,
        qsouth,
        qwest
      FROM questions
      WHERE qowner = ${qowner} and qgroup = ${qgroup}
      ORDER BY qowner, qgroup, qseq;
    `

    //
    //  Return rows
    //
    const questions = data.rows
    return questions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch questions.')
  }
}
//---------------------------------------------------------------------
//  Write User History
//---------------------------------------------------------------------
export async function writeUserHistory() {
  try {
    return null
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to write user history.')
  }
}
