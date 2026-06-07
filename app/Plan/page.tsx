import { PricingTable } from '@clerk/nextjs'
import React from 'react'
import Header from '../_shared/Header'

function page() {
  return (
      <div>
        <Header/>
       <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <h2 className="text-center text-xl font-bold mb-4">Plan</h2>
      <PricingTable />
    </div>

    </div>
  )
}

export default page
