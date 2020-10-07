<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10">
        <h2 class="h23 font-weight-bold text-center">
          注文が承認されてません。
          <br>
          受注後デリバーを呼ばずに５分放置してます。
        </h2>
      </v-card-title>
      <v-card-subtitle>
        <h5 class="h45 black--text text-center">
          注文番号: {{ form.order_uid }}
        </h5>
      </v-card-subtitle>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              block
              color="secondary"
              text
              height="56"
              class="font-weight-bold"
              @click="onClose"
            >
              OK
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

const DEFAULT_SCEHMA = {
  store_name: '',
  order_uid: '',
  telephone: '',
  mobile_phone: ''
}

export default {
  name: 'DelayOrderDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCEHMA))
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
