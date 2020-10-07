export const actions = {
  getAreaItems (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.get('admin/get_area_items')
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  }
}
