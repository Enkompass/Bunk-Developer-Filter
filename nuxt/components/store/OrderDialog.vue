<template>
  <div>
    <receive-dialog v-model="receiveItem" />
    <accept-dialog v-model="acceptItem" />
    <takeout-dialog v-model="takeoutItem" />
    <complete-dialog v-model="completeItem" />
    <cancel-dialog v-model="cancelItem" />
    <book-cancel-dialog v-model="bookCancelItem" />
    <book-accepted-dialog v-model="bookAcceptedItem" />
    <book-confirm-dialog v-model="bookConfirmItem" />
    <takeout-confirm-dialog v-model="takeoutConfirmItem" />
    <delay-order-dialog v-model="delayOrderItem" />
    <chat-arrive-dialog v-model="chatArriveItem" />
    <approve-coupon-item v-model="approveCouponItem" />
  </div>
</template>

<script>
import TakeoutDialog from '~/components/store/OrderDialog/TakeoutDialog'
import CompleteDialog from '~/components/store/OrderDialog/CompleteDialog'
import CancelDialog from '~/components/store/OrderDialog/CancelDialog'
import BookCancelDialog from '~/components/store/OrderDialog/BookCancelDialog'
import BookConfirmDialog from '~/components/store/OrderDialog/BookConfirmDialog'
import BookAcceptedDialog from '~/components/store/OrderDialog/BookAcceptedDialog'
import TakeoutConfirmDialog from '~/components/store/OrderDialog/TakeoutConfirmDialog'
import DelayOrderDialog from '@/components/store/OrderDialog/DelayOrderDialog'
import ReceiveDialog from '@/components/store/OrderDialog/ReceiveDialog'
import AcceptDialog from '@/components/store/OrderDialog/AcceptDialog'
import ChatArriveDialog from '@/components/store/OrderDialog/ChatArriveDialog'
import ApproveCouponItem from '@/components/store/OrderDialog/ApproveCouponItem'

export default {
  name: 'OrderDialog',
  components: { ApproveCouponItem, ChatArriveDialog, AcceptDialog, ReceiveDialog, DelayOrderDialog, TakeoutConfirmDialog, BookAcceptedDialog, BookConfirmDialog, BookCancelDialog, CancelDialog, CompleteDialog, TakeoutDialog },
  data: () => ({
    acceptItem: null,
    receiveItem: null,
    takeoutItem: null,
    completeItem: null,
    cancelItem: null,
    bookCancelItem: null,
    bookConfirmItem: null,
    bookAcceptedItem: null,
    takeoutConfirmItem: null,
    delayOrderItem: null,
    chatArriveItem: null,
    approveCouponItem: null
  }),
  mounted () {
    const uid = this.$auth.$state.user.user.uid
    this.$socket.client.on(`receive_order_${uid}`, (payload) => {
      this.playSound()
      this.$router.push('/store/order_manage')
      this.receiveItem = payload
    })
    this.$socket.client.on(`accepted_order_${uid}`, (payload) => {
      this.playSound()
      if (payload.deliver_type === 'order') {
        // this.order = payload
        this.acceptItem = payload
        this.$bus.$emit('order.refresh', ({}))
        this.$bus.$emit('refresh_badge', ({}))
      } else {
        this.bookAcceptedItem = payload
        this.$bus.$emit('order.refresh', ({}))
        this.$bus.$emit('refresh_badge', ({}))
      }
    })
    this.$socket.client.on(`refresh_badge_${uid}`, () => {
      this.$bus.$emit('order.refresh', ({}))
      this.$bus.$emit('refresh_badge', ({}))
    })
    this.$socket.client.on(`complete_takeout_${uid}`, () => {
      this.playSound()
      this.takeoutItem = {}
    })
    this.$socket.client.on(`complete_delivery_${uid}`, () => {
      this.playSound()
      this.completeItem = {}
    })
    this.$socket.client.on(`cancelling_order_${uid}`, (payload) => {
      this.playSound()
      if (payload.deliver_type === 'order') {
        this.cancelItem = payload
      } else {
        this.bookCancelItem = payload
      }
    })
    this.$socket.client.on(`book_confirm_${uid}`, (payload) => {
      this.playSound()
      if (payload.deliver_type === 'takeout') {
        this.takeoutConfirmItem = payload
      } else {
        this.bookConfirmItem = payload
      }
    })
    this.$socket.client.on(`delayed_order_${uid}`, (payload) => {
      this.playSound()
      this.delayOrderItem = payload
    })
    this.$socket.client.on(`arrived_chat_${uid}`, (payload) => {
      this.playSound()
      this.chatArriveItem = {}
    })
    this.$socket.client.on(`approved_coupon_${uid}`, (payload) => {
      this.playSound()
      this.approveCouponItem = {}
    })
  },
  beforeDestroy () {
    const uid = this.$auth.$state.user.user.uid
    this.$socket.client.off(`receive_order_${uid}`)
    this.$socket.client.off(`accepted_order_${uid}`)
    this.$socket.client.off(`refresh_badge_${uid}`)
    this.$socket.client.off(`complete_takeout_${uid}`)
    this.$socket.client.off(`complete_delivery_${uid}`)
    this.$socket.client.off(`cancelling_order_${uid}`)
    this.$socket.client.off(`book_confirm_${uid}`)
    this.$socket.client.off(`delayed_order_${uid}`)
    this.$socket.client.off(`approved_coupon_${uid}`)
  },
  methods: {
    playSound () {
      const audio = new Audio('http://18.220.134.54:5000/bot_operator.mp3')
      audio.play()
    }
  }
}
</script>
