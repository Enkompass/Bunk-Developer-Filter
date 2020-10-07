<template>
  <div class="store-chat-room">
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="4" class="pr-0 pr-md-10">
        <store-room-list v-show="!show_content || $vuetify.breakpoint.mdAndUp" @selectedRoom="selectRoom" />
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-slide-x-reverse-transition>
          <store-chat-content v-show="show_content || $vuetify.breakpoint.mdAndUp" :item="item" @backtoList="backtoList" />
        </v-slide-x-reverse-transition>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import StoreRoomList from '~/components/store/Chat/StoreRoomList'
import StoreChatContent from '~/components/store/Chat/StoreChatContent'
export default {
  name: 'ChatRoom',
  components: { StoreRoomList, StoreChatContent },
  data: () => ({
    show_content: false,
    item: null
  }),
  methods: {
    ...mapActions('firebase', ['updateUnreadStatus']),
    selectRoom (item) {
      this.show_content = true
      this.item = item
      this.updateUnreadStatus({
        params: {
          room_id: item.room_id,
          uid: this.$auth.$state.user.user.uid
        }
      })
    },
    backtoList () {
      this.show_content = false
    }
  },
  head: () => ({
    title: 'チャットルーム'
  })
}
</script>
