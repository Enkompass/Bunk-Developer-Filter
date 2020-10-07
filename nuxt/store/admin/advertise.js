export const state = () => ({
  rows: [],
  products: [],
  count: 0,
  params: {},
  loading: true
})

export const getters = {
  getAdvertiseRows: state => state.rows,
  getAdvertiseLoading: state => state.loading,
  getAdvertiseCount: state => state.count,
  getProductItems: state => state.products
}

export const mutations = {
  setCount (state, count) {
    state.count = count
  },
  setRows (state, rows) {
    state.rows = rows
  },
  setProducts (state, products) {
    state.products = products
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setParams (state, params) {
    state.params = params
  }
}

export const actions = {
  getAdvertise ({ commit }, params) {
    commit('setLoading', true)

    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_advertises', params)
        .then((res) => {
          commit('setRows', res.list)
          commit('setCount', res.meta.total)
          commit('setParams', params)
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },
  saveAdvertise ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_advertise', params)
        .then(() => {
          dispatch('getAdvertise', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  deleteAdvertise ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/delete_advertise', params)
        .then(() => {
          dispatch('getAdvertise', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  loadProducts ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_products_by_store', params)
        .then((res) => {
          commit('setProducts', res.list)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
