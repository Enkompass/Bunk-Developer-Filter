export const state = () => ({
  rooms: []
})

export const getters = {
  getRooms: state => state.rooms
}

export const mutations = {
  setRoomList (state, item) {
    state.rooms.push(item)
  }
}

export const actions = {
  sendPushNotification ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/send_push_notification', params)
        .then(resolve)
        .catch(reject)
    })
  },
  addRoom ({ commit }, roomInfo) {
    commit('setRoomList', roomInfo)
  },
  // eslint-disable-next-line no-empty-pattern
  updateReadStatus ({}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/update_read_status', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
