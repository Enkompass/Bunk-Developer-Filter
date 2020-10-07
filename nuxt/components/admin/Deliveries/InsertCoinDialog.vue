<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2 class="h23 black--text font-weight-bold text-center">
            バックパック預け金を入力してください。
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row class="px-4 px-md-12">
            <v-col cols="12">
              <v-text-field
                v-model="form.coin_value"
                :rules="[rules.required]"
                placeholder="店舗名を入力…"
                background-color="white"
                outlined
                dense
                hide-details
                class="mt-1 mb-3"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey-fixed">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="error"
                block
                text
                aria-label="cancel"
                @click="onClose"
              >
                キャンセル
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                aria-label="delete"
                class="font-weight-bold"
                type="submit"
              >
                登録
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  uid: '',
  coin_value: 0
}

export default {
  name: 'InsertCoinDialog',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
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
    ...mapActions('admin/deliveries', ['updateDeliveryCoinvalue']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        this.updateDeliveryCoinvalue(this.form)
          .then(this.onClose)
      }
    }
  }
}
</script>
