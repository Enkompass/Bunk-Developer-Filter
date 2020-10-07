<template>
  <v-dialog v-model="dialog" :persistent="form.status !== 'accepted'" max-width="800" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-3 py-md-6">
        <h2 class="h23 black--text font-weight-bold">
          {{ deliveryTypes[form.deliver_type] + 'です' }}
        </h2>
      </v-card-title>
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
        <v-row v-if="form.deliver_type !== 'order'" justify="center" class="px-2 px-md-10 mt-3">
          <h6 class="grey--text text-center">
            ※こちらを閉じても受注管理画面から操作ができます。
          </h6>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              block
              color="secondary"
              text
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              @click="onClose"
            >
              閉じる
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

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
  delay_to_store: ''
}

export default {
  name: 'OrderDetailsDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA)),
    deliveryTypes: {
      order: '【今すぐ注文】',
      book: '【予約注文】',
      takeout: '【テイクアウト注文】'
    }
  }),
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
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    }
  }
}
</script>
