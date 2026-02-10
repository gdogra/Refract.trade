'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume?: string
}

interface MarketIndicator {
  name: string
  value: number
  change: number
  changePercent: number
}

export default function MarketOverview() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['market-overview'],
    queryFn: async () => {
      // Mock data for now - will connect to real market data API later
      return {
        indices: [
          { symbol: 'SPY', price: 478.32, change: 2.45, changePercent: 0.51, volume: '45.2M' },
          { symbol: 'QQQ', price: 412.67, change: -1.23, changePercent: -0.30, volume: '32.1M' },
          { symbol: 'IWM', price: 201.45, change: 0.78, changePercent: 0.39, volume: '18.7M' },
          { symbol: 'VIX', price: 13.42, change: -0.67, changePercent: -4.76, volume: 'N/A' }
        ],
        indicators: [
          { name: 'Fear & Greed', value: 72, change: 3, changePercent: 4.35 },
          { name: 'Put/Call Ratio', value: 0.84, change: -0.02, changePercent: -2.33 },
          { name: 'Options Volume', value: 42.5, change: 5.2, changePercent: 13.93 },
          { name: 'IV Rank', value: 28, change: -2, changePercent: -6.67 }
        ]
      }
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number, decimals = 2) => 
    price.toFixed(decimals)

  const formatPercentage = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Overview</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Live • {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Market Indices */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Major Indices</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData?.indices.map((index, i) => (
            <motion.div
              key={index.symbol}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {index.symbol}
                </span>
                <div className={`flex items-center text-xs ${
                  index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {index.changePercent >= 0 ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {formatPercentage(index.changePercent)}
                </div>
              </div>
              
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatPrice(index.price)}
              </div>
              
              <div className={`text-sm ${
                index.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {index.change >= 0 ? '+' : ''}${formatPrice(index.change)}
              </div>
              
              {index.volume !== 'N/A' && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Vol: {index.volume}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Market Indicators */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Market Indicators</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData?.indicators.map((indicator, i) => (
            <motion.div
              key={indicator.name}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {indicator.name}
                </span>
                <div className={`flex items-center text-xs ${
                  indicator.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {indicator.changePercent >= 0 ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {formatPercentage(indicator.changePercent)}
                </div>
              </div>
              
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {indicator.name.includes('Ratio') || indicator.name.includes('Put') ? 
                  indicator.value.toFixed(2) : 
                  Math.round(indicator.value)
                }
                {indicator.name === 'Options Volume' && 'M'}
              </div>
              
              <div className={`text-sm ${
                indicator.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {indicator.change >= 0 ? '+' : ''}{
                  indicator.name.includes('Ratio') || indicator.name.includes('Put') ? 
                    indicator.change.toFixed(2) : 
                    indicator.change.toFixed(1)
                }
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Market Sentiment Indicator */}
      <motion.div 
        className="mt-6 p-4 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/10 dark:to-red-900/10 rounded-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Market Sentiment
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Based on volatility, volume, and options flow
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-green-600">Bullish</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Strong</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}