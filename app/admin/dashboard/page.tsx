'use client'

import { useEffect, useState } from 'react'
import { Calendar, Package, Users, Euro, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    ordiniOggi: 0,
    prodottiAttivi: 0,
    cittaProgrammate: 0,
    fatturato: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Verifica autenticazione
    const auth = localStorage.getItem('admin_authenticated')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      // Carica statistiche (mock per ora)
      setStats({
        ordiniOggi: 24,
        prodottiAttivi: 12,
        cittaProgrammate: 7,
        fatturato: 1245.50
      })
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary">TAXI</span> 
              <span className="text-white"> POLLO</span> - Admin
            </h1>
            <p className="text-gray-400">Pannello di gestione</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ordini Oggi</p>
              <p className="text-3xl font-bold">{stats.ordiniOggi}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Prodotti Attivi</p>
              <p className="text-3xl font-bold">{stats.prodottiAttivi}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Package className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Città Programmate</p>
              <p className="text-3xl font-bold">{stats.cittaProgrammate}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fatturato Oggi</p>
              <p className="text-3xl font-bold">€{stats.fatturato.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Euro className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Admin */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gestione Programma Settimanale */}
        <Link href="/admin/citta">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-primary transition-all duration-300 cursor-pointer hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Programma Settimanale</h3>
                <p className="text-gray-400">Gestisci città, orari e luoghi</p>
              </div>
            </div>
            <p className="text-gray-300">
              Definisci date, città, orari e luoghi per ogni giorno della settimana.
            </p>
          </div>
        </Link>

        {/* Gestione Prodotti */}
        <Link href="/admin/prodotti">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-primary transition-all duration-300 cursor-pointer hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Gestione Prodotti</h3>
                <p className="text-gray-400">Menu e prezzi</p>
              </div>
            </div>
            <p className="text-gray-300">
              Aggiungi, modifica o elimina prodotti dal menu. Controlla prezzi e disponibilità.
            </p>
          </div>
        </Link>

        {/* Impostazioni */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Impostazioni</h3>
              <p className="text-gray-400">Configura sistema</p>
            </div>
          </div>
          <p className="text-gray-300">
            Configura numero WhatsApp, metodi di pagamento e altre impostazioni del sistema.
          </p>
        </div>

        {/* Ordini Recenti */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Ordini Recenti</h3>
              <p className="text-gray-400">Ultimi 24 ore</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium">Mario Rossi</p>
                <p className="text-sm text-gray-400">Barletta - 16:00</p>
              </div>
              <span className="font-bold text-primary">€24.90</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium">Luigi Verdi</p>
                <p className="text-sm text-gray-400">Bari - 17:30</p>
              </div>
              <span className="font-bold text-primary">€18.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}