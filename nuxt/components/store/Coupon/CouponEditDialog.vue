<template>
  <v-dialog v-model="dialog" :persistent="$vuetify.breakpoint.mdAndUp" max-width="800" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-form ref="form">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2>
            {{ title }}
          </h2>
        </v-card-title>
        <v-card-subtitle v-if="form.status === 'request'" class="error--text text-center">
          修正依頼：{{ form.reason }}
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="form.coupon_name"
            :rules="[rules.required]"
            validate-on-blur
            placeholder="クーポン名"
            background-color="white"
            outlined
            dense
            hide-details
            style="border: 0;"
          />
          <v-textarea
            v-model="form.use_condition"
            :rows="$vuetify.breakpoint.mdAndUp ? 3 : 2"
            :rules="[rules.required]"
            validate-on-blur
            placeholder="利用条件"
            background-color="white"
            outlined
            dense
            hide-details
            no-resize
            class="mt-3"
            style="border: 0;"
          />
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12">
              <div class="d-flex align-end">
                <v-text-field
                  v-model="form.usable_count"
                  :rules="[rules.required]"
                  validate-on-blur
                  placeholder="利用可能枚数"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                  class="mt-3"
                  style="border: 0;"
                />
                <h6 class="mx-2">
                  枚
                </h6>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="form.value"
                :rules="[rules.required]"
                validate-on-blur
                placeholder="割引金額"
                background-color="white"
                outlined
                dense
                hide-details
                class="mt-3"
                style="border: 0;"
              />
            </v-col>
          </v-row>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.usable_date_range"
                :rules="[rules.required]"
                validate-on-blur
                placeholder="配布期間"
                background-color="white"
                readonly
                outlined
                dense
                hide-details
                class="mt-3"
                v-bind="attrs"
                style="border: 0;"
                v-on="on"
              />
            </template>
            <v-date-picker
              ref="picker"
              v-model="form.usable_date_range"
              min="1950-01-01"
              range
              @change="$refs.menu.save(form.usable_date_range)"
            />
          </v-menu>
          <v-radio-group v-model="form.can_use" validate-on-blur hide-details row>
            <v-radio active-class="active-radio-label" color="secondary" label="クーポン併用可" :value="true" />
            <v-radio active-class="active-radio-label" color="secondary" label="併用不可" :value="false" />
          </v-radio-group>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col md="4" sm="6" class="br-1-grey-fixed">
              <v-btn
                :disabled="form.status === 'pending'"
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                class="font-weight-bold"
                @click="save('pending')"
              >
                承認申請
              </v-btn>
            </v-col>
            <v-col md="4" sm="6" class="br-1-grey">
              <v-btn
                :disabled="form.status === 'pending'"
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="save('draft')"
              >
                下書き保存
              </v-btn>
            </v-col>
            <v-col md="4" class="d-none d-sm-block">
              <v-btn :height="$vuetify.breakpoint.mdAndUp ? 56 : 44" block color="accent" text @click="onClose">
                キャンセル
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  status: '',
  coupon_name: '',
  use_condition: '',
  usable_count: '',
  usable_date_range: [],
  can_use: null,
  value: 0
}

export default {
  name: 'CouponEditDialog',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    menu: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  computed: {
    title () {
      return this.form.status === 'pending' ? '申請中のクーポン' : this.form.status === 'request' ? '修正依頼を確認' : this.form.id === -1 ? 'クーポンを新規作成' : 'クーポンを編集'
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
    ...mapActions('store/coupon', ['saveStoreCoupon']),
    async save (status) {
      this.errors = {}
      if (status !== 'draft') {
        if (!this.$refs.form.validate()) {
          return
        }
      }
      this.form.status = status
      await this.saveStoreCoupon(this.form)
      this.$bus.$emit('refresh_badge', {})
      this.dialog = false
    },
    onClose () {
      this.dialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$refs.form.resetValidation()
      this.$emit('input', null)
    }
  }
}
</script>
