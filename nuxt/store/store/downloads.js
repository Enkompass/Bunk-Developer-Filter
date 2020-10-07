export const state = () => ({
  details: {},
  count: 0,
  params: {},
  loading: true
})

export const getters = {
  getSalesStatement: state => state.details,
  getSalesStatementLoading: state => state.loading,
  getSalesStatementCount: state => state.count
}

export const mutations = {
  setCount (state, count) {
    state.count = count
  },
  setDetails (state, details) {
    state.details = details
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setParams (state, params) {
    state.params = params
  }
}

export const actions = {
  loadMonthlySalesStatement ({ commit }, params) {
    commit('setLoading', true)

    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_sales_statement', params)
        .then((res) => {
          commit('setDetails', res.data)
          resolve(res.data)
        })
        .catch(reject)
        .finally(() => {
          commit('setLoading', false)
        })
    })
  }
}
