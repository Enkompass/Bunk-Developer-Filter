export const state = () => ({
  rows: [],
  count: 0,
  params: {},
  loading: true
})

export const getters = {
  getDepositRows: state => state.rows,
  getDepositLoading: state => state.loading,
  getDepositCount: state => state.count
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
  loadDeliveryDeposits ({ commit }, params) {
    commit('setLoading', true)
    commit('setParams', params)
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_deliver_deposit', params)
        .then((res) => {
          commit('setRows', res.list)
          commit('setCount', res.list.length)
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },

  updateDeliveryDeposits ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/update_delivery_deposits', params)
        .then(() => {
          dispatch('loadDeliveryDeposits', params)
          resolve(true)
        })
        .catch(reject)
    })
  },

  updateDeliveryNotes ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/update_delivery_notes', params)
        .then(resolve)
        .catch(reject)
    })
  },

  updateDeliveryPayment ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/update_delivery_payment', params)
        .then(() => {
          dispatch('loadDeliveryDeposits', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
