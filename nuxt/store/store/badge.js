export const state = () => ({
  order_count: 0,
  coupon_count: 0,
  unread_count: 0,
  delivering: [],
  notifications: []
})

export const getters = {
  getOrderBadge: state => state.order_count,
  getDelivering: state => state.delivering,
  getCouponCount: state => state.coupon_count,
  getNotifications: state => state.notifications,
  getUnreadCount: state => state.unread_count
}

export const mutations = {
  setCouponCount (state, count) {
    state.coupon_count = count
  },
  setOrderBadge (state, badge) {
    state.order_count = badge
  },
  setDelivering (state, delivering) {
    state.delivering = delivering
  },
  setNotifications (state, notifications) {
    state.notifications = notifications
  },
  setUnreadCount (state, count) {
    state.unread_count = count
  }
}

export const actions = {
  loadStoreBadge ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_order_count')
        .then((res) => {
          commit('setOrderBadge', res.count)
          commit('setCouponCount', res.coupon_count)
          commit('setDelivering', res.delivering)
          resolve(true)
        })
        .catch(reject)
    })
  },
  loadNotifications ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_notification')
        .then((res) => {
          commit('setNotifications', res.data)
          resolve(true)
        })
        .catch(reject)
    })
  },
  loadUnreadMessage ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/get_unread_message')
        .then((res) => {
          commit('setUnreadCount', res.count)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
