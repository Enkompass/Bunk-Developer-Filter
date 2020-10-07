export const state = () => ({
  loading: false,
  saving: false,
  rows: [],
  count: 0
})

export const getters = {
  getCouponRows: state => state.rows,
  getCouponCount: state => state.count,
  getCouponLoading: state => state.loading,
  getCouponSaving: state => state.saving
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
  setSaving (state, saving) {
    state.saving = saving
  }
}

export const actions = {
  getStoreCoupons ({ commit }) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_store_coupons')
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
  saveStoreCoupon ({ commit, dispatch }, params) {
    commit('setSaving', true)
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/save_store_coupon', params)
        .then((res) => {
          dispatch('getStoreCoupons')
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setSaving', false)
        })
    })
  }
}
