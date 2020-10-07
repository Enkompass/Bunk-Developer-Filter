export const actions = {
  getStoreCategory (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_store_category')
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  },
  getProductCategory (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_product_category')
        .then((res) => {
          resolve(res.data.list)
        })
        .catch(reject)
    })
  },
  updateStoreCategoryOrder (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/update_store_category_order', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  updateProductCategoryOrder (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/update_product_category_order', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  saveCategory (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/add_new_category', params)
        .then(resolve)
        .catch(reject)
    })
  },
  deleteCategory (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/delete_category', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
