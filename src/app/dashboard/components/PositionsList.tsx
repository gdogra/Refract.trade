'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Calendar, Target, MoreHorizontal } from 'lucide-react'

interface Position {
  id: string
  symbol: string
  strategy: string
  quantity: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  expiry: string
  daysToExpiry: number
  delta: number
  theta: number
}

export default function PositionsList() {
  const { data: positions, isLoading } = useQuery<Position[]>({
    queryKey: ['positions'],
    queryFn: async () => {
      // Mock data for now - will connect to API later
      return [
        {
          id: '1',
          symbol: 'AAPL',
          strategy: 'Iron Condor',
          quantity: 5,
          entryPrice: 2.45,
          currentPrice: 3.20,
          pnl: 375.00,
          pnlPercent: 30.61,
          expiry: '2024-01-19',
          daysToExpiry: 14,
          delta: 0.23,
          theta: -12.50
        },
        {
          id: '2',
          symbol: 'TSLA',
          strategy: 'Bull Call Spread',
          quantity: 10,
          entryPrice: 4.80,
          currentPrice: 3.90,
          pnl: -900.00,
          pnlPercent: -18.75,
          expiry: '2024-02-16',
          daysToExpiry: 42,
          delta: 0.67,
          theta: -8.75
        },
        {
          id: '3',
          symbol: 'SPY',
          strategy: 'Short Straddle',
          quantity: 2,
          entryPrice: 8.25,
          currentPrice: 6.80,
          pnl: 290.00,
          pnlPercent: 17.58,
          expiry: '2024-01-12',
          daysToExpiry: 7,
          delta: -0.12,
          theta: 45.30
        }
      ]
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Positions</h3>
        <motion.button 
          className="text-brand-500 hover:text-brand-600 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </div>

      <div className="space-y-4">
        {positions?.map((position, index) => (
          <motion.div
            key={position.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {position.symbol}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {position.strategy}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {position.quantity}x
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>Entry: {formatCurrency(position.entryPrice)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{position.daysToExpiry}d to expiry</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Δ: {position.delta >= 0 ? '+' : ''}{position.delta.toFixed(2)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Θ: {position.theta >= 0 ? '+' : ''}{position.theta.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className={`font-semibold ${
                  position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(position.pnl)}
                </div>
                <div className={`text-sm flex items-center ${
                  position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {position.pnlPercent >= 0 ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {formatPercentage(position.pnlPercent)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Current: {formatCurrency(position.currentPrice)}
                </div>
              </div>

              <motion.button 
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total P&L Today
          </span>
          <span className="font-semibold text-green-600">
            +$1,234.56 (+2.34%)
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}