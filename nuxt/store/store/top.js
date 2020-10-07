export const actions = {
  getTodayOrders (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/get_today_orders')
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getBusinessHours (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/get_business_hours', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  saveBusinessHours (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/save_business_hours', params)
        .then(resolve)
        .catch(reject)
    })
  },
  startReceive (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/start_receive')
        .then(resolve)
        .catch(reject)
    })
  },
  stopReceive (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/stop_receive')
        .then(resolve)
        .catch(reject)
    })
  }
}
