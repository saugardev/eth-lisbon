import { useState } from 'react'

import { Grid, Tab, TabList, Text, Title } from '@tremor/react'

import ChartView from 'src/components/ChartView/ChartView'
import KpiCard from 'src/components/KpiCard/KpiCard'
import TableView from 'src/components/TableView/TableView'
import { kpis } from 'src/data/kpis'
import { performance } from 'src/data/performance'
import { salesPeople } from 'src/data/salesPeople'
import Footer from '~/components/footer'
import Header from '~/components/ui/header'

const DashboardPage = () => {
  const [selectedView, setSelectedView] = useState('1')

  return (
    <>
    <Header/>
    <main className="grow">
      <div className="bg-slate-50 sm:p-10">
        <Title className='mt-10 text-2xl'>Dashboard</Title>
        <Text>Manage all your proposals from Guvn000r</Text>

        <TabList
          defaultValue="1"
          onValueChange={(value) => setSelectedView(value)}
          className="mt-6"
        >
          <Tab value="1" text="Overview" />
          <Tab value="2" text="Detail" />
        </TabList>

        {selectedView === '1' ? (
          <>
            <Grid numColsLg={3} className="mt-6 gap-6">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.title} kpi={kpi} />
              ))}
            </Grid>

            <div className="mt-6">
              <ChartView performance={performance} />
            </div>
          </>
        ) : (
          <TableView salesPeople={salesPeople} />
        )}
      </div>
    </main>
    <Footer />
    </>
  )
}

export default DashboardPage