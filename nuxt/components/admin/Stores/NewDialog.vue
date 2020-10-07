<template>
  <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card color="#D4D4D4" :loading="loading">
        <v-card-title class="justify-center py-5 pt-8">
          <h2>
            {{ !form.id ? '新規店舗コード・パスワード作成' : '店舗情報編集' }}
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row align="center" class="px-0 px-md-12">
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>飲食店コード</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.store_code"
                placeholder="自動発行"
                background-color="white"
                readonly
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>パスワード</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.password"
                placeholder="自動発行"
                type="password"
                background-color="white"
                readonly
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>契約日</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="form.contract_date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.contract_date"
                    :rules="[rules.required]"
                    placeholder="契約日"
                    background-color="white"
                    outlined
                    dense
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="form.contract_date"
                  locale="ja"
                  first-day-of-week="1"
                  :day-format="getDay"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn text color="primary" @click="menu = false">
                    {{ $t('common.close') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(form.contract_date)">
                    {{ $t('common.save') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>店舗名</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.name"
                :rules="[rules.required]"
                placeholder="店舗名"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>TEL(固定)</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.telephone"
                :rules="[rules.required]"
                placeholder="0000-00-0000"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>TEL(携帯)</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.mobile_phone"
                :rules="[rules.required]"
                placeholder="0000-00-0000"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>メールアドレス</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.email"
                :rules="[rules.required, rules.email]"
                placeholder="入力"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3" sm="4" class="text-center pa-2">
              <h6>店舗責任者名</h6>
            </v-col>
            <v-col cols="12" md="9" sm="8" class="pa-2">
              <v-text-field
                v-model="form.boss_name"
                :rules="[rules.required]"
                placeholder="入力"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12" class="br-1-grey">
              <v-btn
                color="secondary"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                type="submit"
                block
                text
                aria-label="create register and send email"
                class="font-weight-bold"
              >
                作成して登録・メールを送信
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-btn
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                aria-label="Cancel"
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
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  id: '',
  password: '',
  contract_date: '',
  name: '',
  telephone: '',
  mobile_phone: '',
  email: '',
  boss_name: ''
}

export default {
  name: 'NewDialog',
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
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.form = JSON.parse(JSON.stringify(val))
          this.dialog = true
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/stores', ['saveStoreItem']),
    onClose () {
      this.dialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        if (this.form.name === 'admin') {
          return this.$notify.warning({
            message: 'ストア名は「管理者」にすることはできません'
          })
        }
        this.loading = true
        this.saveStoreItem(this.form)
          .then(this.onClose)
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
