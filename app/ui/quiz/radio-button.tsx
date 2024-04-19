import { useState } from 'react'

interface RadioOption {
  id: string
  label: string
  value: number
}

interface RadioGroupProps {
  options: RadioOption[]
  selectedOption: number
  onChange: (value: number) => void
}

export default function RadioGroup(props: RadioGroupProps): JSX.Element {
  const { options, selectedOption, onChange } = props
  const [selectedValue, setSelectedValue] = useState<number>(selectedOption)

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const int = parseInt(value)
    setSelectedValue(int)
    onChange(int)
    console.log('int', int)
  }

  return (
    <div>
      {options.map(option => (
        <div key={option.id}>
          <input
            type='radio'
            id={option.id}
            name='options'
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleOptionChange}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
    </div>
  )
}
