export const actions = {
  getStoreSalesData (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/get_store_sales_data', params)
        .then((res) => {
          resolve(res.data.info)
        })
        .catch(reject)
    })
  }
}
