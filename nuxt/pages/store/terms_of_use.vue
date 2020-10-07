<template>
  <div class="store-terms-of-use">
    <div class="d-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'file-alt']" class="secondary--text" />
        利用規約
      </h3>
      <v-btn
        color="secondary"
        width="120"
        height="40"
        :disabled="$auth.$state.user.user.is_accepted_terms"
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
  name: 'TermsOfUse',
  data: () => ({
    content: ''
  }),
  async mounted () {
    this.content = await this.getPrivacyPolicy({
      $axios: this.$axios,
      params: {
        type: 'terms'
      }
    })
  },
  methods: {
    ...mapActions('store/policy', ['getPrivacyPolicy', 'updateAccept']),
    async accept () {
      await this.updateAccept({
        $axios: this.$axios,
        params: {
          type: 'terms'
        }
      })
      await this.$auth.fetchUser()
      this.$bus.$emit('refresh_badge', {})
    }
  },
  head: () => ({
    title: '利用規約'
  })
}
</script>
