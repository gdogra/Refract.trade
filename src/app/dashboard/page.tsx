import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardClient from './components/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard - Refract.trade',
  description: 'Portfolio overview and risk metrics dashboard',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <DashboardClient />
}