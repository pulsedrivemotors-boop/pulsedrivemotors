"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const PRICE_OPTIONS = [
  { label: 'Any Price',          value: '' },
  { label: 'Under $7,000',       value: 'max-7000' },
  { label: '$7,000 – $15,000',   value: 'min-7000-max-15000' },
  { label: '$15,000+',           value: 'min-15000' },
]

export default function HomeSearch() {
  const router = useRouter()
  const [make, setMake] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (make) params.set('make', make)
    if (type === 'Electric') {
      params.set('fuel', 'Electric')
    } else if (type) {
      params.set('type', type)
    }
    if (price) {
      const [, minPart, , maxPart] = price.match(/(?:min-(\d+))?(?:-?max-(\d+))?/) ?? []
      if (minPart) params.set('minPrice', minPart)
      if (maxPart) params.set('maxPrice', maxPart)
      if (!minPart && !maxPart && price.startsWith('min-')) {
        params.set('minPrice', price.replace('min-', ''))
      }
    }
    router.push(`/inventory?${params.toString()}`)
  }

  const selectClass = "bg-black border border-white/20 text-white rounded-lg px-3 py-3 text-sm focus:border-lime-500 focus:outline-none"

  return (
    <div className="bg-gray-900/80 backdrop-blur border border-lime-500/20 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <select value={make} onChange={e => setMake(e.target.value)} className={selectClass}>
          <option value="">Any Make</option>
          {['Toyota','Honda','Ford','Chevrolet','BMW','Audi','Tesla','Dodge','Hyundai','Kia','Nissan','Mazda','Subaru','Volkswagen','Mercedes-Benz','Ram','GMC','Jeep'].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select value={price} onChange={e => setPrice(e.target.value)} className={selectClass}>
          {PRICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
          <option value="">Any Type</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>Truck</option>
          <option>Coupe</option>
          <option>Hatchback</option>
          <option>Minivan</option>
          <option>Wagon</option>
          <option>Convertible</option>
          <option>Electric</option>
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="w-full flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3.5 rounded-xl transition-colors text-base"
      >
        <Search size={20} /> Search Inventory
      </button>
    </div>
  )
}
