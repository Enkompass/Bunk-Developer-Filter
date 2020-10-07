<template>
  <div class="admin-chat-room">
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="4" class="pr-0 pr-md-10">
        <room-list v-show="!show_content || $vuetify.breakpoint.mdAndUp" @selectedRoom="selectRoom" />
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-slide-x-reverse-transition>
          <chat-content v-show="show_content || $vuetify.breakpoint.mdAndUp" :item="item" @backtoList="backtoList" />
        </v-slide-x-reverse-transition>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomList from '~/components/admin/Chat/RoomList'
import ChatContent from '~/components/admin/Chat/ChatContent'
export default {
  name: 'ChatRoom',
  layout: 'admin',
  components: { ChatContent, RoomList },
  data: () => ({
    show_content: false,
    item: null
  }),
  methods: {
    selectRoom (item) {
      this.show_content = true
      this.item = item
    },
    backtoList () {
      this.show_content = false
    }
  },
  head: () => ({
    title: 'チャットルーム確認'
  })
}
</script>
