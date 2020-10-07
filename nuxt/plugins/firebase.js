import firebase from 'firebase/app'
import 'firebase/database'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  })
}

export default firebase
export const firebaseRef = firebase.database()
export const usersRef = firebase.database().ref('Users')
export const chatsRef = firebase.database().ref('Chats')
export const messagesRef = firebase.database().ref('chatMessages')
export const userChatsRef = firebase.database().ref('userChats')
export const serverTimestamp = firebase.database.ServerValue.TIMESTAMP
