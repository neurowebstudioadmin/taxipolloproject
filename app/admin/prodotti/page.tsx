'use client'

import { useState, useEffect } from 'react'
import { Save, Edit, Trash2, Plus, Eye, EyeOff, Package, Euro, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Prodotto = {
  id: string
  nome: string
  categoria: string
  prezzo: number
  descrizione: string
  visibile: boolean
}

const categorie = [
  "Pollo", "Antipasti", "Carne", "Contorni", "Bevande", "Dolci", "Specialità"
]

export default function GestioneProdotti() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingProdotto, setEditingProdotto] = useState<Prodotto | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Prodotto>>({
    nome: '',
    categoria: 'Pollo',
    prezzo: 0,
    descrizione: '',
    visibile: true
  })
  const router = useRouter()

  useEffect(() => {
    // Verifica autenticazione
    const auth = localStorage.getItem('admin_authenticated')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      caricaProdotti()
    }
  }, [router])

  const caricaProdotti = async () => {
    try {
      const response = await fetch('/api/sync?type=prodotti')
      const data = await response.json()
      setProdotti(data)
    } catch (error) {
      console.error('Errore nel caricamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (prodotto: Prodotto) => {
    setEditingId(prodotto.id)
    setEditingProdotto({ ...prodotto })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingProdotto(null)
  }

  const updateEditingField = (field: keyof Prodotto, value: any) => {
    if (editingProdotto) {
      setEditingProdotto({
        ...editingProdotto,
        [field]: value
      })
    }
  }

  const saveProdotto = async () => {
    if (!editingProdotto) return

    try {
      const updatedProdotti = prodotti.map(p =>
        p.id === editingId ? editingProdotto : p
      )
      setProdotti(updatedProdotti)

      // Salva sul server
      await fetch('/api/admin/prodotti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prodotti: updatedProdotti })
      })

      setEditingId(null)
      setEditingProdotto(null)
      alert('Prodotto aggiornato con successo!')
    } catch (error) {
      console.error('Errore nel salvataggio:', error)
      alert('Errore nel salvataggio')
    }
  }

  const addProdotto = async () => {
    if (!newProduct.nome || newProduct.prezzo <= 0) {
      alert('Inserisci nome e prezzo validi')
      return
    }

    const nuovoProdotto: Prodotto = {
      id: Date.now().toString(),
      nome: newProduct.nome!,
      categoria: newProduct.categoria!,
      prezzo: newProduct.prezzo!,
      descrizione: newProduct.descrizione || '',
      visibile: newProduct.visibile!
    }

    try {
      const updatedProdotti = [...prodotti, nuovoProdotto]
      setProdotti(updatedProdotti)

      // Salva sul server
      await fetch('/api/admin/prodotti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prodotti: updatedProdotti })
      })

      // Reset form
      setNewProduct({
        nome: '',
        categoria: 'Pollo',
        prezzo: 0,
        descrizione: '',
        visibile: true
      })

      alert('Prodotto aggiunto con successo!')
    } catch (error) {
      console.error('Errore nell\'aggiunta:', error)
      alert('Errore nell\'aggiunta')
    }
  }

  const deleteProdotto = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return

    try {
      const updatedProdotti = prodotti.filter(p => p.id !== id)
      setProdotti(updatedProdotti)

      // Salva sul server
      await fetch('/api/admin/prodotti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prodotti: updatedProdotti })
      })

      alert('Prodotto eliminato con successo!')
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error)
      alert('Errore nell\'eliminazione')
    }
  }

  const toggleVisibility = async (id: string) => {
    const updatedProdotti = prodotti.map(p =>
      p.id === id ? { ...p, visibile: !p.visibile } : p
    )
    setProdotti(updatedProdotti)

    try {
      await fetch('/api/admin/prodotti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prodotti: updatedProdotti })
      })
    } catch (error) {
      console.error('Errore nell\'aggiornamento:', error)
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
              <Package className="w-8 h-8 text-primary" />
              <span>
                <span className="text-primary">Prodotti</span> Taxi Pollo
              </span>
            </h1>
            <p className="text-gray-400">Gestisci i prodotti che compaiono nella pagina ordini.</p>
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
        {/* Tabella Prodotti */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Nome</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Categoria</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Prezzo</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Stato</th>
                  <th className="py-4 px-6 text-left font-bold text-gray-300">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {prodotti.map((prodotto) => (
                  <tr 
                    key={prodotto.id} 
                    className="border-t border-gray-700 hover:bg-gray-800/30 transition-colors"
                  >
                    {editingId === prodotto.id ? (
                      // Modalità modifica
                      <>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={editingProdotto?.nome || ''}
                            onChange={(e) => updateEditingField('nome', e.target.value)}
                            className="p-2 bg-gray-900 border border-gray-700 rounded w-full"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={editingProdotto?.categoria || 'Pollo'}
                            onChange={(e) => updateEditingField('categoria', e.target.value)}
                            className="p-2 bg-gray-900 border border-gray-700 rounded w-full"
                          >
                            {categorie.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              step="0.01"
                              value={editingProdotto?.prezzo || 0}
                              onChange={(e) => updateEditingField('prezzo', parseFloat(e.target.value))}
                              className="p-2 bg-gray-900 border border-gray-700 rounded w-full"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={editingProdotto?.visibile ? 'visibile' : 'nascosto'}
                            onChange={(e) => updateEditingField('visibile', e.target.value === 'visibile')}
                            className="p-2 bg-gray-900 border border-gray-700 rounded w-full"
                          >
                            <option value="visibile">Visibile</option>
                            <option value="nascosto">Nascosto</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveProdotto}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Salva
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                            >
                              Annulla
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Modalità visualizzazione
                      <>
                        <td className="py-4 px-6">
                          <div className="font-bold">{prodotto.nome}</div>
                          {prodotto.descrizione && (
                            <div className="text-sm text-gray-400 mt-1">{prodotto.descrizione}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {prodotto.categoria}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-gray-400" />
                            <span className="text-2xl font-bold text-primary">
                              €{prodotto.prezzo.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            prodotto.visibile 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {prodotto.visibile ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            {prodotto.visibile ? 'Visibile' : 'Nascosto'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditing(prodotto)}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Modifica
                            </button>
                            <button
                              onClick={() => toggleVisibility(prodotto.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              {prodotto.visibile ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              {prodotto.visibile ? 'Nascondi' : 'Mostra'}
                            </button>
                            <button
                              onClick={() => deleteProdotto(prodotto.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nuovo Prodotto */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Plus className="w-6 h-6 text-primary" />
            NUOVO PRODOTTO
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Prodotto
              </label>
              <input
                type="text"
                value={newProduct.nome}
                onChange={(e) => setNewProduct({...newProduct, nome: e.target.value})}
                placeholder="Es: Pollo Arrosto"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={newProduct.categoria}
                onChange={(e) => setNewProduct({...newProduct, categoria: e.target.value})}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                {categorie.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prezzo (€)
              </label>
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.prezzo}
                  onChange={(e) => setNewProduct({...newProduct, prezzo: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stato
              </label>
              <select
                value={newProduct.visibile ? 'visibile' : 'nascosto'}
                onChange={(e) => setNewProduct({...newProduct, visibile: e.target.value === 'visibile'})}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option value="visibile">Visibile</option>
                <option value="nascosto">Nascosto</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrizione
              </label>
              <textarea
                value={newProduct.descrizione}
                onChange={(e) => setNewProduct({...newProduct, descrizione: e.target.value})}
                placeholder="Descrizione del prodotto..."
                rows={3}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={addProdotto}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              AGGIUNGI PRODOTTO
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Come funziona</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 mb-2">
                    • I prodotti <strong>visibili</strong> appaiono nella pagina degli ordini
                  </p>
                  <p className="text-gray-300 mb-2">
                    • I prodotti <strong>nascosti</strong> non sono visibili ai clienti
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 mb-2">
                    • Le modifiche sono visibili in tempo reale
                  </p>
                  <p className="text-gray-300">
                    • Puoi modificare prezzi e disponibilità in qualsiasi momento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}