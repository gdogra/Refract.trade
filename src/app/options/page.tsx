import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OptionsChainClient from './components/OptionsChainClient'

export const metadata: Metadata = {
  title: 'Options Chain Explorer - Refract.trade',
  description: 'Real-time options chain analysis and trading tools',
}

export default async function OptionsChainPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <OptionsChainClient />
}