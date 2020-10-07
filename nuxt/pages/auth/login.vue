<template>
  <v-card elevation="0" max-width="400" width="400">
    <v-card-title class="font-weight-bold mb-2">
      <h1>{{ $t('auth.login') }}</h1>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" @submit.prevent="submit">
        <v-text-field
          v-model="form.email"
          :rules="[rules.required]"
          :placeholder="$t('auth.email_placeholder')"
          type="email"
          prepend-inner-icon="mdi-account"
          dense
          single-line
          outlined
          validate-on-blur
        />

        <v-text-field
          v-model="form.password"
          :rules="[rules.required]"
          :placeholder="$t('auth.password_placeholder')"
          prepend-inner-icon="mdi-key"
          type="password"
          dense
          single-line
          outlined
          validate-on-blur
        />

        <v-row no-gutters class="mt-12 mt-md-3">
          <v-btn
            :loading="loading"
            type="submit"
            color="secondary"
            class="white-text"
            depressed
            block
          >
            {{ $t('auth.login') }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import validationRules from '~/mixins/validationRules'

export default {
  layout: 'auth',
  name: 'Login',
  middleware: ['guest'],
  mixins: [validationRules],
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    dirty: false,
    rememberMe: true,
    loading: false
  }),
  created () {
    if (this.$auth.$state.loggedIn === true) {
      this.$router.push('/admin/top')
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.logInWithEmail(this.form, this.rememberMe)
          .finally(() => {
            this.loading = false
          })
      }
    },
    logInWithEmail (data, rememberMe) {
      if (!rememberMe) {
        this.$auth.options.localStorage = false
      } else {
        this.$auth.options.localStorage = { prefix: 'auth.' }
      }
      return this.$auth.loginWith('local', { data })
    }
  },
  head: () => ({
    title: 'ログイン'
  })
}
</script>
