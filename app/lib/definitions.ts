// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import { DateTime } from 'next-auth/providers/kakao'

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string
  name: string
  email: string
  password: string
}

export type Userrecord = {
  u_uid: number
  u_hash: string
  u_user: string
  u_name: string
  u_email: string
  u_joined: DateTime
  u_fedid: string
  u_admin: boolean
  u_showprogress: boolean
  u_showscore: boolean
  u_sortquestions: boolean
  u_skipcorrect: boolean
  u_dftmaxquestions: number
  u_fedcountry: string
  u_dev: boolean
}

export type Customer = {
  id: string
  name: string
  email: string
  image_url: string
}

export type Invoice = {
  id: string
  customer_id: string
  amount: number
  date: string
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid'
}

export type Revenue = {
  month: string
  revenue: number
}

export type LatestInvoice = {
  id: string
  name: string
  image_url: string
  email: string
  amount: string
}

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number
}

export type InvoicesTable = {
  id: string
  customer_id: string
  name: string
  email: string
  image_url: string
  date: string
  amount: number
  status: 'pending' | 'paid'
}

export type CustomersTableType = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: number
  total_paid: number
}

export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: string
  total_paid: string
}

export type CustomerField = {
  id: string
  name: string
}

export type InvoiceForm = {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export type LibraryTable = {
  lrlid: number
  lrref: string
  lrdesc: string
  lrlink: string
  lrwho: string
  lrtype: string
  lrowner: string
  lrgroup: string
  ogcntquestions: number
  ogcntlibrary: number
  lrgid: number
}

export type QuestionsTable = {
  qqid: number
  qowner: string
  qdetail: string
  qgroup: string
  qpoints: number[]
  qans: number[]
  qseq: number
  qrounds: string[][] | null
  qnorth: string[] | null
  qeast: string[] | null
  qsouth: string[] | null
  qwest: string[] | null
  qgid: number
}

export type UsershistoryTable = {
  r_hid: number
  r_datetime: DateTime
  r_owner: string
  r_group: string
  r_questions: number
  r_qid: number[]
  r_ans: number[]
  r_uid: number
  r_points: number[]
  r_maxpoints: number
  r_totalpoints: number
  r_correctpercent: number
  r_gid: number
}

export type NewUsershistoryTable = Omit<UsershistoryTable, 'r_hid'>

export type Userssessions = {
  usid: number
  usdatetime: DateTime
  usuid: number
  ususer: string
}

export type NewUserssessionsTable = Omit<Userssessions, 'usid'>
