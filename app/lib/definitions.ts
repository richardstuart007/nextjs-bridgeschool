import { DateTime } from 'next-auth/providers/kakao'

export type LibraryTable = {
  lrlid: number
  lrref: string
  lrdesc: string
  lrlink: string
  lrwho: string
  lrtype: string
  lrowner: string
  lrgroup: string
  lrgid: number
}

export type LibraryGroupTable = {
  lrlid: number
  lrref: string
  lrdesc: string
  lrlink: string
  lrwho: string
  lrtype: string
  lrowner: string
  lrgroup: string
  lrgid: number
  ogowner: string
  oggroup: string
  ogtitle: string
  ogcntquestions: number
  ogcntlibrary: number
  oggid: number
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
  r_sid: number
}

export type NewUsershistoryTable = Omit<UsershistoryTable, 'r_hid'>

export type HistoryGroupTable = {
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
  r_sid: number
  ogowner: string
  oggroup: string
  ogtitle: string
  ogcntquestions: number
  ogcntlibrary: number
  u_name: string
}

export type OwnergroupTable = {
  ogowner: string
  oggroup: string
  ogtitle: string
  ogcntquestions: number
  ogcntlibrary: number
  oggid: number
}

export type UserssessionsTable = {
  usid: number
  usdatetime: DateTime
  usuid: number
  ususer: string
}

export type NewUserssessionsTable = Omit<UserssessionsTable, 'usid'>

export type UserAuth = {
  id: string
  name: string
  email: string
  password: string
}

export type UsersTable = {
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

export type BSsessionTable = {
  u_uid: number
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
  usid: number
} | null

export interface UsershistoryTopResults {
  r_uid: number
  u_name: string
  record_count: number
  total_points: number
  total_maxpoints: number
  percentage: number
}

export interface UsershistoryRecentResults {
  r_hid: number
  r_uid: number
  u_name: string
  r_totalpoints: number
  r_maxpoints: number
  r_correctpercent: number
}
