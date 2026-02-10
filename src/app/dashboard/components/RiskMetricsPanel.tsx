'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Activity, TrendingUp } from 'lucide-react'

interface RiskMetrics {
  portfolioBeta: number
  valueAtRisk: number
  stressTestScore: number
  concentrationRisk: number
  greeks: {
    delta: number
    gamma: number
    theta: number
    vega: number
  }
  riskScore: number
}

export default function RiskMetricsPanel() {
  const { data: riskMetrics, isLoading } = useQuery<RiskMetrics>({
    queryKey: ['risk-metrics'],
    queryFn: async () => {
      // Mock data for now - will connect to API later
      return {
        portfolioBeta: 1.23,
        valueAtRisk: -4567.89,
        stressTestScore: 7.8,
        concentrationRisk: 0.34,
        greeks: {
          delta: 0.67,
          gamma: 0.045,
          theta: -23.45,
          vega: 156.78
        },
        riskScore: 6.5
      }
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-100 dark:bg-red-900/20'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-green-600 bg-green-100 dark:bg-green-900/20'
  }

  const getRiskLevel = (score: number) => {
    if (score >= 8) return 'High Risk'
    if (score >= 6) return 'Moderate Risk'
    return 'Low Risk'
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Metrics</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(riskMetrics?.riskScore || 0)}`}>
          {getRiskLevel(riskMetrics?.riskScore || 0)}
        </div>
      </div>

      <div className="space-y-6">
        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-brand-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Risk Score</span>
            </div>
            <span className="text-sm font-medium">{riskMetrics?.riskScore}/10</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(riskMetrics?.riskScore || 0) * 10}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Value at Risk */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Value at Risk (95%)</span>
          </div>
          <div className="text-lg font-semibold text-red-600">
            ${Math.abs(riskMetrics?.valueAtRisk || 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Maximum expected loss in 1 day
          </div>
        </div>

        {/* Portfolio Beta */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Beta</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {riskMetrics?.portfolioBeta.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {(riskMetrics?.portfolioBeta || 0) > 1 ? 'More volatile than market' : 'Less volatile than market'}
          </div>
        </div>

        {/* Greeks Summary */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Greeks</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">Delta</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {riskMetrics?.greeks.delta.toFixed(3)}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">Gamma</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {riskMetrics?.greeks.gamma.toFixed(3)}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">Theta</div>
              <div className="text-sm font-medium text-red-600">
                ${riskMetrics?.greeks.theta.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">Vega</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {riskMetrics?.greeks.vega.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Stress Test Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Stress Test Score</span>
            <span className="text-sm font-medium">{riskMetrics?.stressTestScore}/10</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full ${
                (riskMetrics?.stressTestScore || 0) >= 8 ? 'bg-green-500' :
                (riskMetrics?.stressTestScore || 0) >= 6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(riskMetrics?.stressTestScore || 0) * 10}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          className="w-full bg-brand-500 hover:bg-brand-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Detailed Risk Analysis
        </motion.button>
      </div>
    </motion.div>
  )
}