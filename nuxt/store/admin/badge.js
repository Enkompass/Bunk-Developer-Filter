export const actions = {
  getAdminBadge (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.get('admin/get_admin_badge')
        .then((res) => {
          resolve(res.data.info)
        })
        .catch(reject)
    })
  }
}
