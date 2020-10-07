<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-card color="#D4D4D4" :loading="loading">
      <v-card-title class="justify-center py-4 py-md-10 px-4 px-md-8">
        <h2 class="h23 black--text font-weight-bold text-center">
          お客様より【予約・テイクアウト】の
          <br class="pt-1">
          キャンセル申請がありました
        </h2>
      </v-card-title>
      <v-card-text class="pb-4 pb-md-8 px-4 px-md-12">
        <h5 class="h45 black--text text-center">
          キャンセル料
          <br>
          6〜3日前 商品代金の75％
          <br>
          2日前〜当日 商品代金の100％
        </h5>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              color="error"
              block
              text
              aria-label="Accept Cancelling"
              class="font-weight-bold"
              @click="onAccept"
            >
              承認する
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

const DEFAULT_SCHEMA = {
  order_uid: '',
  deliver_type: '',
  arrive_time: ''
}

export default {
  name: 'BookCancelDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
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
    ...mapActions('store/order', ['acceptCancellingBook']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    },
    onAccept () {
      this.loading = true
      this.acceptCancellingBook(this.form)
        .then(this.onClose)
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
