import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settimana } = body

    // Percorso del file
    const filePath = path.join(process.cwd(), 'app/data/citta.json')
    
    // Salva i dati
    const dataToSave = { settimana }
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf8')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dati salvati con successo' 
    })
  } catch (error) {
    console.error('Errore nel salvataggio:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio dei dati' },
      { status: 500 }
    )
  }
}