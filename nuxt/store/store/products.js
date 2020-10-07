export const state = () => ({
  menu_images: []
})

export const getters = {
  getMenuImages: state => state.menu_images
}

export const mutations = {
  setMenuImages (state, images) {
    state.menu_images = images
  }
}

export const actions = {
  getStoreProductList (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/get_store_product_list')
        .then(res => (
          resolve(res.data.list)
        ))
        .catch(reject)
    })
  },
  deleteProducts (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/remove_products', params)
        .then(resolve)
        .catch(reject)
    })
  },
  saveAsNullStock (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/save_null_stock', params)
        .then(resolve)
        .catch(reject)
    })
  },
  getProductItem (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/get_product_item', params)
        .then((res) => {
          resolve(res.data.info)
        })
        .catch(reject)
    })
  },
  saveProduct (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/save_product_item', params)
        .then(resolve)
        .catch(reject)
    })
  },
  saveAsAdditional (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/save_as_additional', params)
        .then(resolve)
        .catch(reject)
    })
  },
  loadMenuImage ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_menu_images')
        .then((res) => {
          commit('setMenuImages', res.list)
          resolve(true)
        })
        .catch(reject)
    })
  },
  saveMenuImages ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/save_menu_images', params)
        .then(resolve)
        .catch(reject)
    })
  },
  deleteImageUrls ({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/delete_image_urls', params)
        .then(() => {
          dispatch('loadMenuImage')
          resolve(true)
        })
        .catch(reject)
    })
  }
}
