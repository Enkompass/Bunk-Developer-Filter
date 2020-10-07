// import { messagesRef } from '~/plugins/firebase'

export const state = () => ({
  rooms: [],
  chats: []
})

export const getters = {
  getRooms: state => state.rooms,
  getChatContents: state => state.chats
}

export const mutations = {
  setRooms (state, rooms) {
    state.rooms = rooms
  },
  setChats (state, chats) {
    state.chats = chats
  }
}

export const actions = {
  getRoomList ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_chat_history')
        .then((res) => {
          commit('setRooms', res.list)
          resolve(true)
        })
        .catch(reject)
      /* chatsRef.once('value')
        .then((snapshot) => {
          const rooms = snapshot.val()
          const roomList = []
          Object.keys(rooms).forEach((roomId) => {
            const roomInfo = rooms[roomId]
            const orderUID = roomInfo.order_uid
            roomList.push({
              room_id: roomId,
              ...roomInfo,
              order_uid: orderUID
            })
          })
          commit('setRooms', roomList)
          resolve(true)
        })
        .catch(reject) */
    })
  },
  getChats ({ commit }, roomId) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_chats_by_room_id', {
        room_id: roomId
      })
        .then((res) => {
          commit('setChats', res.list)
          resolve(true)
        })
        .catch(reject)
      /* messagesRef.child(roomId).once('value')
        .then((snapshot) => {
          const contents = snapshot.val()
          const chatContents = []
          Object.keys(contents).forEach((chatId) => {
            const chat = contents[chatId]
            chatContents.push({
              room_id: roomId,
              ...chat
            })
          })
          commit('setChats', chatContents)
          resolve(true)
        })
        .catch(reject) */
    })
  }
}
