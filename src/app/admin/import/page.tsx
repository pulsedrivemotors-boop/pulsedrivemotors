"use client"
import { useEffect, useRef, useState } from 'react'
import { Upload, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react'

const CSV_TEMPLATE = `make,model,year,trim,bodyType,drivetrain,fuelType,odometer,price,vin,description,engine,transmission,color,doors,seats,status,photos,features
Toyota,Camry,2022,SE,Sedan,FWD,Gasoline,25000,28900,SAMPLE1234567890A,Great condition,2.5L 4-Cylinder,8-Speed Automatic,White,4,5,available,https://example.com/photo.jpg,"Heated Seats,Apple CarPlay"
Honda,Civic,2023,LX,Sedan,FWD,Gasoline,12000,24500,SAMPLE1234567890B,Like new,1.5L Turbo,CVT,Blue,4,5,available,,`

export default function AdminImportPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [csvText, setCsvText] = useState('')
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<any[]>([])
  const [previewTotal, setPreviewTotal] = useState(0)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ count: number; errors: string[] } | null>(null)
  const [importLogs, setImportLogs] = useState<any[]>([])
  const [error, setError] = useState('')

  const loadLogs = async () => {
    const res = await fetch('/api/admin/stats')
    const data = await res.json()
    setImportLogs(data.importLogs || [])
  }

  useEffect(() => { loadLogs() }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResult(null)
    setError('')
    const text = await file.text()
    setCsvText(text)

    // Get preview
    const res = await fetch('/api/admin/import/csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText: text, preview: true }),
    })
    const data = await res.json()
    if (data.preview) {
      setPreview(data.preview)
      setPreviewTotal(data.total)
    }
  }

  const handleImport = async () => {
    if (!csvText) return
    setImporting(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/admin/import/csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText, fileName }),
    })
    const data = await res.json()
    setImporting(false)

    if (!res.ok) { setError(data.error || 'Import failed'); return }
    setResult({ count: data.count, errors: data.errors || [] })
    loadLogs()
  }

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vehicle-import-template.csv'
    a.click()
  }

  const previewHeaders = preview.length > 0 ? Object.keys(preview[0]).slice(0, 8) : []

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">CSV Import</h1>
        <p className="text-gray-400 text-sm">Import vehicles from a CSV file</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Template Download */}
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-2">CSV Template</h2>
            <p className="text-gray-400 text-sm mb-4">
              Download the template CSV to see the required format. Required fields: <code className="text-lime-400">vin</code>, <code className="text-lime-400">make</code>, <code className="text-lime-400">model</code>
            </p>
            <div className="bg-black/40 rounded-lg p-3 mb-4 overflow-x-auto">
              <code className="text-gray-300 text-xs whitespace-nowrap">
                make, model, year, trim, bodyType, drivetrain, fuelType, odometer, price, vin, description, engine, transmission, color, doors, seats, status, photos, features
              </code>
            </div>
            <button onClick={downloadTemplate}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              <Download size={16} /> Download Template
            </button>
          </div>

          {/* File Upload */}
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Upload CSV File</h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-lime-500/50 rounded-xl p-10 text-center cursor-pointer transition-colors">
              <Upload size={32} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">{fileName || 'Click to select CSV file'}</p>
              <p className="text-gray-500 text-sm mt-1">Supports .csv files</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Preview ({previewTotal} rows total)</h2>
                <button onClick={handleImport} disabled={importing}
                  className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-60 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                  <Upload size={14} />
                  {importing ? 'Importing...' : `Import ${previewTotal} Vehicles`}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      {previewHeaders.map(h => (
                        <th key={h} className="text-left text-gray-400 font-medium px-3 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {previewHeaders.map(h => (
                          <td key={h} className="px-3 py-2 text-gray-300 max-w-32 truncate">{String(row[h] || '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {result && (
            <div className="bg-lime-500/10 border border-lime-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-lime-400" />
                <p className="text-lime-400 font-medium">Import Complete</p>
              </div>
              <p className="text-gray-300 text-sm">{result.count} vehicles imported successfully</p>
              {result.errors.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-yellow-400 text-xs font-medium">Warnings:</p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-gray-400 text-xs">{e}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Import Logs */}
        <div>
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" /> Import History
            </h2>
            {importLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No imports yet</p>
            ) : (
              <div className="space-y-3">
                {importLogs.map((log: any) => (
                  <div key={log.id} className="p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-xs font-medium truncate">{log.fileName}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${log.success ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                        {log.success ? 'OK' : 'Err'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{log.count} vehicles &bull; {new Date(log.createdAt).toLocaleDateString()}</p>
                    {log.message && <p className="text-yellow-500 text-xs mt-1 truncate">{log.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
