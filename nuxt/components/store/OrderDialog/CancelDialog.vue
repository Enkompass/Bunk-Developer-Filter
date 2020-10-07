<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4" :loading="loading">
        <v-card-title class="justify-center py-4 py-md-10 px-4 px-md-12">
          <h2 class="h23 black--text font-weight-bold text-center">
            お客様より【今すぐ注文】の
            <br>
            キャンセル申請がありました
          </h2>
        </v-card-title>
        <v-card-text class="pb-4 pb-md-8 px-4 px-md-12">
          <h5 class="h45 black--text text-center">
            お客様に通知しているお届け目安時間は「{{ form.arrive_time | timeFormat }}」です。
            <br>
            15分以上の遅れが出ている可能性があります。
            <br>
            <br>
            ※今すぐ注文はお客様の都合ではキャンセルができませんので、
            <br>
            遅れていない場合はお客様に連絡をお願いします。
          </h5>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="3" sm="12" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="Contact Delivery"
                class="font-weight-bold"
                @click="onContactDelivery"
              >
                デリバーに連絡
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" sm="12" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="Contact Customer"
                class="font-weight-bold"
                @click="onContactCustomer"
              >
                お客様に連絡
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" sm="12" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="error"
                block
                text
                aria-label="Reject Cancelling"
                @click="onReject"
              >
                承認しない
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" sm="12">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="error"
                block
                text
                aria-label="Accept Cancelling"
                @click="onAccept"
              >
                承認する
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="customerContact" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="h23 secondary--text font-weight-bold">
            <font-awesome-icon :icon="['fas', 'phone-alt']" />
            {{ form.customer.phone | formatPhoneNumber }}
          </h2>
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn
                block
                color="grey"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="customerContact = false"
              >
                閉じる
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deliveryContact" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="h23 secondary--text font-weight-bold">
            <font-awesome-icon :icon="['fas', 'phone-alt']" />
            {{ form.delivery.phone | formatPhoneNumber }}
          </h2>
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn
                block
                color="grey"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="deliveryContact = false"
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
  deliver_type: '',
  arrive_time: '',
  customer: {
    uid: '',
    phone: ''
  },
  delivery: {
    uid: '',
    phone: ''
  }
}

export default {
  name: 'CancelDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    customerContact: false,
    deliveryContact: false,
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
    ...mapActions('store/order', ['acceptCancellingOrder', 'rejectCancellingOrder']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    },
    onAccept () {
      this.loading = true
      this.acceptCancellingOrder(this.form)
        .then(this.onClose)
        .finally(() => {
          this.loading = true
        })
    },
    onReject () {
      this.rejectCancellingOrder(this.form)
        .then(this.onClose)
    },
    onContactCustomer () {
      this.customerContact = true
    },
    onContactDelivery () {
      if (!this.form.delivery.uid) {
        return this.$notify.warning({
          message: 'デリバーがまだ選択されてません。'
        })
      }
      this.deliveryContact = true
    }
  }
}
</script>
