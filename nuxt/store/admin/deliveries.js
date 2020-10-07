export const state = () => ({
  rows: [],
  count: 0,
  params: {},
  loading: true
})

export const getters = {
  getDeliveryRows: state => state.rows,
  getDeliveryLoading: state => state.loading,
  getDeliveryCount: state => state.count
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
  getDeliveries ({ commit }, params) {
    commit('setLoading', true)
    commit('setParams', params)

    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_deliveries', params)
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
  deleteDelivery ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/delete_delivery', params)
        .then(() => {
          dispatch('getDeliveries', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  saveDeliveryImages ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_delivery_images', params)
        .then(() => {
          dispatch('getDeliveries', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  getDeliveryFeeDetails ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_delivery_fee_details', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  updateDeliveryStatus ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/update_delivery_status', params)
        .then(() => {
          dispatch('getDeliveries', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  updateDeliveryCoinvalue ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/update_coin_value', params)
        .then(() => {
          dispatch('getDeliveries', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
