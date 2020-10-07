export const actions = {
  saveBusinessHours (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/save_business_time', params)
        .then(resolve)
        .catch(reject)
    })
  },
  getBusinessMonth (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/get_business_months', params)
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  },
  saveBusinessHourByType (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/save_business_by_type', params)
        .then(resolve)
        .catch(reject)
    })
  },
  saveHoliday ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/save_holiday', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
