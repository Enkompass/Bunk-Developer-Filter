import { userChatsRef, chatsRef, usersRef, messagesRef, serverTimestamp, firebaseRef } from '~/plugins/firebase'

export const actions = {
  getRoomList (ctx, { params }) {
    return new Promise((resolve, reject) => {
      if (params) {
        userChatsRef.child(params).once('value')
          .then((snapshot) => {
            resolve(snapshot.val())
          })
          .catch(reject)
      }
    })
  },
  getRoomMember (ctx, { params }) {
    return new Promise((resolve, reject) => {
      chatsRef.child(params).child('members').once('value')
        .then((snapshot) => {
          resolve(snapshot.val())
        })
        .catch(reject)
    })
  },
  getRoomInfo (ctx, { params }) {
    return new Promise((resolve, reject) => {
      chatsRef.child(params).once('value')
        .then((snapshot) => {
          resolve(snapshot.val())
        })
        .catch(reject)
    })
  },
  getRoomBadge (ctx, { params }) {
    return new Promise((resolve, reject) => {
      messagesRef.child(params.room_id).orderByChild('status').equalTo('unread').once('value')
        .then((snapshot) => {
          const rooms = snapshot.val()
          const count = Object.keys(rooms).filter((roomID) => {
            return rooms[roomID].senderUID !== params.uid
          }).length
          resolve(count)
        })
        .catch(() => {
          resolve(0)
        })
    })
  },
  getUserInfo (ctx, { params }) {
    return new Promise((resolve, reject) => {
      usersRef.child(params).once('value')
        .then((snapshot) => {
          resolve(snapshot.val())
        })
        .catch(reject)
    })
  },
  getChatContent (ctx, { params }) {
    return new Promise((resolve, reject) => {
      messagesRef.child(params).once('value')
        .then((snapshot) => {
          resolve(snapshot.val())
        })
        .catch(reject)
    })
  },
  async sendMessage (ctx, params) {
    const author = params.author
    const target = params.target
    // eslint-disable-next-line camelcase
    const order_uid = params.order_uid
    const roomId = (author.uid < target.uid) ? author.uid + target.uid : target.uid + author.uid
    if (params.openChat === false) {
      await firebaseRef.ref(`chatMessages/${roomId}`).push({
        senderName: author.name,
        senderAvatar: author.avatar,
        senderUID: author.uid,
        message: params.message,
        timestamp: serverTimestamp,
        status: 'unread'
      })
    }
    const authroom = await userChatsRef.child(author.uid).once('value')
    let roomList = authroom.val()
    if (roomList === null) {
      roomList = [roomId]
    } else if (!roomList.includes(roomId)) {
      roomList.push(roomId)
    }
    await userChatsRef.child(author.uid).set(roomList)
    const targetRoom = await userChatsRef.child(target.uid).once('value')
    let targetRoomList = targetRoom.val()
    if (targetRoomList === null) {
      targetRoomList = [roomId]
    } else if (!targetRoomList.includes(roomId)) {
      targetRoomList.push(roomId)
    }
    await userChatsRef.child(target.uid).set(targetRoomList)
    await chatsRef.child(roomId).set({
      lastMessageSent: params.message,
      lastMessageTimestamp: serverTimestamp,
      members: [author.uid, target.uid],
      senderPhone: author.phone,
      receiverPhone: target.phone,
      senderName: author.name,
      senderAvatar: author.avatar,
      receiverName: target.name,
      receiverAvatar: target.avatar,
      senderRole: author.role,
      receiverRole: target.role,
      senderUID: author.uid,
      receiverUID: target.uid,
      order_uid
    })
  },
  getPersonRoomList (uid) {
    return new Promise((resolve, reject) => {
      userChatsRef
        .child(uid)
        .once('value')
        .then((snapshot) => {
          resolve(snapshot.val())
        })
        .catch(reject)
    })
  },
  updateUnreadStatus (ctx, { params }) {
    return new Promise((resolve, reject) => {
      messagesRef.child(params.room_id).orderByChild('status').equalTo('unread').once('value')
        .then((snapshot) => {
          const rooms = snapshot.val()
          Object.keys(rooms).forEach((chatID) => {
            if (rooms[chatID].senderUID !== params.uid) {
              const chat = rooms[chatID]
              chat.status = 'read'
              messagesRef.child(params.room_id).child(chatID).update(chat)
            }
          })
          resolve(true)
        })
        .catch(reject)
    })
  }
}
