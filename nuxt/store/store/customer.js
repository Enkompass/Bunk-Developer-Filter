export const actions = {
  getStoreCustomer (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/customer_infos')
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  }
}
