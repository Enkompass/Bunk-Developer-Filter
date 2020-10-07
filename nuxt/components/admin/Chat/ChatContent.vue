<template>
  <div v-if="item" class="chat-content">
    <v-card tile elevation="2">
      <v-card-title>
        <v-row no-gutters justify="space-between" align="center">
          <div class="d-md-flex align-center">
            <div class="hidden-md-and-up">
              <h6 class="grey--text">
                <v-btn text @click="backtoList">
                  <font-awesome-icon :icon="['fas', 'angle-left']" class="grey--text" />
                  戻る
                </v-btn>
              </h6>
            </div>
            <h5 class="font-weight-bold black--text">
              <font-awesome-icon :icon="icons[item.senderRole]" class="secondary--text" />
              {{ item.senderName }}
            </h5>
          </div>
          <div>
            <h5 class="grey--text text-center">
              {{ order_uid }}
            </h5>
          </div>
          <div>
            <h5 class="font-weight-bold black--text">
              <font-awesome-icon :icon="icons[item.receiverRole]" class="secondary--text" />
              {{ item.receiverName }}
            </h5>
          </div>
        </v-row>
      </v-card-title>
      <v-card-text ref="content" class="height-100 d-flex flex-column-reverse">
        <chat
          v-for="(chat, index) in getChatContents"
          :key="index"
          :avatar="chat.senderAvatar"
          :message="chat.message"
          :timestamp="chat.timestamp"
          :left="chat.left"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Chat from '~/components/admin/Chat/Chat'
import validationRules from '~/mixins/validationRules'

export default {
  name: 'ChatContent',
  components: { Chat },
  mixins: [validationRules],
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    items: [
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが入りますメッセージが入りますメッセージが入りますメッセージが入ります', timestamp: '22:32', left: true },
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが入りますメッセージが入りますメッセージが入りますメッセージが入ります', timestamp: '22:32', left: false },
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが', timestamp: '22:32', left: true },
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが入りますメッセージが入りますメッセージが入りますメッセージが入ります', timestamp: '22:32', left: true },
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが入りますメッセージが入りますメッセージが入りますメッセージが入ります', timestamp: '22:32', left: false },
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが入りますメッセージが入りますメッセージが入りますメッセージが入ります', timestamp: '22:32', left: true },
      { avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', content: 'メッセージが入りますメッセージが入りますメッセージが入りますメッセージが入りますメッセージが入ります', timestamp: '22:32', left: true }
    ],
    chat_content: '',
    types: {
      customer: 'お客様',
      store: '飲食店',
      deliver: 'デリバー'
    },
    icons: {
      customer: ['fas', 'user'],
      store: ['fas', 'utensils'],
      deliver: ['fas', 'box-open']
    },
    order_uid: ''
  }),
  computed: {
    ...mapGetters('admin/chat', ['getChatContents'])
  },
  watch: {
    item: {
      deep: true,
      async handler (val) {
        if (val) {
          this.order_uid = val.order_uid
          await this.getChats(this.item.room_id)
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/chat', ['getChats']),
    backtoList () {
      this.$emit('backtoList')
    },
    scrollToEnd () {
      const container = this.$refs.content
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>
