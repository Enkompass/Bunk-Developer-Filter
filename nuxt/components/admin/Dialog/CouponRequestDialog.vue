<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10">
        <h2 class="h23 font-weight-bold text-center">
          店舗クーポンの承認の依頼です
        </h2>
      </v-card-title>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="6" class="br-1-grey-fixed">
            <v-btn
              block
              color="secondary"
              text
              height="56"
              class="font-weight-bold"
              @click="onConfirm"
            >
              クーポンページへ移行
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              color="secondary"
              text
              height="56"
              class="font-weight-bold"
              @click="onClose"
            >
              キャンセル
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CouponRequestDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false
  }),
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.dialog = true
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
      this.$router.push('/admin/coupon_manage')
      this.onClose()
    }
  }
}
</script>
