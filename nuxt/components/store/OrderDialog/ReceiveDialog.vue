<template>
  <div>
    <v-dialog v-model="dialog.receive_order" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-8">
          <h2 class="h23 black--text font-weight-bold">
            {{ dialogTitles[order.deliver_type] }}
          </h2>
          <h3 class="h45 black--text mt-3 mt-md-5 text-center" v-html="dialogSubTitles[order.deliver_type]" />
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                class="font-weight-bold"
                @click="gotoDetail"
              >
                注文詳細へ
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.details" :persistent="order.status !== 'accepted'" max-width="800" overlay-opacity="0.6">
      <v-card v-if="order" color="#D4D4D4">
        <v-card-title class="justify-center py-3 py-md-6">
          <h2 v-if="order.is_big_order && order.deliver_type !== 'takeout'" class="h23 black--text font-weight-bold">
            {{ bigDeliveryTypes[order.deliver_type] + 'です' }}
          </h2>
          <h2 v-else class="h23 black--text font-weight-bold">
            {{ deliveryTypes[order.deliver_type] + 'です' }}
          </h2>
        </v-card-title>
        <v-card-subtitle v-if="order.is_big_order && order.deliver_type !== 'takeout'">
          <h5 v-if="order.deliver_type === 'order'" class="h45 grey--text text-center">
            ● 調理目安時間よりも30分以上かかる場合は、
            お客様にその旨を連絡してください。
            <br>
            ● 事業用車両限定で呼びますが、見つからない場合は
            二輪デリバーを複数名呼びます。（1名追加＋500円）
          </h5>
          <h5 v-if="order.deliver_type === 'book'" class="h45 grey--text text-center">
            事業用車両限定で呼びますが、見つからない場合は
            二輪デリバーを複数名呼びます。（1名追加＋500円）
          </h5>
        </v-card-subtitle>
        <v-card-text>
          <v-row class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
                受注日時
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5>
                {{ order.order_time | datetimeFormat }}
              </h5>
            </v-col>
          </v-row>
          <v-row v-if="order.deliver_type !== 'order'" class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
                予約日時
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5 class="secondary--text">
                {{ order.book_date | datetimeFormat }}
              </h5>
            </v-col>
          </v-row>
          <v-divider class="mx-2 mx-md-10 white" />
          <v-row class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'utensils']" class="secondary--text" />
                商品内容
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5 v-if="order.products.length > 0">
                {{ order.products.length > 0 ? (order.products[0].product_name + '   数量' + order.products[0].quantity) : 0 }}
              </h5>
            </v-col>
            <v-divider class="mx-3 white" />
            <v-col v-if="order.products.length > 1" cols="12" class="text-right">
              <div v-for="(item, index) in secondProducts" :key="index">
                <h5>
                  {{ item.product_name + '    数量' + item.quantity }}
                </h5>
                <v-divider class="mx-1 white" />
              </div>
            </v-col>
            <v-col cols="12" class="text-right">
              <h5>{{ order.is_cutlery ? 'カトラリーあり' : 'カトラリーなし' }}</h5>
            </v-col>
            <v-divider class="mx-3 white" />
            <v-col cols="12" class="text-right">
              <h5>{{ order.is_assist ? '支援金あり' : '支援金なし' }}</h5>
            </v-col>
          </v-row>
          <v-divider class="mx-2 mx-md-10 white" />
          <v-row class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
                商品売上
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5>
                {{ order.price | currency }}
              </h5>
            </v-col>
          </v-row>
          <v-divider class="mx-2 mx-md-10 white" />
          <v-row class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'user-circle']" class="secondary--text" />
                お客様の名前
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5>
                {{ order.customer_name }}
              </h5>
            </v-col>
          </v-row>
          <v-divider class="mx-2 mx-md-10 white" />
          <v-row class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'quote-right']" class="secondary--text" />
                備考
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5>
                {{ order.note }}
              </h5>
            </v-col>
          </v-row>
          <v-divider class="mx-2 mx-md-10 white" />
          <v-row v-if="order.deliver_type !== 'order'" justify="center" class="px-2 px-md-10 mt-3">
            <h6 class="grey--text text-center">
              ※こちらを閉じても受注管理画面から操作ができます。
            </h6>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12" md="4" sm="12" class="br-1-grey">
              <v-btn
                v-if="order.deliver_type === 'order'"
                :disabled="order.status === 'accepted'"
                block
                color="secondary"
                text
                aria-label="Find Delivery"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                class="font-weight-bold"
                @click="findDelivery"
              >
                デリバーを呼ぶ
              </v-btn>
              <v-btn
                v-else
                block
                color="secondary"
                text
                aria-label="Accept Order"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                class="font-weight-bold"
                @click="acceptOrder"
              >
                受け付けました
              </v-btn>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="br-1-grey">
              <v-btn
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                aria-label="Contact Customer"
                @click="customerContact"
              >
                お客様に連絡
              </v-btn>
            </v-col>
            <v-col cols="12" md="4" sm="12">
              <v-btn
                :disabled="order.status === 'accepted'"
                block
                color="error"
                text
                aria-label="Emergency cancel"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="showCancelDialog"
              >
                緊急時のキャンセル
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.customerContact" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="h23 secondary--text font-weight-bold">
            <font-awesome-icon :icon="['fas', 'phone-alt']" />
            {{ order.customer_phone }}
          </h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="h45 black--text text-center mt-3">
            やむを得ない理由で、通常通りの対応ができない場合は、<br>
            お客様へ連絡をし、理由を伝えてください。
          </h3>
        </v-card-subtitle>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn
                block
                color="grey"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="dialog.customerContact = false"
              >
                閉じる
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.cancel" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="h23 font-weight-bold">
            お客様へキャンセルの連絡をお願いします
          </h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="h45 black--text text-center mt-3">
            【要確認】やむを得ない理由で通常通りの対応ができない場合は、<br>
            <span class="error--text">お客様へ連絡をし理由を伝えてから</span>
            キャンセルをしてください。
          </h3>
        </v-card-subtitle>
        <v-card-text class="text-center">
          <div class="d-flex error--text align-center justify-center h23">
            <font-awesome-icon :icon="['fas', 'phone-alt']" class="error--text" />
            {{ order.customer_phone }}
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn
                block
                color="error"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="confirmCancel"
              >
                連絡済なのでキャンセル
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const DEFAULT_SCHEMA = {
  order_uid: '',
  status: '',
  deliver_type: '',
  order_time: '',
  book_date: '',
  is_cutlery: false,
  is_assist: false,
  price: 0,
  products: [],
  customer_name: '',
  customer_phone: '',
  delay_to_store: '',
  is_big_order: false
}

export default {
  name: 'ReceiveDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: {
      receive_order: false,
      details: false,
      customerContact: false,
      cancel: false
    },
    dialogTitles: {
      order: '【今すぐ注文】が入りました',
      book: '【予約注文】が入りました',
      takeout: '【テイクアウト】で注文が入りました'
    },
    dialogSubTitles: {
      order: '受注時間から  5分以内 に注文詳細を確認し、<br>『デリバーを呼ぶ』ボタンを押してください。',
      book: '受注時間から 5分以内 に注文詳細を確認し、<br>『受け付けました』ボタンを押してください。',
      takeout: '受注時間から 5分以内 に注文詳細を確認し、<br>『受け付けました』ボタンを押してください。'
    },
    deliveryTypes: {
      order: '【今すぐ注文】',
      book: '【予約注文】',
      takeout: '【テイクアウト注文】'
    },
    bigDeliveryTypes: {
      order: '【今すぐ注文（大量注文）】',
      book: '【予約注文（大量注文）】'
    },
    order: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  computed: {
    secondProducts () {
      if (this.order.products.length > 1) {
        const temp = JSON.parse(JSON.stringify(this.order.products))
        return temp.splice(1)
      }
      return []
    }
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        this.dialog.receive_order = true
        this.order = JSON.parse(JSON.stringify(val))
        this.$bus.$emit('order.refresh', ({}))
        this.$bus.$emit('refresh_badge', ({}))
      }
    }
  },
  methods: {
    ...mapActions('store/order', ['searchDelivery', 'cancelOrder', 'acceptingOrder']),
    gotoDetail () {
      this.dialog.receive_order = false
      this.dialog.details = true
    },
    async findDelivery () {
      const response = await this.searchDelivery({
        order_uid: this.order.order_uid
      })
      if (response === true) {
        this.dialog.details = false
      }
    },
    customerContact () {
      this.dialog.customerContact = true
    },
    showCancelDialog () {
      this.dialog.details = false
      this.dialog.cancel = true
    },
    acceptOrder () {
      this.acceptingOrder({
        order_uid: this.order.order_uid
      }).then((res) => {
        this.dialog.details = false
      })
    },
    confirmCancel () {
      this.dialog.cancel = false
      this.cancelOrder({
        order_uid: this.order.order_uid
      })
    }
  }
}
</script>
