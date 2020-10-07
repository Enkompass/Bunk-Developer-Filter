<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4" :loading="loading">
        <v-card-title class="justify-center py-4 py-md-10 px-4 px-md-8">
          <h2 class="h23 black--text font-weight-bold text-center">
            予約（テイクアウト来店）の１時間前です。
          </h2>
        </v-card-title>
        <v-card-text class="pb-4 pb-md-8 px-4 px-md-12">
          <h5 class="h45 black--text text-center">
            商品を準備してお待ちください。
          </h5>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="Confirm Order Details"
                @click="onConfirm"
              >
                注文詳細へ
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
  name: 'TakeoutConfirmDialog',
  components: { OrderDetailsDialog },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA)),
    detailsItem: null
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
    },
    onConfirm () {
      this.detailsItem = this.form
      this.onClose()
    }
  }
}
</script>
