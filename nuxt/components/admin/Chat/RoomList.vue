<template>
  <div class="admin-room-list">
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'comments']" class="secondary--text" />
        チャットルーム確認
      </h3>
    </div>
    <div class="d-flex align-center">
      <v-btn
        :color="params.type === 'store_delivery' ? 'secondary' : 'grey'"
        text
        width="33%"
        class="px-2 ml-0 rounded-0"
        :class="{'border-active': params.type === 'store_delivery'}"
        :ripple="false"
        @click="params.type = 'store_delivery'"
      >
        <h6>
          飲食店とデリバー
        </h6>
      </v-btn>
      <v-btn
        :color="params.type === 'store_customer' ? 'secondary' : 'grey'"
        text
        width="33%"
        class="ml-0 px-2 rounded-0"
        :ripple="false"
        :class="{'border-active': params.type === 'store_customer'}"
        @click="params.type = 'store_customer'"
      >
        <h6>
          飲食店とユーザー
        </h6>
      </v-btn>
      <v-btn
        :color="params.type === 'customer_delivery' ? 'secondary' : 'grey'"
        text
        width="33%"
        class="ml-0 px-2 rounded-0"
        :ripple="false"
        :class="{'border-active': params.type === 'customer_delivery'}"
        @click="params.type = 'customer_delivery'"
      >
        <h6>
          ユーザーとデリバー
        </h6>
      </v-btn>
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
    <v-list two-line class="mt-2" style="border-radius: 15px;">
      <template v-for="(item, index) in filteredItem">
        <v-list-item :key="index" @click="selectRoom(item)">
          <v-list-item-icon>
            <v-avatar>
              <img
                :src="item.senderAvatar"
                alt=""
              >
            </v-avatar>
            <v-avatar style="position: absolute; top: 30px; left: 40px;">
              <img
                :src="item.receiverAvatar"
                alt=""
              >
            </v-avatar>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              <h6 class="font-weight-bold black--text">
                <font-awesome-icon :icon="icons[item.senderRole]" class="secondary--text" />
                {{ item.senderName }}
              </h6>
            </v-list-item-title>
            <v-list-item-subtitle>
              <h6 class="font-weight-bold black--text">
                <font-awesome-icon :icon="icons[item.receiverRole]" class="secondary--text" />
                {{ item.receiverName }}
              </h6>
            </v-list-item-subtitle>
            <v-list-item-subtitle class="grey--text" v-text="item.order_uid" />
          </v-list-item-content>

          <v-list-item-action>
            <h6 class="grey--text">
              {{ item.lastMessageTimestamp | monthFormat }}
            </h6>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="item.id" />
      </template>
    </v-list>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'RoomList',
  async fetch () {
    await this.getRoomList()
    this.filteredItem = JSON.parse(JSON.stringify(this.getRooms))
    this.filterItem('', 'store_delivery')
  },
  data: () => ({
    params: {
      search: '',
      type: 'store_delivery'
    },
    filteredItem: [],
    items: [],
    types: {
      customer: 'お客様',
      store: '飲食店',
      deliver: 'デリバー'
    },
    icons: {
      customer: ['fas', 'user'],
      store: ['fas', 'utensils'],
      deliver: ['fas', 'box-open']
    }
  }),
  computed: {
    ...mapGetters('admin/chat', ['getRooms'])
  },
  watch: {
    'params.type' (val) {
      this.filterItem(this.params.search, val)
    },
    'params.search': _.debounce(function (newVal) {
      this.filterItem(newVal, this.params.type)
    }, 500)
  },
  methods: {
    ...mapActions('store/chat', ['addRoom']),
    ...mapActions('admin/chat', ['getRoomList']),
    selectRoom (item) {
      this.$emit('selectedRoom', item)
    },
    filterItem (val, type) {
      let temp = JSON.parse(JSON.stringify(this.getRooms))
      if (val) {
        temp = temp.filter(item => item.order_uid.includes(val) || item.senderName.includes(val) || item.receiverName.includes(val))
      }
      if (type === 'store_delivery') {
        temp = temp.filter(item => (item.senderRole === 'store' && item.receiverRole === 'deliver') || (item.senderRole === 'deliver' && item.receiverRole === 'store'))
      } else if (type === 'store_customer') {
        temp = temp.filter(item => (item.senderRole === 'store' && item.receiverRole === 'customer') || (item.senderRole === 'customer' && item.receiverRole === 'store'))
      } else if (type === 'customer_delivery') {
        temp = temp.filter(item => (item.senderRole === 'customer' && item.receiverRole === 'deliver') || (item.senderRole === 'deliver' && item.receiverRole === 'customer'))
      }
      this.filteredItem = JSON.parse(JSON.stringify(temp))
    }
  }
}
</script>
