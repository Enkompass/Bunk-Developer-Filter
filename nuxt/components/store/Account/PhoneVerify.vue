<template>
  <div class="mt-5">
    <v-form ref="form" @submit="submit">
      <div class="d-flex">
        <h6>店舗名</h6>
        <h6 class="error--text">
          ※必須
        </h6>
      </div>
      <v-text-field
        v-model="value.store_name"
        :rules="[rules.required]"
        placeholder="店舗名を入力…"
        background-color="white"
        outlined
        dense
        hide-details
        class="mt-1 mb-3"
      />
      <div class="d-flex">
        <h6>住所</h6>
        <h6 class="error--text">
          ※必須
        </h6>
      </div>
      <v-text-field
        v-model="value.address"
        :rules="[rules.required]"
        placeholder="住所を入力…"
        background-color="white"
        outlined
        dense
        hide-details
        class="mt-1 mb-3"
      />
      <div class="d-flex">
        <h6>メールアドレス</h6>
        <h6 class="error--text">
          ※必須
        </h6>
      </div>
      <v-text-field
        v-model="value.email"
        :rules="[rules.required, rules.email]"
        placeholder="メールアドレスを入力…"
        background-color="white"
        outlined
        dense
        hide-details
        class="mt-1 mb-3"
      />
      <div class="d-flex">
        <h6>店舗の電話番号(固定電話)</h6>
        <h6 class="error--text">
          ※必須
        </h6>
      </div>
      <v-text-field
        v-model="value.telephone"
        :rules="[rules.required, rules.number]"
        placeholder="住所を入力…"
        background-color="white"
        outlined
        dense
        hide-details
        class="mt-1 mb-3"
      />
      <div class="d-flex">
        <h6>携帯電話番号</h6>
        <h6 class="error--text">
          ※必須
        </h6>
      </div>
      <v-text-field
        v-model="value.mobile_phone"
        :rules="[rules.required, rules.number]"
        placeholder="携帯電話番号を入力…"
        background-color="white"
        outlined
        dense
        hide-details
        class="mt-1 mb-3"
      />
      <div class="d-flex justify-end mt-4">
        <v-btn outlined rounded color="secondary" @click="submit">
          携帯電話を認証
        </v-btn>
      </div>
      <div class="d-flex justify-end mt-1">
        <h6>※SMSで認証コードが届きます。</h6>
      </div>
    </v-form>
    <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
      <v-form ref="smsForm">
        <v-card color="#D4D4D4">
          <v-card-title class="justify-center py-5 pt-8">
            <h2>
              確認コードを入力
            </h2>
          </v-card-title>
          <v-card-text>
            <v-row align="center" justify="center" class="px-0 px-md-12">
              <code-input :loading="false" class="input" @change="onChange" @complete="onComplete" />
              <h6 class="secondary--text mt-5" @click="gotoResend">
                <font-awesome-icon :icon="['fas', 'arrow-circle-right']" class="secondary--text" />
                コードが届かない場合はこちら
              </h6>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="py-0">
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn
                  color="secondary"
                  height="56"
                  block
                  text
                  class="font-weight-bold"
                  @click="sendVerifyCode"
                >
                  OK
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="resendDialog" persistent max-width="800" overlay-opacity="0.6">
      <v-form>
        <v-card color="#D4D4D4">
          <v-card-title class="justify-center py-5 pt-8">
            <h2 class="text-center">
              {{ value.mobile_phone }}に
              <br>
              確認コードを再送信します
            </h2>
          </v-card-title>
          <v-divider />
          <v-card-actions class="py-0">
            <v-row no-gutters>
              <v-col cols="6" class="br-1-grey-fixed">
                <v-btn
                  color="secondary"
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  block
                  text
                  @click="resendDialog = false"
                >
                  キャンセル
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="secondary"
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  block
                  text
                  class="font-weight-bold"
                  @click="resendVerifyCode"
                >
                  再送信
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'

export default {
  name: 'PhoneVerify',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    form: {},
    dialog: false,
    resendDialog: false,
    verify_code: ''
  }),
  created () {
    // this.form.store_name = this.$auth.$state.user.user.name
    // this.form.address = this.$auth.$state.user.user.address
    // this.form.email = this.$auth.$state.user.user.email
    // this.form.telephone = this.$auth.$state.user.user.telephone
    // this.form.mobile_phone = this.$auth.$state.user.user.mobile_phone
  },
  methods: {
    ...mapActions('store/account', ['changeAccountInfos', 'confirmVerifyCode', 'resendCode', 'sendSMSCode']),
    submit () {
      if (!this.$refs.form.validate()) {
        return this.$bus.$emit('alert.required')
      }
      /* if (this.value.mobile_phone === this.$auth.$state.user.user.mobile_phone) {
        await this.changeAccountInfos({
          $axios: this.$axios,
          params: this.form
        })
        await this.$auth.fetchUser()
      } else { */
      this.sendSMSCode({
        mobile_phone: this.value.mobile_phone
      }).then((res) => {
        if (res.status === true) {
          this.verify_code = ''
          this.dialog = true
        } else if (res.status !== 3) {
          this.$notify.error({
            title: 'Error has been occurred',
            message: 'Twilio service has been stopped. Please contact Administrator to change the account Information'
          })
        }
      })
      // }
    },
    async sendVerifyCode () {
      const status = await this.confirmVerifyCode({
        $axios: this.$axios,
        params: { code: this.verify_code }
      })
      if (status) {
        this.dialog = false
        /* await this.changeAccountInfos({
          $axios: this.$axios,
          params: this.value
        })
        await this.$auth.fetchUser() */
      }
    },
    async resendVerifyCode () {
      this.resendDialog = false
      await this.resendCode({
        $axios: this.$axios,
        mobile_phone: this.value.mobile_phone
      })
      this.dialog = true
    },
    gotoResend () {
      this.resendDialog = true
    },
    onChange (v) {},
    onComplete (v) {
      this.verify_code = v
    }
  }
}
</script>
