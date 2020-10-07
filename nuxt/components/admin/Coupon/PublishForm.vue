<template>
  <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card color="#D4D4D4" :loading="loading">
        <v-card-title class="justify-center py-5 pt-8">
          <h2 class="black--text">
            店舗クーポンを配布しますか？
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row class="mx-3 mx-md-6" no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="form.author"
                :rules="[rules.required]"
                readonly
                outlined
                dense
                hide-details
                background-color="white"
                placeholder="クーポン名"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.coupon_name"
                :rules="[rules.required]"
                readonly
                outlined
                dense
                hide-details
                class="mt-3"
                background-color="white"
                placeholder="クーポン名"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.terms_of_use"
                :rules="[rules.required]"
                readonly
                rows="3"
                no-resize
                outlined
                dense
                hide-details
                class="mt-3"
                background-color="white"
                placeholder="利用条件"
              />
            </v-col>
            <v-col cols="12" :md="form.distribution_target === 'individual' ? 3 : 4" sm="12">
              <div class="d-flex align-end">
                <v-text-field
                  v-model="form.usable_count"
                  readonly
                  :rules="[rules.required]"
                  outlined
                  dense
                  hide-details
                  class="mt-3 mr-2"
                  background-color="white"
                  placeholder="利用可能枚数"
                />
                <h6>枚</h6>
              </div>
            </v-col>
            <v-col cols="12" :md="form.distribution_target === 'individual' ? 3 : 4" sm="12">
              <v-select
                v-model="form.distribution_target"
                :items="targetItems"
                :rules="[rules.required]"
                outlined
                dense
                hide-details
                class="mt-3 ml-md-2 ml-0"
                background-color="white"
                placeholder="配布対象"
              />
            </v-col>
            <v-col v-if="form.distribution_target === 'individual'" cols="12" :md="form.distribution_target === 'individual' ? 3 : 4" sm="12">
              <v-autocomplete
                v-model="form.target_uid"
                :items="getCustomers"
                :rules="[rules.required]"
                outlined
                dense
                hide-details
                class="mt-3 ml-md-2 ml-0"
                background-color="white"
              />
            </v-col>
            <v-col cols="12" :md="form.distribution_target === 'individual' ? 3 : 4" sm="12">
              <v-text-field
                v-model="form.value"
                readonly
                :rules="[rules.required]"
                outlined
                dense
                hide-details
                class="mt-3 ml-md-2 ml-0"
                background-color="white"
                placeholder="利用可能枚数"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.distribution_period"
                :rules="[rules.required]"
                validate-on-blur
                placeholder="配布期間"
                background-color="white"
                readonly
                outlined
                dense
                hide-details
                class="mt-3"
              />
            </v-col>
            <v-col cols="12">
              <v-radio-group
                v-model="form.can_use"
                :rules="[rules.required]"
                readonly
                class="mt-3"
                validate-on-blur
                hide-details
                row
              >
                <v-radio active-class="active-radio-label" color="secondary" label="クーポン併用可" :value="'1'" />
                <v-radio active-class="active-radio-label" color="secondary" label="併用不可" :value="'0'" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                type="submit"
              >
                配布するクーポン内容を確認
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="grey"
                block
                text
                aria-label="delete"
                class="font-weight-bold"
                @click="onClose"
              >
                キャンセル
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  author: '',
  coupon_name: '',
  terms_of_use: '',
  usable_count: '',
  distribution_target: '',
  target_uid: '',
  distribution_period: ['', ''],
  can_use: null,
  deny_reason: '',
  value: 0
}

export default {
  name: 'PublishForm',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    menu: false,
    dialog: false,
    loading: false,
    targetItems: [
      { text: '全ユーザー', value: 'all_customer' },
      { text: '個別', value: 'individual' },
      { text: '店舗から6.5km圏内のユーザー', value: 'user_near_3km' }
    ],
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  computed: {
    ...mapGetters('admin/coupon', ['getCustomers'])
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
    ...mapActions('admin/coupon', ['publishStoreCoupon']),
    onClose () {
      this.dialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.publishStoreCoupon({
          id: this.value.id,
          target: this.form.distribution_target,
          target_uid: this.form.target_uid
        })
          .then(this.onClose)
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
