export const actions = {
  getCategory (ctx, { $axios, type }) {
    return new Promise((resolve, reject) => {
      $axios.get('admin/get_category', { params: { type } })
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  }
}
