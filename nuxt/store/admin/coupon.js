export const state = () => ({
  rows: [],
  customers: [],
  count: 0,
  params: {},
  loading: true
})

export const getters = {
  getCouponRows: state => state.rows,
  getCouponLoading: state => state.loading,
  getCouponCount: state => state.count,
  getCustomers: state => state.customers
}

export const mutations = {
  setCount (state, count) {
    state.count = count
  },
  setCustomers (state, customers) {
    state.customers = customers
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
  loadAdminCoupons ({ commit }, params) {
    commit('setLoading', true)
    commit('setParams', params)

    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_admin_coupons', params)
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
  saveAdminCoupon ({ state, dispatch }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_admin_coupon', params)
        .then(() => {
          dispatch('loadAdminCoupons', state.params)
          resolve(true)
        })
        .catch(reject)
    })
  },
  publishStoreCoupon ({ state, dispatch }, params) {
    return new Promise((resolve, reject) => [
      this.$axios.$post('admin/publish_store_coupon', params)
        .then(() => {
          dispatch('loadAdminCoupons', state.params)
          resolve(true)
        })
        .catch(reject)
    ])
  },
  loadCustomerInfos ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_customer_infos_coupon')
        .then((res) => {
          commit('setCustomers', res.list)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
