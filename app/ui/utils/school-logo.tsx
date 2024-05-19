import Image from 'next/image'
import { lusitana } from '@/app/ui/fonts'

export default function SchoolLogo() {
  return (
    <div className={`${lusitana.className} `}>
      <Image src='/logos/bridgelogo.svg' width={150} height={150} priority alt='bridgecards' />
    </div>
  )
}
