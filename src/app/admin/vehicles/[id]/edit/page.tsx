"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VehicleForm from '@/components/admin/VehicleForm'

export default function EditVehiclePage() {
  const params = useParams()
  const id = params.id as string
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/vehicles/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => { if (data) { setVehicle(data); setLoading(false) } })
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="p-8 text-center text-gray-400">Vehicle not found</div>
  )

  return <VehicleForm mode="edit" initialData={vehicle} />
}
