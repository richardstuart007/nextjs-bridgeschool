import { useState } from 'react'
import { COUNTRIES } from './countries.js'

interface Props {
  onChange: (code: string) => void
  countryCode: string
}
interface Country {
  code: string
  label: string
  phone: string
}
export default function SelectCountry({ onChange, countryCode }: Props): JSX.Element {
  //
  // Sort the countries array by label
  //
  COUNTRIES.sort((a, b) => a.label.localeCompare(b.label))
  //
  //  Find country or default
  //
  let countryInit = COUNTRIES.find(country => country.code === countryCode)
  if (!countryInit) countryInit = { code: 'ZZ', label: 'World', phone: '999' }
  //
  //  State
  //
  const [country, setCountry] = useState<Country>(countryInit as Country)
  //-----------------------------------------------------------------------------------
  //  Country Change Handler
  //-----------------------------------------------------------------------------------
  function handleCountryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    //
    //  Find the selected country
    //
    const selectedCountryCode = event.target.value
    const selectedCountry = COUNTRIES.find(country => country.code === selectedCountryCode)
    //
    //  Update state
    //
    setCountry(selectedCountry as Country)
    //
    //  Call the parent onChange function
    //
    if (selectedCountry) onChange(selectedCountry.code)
  }
  //...................................................................................
  return (
    <div className='flex justify-left'>
      <select
        value={country.code}
        onChange={handleCountryChange}
        className='w-72 px-4 py-[9px] border border-gray-200 rounded-md text-sm outline-2 focus:outline-none focus:ring focus:ring-blue-200'
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
