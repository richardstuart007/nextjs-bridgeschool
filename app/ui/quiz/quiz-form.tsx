'use client'

import { useState } from 'react'
import { QuestionsTable } from '@/app/lib/definitions'
import QuizQuestion from '@/app/ui/quiz-question/quiz-question'
import QuizBidding from '@/app/ui/quiz-question/quiz-bidding/QuizBidding'
import QuizHands from '@/app/ui/quiz-question/quiz-hands/QuizHands'
import QuizChoice from './quiz-choice'
import { QuizSubmit } from '@/app/ui/quiz/buttons'
import { useRouter } from 'next/navigation'
import { writeUsershistory } from '@/app/lib/actions'
import type { NewUsershistoryTable } from '@/app/lib/definitions'

interface QuestionsFormProps {
  questions: QuestionsTable[]
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionsForm(props: QuestionsFormProps): JSX.Element {
  //
  //  Deconstruct props
  //
  const questions = props.questions
  //
  //  Go back
  //
  const router = useRouter()
  //
  //  Define the State variables
  //
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [question, setQuestion] = useState(questions[currentQuestionIndex])
  const [answer, setAnswer] = useState<number[]>([])
  const [showSubmit, setShowSubmit] = useState(false)
  //...................................................................................
  //.  Next Question
  //...................................................................................
  function handleNextQuestion() {
    const nextQuestionIndex = currentQuestionIndex + 1
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex)
      setQuestion(questions[nextQuestionIndex])
      return
    }
    //
    //  Quiz completed
    //
    handleQuizCompleted()
  }
  //...................................................................................
  //.  Quiz Completed
  //...................................................................................
  function handleQuizCompleted() {
    //
    //  Initialise the results
    //
    let r_qid: number[] = []
    let r_points: number[] = []
    let r_totalpoints = 0
    let r_maxpoints = 0
    let r_correctpercent = 0
    //
    // Get the answered questions
    //
    const answeredQuestions = questions.slice(0, answer.length)
    //
    //  Loop through the answered questions
    //
    answeredQuestions.forEach((question, i) => {
      r_qid.push(question.qqid)

      const p = answer[i] - 1
      const points = question.qpoints[p]
      if (points !== undefined) {
        r_points.push(points)
        r_totalpoints += points
      }
      //
      //  Max points
      //
      r_maxpoints += Math.max(...question.qpoints)
    })

    if (r_maxpoints !== 0) {
      r_correctpercent = Math.ceil((r_totalpoints * 100) / r_maxpoints)
    }
    //
    //  Get the user from cookie
    //
    let r_uid = 0
    const BridgeSchool_Session = getCookie('BridgeSchool_Session')
    if (BridgeSchool_Session) {
      const JSON_BridgeSchool_Session = JSON.parse(BridgeSchool_Session)
      if (JSON_BridgeSchool_Session && JSON_BridgeSchool_Session.u_uid) {
        r_uid = JSON_BridgeSchool_Session.u_uid
      }
    }
    //
    // Create a NewUsersHistoryTable object
    //
    const history: NewUsershistoryTable = {
      r_datetime: new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 23),
      r_owner: question.qowner,
      r_group: question.qgroup,
      r_questions: answer.length,
      r_qid: r_qid,
      r_ans: answer,
      r_uid: r_uid,
      r_points: r_points,
      r_maxpoints: r_maxpoints,
      r_totalpoints: r_totalpoints,
      r_correctpercent: r_correctpercent,
      r_gid: question.qgid
    }
    console.log('history:', history)

    const historyRecord = writeUsershistory(history)
    console.log('historyRecord:', historyRecord)
    router.push(`/dashboard/quiz-review/${question.qgid}/quiz-review`)
  }
  //...................................................................................
  //.  Get a cookie
  //...................................................................................
  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const lastPart = parts.pop()
      if (lastPart) {
        const splitParts = lastPart.split(';')
        const firstPart = splitParts.shift()
        if (firstPart) {
          const decodedCookie = decodeURIComponent(firstPart)
          return decodedCookie
        }
      }
    }
    return undefined
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>id: {question.qqid}</p>
        <p>owner: {question.qowner}</p>
        <p>group: {question.qgroup}</p>
        <p>owner/group-ID: {question.qgid}</p>
      </div>
      <QuizQuestion question={question} quizQuestion={1} quizTotal={2} />
      <QuizBidding question={question} />
      <QuizHands question={question} />
      <QuizChoice question={question} setAnswer={setAnswer} setShowSubmit={setShowSubmit} />
      {showSubmit ? (
        <div className='whitespace-nowrap px-3 h-5'>
          <QuizSubmit onNextQuestion={handleNextQuestion} />
        </div>
      ) : null}
    </>
  )
}
