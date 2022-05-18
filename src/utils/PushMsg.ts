import { Client } from '@line/bot-sdk'
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
    const task = cron.schedule('*/10 16-19 * * *', async () => {
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
        // clearInterval(intervalTool)
        // task.stop()
        // console.log('clearInterval!!!')
      } else {
        console.log('今天的球員異動還未發佈!')
        console.log('getTask: ', getTasks())
      }
    })
  }
  // wakeUpTask: () => {
  //   cron.schedule('25 16 * * *', async () => {
  //     task.start()
  //   })
  // }
}
