<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10">
        <h1 class="h23 black--text text-center font-weight-bold">
          重要事項（規約・特商法・保護法）に<br>
          改定がありました。
        </h1>
      </v-card-title>
      <v-card-subtitle class="black--text text-center">
        ホーム画面 該当項目に「①」の表示より
        確認と同意をお願いいたします。
      </v-card-subtitle>
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
              @click="onClose"
            >
              閉じる
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UpdatePolicy',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false
  }),
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.dialog = true
        }
      }
    }
  },
  methods: {
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    }
  }
}
</script>
