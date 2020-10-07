export const state = () => ({
  rows: [],
  count: 0,
  loading: false,
  params: {},
  monthlyRows: [],
  monthlyCount: 0,
  monthlyLoading: false,
  monthlyParams: {},
  monthlyStoreName: ''
})

export const getters = {
  getStoreRows: state => state.rows,
  getStoreLoading: state => state.loading,
  getStoreCount: state => state.count,
  getMonthlyRows: state => state.monthlyRows,
  getMonthlyCount: state => state.monthlyCount,
  getMonthlyLoading: state => state.monthlyLoading,
  getMonthlyParams: state => state.monthlyParams,
  getStoreName: state => state.monthlyStoreName
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
  },
  setMonthlyCount (state, count) {
    state.monthlyCount = count
  },
  setMonthlyRows (state, rows) {
    state.monthlyRows = rows
  },
  setMonthlyLoading (state, loading) {
    state.monthlyLoading = loading
  },
  setMonthlyParams (state, params) {
    state.monthlyParams = params
  },
  setStoreName (state, name) {
    state.monthlyStoreName = name
  }
}

export const actions = {
  getStoreItems ({ commit }, params) {
    commit('setLoading', true)
    commit('setParams', params)

    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_store_items', params)
        .then((res) => {
          commit('setRows', res.data)
          commit('setCount', res.meta.total)
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },
  saveStoreItem ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_store', params)
        .then(() => {
          dispatch('getStoreItems', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  updateRatingValue ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_rating_value', params)
        .then(() => {
          dispatch('getStoreItems', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  getStoreYearly ({ commit }, params) {
    commit('setMonthlyLoading', true)
    commit('setMonthlyParams', params)

    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_store_yearly', params)
        .then((res) => {
          commit('setStoreName', res.name)
          commit('setMonthlyRows', res.data)
          commit('setMonthlyCount', res.meta.total)

          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setMonthlyLoading', false)
        })
    })
  },
  deleteStore ({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/delete_store', params)
        .then(() => {
          dispatch('getStoreItems', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  // eslint-disable-next-line no-empty-pattern
  getMonthlyDetails ({}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_monthly_details', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
