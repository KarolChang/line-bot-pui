import axios from 'axios'

const baseURL = 'https://cpbl-python.herokuapp.com'
const apiHelper = axios.create({
  baseURL
})

export default {
  playerTrans(year: string, month: string) {
    return apiHelper.get(`/playertrans/${year}/${month}`)
  }
}
