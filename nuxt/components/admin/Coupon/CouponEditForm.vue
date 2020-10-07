<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-card color="#D4D4D4" :loading="loading">
          <v-card-title class="justify-center py-5 pt-8">
            <h2 class="black--text">
              {{ title }}
            </h2>
          </v-card-title>
          <v-card-text>
            <v-row class="mx-3 mx-md-6" no-gutters>
              <v-col cols="12">
                <v-text-field
                  v-model="form.coupon_name"
                  :rules="[rules.required]"
                  outlined
                  dense
                  hide-details
                  background-color="white"
                  placeholder="クーポン名"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.terms_of_use"
                  :rules="[rules.required]"
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
                <div class="d-flex align-end">
                  <v-text-field
                    v-model="form.value"
                    :rules="[rules.required]"
                    outlined
                    dense
                    hide-details
                    class="mt-3 mx-md-2 mx-0"
                    background-color="white"
                    placeholder="割引金額"
                  />
                  <h6>¥</h6>
                </div>
              </v-col>
              <v-col cols="12" :md="form.distribution_target === 'individual' ? 3 : 4" sm="12">
                <v-select
                  v-model="form.distribution_target"
                  :items="targetItems"
                  :rules="approving ? [] : [rules.required]"
                  :disabled="approving"
                  :readonly="approving"
                  outlined
                  dense
                  hide-details
                  class="mt-3 ml-md-2 ml-0"
                  background-color="white"
                  placeholder="配布対象"
                />
              </v-col>
              <v-col v-if="!approving && form.distribution_target === 'individual'" cols="12" :md="form.distribution_target === 'individual' ? 3 : 4" sm="12">
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
              <v-col cols="12">
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
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="form.distribution_period"
                    min="1950-01-01"
                    range
                    @change="$refs.menu.save(form.distribution_period)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  v-model="form.can_use"
                  :rules="[rules.required]"
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
          <v-card-actions class="py-0">
            <v-row v-if="approving" no-gutters>
              <v-col cols="4" class="br-1-grey">
                <v-btn
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  color="secondary"
                  class="font-weight-bold"
                  block
                  text
                  @click="onSubmit('approved')"
                >
                  承認
                </v-btn>
              </v-col>
              <v-col cols="4" class="br-1-grey">
                <v-btn
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  color="error"
                  block
                  text
                  @click="showDenyDialog"
                >
                  修正を依頼
                </v-btn>
              </v-col>
              <v-col cols="4">
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
            <v-row v-else no-gutters>
              <v-col cols="4" class="br-1-grey">
                <v-btn
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  color="secondary"
                  class="font-weight-bold"
                  block
                  text
                  @click="showConfirmDialog"
                >
                  配布 内容確認
                </v-btn>
              </v-col>
              <v-col cols="4" class="br-1-grey">
                <v-btn
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  color="secondary"
                  block
                  text
                  @click="onSubmit('draft')"
                >
                  下書き保存
                </v-btn>
              </v-col>
              <v-col cols="4">
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
    <v-dialog v-model="denyDialog" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2 class="black--text font-weight-bold">
            店舗クーポンの修正を依頼
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row class="mx-3 mx-md-6" no-gutters>
            <v-textarea
              v-model="form.deny_reason"
              rows="6"
              no-resize
              outlined
              dense
              hide-details
              background-color="white"
              placeholder="却下する理由"
            />
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                @click="onDeny"
              >
                修正を依頼
              </v-btn>
            </v-col>
            <v-col cols="6">
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
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2 class="black--text font-weight-bold">
            本部クーポンを配布
          </h2>
        </v-card-title>
        <v-card-text>
          <div class="mx-3 mx-md-12">
            <h4 class="h45 black--text">
              クーポン名：{{ form.coupon_name }}
            </h4>
            <h4 class="h45 black--text">
              利用可能枚数：{{ form.usable_count }}枚
            </h4>
            <h4 class="h45 black--text">
              配布対象：{{ targetItem[form.distribution_target] }}枚
            </h4>
            <h4 class="h45 black--text">
              期限：{{ form.distribution_period ? form.distribution_period[0] + ' ~ ' + form.distribution_period[1] : '' }}
            </h4>
            <h4 class="h45 black--text">
              併用：{{ form.can_use === '1' ? '可' : '不可' }}
            </h4>
            <h4 class="h45 black--text mt-3 mt-md-5">
              {{ form.terms_of_use }}
            </h4>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey">
              <v-btn
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
                block
                text
                @click="onSubmit('approved')"
              >
                確定 配布する
              </v-btn>
            </v-col>
            <v-col cols="6">
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
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  status: '',
  coupon_name: '',
  terms_of_use: '',
  usable_count: '',
  distribution_target: '',
  distribution_period: ['', ''],
  target_uid: '',
  can_use: null,
  deny_reason: ''
}

export default {
  name: 'CouponEditForm',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  async fetch () {
    await this.loadCustomerInfos()
  },
  data: () => ({
    menu: false,
    dialog: false,
    denyDialog: false,
    confirmDialog: false,
    loading: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA)),
    targetItems: [
      { text: '全ユーザー', value: 'all_customer' },
      { text: '個別', value: 'individual' },
      { text: '店舗から6.5km圏内のユーザー', value: 'user_near_3km' }
    ],
    targetItem: {
      all_customer: '全ユーザー',
      individual: '個別',
      user_near_3km: '店舗から6.5km圏内のユーザー'
    }
  }),
  computed: {
    ...mapGetters('admin/coupon', ['getCustomers']),
    title () {
      return this.form.status === 'pending' && this.form.author !== 'admin'
        ? '店舗クーポン承認の依頼です'
        : this.form.id ? '本部クーポンを編集' : '本部クーポンを新規作成'
    },
    approving () {
      return this.form.status === 'pending' && this.form.author !== 'admin'
    }
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          if (val.status === 'draft' && val.author !== 'admin') {
            return
          }
          this.form = JSON.parse(JSON.stringify(val))
          this.dialog = true
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/coupon', ['saveAdminCoupon', 'loadCustomerInfos']),
    onClose () {
      this.dialog = false
      this.denyDialog = false
      this.confirmDialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
      this.$refs.form.resetValidation()
    },
    onSubmit (status) {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.form.status = status
        this.form.can_use = this.form.can_use === '1'
        this.saveAdminCoupon(this.form)
          .then(this.onClose)
          .finally(() => {
            this.loading = false
          })
      }
    },
    onDeny () {
      this.loading = true
      this.form.status = 'request'
      this.saveAdminCoupon(this.form)
        .then(this.onClose)
        .finally(() => {
          this.loading = false
        })
    },
    showDenyDialog () {
      this.denyDialog = true
      this.dialog = false
    },
    showConfirmDialog () {
      this.confirmDialog = true
      this.dialog = false
    }
  }
}
</script>
