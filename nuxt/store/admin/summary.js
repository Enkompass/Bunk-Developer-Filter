export const actions = {
  getSummaryContent (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_summary', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  saveSummary (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/save_summary', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getHelpContent (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_help_content', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  saveHelpContent (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/save_help_content', params)
        .then(resolve)
        .catch(reject)
    })
  },
  getSummaryHelpList (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_summary_help_list')
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  },
  deleteSummaryContent (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/delete_summary_content', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
