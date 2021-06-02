import axios from 'axios'
import qs from 'qs'
function getdate() {
  return axios({
    url: '/dali/v1/mscamps',
    method: 'get',
    contentType: 'application/json',
    processData: false,
    withCredentials: false,
  }).then((res) => {
    console.log('res: ', res.data.data)
    return res.data.data
  })
}
export { getdate }
