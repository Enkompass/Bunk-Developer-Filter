<template>
  <div class="store-privacy-policy">
    <div class="d-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'unlock-alt']" class="secondary--text" />
        個人情報保護方針
      </h3>
      <v-btn
        color="secondary"
        width="120"
        height="40"
        class="mt-0"
        :disabled="$auth.$state.user.user.is_accepted_personal"
        @click="accept"
      >
        同意する
      </v-btn>
    </div>
    <h5 class="mt-4">
      <pre>
        {{ content }}
      </pre>
    </h5>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PrivacyPolicy',
  data: () => ({
    content: ''
  }),
  async mounted () {
    this.content = await this.getPrivacyPolicy({
      $axios: this.$axios,
      params: {
        type: 'personal'
      }
    })
  },
  methods: {
    ...mapActions('store/policy', ['getPrivacyPolicy', 'updateAccept']),
    async accept () {
      await this.updateAccept({
        $axios: this.$axios,
        params: {
          type: 'personal'
        }
      })
      await this.$auth.fetchUser()
      this.$bus.$emit('refresh_badge', {})
    }
  },
  head: () => ({
    title: '個人情報保護方針'
  })
}
</script>
