export const state = () => ({
  rows: [],
  count: 0,
  params: {},
  loading: true,
  subrows: [],
  subcount: 0,
  subparams: {},
  subloading: true,
  deliveries: []
})

export const getters = {
  getNotificationRows: state => state.rows,
  getNotificationLoading: state => state.loading,
  getNotificationCount: state => state.count,
  getHistoryRows: state => state.subrows,
  getHistoryLoading: state => state.subloading,
  getHistoryCount: state => state.subcount,
  getDeliveries: state => state.deliveries
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
  setSubCount (state, count) {
    state.subcount = count
  },
  setSubRows (state, rows) {
    state.subrows = rows
  },
  setSubLoading (state, loading) {
    state.subloading = loading
  },
  setSubParams (state, params) {
    state.subparams = params
  },
  setDeliveries (state, deliveries) {
    state.deliveries = deliveries
  }
}

export const actions = {
  saveNotification ({ state, dispatch }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/save_notification', params)
        .then(() => {
          dispatch('getAllNotifications')
          resolve(true)
        })
        .catch(reject)
    })
  },
  getAllNotifications ({ commit }) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_all_notifications')
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
  getNotificationHistory ({ commit }) {
    commit('setSubLoading', true)
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_notification_history')
        .then((res) => {
          commit('setSubRows', res.list)
          commit('setSubCount', res.list.length)
          resolve(true)
        })
        .catch(reject)
        .finally(() => {
          commit('setSubLoading', false)
        })
    })
  },
  deleteNotification ({ state, dispatch }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.post('admin/delete_notification', params)
        .then(() => {
          dispatch('getAllNotifications')
          resolve(true)
        })
        .catch(reject)
    })
  },
  loadNotificationTargets ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_deliveries_notify')
        .then((res) => {
          commit('setDeliveries', res.list)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
