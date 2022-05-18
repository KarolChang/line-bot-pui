import { Client, Message } from '@line/bot-sdk'
import cpblAPI from '../apis/cpbl'
import dayjs from 'dayjs'
import cron, { getTasks } from 'node-cron'

export default {
  cpblPlayerTrans: (client: Client) => {
    // 每 10 分鐘去 call api
    const intervalTool = setInterval(async function () {
      const { data } = await cpblAPI.playerTrans(String(dayjs().year()), String(dayjs().month() + 1))
      console.log('data!!!!!!!!!', data)

      const today = dayjs().format('YYYY/MM/DD')
      if (data[today]) {
        const todayTrans = data[today]
        let pushText = `${today} 今日球員異動：`
        for (const tran of todayTrans) {
          const text = `\n${tran[0]}(${tran[1].slice(0, 2)}) ${tran[2]}`
          pushText += text
        }
        console.log('pushText!!!!!!', pushText)
        client.broadcast({ type: 'text', text: pushText })
        clearInterval(intervalTool)
        console.log('clearInterval!!!')
      } else {
        console.log('今天的球員異動還未發佈!')
      }
    }, 600000)
    // 600000
  },
  cpblPlayerTransCron: (client: Client) => {
    cron.schedule('*/10 8-11 * * *', async () => {
      console.log('start cpblPlayerTransCron!!!', new Date().toLocaleString())

      const { data } = await cpblAPI.playerTrans(String(dayjs().year()), String(dayjs().month() + 1))
      console.log('data!!!!!!!!!', data)

      const today = dayjs().format('YYYY/MM/DD')
      if (data[today]) {
        const todayTrans = data[today]
        let pushText = `${today} 今日球員異動：`
        for (const tran of todayTrans) {
          const text = `\n${tran[0]}(${tran[1].slice(0, 2)}) ${tran[2]}`
          pushText += text
        }
        console.log('pushText!!!!!!', pushText)
        // client.broadcast({ type: 'text', text: pushText })
        // clearInterval(intervalTool)
        // task.stop()
        // console.log('clearInterval!!!')
      } else {
        console.log('今天的球員異動還未發佈!')
      }
    })
  },
  cpblVoteCron: async (client: Client) => {
    const echo: Message = {
      type: 'flex',
      altText: '臭建喵投票!',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: 'https://upload.wikimedia.org/wikipedia/zh/thumb/7/74/CPBL_logo.svg/1200px-CPBL_logo.svg.png',
          size: 'lg'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '中職明星賽投票',
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
                  text: '每個帳號一天可以投2次!!!',
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
                label: '投票去',
                uri: 'https://sports.campaign.yahoo.com.tw/cpbl-allstar/2022/m/?guce_referrer=aHR0cHM6Ly93d3cuY3BibC5jb20udHcv&guce_referrer_sig=AQAAAMpah4xUYDT8_kFTyDxO7H_QDdoYKg9hsILFSSrnnAL5gdxgdfu-nS8zTrly9l8gEp1Q5_wtUKJSewLqr-cWFzGceKpVKG_SYNqGnv-rvBcJQqpEETxGOHkkYYopBF4fbfSFrW2wQzIzZk2BvxoQkxr3I-1kEzfiK0pS895G_7oD'
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
    try {
      cron.schedule('0 9 * * *', async () => {
        console.log('start cpblVoteCron!!!', new Date().toLocaleString())

        client.broadcast(echo)
      })
    } catch (error) {
      console.log('[ERROR-cpblVoteCron]', error)
    }
  }
}
