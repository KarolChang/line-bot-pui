import axios from 'axios'

const baseURL = 'http://jm-expense-mysql.herokuapp.com'
const apiHelper = axios.create({
  baseURL
})

export default {
  bindingLineUserId(email: string, lineUserId: string) {
    return apiHelper.put(`/user/binding`, { email, lineUserId })
  }
}
