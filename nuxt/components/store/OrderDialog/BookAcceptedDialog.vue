<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4" :loading="loading">
        <v-card-title class="justify-center py-4 py-md-10 px-4 px-md-8">
          <h2 class="h23 black--text font-weight-bold text-center">
            予約注文のデリバーが決まりました！
          </h2>
        </v-card-title>
        <v-card-text class="pb-4 pb-md-8 px-4 px-md-12">
          <h5 class="h45 black--text text-center">
            予約当日に確認通知をします。
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
    <v-dialog v-model="detailDialog" :persistent="form.status !== 'accepted'" max-width="800" overlay-opacity="0.6">
      <v-card v-if="form" color="#D4D4D4">
        <v-card-title class="justify-center py-3 py-md-6">
          <h2 v-if="form.is_big_order && form.deliver_type !== 'takeout'" class="h23 black--text font-weight-bold">
            {{ bigDeliveryTypes[form.deliver_type] + 'です' }}
          </h2>
          <h2 v-else class="h23 black--text font-weight-bold">
            {{ deliveryTypes[form.deliver_type] + 'です' }}
          </h2>
        </v-card-title>
        <v-card-subtitle v-if="form.is_big_order && form.deliver_type !== 'takeout'">
          <h5 v-if="form.deliver_type === 'order'" class="h45 grey--text text-center">
            ● 調理目安時間よりも30分以上かかる場合は、
            お客様にその旨を連絡してください。
            <br>
            ● 事業用車両限定で呼びますが、見つからない場合は
            二輪デリバーを複数名呼びます。（1名追加＋500円）
          </h5>
          <h5 v-if="form.deliver_type === 'book'" class="h45 grey--text text-center">
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
                {{ form.order_time | datetimeFormat }}
              </h5>
            </v-col>
          </v-row>
          <v-row v-if="form.deliver_type !== 'order'" class="px-2 px-md-10">
            <v-col cols="4" sm="5">
              <h6 class="d-flex align-center h45">
                <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
                予約日時
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right">
              <h5 class="secondary--text">
                {{ form.book_date | datetimeFormat }}
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
              <h5 v-if="form.products.length > 0">
                {{ form.products.length > 0 ? (form.products[0].product_name + '   数量' + form.products[0].quantity) : 0 }}
              </h5>
            </v-col>
            <v-divider class="mx-3 white" />
            <v-col v-if="form.products.length > 1" cols="12" class="text-right">
              <div v-for="(item, index) in secondProducts" :key="index">
                <h5>
                  {{ item.product_name + '    数量' + item.quantity }}
                </h5>
                <v-divider class="mx-1 white" />
              </div>
            </v-col>
            <v-col cols="12" class="text-right">
              <h5>{{ form.is_cutlery ? 'カトラリーあり' : 'カトラリーなし' }}</h5>
            </v-col>
            <v-divider class="mx-3 white" />
            <v-col cols="12" class="text-right">
              <h5>{{ form.is_assist ? '支援金あり' : '支援金なし' }}</h5>
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
                {{ form.price | currency }}
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
                {{ form.customer_name }}
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
                {{ form.note }}
              </h5>
            </v-col>
          </v-row>
          <v-divider class="mx-2 mx-md-10 white" />
          <v-row v-if="form.deliver_type !== 'order'" justify="center" class="px-2 px-md-10 mt-3">
            <h6 class="grey--text text-center">
              ※こちらを閉じても受注管理画面から操作ができます。
            </h6>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <v-btn
                block
                color="error"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="onCloseDetail"
              >
                閉じる
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
  name: 'BookAcceptedDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    detailDialog: false,
    loading: false,
    bigDeliveryTypes: {
      order: '【今すぐ注文（大量注文）】',
      book: '【予約注文（大量注文）】'
    },
    deliveryTypes: {
      order: '【今すぐ注文】',
      book: '【予約注文】',
      takeout: '【テイクアウト注文】'
    },
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  computed: {
    secondProducts () {
      if (this.form.products.length > 1) {
        const temp = JSON.parse(JSON.stringify(this.form.products))
        return temp.splice(1)
      }
      return []
    }
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.dialog = true
          this.form = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  methods: {
    ...mapActions('store/order', ['acceptCancellingBook']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    },
    onConfirm () {
      this.detailDialog = true
      /* this.acceptCancellingBook(this.form)
        .then(this.onClose)
        .finally(() => {
          this.loading = false
        }) */
    },
    onCloseDetail () {
      this.detailDialog = false
    }
  }

}
</script>
