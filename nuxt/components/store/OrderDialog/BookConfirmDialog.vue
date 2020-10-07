<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4" :loading="loading">
        <v-card-title class="justify-center py-4 py-md-10 px-4 px-md-8">
          <h2 class="h23 black--text font-weight-bold text-center">
            まもなく予約の時間です。（デリバー確定済）
          </h2>
        </v-card-title>
        <v-card-text class="pb-4 pb-md-8 px-4 px-md-12">
          <h5 class="h45 black--text text-center">
            デリバーは決まっております。
            ご注文の商品を準備してお待ちください。
          </h5>
          <h5 class="black--text text-center">
            ※この通知は予約時間から「配達所要時間＋調理目安時間＋10分」
            を差し引いた時間に送られています。
          </h5>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="6" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="Confirm Order Details"
                @click="onConfirm"
              >
                注文内容を確認
              </v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="error"
                block
                text
                aria-label="Close"
                class="font-weight-bold"
                @click="onClose"
              >
                閉じる
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deliveryDialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-4 py-md-10 px-4 px-md-8">
          <div>
            <h2 class="h23 black--text font-weight-bold text-center">
              予約注文のデリバーが決まっておりません。
            </h2>
            <h2 class="h23 error--text font-weight-bold text-center">
              「デリバーを呼ぶ」ボタンを押して、
              <br>
              デリバーに依頼をしてください。
            </h2>
          </div>
        </v-card-title>
        <v-card-text class="pb-4 pb-md-8 px-4 px-md-12">
          <h5 class="h45 black--text text-center">
            ご注文の商品を準備してお待ちください。
          </h5>
          <h5 class="black--text text-center">
            ※この通知は予約時間から「配達所要時間＋調理目安時間＋10分」
            を差し引いた時間に送られています。
          </h5>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="4" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="Call Delivery"
                class="font-weight-bold"
                @click="onCallDelivery"
              >
                デリバーを呼ぶ
              </v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="4" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="Confirm Order Details"
                @click="onConfirm"
              >
                受注内容を確認
              </v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="error"
                block
                text
                aria-label="Close"
                class="font-weight-bold"
                @click="onClose"
              >
                閉じる
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <order-details-dialog v-model="detailsItem" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import OrderDetailsDialog from '~/components/store/OrderDialog/OrderDetailsDialog'

const DEFAULT_SCHEMA = {
  order_uid: '',
  status: '',
  deliver_uid: null,
  deliver_type: '',
  order_time: '',
  book_date: '',
  is_cutlery: false,
  is_assist: false,
  price: 0,
  products: [],
  customer_name: '',
  customer_phone: '',
  delay_to_store: ''
}

export default {
  name: 'BookConfirmDialog',
  components: { OrderDetailsDialog },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    deliveryDialog: false,
    loading: false,
    detailsItem: null,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          if (val.deliver_uid) {
            this.dialog = true
          } else {
            this.deliveryDialog = true
          }
          this.form = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  methods: {
    ...mapActions('store/order', ['acceptCancellingBook', 'searchDelivery']),
    onClose () {
      this.dialog = false
      this.deliveryDialog = false
      this.$emit('input', null)
    },
    onConfirm () {
      this.detailsItem = this.form
    },
    onCallDelivery () {
      this.searchDelivery(this.form)
        .then(this.onClose)
    }
  }

}
</script>
