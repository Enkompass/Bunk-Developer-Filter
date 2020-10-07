<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10">
        <h2 class="h23 font-weight-bold text-center">
          チャットが入りました！
        </h2>
      </v-card-title>
      <v-card-subtitle>
        <h5 class="h45 black--text text-center">
          すぐに確認をお願いします。
        </h5>
      </v-card-subtitle>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              block
              color="secondary"
              text
              height="56"
              class="font-weight-bold"
              @click="onClose"
            >
              確認
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChatArriveDialog',
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
        if (val && this.$route.path !== '/store/chat_room') {
          this.dialog = true
        } else {
          this.$emit('input', null)
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
