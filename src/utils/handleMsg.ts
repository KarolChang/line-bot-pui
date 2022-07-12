import { Client, WebhookEvent, TextMessage, Message } from '@line/bot-sdk'
import { GoogleSheet } from '../sheet/config'

export default {
  reply: async (client: Client, event: WebhookEvent, sheet: GoogleSheet) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null)
    }

    let text: string

    if (event.message.text === '今日待辦') {
      const notes = await sheet.getNotes()
      text = notes === '' ? '今日無提醒事項' : notes
    } else {
      text = '你說什麼 大聲點!!!'
    }

    const echo: TextMessage = { type: 'text', text }
    client.replyMessage(event.replyToken, echo)
  },
  link: async (client: Client, event: WebhookEvent) => {
    if (event.type !== 'message' || event.message.type !== 'text' || event.message.text !== 'line') {
      return Promise.resolve(null)
    }
    const linkToken = await client.getLinkToken(event.source.userId!)
    const echo: Message = {
      type: 'flex',
      altText: '建喵 好嗨!',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: 'https://pdinfo.senao.com.tw/octopus/contents/9f1198e659a54416a343f9786a15699d.jpg',
          size: 'lg'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '與 JM-Expense 連動',
              weight: 'bold',
              size: 'lg',
              align: 'center'
            },
            {
              type: 'box',
              layout: 'baseline',
              margin: 'md',
              contents: [
                {
                  type: 'text',
                  text: '在JM-Expense中登入帳號\n即可與你的LINE做連動',
                  size: 'sm',
                  color: '#0514f0',
                  margin: 'md',
                  align: 'center',
                  wrap: true
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'link',
              height: 'sm',
              action: {
                type: 'uri',
                label: '前往ERP',
                uri: `https://jm-expense-2022.firebaseapp.com/link?linkToken=${linkToken}`
              }
            }
          ],
          flex: 0
        },
        size: 'kilo',
        styles: {
          hero: {
            backgroundColor: '#98e3ed'
          }
        }
      }
    }
    client.replyMessage(event.replyToken, echo)
  }
}
