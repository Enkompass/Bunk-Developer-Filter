export const state = () => ({
  rows: [],
  count: 0,
  loading: false,
  params: null
})

export const getters = {
  getAdminOrders: state => state.rows,
  getAdminOrderCount: state => state.count,
  getAdminOrderLoading: state => state.loading
}

export const mutations = {
  setCount (state, count) {
    state.count = count
  },
  setRows (state, rows) {
    state.rows = rows
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setParams (state, params) {
    state.params = params
  }
}

export const actions = {
  loadAdminOrders ({ commit }, params) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      commit('setParams', params)
      this.$axios.$post('admin/get_admin_orders', params)
        .then((res) => {
          commit('setRows', res.list)
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },

  changeEmergencyDelivery ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/change_delivery_emergency', params)
        .then(() => {
          dispatch('loadAdminOrders', state.params)
          resolve(resolve)
        })
        .catch(reject)
    })
  }
}
