import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  
  try {
    if (type === 'citta') {
      const filePath = path.join(process.cwd(), 'app/data/citta.json')
      const data = fs.readFileSync(filePath, 'utf8')
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData.settimana)
    }
    
    if (type === 'prodotti') {
      const filePath = path.join(process.cwd(), 'app/data/prodotti.json')
      const data = fs.readFileSync(filePath, 'utf8')
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData.prodotti)
    }
    
    return NextResponse.json({ error: 'Type non specificato' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Errore nel caricamento dati' }, { status: 500 })
  }
}