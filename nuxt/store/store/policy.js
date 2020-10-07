export const actions = {
  getPrivacyPolicy (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.get(`get_policy?type=${params.type}`)
        .then((res) => {
          resolve(res.data.content)
        }).catch(reject)
    })
  },

  updateAccept (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/update_policy', params)
        .then((res) => {
          resolve(res.data.status)
        }).catch(reject)
    })
  }
}
