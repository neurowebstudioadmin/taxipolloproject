'use client'

import { useState, useEffect } from 'react'
import { Save, Edit, X, Plus, Calendar, MapPin, Clock, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Settimana = {
  giorno: string
  data: string
  citta: string[]
  orario: string
  luogo: string
}

const giorniSettimana = [
  "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"
]

const opzioniCitta = [
  "Barletta", "Bari", "Trani", "Andria", "Corato", "Bisceglie", "Molfetta", "Terlizzi"
]

export default function GestioneCitta() {
  const [settimana, setSettimana] = useState<Settimana[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Settimana | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verifica autenticazione
    const auth = localStorage.getItem('admin_authenticated')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      caricaSettimana()
    }
  }, [router])

  const caricaSettimana = async () => {
    try {
      const response = await fetch('/api/sync?type=citta')
      const data = await response.json()
      
      // Se non ci sono dati, crea struttura vuota
      if (!data || data.length === 0) {
        const nuovaSettimana = giorniSettimana.map(giorno => ({
          giorno,
          data: '',
          citta: [],
          orario: '',
          luogo: ''
        }))
        setSettimana(nuovaSettimana)
      } else {
        // Assicurati che ci siano tutti i giorni
        const giorniEsistenti = data.map((d: Settimana) => d.giorno)
        const giorniMancanti = giorniSettimana.filter(g => !giorniEsistenti.includes(g))
        
        const settimanaCompleta = [...data]
        giorniMancanti.forEach(giorno => {
          settimanaCompleta.push({
            giorno,
            data: '',
            citta: [],
            orario: '',
            luogo: ''
          })
        })
        
        // Ordina per giorno della settimana
        settimanaCompleta.sort((a, b) => 
          giorniSettimana.indexOf(a.giorno) - giorniSettimana.indexOf(b.giorno)
        )
        
        setSettimana(settimanaCompleta)
      }
    } catch (error) {
      console.error('Errore nel caricamento:', error)
      // Crea struttura vuota
      const nuovaSettimana = giorniSettimana.map(giorno => ({
        giorno,
        data: '',
        citta: [],
        orario: '',
        luogo: ''
      }))
      setSettimana(nuovaSettimana)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (giorno: string) => {
    const dayData = settimana.find(d => d.giorno === giorno)
    if (dayData) {
      setEditingDay(giorno)
      setEditingData({ ...dayData })
    }
  }

  const cancelEditing = () => {
    setEditingDay(null)
    setEditingData(null)
  }

  const updateEditingField = (field: keyof Settimana, value: string | string[]) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        [field]: value
      })
    }
  }

  const saveDay = async () => {
    if (!editingData || !editingDay) return

    try {
      // Aggiorna localmente
      const updatedSettimana = settimana.map(day =>
        day.giorno === editingDay ? editingData : day
      )
      setSettimana(updatedSettimana)

      // Salva sul server
      await fetch('/api/admin/citta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settimana: updatedSettimana })
      })

      setEditingDay(null)
      setEditingData(null)
      alert('Modifiche salvate con successo!')
    } catch (error) {
      console.error('Errore nel salvataggio:', error)
      alert('Errore nel salvataggio')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <span>
                <span className="text-primary">Programma</span> Settimanale
              </span>
            </h1>
            <p className="text-gray-400">Definisci date, città, orari e luoghi per ogni giorno.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Tabella */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Giorno</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Città</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Orario</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Luogo</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {settimana.map((giorno) => (
                  <tr 
                    key={giorno.giorno} 
                    className="border-t border-gray-700 hover:bg-gray-800/30 transition-colors"
                  >
                    {editingDay === giorno.giorno ? (
                      // Modalità modifica
                      <>
                        <td className="py-4 px-6">
                          <div className="font-bold">{giorno.giorno}</div>
                          <input
                            type="date"
                            value={editingData?.data || ''}
                            onChange={(e) => updateEditingField('data', e.target.value)}
                            className="mt-2 p-2 bg-gray-900 border border-gray-700 rounded w-full text-sm"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <select
                            multiple
                            value={editingData?.citta || []}
                            onChange={(e) => {
                              const selected = Array.from(e.target.selectedOptions, option => option.value)
                              updateEditingField('citta', selected)
                            }}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded h-32"
                            size={3}
                          >
                            {opzioniCitta.map(citta => (
                              <option key={citta} value={citta}>{citta}</option>
                            ))}
                          </select>
                          <div className="text-xs text-gray-400 mt-1">
                            CTRL+click per selezionare multipli
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={editingData?.orario || ''}
                              onChange={(e) => updateEditingField('orario', e.target.value)}
                              placeholder="16:00-18:00"
                              className="p-2 bg-gray-900 border border-gray-700 rounded w-full"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={editingData?.luogo || ''}
                              onChange={(e) => updateEditingField('luogo', e.target.value)}
                              placeholder="Parcheggio Lidl"
                              className="p-2 bg-gray-900 border border-gray-700 rounded w-full"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveDay}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Salva
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Annulla
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Modalità visualizzazione
                      <>
                        <td className="py-4 px-6">
                          <div className="font-bold text-lg">{giorno.giorno}</div>
                          {giorno.data && (
                            <div className="text-sm text-gray-400 mt-1">
                              {new Date(giorno.data).toLocaleDateString('it-IT')}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {giorno.citta.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {giorno.citta.map((c, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Nessuna città selezionata</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {giorno.orario ? (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{giorno.orario}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Non specificato</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {giorno.luogo ? (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span>{giorno.luogo}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Non specificato</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => startEditing(giorno.giorno)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Modifica
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary">ℹ️</span>
            Istruzioni
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-300">
                • Le modifiche vengono salvate automaticamente e sincronizzate con la pagina cliente
              </p>
              <p className="text-gray-300">
                • Le città selezionate appariranno nel menu a tendina della pagina ordini
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">
                • Utilizza CTRL+click per selezionare più città contemporaneamente
              </p>
              <p className="text-gray-300">
                • Il formato orario consigliato è: "16:00-18:00"
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-400">🚀</div>
            <div>
              <p className="font-medium">Aggiornamento in tempo reale</p>
              <p className="text-sm text-gray-300">
                Quando salvi le modifiche, la pagina degli ordini (<code>/home</code>) si aggiorna automaticamente entro 1 secondo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}