<template>
  <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 pt-8">
        <h2 class="black--text">
          解約処理をしますか？
        </h2>
      </v-card-title>
      <v-card-subtitle>
        <h3 class="h45 black--text text-center mt-2 mt-md-3">
          ※解約してもデータは残ります。
        </h3>
      </v-card-subtitle>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="6" class="br-1-grey-fixed">
            <v-btn
              color="secondary"
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              block
              text
              aria-label="cancel"
              @click="onClose"
            >
              キャンセル
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
              block
              text
              aria-label="delete"
              class="font-weight-bold"
              @click="onConfirm"
            >
              解約
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'DeleteDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false
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
    ...mapActions('admin/stores', ['deleteStore']),
    onConfirm () {
      this.loading = true
      this.deleteStore({ store_uid: this.value.store_uid })
        .then(this.onClose)
        .finally(() => {
          this.loading = false
        })
    },
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    }
  }
}
</script>
