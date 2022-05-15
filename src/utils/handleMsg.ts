import { Client, WebhookEvent, TextMessage, Message } from '@line/bot-sdk'
import { Base64 } from 'js-base64'
import UserAPI from '../apis/user'

const handleMsg = {
  reply: (client: Client, event: WebhookEvent) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null)
    }
    const echo: TextMessage = { type: 'text', text: `有笨蛋說：${event.message.text}` }
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
  },
  linked: async (client: Client, event: WebhookEvent) => {
    if (event.type !== 'accountLink' || event.link.result !== 'ok') {
      return Promise.resolve(null)
    }
    // 修改 lineUserId
    const email = Base64.decode(event.link.nonce)
    const lineUserId = event.source.userId!
    await UserAPI.bindingLineUserId(email, lineUserId)
    // 傳送訊息
    const echo: Message = {
      type: 'flex',
      altText: '笨建喵 好嗨!',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          aspectRatio: '4:3',
          url: 'https://i.imgur.com/thnpXTN.jpg',
          size: 'lg'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '連動成功！',
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
                  text: '你現在可以透過LINE\n來接收JM-Expense的通知訊息了！',
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

export default handleMsg
