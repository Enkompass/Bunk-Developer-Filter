import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

const socket = io(process.env.SOCKET_BASE_URL)

Vue.use(VueSocketIOExt, socket)
