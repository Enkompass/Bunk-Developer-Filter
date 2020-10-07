<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10">
        <h2 :class="color" class="h23 font-weight-bold">
          {{ title }}
        </h2>
        <h3 v-if="subtitle" class="h45 text-center mt-2">
          <span v-html="subtitle" />
        </h3>
      </v-card-title>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              block
              color="secondary"
              text
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              class="font-weight-bold"
              @click="dialog = false"
            >
              OK
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AlertDialog',
  data: () => ({
    dialog: false,
    title: '',
    subtitle: '',
    color: 'black--text'
  }),
  created () {
    this.$bus.$on('alert.warning', (res) => {
      const title = res.data.alert || res.alert || res.title
      const subtitle = res.data.subalert || res.subalert || res.subtitle
      if (title) {
        this.dialog = true
        this.title = title
        this.subtitle = subtitle
      }
    })
    this.$bus.$on('alert.required', () => {
      this.color = 'error--text'
      this.dialog = true
      this.title = '必須項目が入力されていません'
      this.subtitle = '戻って入力をお願いします。'
    })
  },
  beforeDestroy () {
    this.$bus.$off('alert.warning')
    this.$bus.$off('alert.required')
  }
}
</script>
