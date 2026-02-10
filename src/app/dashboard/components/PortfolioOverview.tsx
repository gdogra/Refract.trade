'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Activity } from 'lucide-react'

interface PortfolioStats {
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
  totalPnL: number
  totalPnLPercent: number
  buyingPower: number
  riskUtilization: number
}

export default function PortfolioOverview() {
  const { data: portfolio, isLoading } = useQuery<PortfolioStats>({
    queryKey: ['portfolio-overview'],
    queryFn: async () => {
      // Mock data for now - will connect to API later
      return {
        totalValue: 125840.32,
        dailyChange: 2340.50,
        dailyChangePercent: 1.89,
        totalPnL: 15840.32,
        totalPnLPercent: 14.39,
        buyingPower: 45600.00,
        riskUtilization: 0.68
      }
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  const formatPercentage = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio Overview</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-brand-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(portfolio?.totalValue || 0)}
          </div>
          <div className={`flex items-center space-x-1 text-sm ${
            (portfolio?.dailyChangePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(portfolio?.dailyChangePercent || 0) >= 0 ? 
              <TrendingUp className="h-4 w-4" /> : 
              <TrendingDown className="h-4 w-4" />
            }
            <span>{formatCurrency(portfolio?.dailyChange || 0)}</span>
            <span>({formatPercentage(portfolio?.dailyChangePercent || 0)})</span>
          </div>
        </motion.div>

        {/* Total P&L */}
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${
            (portfolio?.totalPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(portfolio?.totalPnL || 0)}
          </div>
          <div className={`text-sm ${
            (portfolio?.totalPnLPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatPercentage(portfolio?.totalPnLPercent || 0)} all time
          </div>
        </motion.div>

        {/* Buying Power */}
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Buying Power</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(portfolio?.buyingPower || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Available to trade
          </div>
        </motion.div>

        {/* Risk Utilization */}
        <motion.div 
          className="space-y-2 md:col-span-2 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Risk Utilization</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {((portfolio?.riskUtilization || 0) * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full ${
                (portfolio?.riskUtilization || 0) > 0.8 ? 'bg-red-500' :
                (portfolio?.riskUtilization || 0) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(portfolio?.riskUtilization || 0) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Performance Chart Placeholder */}
        <motion.div 
          className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            30-Day Performance
          </h3>
          <div className="h-20 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded flex items-center justify-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Chart visualization coming soon
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}