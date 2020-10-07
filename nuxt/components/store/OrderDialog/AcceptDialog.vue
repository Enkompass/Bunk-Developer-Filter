<template>
  <v-dialog v-model="dialog.accepted" persistent max-width="800" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10">
        <h2 class="h23 font-weight-bold text-center">
          {{
            parseInt(cooking_time) * 60 > parseInt(order.delay_to_store)
              ? '担当デリバーが決まりました！'
              : `担当デリバーが決まりましたが、現在地が遠いため到着が約${order.delay_to_store === 'unknown' ? 9999 : Math.round(order.delay_to_store / 60)}分ほど遅れます`
          }}
        </h2>
      </v-card-title>
      <v-card-subtitle>
        <h3 class="h45 black--text text-center mt-3">
          {{
            parseInt(cooking_time) * 60 > parseInt(order.delay_to_store)
              ? '商品の準備をしてお待ちください。'
              : 'お客様にも同様の通知が送られています。'
          }}
        </h3>
      </v-card-subtitle>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="12" md="4" sm="12" class="br-1-grey">
            <v-btn
              block
              color="secondary"
              text
              aria-label="Confirm Delivery"
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              class="font-weight-bold"
              @click="confirmDelivery"
            >
              デリバーを確認
            </v-btn>
          </v-col>
          <v-col cols="12" md="4" sm="12" class="br-1-grey">
            <v-btn
              block
              color="secondary"
              text
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              aria-label="Confirm Order Details"
              @click="confirmOrderDetails"
            >
              受注内容を確認
            </v-btn>
          </v-col>
          <v-col cols="12" md="4" sm="12">
            <v-btn
              block
              color="error"
              text
              aria-label="Close Dialog"
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              @click="dialog.accepted = false"
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
  name: 'AcceptDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    cooking_time: '',
    dialog: {
      accepted: false
    },
    order: JSON.parse(JSON.stringify(DEFAULT_SCHEMA)),
    title: '',
    subtitle: ''
  }),
  watch: {
    value: {
      deep: true,
      handler (val) {
        this.dialog.accepted = true
        this.order = val
      }
    }
  },
  mounted () {
    this.cooking_time = this.$auth.$state.user.user.cooking_time
  },
  methods: {
    confirmDelivery () {
      this.dialog.accepted = false
    },
    confirmOrderDetails () {
      this.dialog.details = true
    }
  }
}
</script>
