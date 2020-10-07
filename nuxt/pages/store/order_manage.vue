<template>
  <div class="store-order-manage">
    <div class="d-md-flex justify-start align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'box-open']" class="secondary--text" />
        受注管理
      </h3>
    </div>
    <div>
      <v-chip-group
        v-model="params.filter"
        multiple
        active-class="secondary--text"
      >
        <v-chip
          v-for="(item, index) in filterItems"
          :key="index"
          color="#f2f2f2"
          pill
          text-color="black"
          :ripple="false"
          :value="item.value"
        >
          <v-icon color="grey">
            mdi-check-circle
          </v-icon>
          <h5>{{ item.text }}</h5>
        </v-chip>
      </v-chip-group>
    </div>
    <v-data-table
      :headers="headers"
      :items="getOrderRows"
      :server-items-length="getOrderCount"
      :loading="getOrderLoading"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-2"
    >
      <template v-slot:item.status="{ item }">
        <h6 :class="{'red--text': item.status !== 'complete'}">
          {{ statusTypes[item.status] }}
        </h6>
      </template>
      <template v-slot:item.order_type="{ item }">
        <h6>
          {{ orderTypes[item.order_type] }}
        </h6>
      </template>
      <template v-slot:item.order_date_time="{ item }">
        <h6>
          {{ item.order_date_time | monthDayTimeFormat }}
        </h6>
      </template>
      <template v-slot:item.serve_date_time="{ item }">
        <h6 v-if="item.order_type === 'order'">
          今すぐ
        </h6>
        <h6 v-else-if="item.serve_date_time">
          {{ item.serve_date_time | monthDayTimeFormat }}
        </h6>
        <h6 v-else>
          -
        </h6>
      </template>
      <template v-slot:item.coming_date_time="{ item }">
        <h6 v-if="item.coming_date_time">
          {{ item.coming_date_time | monthDayTimeFormat }}
        </h6>
        <h6 v-else>
          -
        </h6>
      </template>
      <template v-slot:item.delivery_start_date_time="{ item }">
        <h6>
          {{ item.delivery_start_date_time ? item.delivery_start_date_time : ' - ' }}
        </h6>
      </template>
      <template v-slot:item.product_details="{ item }">
        <v-menu transition="slide-reverse-x-transition" bottom left>
          <template v-slot:activator="{ on, attrs }">
            <h6 class="secondary--text" v-bind="attrs" v-on="on">
              詳細
            </h6>
          </template>
          <v-card class="pa-0 rounded-sm" min-width="200" max-width="250">
            <v-card-text class="black--text">
              <template v-for="(product, index) in item.products">
                <div :key="index" class="d-flex justify-space-between align-center">
                  <h6>{{ product.product_name }}</h6>
                  <h6>{{ `数量  ${product.quantity}` }}</h6>
                </div>
                <div v-if="product.options.length > 0" :key="index">
                  <div v-for="(option, opt_idx) in product.options" :key="opt_idx" class="d-flex justify-space-between align-center">
                    <h6>{{ option.name }}</h6>
                    <h6>{{ option.count }}</h6>
                  </div>
                </div>
              </template>
              <div class="d-flex justify-space-between align-center">
                <h6>カトラリー</h6>
                <h6>
                  {{ item.is_cutlery ? 'あり' : '無し' }}
                </h6>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:item.note="{ item }">
        <v-menu transition="slide-reverse-x-transition" bottom left offset-y>
          <template v-slot:activator="{ on, attrs }">
            <h6 v-if="item.note" class="secondary--text" v-bind="attrs" v-on="on">
              備考
            </h6>
            <h6 v-else>
              -
            </h6>
          </template>
          <v-card class="pa-0 rounded-sm" min-width="200" max-width="250">
            <v-card-text class="black--text">
              <h6>{{ item.note }}</h6>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:item.product_price="{ item }">
        <h6>{{ item.product_price | currency }}</h6>
      </template>
      <template v-slot:item.delivery_call="{ item }">
        <v-btn
          v-if="!item.delivery_uid && item.order_type !== 'takeout'"
          :disabled="item.status === 'cancel' || item.status === 'cancelling' || item.status === 'complete'"
          color="secondary"
          text
          :ripple="false"
          @click="callDelivery(item)"
        >
          デリバーを呼ぶ
        </v-btn>
        <h6 v-else>
          -
        </h6>
      </template>
      <template v-slot:item.delivery_handover="{ item }">
        <h6 :class="{'secondary--text': item.delivery_handover}">
          {{ item.status === 'complete' ? '引継完了' : ' - ' }}
        </h6>
      </template>
      <template v-slot:item.takeout="{ item }">
        <h6 :class="{'secondary--text': item.order_type === 'takeout'}">
          {{ item.order_type === 'takeout' && item.status === 'complete' ? '受け渡し完了' : ' - ' }}
        </h6>
      </template>
      <template v-slot:item.delivery_contact="{ item }">
        <v-btn
          v-if="item.delivery_uid"
          :disabled="item.status === 'created'"
          color="secondary"
          text
          @click="openModal(item, 'delivery')"
        >
          デリバーへ連絡
        </v-btn>
        <h6 v-else>
          -
        </h6>
      </template>
      <template v-slot:item.customer_contact="{ item }">
        <v-btn
          :disabled="item.status === 'created'"
          color="secondary"
          text
          @click="openModal(item)"
        >
          お客様へ連絡
        </v-btn>
      </template>
      <template v-slot:item.cancel_action="{ item }">
        <v-btn color="error" text :disabled="item.status === 'cancel' || item.status === 'complete'" @click="orderCancel(item)">
          キャンセル
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" :persistent="$vuetify.breakpoint.mdAndUp" max-width="640">
      <v-card>
        <v-card-title class="justify-center py-5 py-md-10">
          <h2>{{ modal.title }}</h2>
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col md="4" sm="6" class="br-1-grey-fixed">
              <v-btn
                :href="`tel:${target.phone}`"
                block
                color="secondary"
                text
                aria-label="phone_call"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              >
                電話
              </v-btn>
            </v-col>
            <v-col md="4" sm="6" class="br-1-grey">
              <v-btn
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                aria-label="chatting"
                @click="openChat"
              >
                チャット
              </v-btn>
            </v-col>
            <v-col md="4" class="d-none d-sm-block">
              <v-btn
                block
                color="accent"
                text
                aria-label="cancel"
                height="56"
                @click="dialog = false"
              >
                キャンセル
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrderManage',
  async fetch () {
    await this.getStoreOrders({
      ...this.params
    })
  },
  data: () => ({
    dialog: false,
    statusTypes: {
      created: '未完了',
      verified: '未完了',
      accepted: '未完了',
      cooking: '未完了',
      delivering: '未完了',
      complete: '完了済',
      cancel: 'キャンセル',
      cancelling: '未完了'
    },
    orderTypes: {
      order: '今すぐ',
      book: '予約',
      takeout: 'テイクアウト'
    },
    filterItems: [
      { text: '未完了の注文のみ', value: 'incomplete' },
      { text: '本日の注文のみ', value: 'today_order' },
      { text: '今すぐ注文のみ', value: 'order' },
      { text: '予約注文のみ', value: 'book' },
      { text: 'テイクアウトの注文のみ', value: 'takeout' }
    ],
    params: {
      filter: ['incomplete', 'order', 'book', 'takeout']
    },
    headers: [
      { text: '状態', value: 'status', align: 'center', width: '110px' },
      { text: '注文種類', value: 'order_type', align: 'center', width: '120px' },
      { text: '受注管理No', value: 'uid', align: 'center', width: '140px' },
      { text: '受注日時', value: 'order_date_time', align: 'center', width: '125px' },
      { text: 'お届け日時', value: 'serve_date_time', align: 'center', width: '125px' },
      { text: '来店日時', value: 'coming_date_time', align: 'center', width: '125px' },
      { text: 'デリバー出発', value: 'delivery_start_date_time', align: 'center', width: '125px' },
      { text: '商品詳細', value: 'product_details', align: 'center', width: '100px' },
      { text: '備考', value: 'note', align: 'center', width: '120px' },
      { text: '売上', value: 'product_price', align: 'center', width: '100px' },
      { text: 'お客様氏名', value: 'customer_name', align: 'center', width: '120px' },
      { text: 'デリバーを呼ぶ', value: 'delivery_call', align: 'center', width: '145px' },
      { text: 'デリバー引継', value: 'delivery_handover', align: 'center', width: '125px' },
      { text: 'テイクアウト', value: 'takeout', align: 'center', width: '130px' },
      { text: '担当デリバー', value: 'delivery_uid', align: 'center', width: '135px' },
      { text: 'デリバー連絡', value: 'delivery_contact', align: 'center', width: '145px' },
      { text: 'お客様連絡', value: 'customer_contact', align: 'center', width: '130px' },
      { text: 'キャンセル', value: 'cancel_action', align: 'center', width: '120px' }
    ],
    modal: {
      title: '',
      phone: '',
      chat_id: ''
    },
    from: 'delivery',
    target: {},
    order_uid: ''
  }),
  computed: {
    ...mapGetters('store/order', ['getOrderCount', 'getOrderRows', 'getOrderLoading'])
  },
  watch: {
    'params.filter': '$fetch'
  },
  mounted () {
    this.$bus.$on('order.refresh', () => {
      this.$fetch()
    })
  },
  beforeDestroy () {
    this.$bus.$off('order.refresh')
  },
  methods: {
    ...mapActions('store/order', ['getStoreOrders', 'searchDelivery', 'cancelOrder']),
    ...mapActions('firebase', ['sendMessage']),
    ...mapActions('store/chat', ['sendPushNotification']),
    async openChat () {
      const author = {
        uid: this.$auth.$state.user.user.uid,
        name: this.$auth.$state.user.user.name,
        phone: this.$auth.$state.user.user.mobile_phone ? this.$auth.$state.user.user.mobile_phone : '',
        role: 'store',
        avatar: this.$auth.$state.user.user.main_photo ? this.$auth.$state.user.user.main_photo : ''
      }
      if (this.target.uid) {
        await this.sendMessage({
          author,
          target: this.target,
          message: '',
          order_uid: this.order_uid,
          openChat: true
        })
        this.$router.push('/store/chat_room')
      }
    },
    openModal (item, from) {
      this.dialog = true
      if (from === 'delivery') {
        this.modal.title = '担当デリバーへ連絡しますか？'
        this.from = 'delivery'
        this.target = {
          uid: item.delivery_contact.uid,
          name: item.delivery_contact.name,
          phone: item.delivery_contact.phone,
          role: from === 'delivery' ? 'deliver' : 'customer',
          avatar: item.delivery_contact.avatar
        }
      } else {
        this.modal.title = 'お客様へ連絡しますか？'
        this.from = 'customer'
        this.target = {
          uid: item.customer_contact.uid,
          name: item.customer_contact.name,
          phone: item.customer_contact.phone,
          role: from === 'delivery' ? 'deliver' : 'customer',
          avatar: item.customer_contact.avatar
        }
      }
      this.order_uid = item.uid
      this.modal.phone = item.phone
      this.modal.chat_id = item.uid
    },
    async callDelivery (item) {
      await this.searchDelivery({
        order_uid: item.uid
      })
    },
    async orderCancel (item) {
      await this.cancelOrder({
        order_uid: item.uid
      })
    }
  },
  head: () => ({
    title: '受注管理'
  })
}
</script>
