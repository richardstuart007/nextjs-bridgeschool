import { useState } from 'react'
//...................................................................................
//.  Main Line
//...................................................................................
export default function SelectCountry(props) {
  //
  //  Deconstruct
  //
  const { onChange, countryCode } = props
  //
  //  Countries
  //
  let { COUNTRIES } = require('./countries.js')
  // Sort the countries array by label
  COUNTRIES.sort((a, b) => a.label.localeCompare(b.label))

  let countryObj = COUNTRIES.find(country => country.code === countryCode)
  if (!countryObj) {
    countryObj = { code: 'ZZ', label: 'World', phone: '999' }
  }
  //
  //  State
  //
  const [selected, setSelected] = useState(countryObj)
  //...................................................................................
  return (
    <div className='flex justify-left'>
      <select
        value={selected.code}
        onChange={event => {
          const selectedCountryCode = event.target.value
          const selectedCountry = COUNTRIES.find(country => country.code === selectedCountryCode)
          setSelected(selectedCountry)
          if (selectedCountry) onChange(selectedCountry.code)
        }}
        className='w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200'
      >
        {COUNTRIES.map(option => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
