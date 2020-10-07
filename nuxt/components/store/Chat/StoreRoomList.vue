<template>
  <div>
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'comments']" class="secondary--text" />
        チャットルーム
      </h3>
    </div>
    <v-text-field
      v-model="params.search"
      prepend-inner-icon="mdi-magnify"
      placeholder="名前、注文管理番号、メッセージで検索…"
      background-color="white"
      outlined
      rounded
      dense
      hide-details
      class="mt-2"
    />
    <v-list v-if="filteredItem.length > 0" two-line class="mt-2" style="border-radius: 15px;">
      <template v-for="item in filteredItem">
        <v-list-item :key="item.id" @click="selectRoom(item)">
          <v-list-item-avatar>
            <v-avatar>
              <img
                :src="item.avatar"
                alt="John"
              >
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex align-center">
                <h6 class="font-weight-bold mr-2">
                  {{ item.name }}
                </h6>
                <v-chip :color="item.type === 'customer' ? 'secondary' : 'grey'" outlined label small>
                  <h6>
                    {{ types[item.type] }}
                  </h6>
                </v-chip>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle class="grey--text" v-text="item.order_uid" />
          </v-list-item-content>

          <v-list-item-action>
            <v-badge
              v-if="item.badge > 0"
              :content="item.badge"
              :value="item.badge"
              color="error"
              inline
            />
            <h6 v-else class="grey--text">
              {{ item.date | monthFormat }}
            </h6>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="item.room_id" />
      </template>
    </v-list>
    <v-list v-else class="mt-2 rounded-lg">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            No Messages here
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { userChatsRef } from '~/plugins/firebase'

export default {
  name: 'StoreRoomList',
  data: () => ({
    params: {
      search: ''
    },
    items: [],
    filteredItem: [],
    types: {
      customer: 'お客様',
      store: '飲食店',
      deliver: 'デリバー'
    }
  }),
  computed: {
    ...mapGetters('store/chat', ['getRooms'])
  },
  watch: {
    'params.search': _.debounce(function (newVal) {
      this.filterItem(newVal)
    }, 500)
  },
  mounted () {
    userChatsRef.child(this.$auth.$state.user.user.uid).on('child_added', this.addedRoom)
  },
  methods: {
    ...mapActions('firebase', ['getRoomList', 'getRoomInfo', 'getRoomBadge']),
    ...mapActions('store/chat', ['addRoom']),
    selectRoom (item) {
      this.$emit('selectedRoom', item)
    },
    filterItem (val) {
      let temp = JSON.parse(JSON.stringify(this.getRooms))
      if (val) {
        temp = temp.filter(item => item.order_uid.includes(val) || item.name.includes(val) || item.targetUID.includes(val))
      }
      this.filteredItem = JSON.parse(JSON.stringify(temp))
    },
    async addedRoom (data) {
      const temp = data.val()
      const uid = this.$auth.$state.user.user.uid
      const roomInfo = await this.getRoomInfo({ params: temp })
      const badge = await this.getRoomBadge({ params: { room_id: temp, uid } })
      let avatar = ''
      let name = ''
      let role = ''
      let phone = ''
      let targetUID = ''
      let orderUID = ''
      if (roomInfo.senderUID === uid) {
        targetUID = roomInfo.receiverUID
        avatar = roomInfo.receiverAvatar
        name = roomInfo.receiverName
        role = roomInfo.receiverRole
        phone = roomInfo.receiverPhone
        orderUID = roomInfo.order_uid
      } else if (roomInfo.receiverUID === uid) {
        targetUID = roomInfo.senderUID
        avatar = roomInfo.senderAvatar
        name = roomInfo.senderName
        role = roomInfo.senderRole
        phone = roomInfo.senderPhone
        orderUID = roomInfo.order_uid
      }
      this.addRoom({
        id: this.items.length,
        targetUID,
        avatar,
        name,
        type: role,
        room_id: temp,
        date: roomInfo.lastMessageTimestamp,
        phone,
        order_uid: orderUID,
        badge
      })
      this.filteredItem.push({
        id: this.items.length,
        targetUID,
        avatar,
        name,
        type: role,
        room_id: temp,
        date: roomInfo.lastMessageTimestamp,
        phone,
        order_uid: orderUID,
        badge
      })
    }
  }
}
</script>
