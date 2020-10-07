<template>
  <div v-if="item" class="chat-content">
    <v-card tile elevation="2">
      <v-card-title>
        <v-row no-gutters justify="space-between" align="center">
          <div>
            <div class="hidden-md-and-up">
              <h6 class="grey--text">
                <v-btn text @click="backtoList">
                  <font-awesome-icon :icon="['fas', 'angle-left']" class="grey--text" />
                  戻る
                </v-btn>
              </h6>
            </div>
          </div>
          <div>
            <div class="d-flex align-center">
              <h4 class="font-weight-bold mr-2">
                {{ item ? item.name : '' }}
              </h4>
              <v-chip outlined label :color="item.type === 'customer' ? 'secondary' : 'grey'" small>
                <h5>
                  {{ item ? types[item.type] : '' }}
                </h5>
              </v-chip>
            </div>
            <h5 class="grey--text text-center">
              {{ item ? item.order_uid : '' }}
            </h5>
          </div>
          <v-btn icon :href="`tel:${item ? item.phone : ''}`">
            <font-awesome-icon :icon="['fas', 'phone']" class="secondary--text" />
          </v-btn>
        </v-row>
      </v-card-title>
      <v-card-text ref="content" class="content height-100 d-flex flex-column-reverse">
        <store-chat
          v-for="(chat, index) in items"
          :key="index"
          :avatar="chat.avatar"
          :content="chat.content"
          :timestamp="chat.timestamp"
          :left="chat.left"
        />
      </v-card-text>
      <v-card-actions>
        <v-row no-gutters>
          <v-col cols="12">
            <v-form ref="ref">
              <div :class="{'d-flex flex-row-reverse align-center': $vuetify.breakpoint.smAndDown}">
                <div class="d-flex justify-end">
                  <v-btn color="secondary" class="white--text" height="32" @click="submit">
                    送信
                    <font-awesome-icon :icon="['fas', 'paper-plane']" class="white--text" />
                  </v-btn>
                </div>
                <v-textarea
                  v-model="chat_content"
                  placeholder="メッセージを入力…"
                  :rows="$vuetify.breakpoint.smAndDown ? 1 : 3"
                  :rules="[rules.required]"
                  background-color="#f2f2f2"
                  no-resize
                  dense
                  outlined
                  hide-details
                  class="mt-0 mt-md-2 mr-2 mr-md-0"
                />
              </div>
            </v-form>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import StoreChat from '~/components/store/Chat/StoreChat'
import validationRules from '~/mixins/validationRules'
import { messagesRef } from '~/plugins/firebase'

export default {
  name: 'StoreChatContent',
  components: { StoreChat },
  mixins: [validationRules],
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    items: [],
    author: {},
    target: {},
    chat_content: '',
    types: {
      customer: 'お客様',
      store: '飲食店',
      deliver: 'デリバー'
    }
  }),
  watch: {
    item: {
      deep: true,
      handler (val) {
        if (val) {
          this.items = []
          this.updateReadStatus(val)
          this.$bus.$emit('refresh_notify_badge', ({}))
          messagesRef.child(this.item.room_id).endAt().on('child_added', this.addedContent)
        }
      }
    }
  },
  methods: {
    ...mapActions('firebase', ['getChatContent', 'getUserInfo', 'sendMessage']),
    ...mapActions('store/chat', ['sendPushNotification', 'updateReadStatus']),
    backtoList () {
      this.$emit('backtoList')
    },
    async submit () {
      if (!this.chat_content) {
        return
      }
      const message = this.chat_content
      this.chat_content = ''
      const author = {
        uid: this.$auth.$state.user.user.uid,
        name: this.$auth.$state.user.user.name,
        phone: this.$auth.$state.user.user.mobile_phone ? this.$auth.$state.user.user.mobile_phone : '',
        role: this.$auth.$state.user.user.role,
        avatar: this.$auth.$state.user.user.main_photo ? this.$auth.$state.user.user.main_photo : ''
      }
      const target = {
        uid: this.item.targetUID,
        name: this.item.name,
        phone: this.item.phone,
        role: this.item.type,
        avatar: this.item.avatar
      }
      await this.sendMessage({
        author,
        target,
        message,
        order_uid: this.item.order_uid,
        openChat: false
      })
      await this.sendPushNotification({
        author,
        target,
        message,
        order_uid: this.item.order_uid
      })
      this.scrollToEnd()
    },
    addedContent (data) {
      const temp = data.val()
      this.items.unshift({
        avatar: temp.senderAvatar,
        content: temp.message,
        left: temp.senderUID !== this.$auth.$state.user.user.uid,
        timestamp: temp.timestamp
      })
    },
    scrollToEnd () {
      const container = this.$refs.content
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>
