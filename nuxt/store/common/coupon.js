export const state = () => ({
  coupons: []
})

export const getters = {
  getCoupons: state => state.coupons
}

export const mutations = {
  setCoupons (state, coupons) {
    state.coupons = coupons
  }
}

export const actions = {
  loadCouponItems ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_coupon_items')
        .then((res) => {
          commit('setCoupons', res.list)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
