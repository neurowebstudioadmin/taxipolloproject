'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, MapPin, Clock, Phone, User, Home } from 'lucide-react'

type Prodotto = {
  id: string
  nome: string
  prezzo: number
  descrizione: string
}

type Citta = {
  giorno: string
  data: string
  citta: string[]
  orario: string
  luogo: string
}

export default function HomePage() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [citta, setCitta] = useState<Citta[]>([])
  const [carrello, setCarrello] = useState<{prodotto: Prodotto, quantita: number}[]>([])
  const [selectedCitta, setSelectedCitta] = useState('')
  const [datiCliente, setDatiCliente] = useState({
    nome: '',
    telefono: '',
    indirizzo: '',
  })

  useEffect(() => {
    // Carica dati da JSON
    fetch('/api/sync?type=prodotti')
      .then(res => res.json())
      .then(data => setProdotti(data))

    fetch('/api/sync?type=citta')
      .then(res => res.json())
      .then(data => {
        setCitta(data)
        if (data.length > 0) {
          const primaCitta = `${data[0].citta[0]} - ${data[0].giorno} ${data[0].orario}`
          setSelectedCitta(primaCitta)
        }
      })
  }, [])

  const aggiungiAlCarrello = (prodotto: Prodotto) => {
    setCarrello(prev => {
      const esistente = prev.find(item => item.prodotto.id === prodotto.id)
      if (esistente) {
        return prev.map(item =>
          item.prodotto.id === prodotto.id
            ? { ...item, quantita: item.quantita + 1 }
            : item
        )
      }
      return [...prev, { prodotto, quantita: 1 }]
    })
  }

  const rimuoviDalCarrello = (prodottoId: string) => {
    setCarrello(prev => prev.filter(item => item.prodotto.id !== prodottoId))
  }

  const totaleCarrello = carrello.reduce((sum, item) => 
    sum + (item.prodotto.prezzo * item.quantita), 0
  )

  const inviaWhatsApp = () => {
    const ordineTesto = `
NUOVO ORDINE TAXI POLLO

📍 ${selectedCitta}
👤 ${datiCliente.nome}
📱 ${datiCliente.telefono}
📍 ${datiCliente.indirizzo}

ORDINE:
${carrello.map(item => `🍗 ${item.prodotto.nome} - €${item.prodotto.prezzo.toFixed(2)} x${item.quantita}`).join('\n')}

💰 TOTALE: €${totaleCarrello.toFixed(2)}
💳 PAGAMENTO: Stripe completo
    `.trim()

    const whatsappUrl = `https://wa.me/393491234567?text=${encodeURIComponent(ordineTesto)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-primary">TAXI</span> 
          <span className="text-white"> POLLO</span>
        </h1>
        <p className="text-center text-gray-300">Ordina e lo portiamo da te in tempo record!</p>
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Sezione Sinistra: Selezione Città e Prodotti */}
        <div className="md:col-span-2 space-y-8">
          {/* Selettore Città */}
          <div className="card-gradient p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-primary w-6 h-6" />
              <h2 className="text-xl font-bold">Seleziona Città e Orario</h2>
            </div>
            
            <select
              value={selectedCitta}
              onChange={(e) => setSelectedCitta(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              {citta.map((giorno, idx) => (
                <option key={idx} value={`${giorno.citta[0]} - ${giorno.giorno} ${giorno.orario}`}>
                  {giorno.citta.join(', ')} - {giorno.giorno} {giorno.orario} ({giorno.luogo})
                </option>
              ))}
            </select>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Orario selezionato: {selectedCitta.split('-')[2]}</span>
              </div>
            </div>
          </div>

          {/* Grid Prodotti */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <ShoppingCart className="text-primary" />
              Menù Taxi Pollo
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prodotti.map((prodotto) => (
                <div
                  key={prodotto.id}
                  className="card-gradient p-4 rounded-xl border border-gray-700 hover:border-primary transition-all duration-300"
                >
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🍗</span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{prodotto.nome}</h3>
                  <p className="text-gray-300 text-sm mb-4">{prodotto.descrizione}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">€{prodotto.prezzo.toFixed(2)}</span>
                    <button
                      onClick={() => aggiungiAlCarrello(prodotto)}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sezione Destra: Carrello e Checkout */}
        <div className="space-y-8">
          {/* Carrello */}
          <div className="card-gradient p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <ShoppingCart className="text-primary" />
              Il tuo Ordine
            </h2>
            
            {carrello.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aggiungi prodotti dal menu</p>
            ) : (
              <div className="space-y-4">
                {carrello.map((item) => (
                  <div key={item.prodotto.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-bold">{item.prodotto.nome}</p>
                      <p className="text-sm text-gray-400">x{item.quantita}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">€{(item.prodotto.prezzo * item.quantita).toFixed(2)}</span>
                      <button
                        onClick={() => rimuoviDalCarrello(item.prodotto.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTALE</span>
                    <span className="text-primary">€{totaleCarrello.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Dati Cliente */}
          <div className="card-gradient p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">I tuoi Dati</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  value={datiCliente.nome}
                  onChange={(e) => setDatiCliente({...datiCliente, nome: e.target.value})}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="Mario Rossi"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefono
                </label>
                <input
                  type="tel"
                  value={datiCliente.telefono}
                  onChange={(e) => setDatiCliente({...datiCliente, telefono: e.target.value})}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="393491234567"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Indirizzo di Consegna
                </label>
                <textarea
                  value={datiCliente.indirizzo}
                  onChange={(e) => setDatiCliente({...datiCliente, indirizzo: e.target.value})}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  rows={3}
                  placeholder="Via Example 123, Città"
                />
              </div>
            </div>
          </div>

          {/* Bottone WhatsApp */}
          <button
            onClick={inviaWhatsApp}
            disabled={carrello.length === 0 || !datiCliente.nome || !datiCliente.telefono}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📱</span>
            INVIA ORDINE VIA WHATSAPP
          </button>

          {/* Opzioni Pagamento */}
          <div className="card-gradient p-6 rounded-2xl border border-gray-700">
            <h3 className="font-bold mb-3">Modalità di Pagamento</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800">
                <input type="radio" name="payment" defaultChecked className="text-primary" />
                <span>💳 Stripe Completo (paga tutto ora)</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800">
                <input type="radio" name="payment" className="text-primary" />
                <span>💰 Contanti/POS (10% acconto online)</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800">
                <input type="radio" name="payment" className="text-primary" />
                <span>💚 Satispay (completo)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}