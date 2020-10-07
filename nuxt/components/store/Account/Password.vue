<template>
  <div>
    <v-form ref="form" @submit.prevent="submit">
      <h6 class="font-weight-bold">
        ログインパスワード
      </h6>
      <v-text-field
        v-model="form.password"
        :rules="[rules.required, rules.min]"
        type="password"
        placeholder="新しいログインパスワードを入力…"
        background-color="white"
        outlined
        dense
        hide-details
        class="mt-2 mb-1"
      />
      <v-text-field
        v-model="form.confirm_pass"
        :rules="[rules.required, rules.min, passwordConfirmationRule]"
        placeholder="確認用ログインパスワードを入力…"
        type="password"
        background-color="white"
        outlined
        dense
        hide-details
      />
      <div class="d-flex justify-end mt-2">
        <v-btn outlined rounded color="secondary" type="submit">
          新しいパスワードを保存
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'
export default {
  name: 'Password',
  mixins: [validationRules],
  data: () => ({
    form: {
      password: '',
      confirm_pass: ''
    }
  }),
  computed: {
    passwordConfirmationRule () {
      return () => (this.form.password === this.form.confirm_pass) || 'Password must match'
    }
  },
  methods: {
    ...mapActions('store/account', ['changePassword']),
    async submit () {
      if (this.$refs.form.validate()) {
        await this.changePassword({
          $axios: this.$axios,
          params: this.form
        })
        this.$refs.form.reset()
      }
    }
  }
}
</script>
