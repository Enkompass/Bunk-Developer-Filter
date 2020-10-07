export const actions = {
  getCustomers (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_customers', params)
        .then(resolve)
        .catch(reject)
    })
  },

  getUseHistory (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_use_history', params)
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  },

  deleteCustomer (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/delete_customer', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
