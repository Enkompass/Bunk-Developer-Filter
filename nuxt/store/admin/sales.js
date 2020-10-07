export const actions = {
  getAdminSalesData (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_admin_sales_data', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }
}
