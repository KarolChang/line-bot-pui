import { GoogleSpreadsheet } from 'google-spreadsheet'

export class GoogleSheet {
  docId: string = '1-Gve2NTrW5LjJvm_028esiLO2Sy2TIMWntK_cgL0TsA'
  doc: GoogleSpreadsheet = new GoogleSpreadsheet(this.docId)

  async init() {
    await this.doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n')
    })
    await this.doc.loadInfo()
  }

  get sheet() {
    return this.doc.sheetsByIndex[0]
  }

  async getNotes() {
    await this.sheet.loadCells()
    let itemString = ''
    const date = new Date().getDate()
    let index = 0
    let cell
    while (cell !== null) {
      cell = this.sheet.getCell(date - 1, index).value
      if (cell === null) break
      index === 0 ? (itemString += `${index + 1}. ${cell}`) : (itemString += `\n${index + 1}. ${cell}`)
      index++
    }
    console.log('[getNotes] itemString')
    console.log(itemString)
    return itemString
  }
}
