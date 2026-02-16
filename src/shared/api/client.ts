import Axios from 'axios'

import { API_ROOT } from 'shared/config/variables'

const api = Axios.create({
  baseURL: API_ROOT,
  timeout: 120000,
})

export default api
