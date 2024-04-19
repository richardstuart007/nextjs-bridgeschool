import { useEffect, useState } from 'react'
import RadioGroup from './radio-button'
import { QuestionsTable } from '@/app/lib/definitions'

// Define the RadioOption type
interface RadioOption {
  id: string
  label: string
  value: number
}

interface QuizChoiceProps {
  question: QuestionsTable
  setValue: (value: number) => void
  setId: (value: string) => void
  setShowSubmit: (value: boolean) => void
}

export default function QuizChoice(props: QuizChoiceProps): JSX.Element {
  const { question, setValue, setId, setShowSubmit } = props
  const [answers, setAnswers] = useState<RadioOption[]>([])
  const [selectedOption, setSelectedOption] = useState<number>(99)
  const [questionText, setQuestionText] = useState<string>('')
  //
  //  Recreate on change of question
  //
  useEffect(() => {
    newRow()
    // eslint-disable-next-line
  }, [question])
  //...................................................................................
  //  Load Answers array with answer element
  //...................................................................................
  function newRow(): void {
    setValue(99)
    setId('')
    setShowSubmit(false)
    //
    //  Determine questionText
    //
    const qdetail = question.qdetail
    const hyperLink = qdetail.substring(0, 8) === 'https://'
    const text = hyperLink ? 'Select your answer' : qdetail
    setQuestionText(text)
    //
    //  Answers array
    //
    const shuffledOptions = shuffleArray(question.qans)
    const newOptions = shuffledOptions.map((option, index) => ({
      id: index.toString(),
      label: option.toString(),
      value: question.qans.indexOf(option)
    }))

    setAnswers(newOptions)
  }
  //...................................................................................
  // Shuffle array function
  //...................................................................................
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
  //...................................................................................
  //. Answer Selected
  //...................................................................................
  function handleSelect(value: number): void {
    setSelectedOption(value)
    setValue(value)
    const id = answers[value].id
    setId(id)
    setShowSubmit(true)
    console.log('setShowSubmit', true)
  }
  //...................................................................................
  //  Format Panel
  //...................................................................................
  return (
    <div>
      <div>{questionText}</div>
      <RadioGroup options={answers} selectedOption={selectedOption} onChange={handleSelect} />
    </div>
  )
}
