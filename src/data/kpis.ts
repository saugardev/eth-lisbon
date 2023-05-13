import type { Kpi } from 'src/components/KpiCard/KpiCard'

export const kpis: Kpi[] = [
  {
    title: 'Voting power',
    metric: '400',
    progress: 400 / 10000000 * 100,
    metricTarget: '10000000',
    delta: '',
    deltaType: 'increase',
  },
  {
    title: 'Active Proposals',
    metric: '12',
    progress: parseFloat((12 / 43 * 100).toFixed(2)),
    metricTarget: '43',
    delta: '',
    deltaType: 'increase',
  },
  {
    title: 'Something else',
    metric: '1,072',
    progress: 53.6,
    metricTarget: '2,000',
    delta: '10.1%',
    deltaType: 'moderateDecrease',
  },
]
