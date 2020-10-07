export const state = () => ({
  rows: [],
  count: 0,
  loading: false,
  params: {}
})

export const getters = {
  getOrderCount: state => state.count,
  getOrderRows: state => state.rows,
  getOrderLoading: state => state.loading
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
  getStoreOrders ({ commit }, params) {
    commit('setLoading', true)
    commit('setParams', params)

    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_store_orders', params)
        .then((res) => {
          commit('setRows', res.list)
          commit('setCount', res.meta.total)
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },

  searchDelivery ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/search_delivery', params)
        .then((res) => {
          dispatch('getStoreOrders', state.params)
          resolve(res.status)
        })
        .catch(reject)
    })
  },

  acceptingOrder ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/accept_order', params)
        .then((res) => {
          dispatch('getStoreOrders', state.params)
          resolve(res.status)
        })
        .catch(reject)
    })
  },

  cancelOrder ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/cancel_order', params)
        .then((res) => {
          dispatch('getStoreOrders', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },

  acceptCancellingBook ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/accept_cancelling_book', params)
        .then((res) => {
          dispatch('getStoreOrders', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },

  acceptCancellingOrder ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/accept_cancelling_order', params)
        .then((res) => {
          dispatch('getStoreOrders', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },

  rejectCancellingOrder ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/reject_cancelling_order', params)
        .then((res) => {
          dispatch('getStoreOrders', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
