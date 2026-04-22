"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import PhotoUploader from './PhotoUploader'

// Map NHTSA values → our form values
function mapBodyType(v: string): string {
  const s = v.toLowerCase()
  if (s.includes('sedan') || s.includes('saloon')) return 'Sedan'
  if (s.includes('suv') || s.includes('sport utility') || s.includes('multi-purpose')) return 'SUV'
  if (s.includes('pickup') || s.includes('truck')) return 'Truck'
  if (s.includes('hatchback') || s.includes('liftback')) return 'Hatchback'
  if (s.includes('coupe')) return 'Coupe'
  if (s.includes('convertible') || s.includes('cabriolet')) return 'Convertible'
  if (s.includes('minivan') || s.includes('van')) return 'Minivan'
  if (s.includes('wagon')) return 'Wagon'
  return ''
}

function mapFuelType(v: string): string {
  const s = v.toLowerCase()
  if (s.includes('electric') && s.includes('plug')) return 'Plug-in Hybrid'
  if (s.includes('electric')) return 'Electric'
  if (s.includes('hybrid')) return 'Hybrid'
  if (s.includes('diesel')) return 'Diesel'
  if (s.includes('flex') || s.includes('ffv')) return 'Gasoline'
  if (s.includes('gasoline') || s.includes('gas')) return 'Gasoline'
  return ''
}

function mapDrivetrain(v: string): string {
  const s = v.toLowerCase()
  if (s.includes('4-wheel') || s.includes('4wd') || s.includes('four-wheel')) return '4WD'
  if (s.includes('all-wheel') || s.includes('awd')) return 'AWD'
  if (s.includes('rear') || s.includes('rwd')) return 'RWD'
  if (s.includes('front') || s.includes('fwd')) return 'FWD'
  return ''
}

async function decodeVin(vin: string) {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
  )
  if (!res.ok) throw new Error('API error')
  const json = await res.json()
  const r = json.Results?.[0]
  if (!r || r.ErrorCode?.startsWith('11')) throw new Error('VIN not found')

  // NHTSA uses "EngineCylinders", not "EngineNumberOfCylinders"
  const cylinders = r.EngineCylinders ? `${r.EngineCylinders}-cyl` : ''
  const displacement = r.DisplacementL ? `${parseFloat(r.DisplacementL).toFixed(1)}L` : ''
  const engineHp = r.EngineHP ? ` (${r.EngineHP} hp)` : ''
  const engine = [displacement, cylinders].filter(Boolean).join(' ') + engineHp

  // TransmissionSpeeds + TransmissionStyle → e.g. "8-Speed Automatic"
  const txSpeed = r.TransmissionSpeeds ? `${r.TransmissionSpeeds}-Speed` : ''
  const txStyle = r.TransmissionStyle || ''
  const transmission = [txSpeed, txStyle].filter(Boolean).join(' ')

  return {
    make: r.Make || '',
    model: r.Model || '',
    year: parseInt(r.ModelYear) || new Date().getFullYear(),
    trim: r.Trim || r.Series || '',
    bodyType: mapBodyType(r.BodyClass || ''),
    fuelType: mapFuelType(r.FuelTypePrimary || ''),
    drivetrain: mapDrivetrain(r.DriveType || ''),
    engine,
    transmission,
    doors: parseInt(r.Doors) || 4,
  }
}

interface VehicleFormData {
  vin: string
  make: string
  model: string
  year: number
  trim: string
  bodyType: string
  drivetrain: string
  fuelType: string
  engine: string
  transmission: string
  color: string
  odometer: number
  price: number
  doors: number
  seats: number
  status: string
  featured: boolean
  description: string
  photos: string[]
  features: string[]
  discountPrice: number | null
  carfaxUrl: string
}

const defaultData: VehicleFormData = {
  vin: '', make: '', model: '', year: new Date().getFullYear(),
  trim: '', bodyType: '', drivetrain: '', fuelType: 'Gasoline',
  engine: '', transmission: '', color: '',
  odometer: 0, price: 0, doors: 4, seats: 5,
  status: 'available', featured: false,
  description: '', photos: [], features: [],
  discountPrice: null, carfaxUrl: '',
}

interface Props {
  initialData?: Partial<VehicleFormData> & { id?: string }
  mode: 'new' | 'edit'
}

export default function VehicleForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<VehicleFormData>({ ...defaultData, ...initialData })
  const [featuresText, setFeaturesText] = useState((initialData?.features || []).join('\n'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [vinDecoding, setVinDecoding] = useState(false)
  const [vinStatus, setVinStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [vinMsg, setVinMsg] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const set = (field: keyof VehicleFormData, value: any) => setForm(f => ({ ...f, [field]: value }))

  const handleGenerateDescription = async () => {
    setGenerating(true)
    setGenError('')
    const features = featuresText.split('\n').map(s => s.trim()).filter(Boolean)
    const res = await fetch('/api/admin/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, features }),
    })
    const data = await res.json()
    setGenerating(false)
    if (!res.ok) {
      setGenError(data.error || 'Failed to generate description')
      return
    }
    set('description', data.description)
  }

  const handleVinDecode = async () => {
    if (form.vin.length !== 17) {
      setVinStatus('error')
      setVinMsg('VIN must be 17 characters')
      return
    }
    setVinDecoding(true)
    setVinStatus('idle')
    setVinMsg('')
    try {
      const data = await decodeVin(form.vin)
      setForm(f => ({ ...f, ...data }))
      const filled = Object.entries(data)
        .filter(([, v]) => v !== '' && v !== 0)
        .map(([k]) => k)
      setVinStatus('ok')
      setVinMsg(`Auto-filled: ${filled.join(', ')}`)
    } catch {
      setVinStatus('error')
      setVinMsg('Could not decode VIN — check the number and try again')
    } finally {
      setVinDecoding(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const features = featuresText.split('\n').map(s => s.trim()).filter(Boolean)
    const payload = { ...form, features }

    const url = mode === 'new' ? '/api/admin/vehicles' : `/api/admin/vehicles/${(initialData as any).id}`
    const method = mode === 'new' ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Failed to save vehicle')
      return
    }
    setSuccess(mode === 'new' ? 'Vehicle created successfully!' : 'Vehicle updated successfully!')
    setTimeout(() => router.push('/admin/vehicles'), 1000)
  }

  const inputClass = "w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
  const labelClass = "text-gray-400 text-xs mb-1.5 block"

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/vehicles" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/15 text-gray-400 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{mode === 'new' ? 'Add New Vehicle' : 'Edit Vehicle'}</h1>
          <p className="text-gray-400 text-sm">{mode === 'new' ? 'Add a vehicle to your inventory' : 'Update vehicle information'}</p>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-lime-500/10 border border-lime-500/30 text-lime-400 text-sm px-4 py-3 rounded-lg mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <label className={labelClass}>VIN * <span className="text-gray-600 font-normal">(press Enter to auto-fill from NHTSA)</span></label>
              <div className="relative">
                <input
                  required
                  value={form.vin}
                  onChange={e => { set('vin', e.target.value.toUpperCase()); setVinStatus('idle'); setVinMsg('') }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleVinDecode())}
                  className={`${inputClass} pr-24 font-mono tracking-widest ${vinStatus === 'ok' ? 'border-lime-500' : vinStatus === 'error' ? 'border-red-500' : ''}`}
                  placeholder="17-character VIN"
                  maxLength={17}
                />
                <button
                  type="button"
                  onClick={handleVinDecode}
                  disabled={vinDecoding || form.vin.length !== 17}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2.5 py-1 bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {vinDecoding ? <Loader2 size={12} className="animate-spin" /> : null}
                  {vinDecoding ? 'Decoding…' : 'Decode'}
                </button>
              </div>
              {vinMsg && (
                <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${vinStatus === 'ok' ? 'text-lime-400' : 'text-red-400'}`}>
                  {vinStatus === 'ok' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {vinMsg}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Make *</label>
              <input required value={form.make} onChange={e => set('make', e.target.value)} className={inputClass} placeholder="e.g. Toyota" />
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input required value={form.model} onChange={e => set('model', e.target.value)} className={inputClass} placeholder="e.g. Camry" />
            </div>
            <div>
              <label className={labelClass}>Year *</label>
              <input required type="number" min="1990" max="2030" value={form.year} onChange={e => set('year', parseInt(e.target.value) || 2020)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Trim</label>
              <input value={form.trim} onChange={e => set('trim', e.target.value)} className={inputClass} placeholder="e.g. XSE V6" />
            </div>
            <div>
              <label className={labelClass}>Body Type</label>
              <select value={form.bodyType} onChange={e => set('bodyType', e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Minivan', 'Wagon', 'Convertible'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Drivetrain</label>
              <select value={form.drivetrain} onChange={e => set('drivetrain', e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {['FWD', 'RWD', 'AWD', '4WD'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fuel Type</label>
              <select value={form.fuelType} onChange={e => set('fuelType', e.target.value)} className={inputClass}>
                {['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Engine</label>
              <input value={form.engine} onChange={e => set('engine', e.target.value)} className={inputClass} placeholder="e.g. 3.5L V6" />
            </div>
            <div>
              <label className={labelClass}>Transmission</label>
              <input value={form.transmission} onChange={e => set('transmission', e.target.value)} className={inputClass} placeholder="e.g. 8-Speed Automatic" />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input value={form.color} onChange={e => set('color', e.target.value)} className={inputClass} placeholder="e.g. Midnight Black" />
            </div>
            <div>
              <label className={labelClass}>Odometer (km)</label>
              <input type="number" min="0" value={form.odometer} onChange={e => set('odometer', parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Doors</label>
              <input type="number" min="2" max="5" value={form.doors} onChange={e => set('doors', parseInt(e.target.value) || 4)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Seats</label>
              <input type="number" min="2" max="9" value={form.seats} onChange={e => set('seats', parseInt(e.target.value) || 5)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Pricing & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input type="number" min="0" step="100" value={form.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>
                Sale Price ($) <span className="text-gray-600 font-normal">— leave empty for no discount</span>
              </label>
              <div className="relative">
                <input
                  type="number" min="0" step="100"
                  value={form.discountPrice ?? ''}
                  onChange={e => set('discountPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  className={`${inputClass} ${form.discountPrice ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="e.g. 24900"
                />
                {form.discountPrice && form.discountPrice < form.price && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400 font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                    -{Math.round((1 - form.discountPrice / form.price) * 100)}%
                  </span>
                )}
              </div>
              {form.discountPrice && form.discountPrice >= form.price && (
                <p className="text-red-400 text-xs mt-1">Sale price must be less than regular price</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputClass}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-lime-500" />
                <span className="text-white text-sm">Featured Vehicle</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description & Media */}
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Description & Media</h2>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`${labelClass} mb-0`}>Description</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-lime-500/15 hover:bg-lime-500/25 text-lime-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generating
                    ? <><Loader2 size={12} className="animate-spin" />Generating…</>
                    : <><Sparkles size={12} />Generate with AI</>}
                </button>
              </div>
              {genError && <p className="text-red-400 text-xs mb-1.5">{genError}</p>}
              <textarea rows={6} value={form.description} onChange={e => set('description', e.target.value)}
                className={`${inputClass} resize-none`} placeholder="Describe this vehicle..." />
            </div>
            <div>
              <label className={labelClass}>
                CARFAX Report URL <span className="text-gray-600 font-normal">— customers will see a clickable link on the vehicle page</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={form.carfaxUrl}
                  onChange={e => set('carfaxUrl', e.target.value)}
                  className={`${inputClass} pl-9`}
                  placeholder="https://www.carfax.com/vehicle/..."
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
            </div>
            <div>
              <label className={labelClass}>Photos</label>
              <PhotoUploader
                photos={form.photos}
                onChange={(photos) => set('photos', photos)}
              />
            </div>
            <div>
              <label className={labelClass}>Features (one per line)</label>
              <textarea rows={4} value={featuresText} onChange={e => setFeaturesText(e.target.value)}
                className={`${inputClass} resize-none`} placeholder="Heated Seats&#10;Sunroof&#10;Apple CarPlay" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-60 text-black font-bold px-6 py-3 rounded-xl transition-colors">
            <Save size={16} />
            {loading ? 'Saving...' : mode === 'new' ? 'Create Vehicle' : 'Save Changes'}
          </button>
          <Link href="/admin/vehicles" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
