export const state = () => ({
  rows: [],
  count: 0,
  params: {},
  loading: true
})

export const getters = {
  getAreaRows: state => state.rows,
  getAreaLoading: state => state.loading,
  getAreaCount: state => state.count
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
  }
}

export const actions = {
  loadAreaItems ({ commit }) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      this.$axios.$get('admin/get_area_items')
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
  saveAreaItem ({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_area_item', params)
        .then(() => {
          dispatch('loadAreaItems')
          resolve(true)
        })
        .catch(reject)
    })
  },
  deleteAreaItem ({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/delete_area_item', params)
        .then(() => {
          dispatch('loadAreaItems')
          resolve(true)
        })
        .catch(reject)
    })
  }
}
