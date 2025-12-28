import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TAXI POLLO - Carne Arrosto Stile Taxi',
  description: 'Ordina il tuo pollo preferito e lo portiamo direttamente da te!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}