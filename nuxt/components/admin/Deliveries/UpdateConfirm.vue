<template>
  <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
    <v-card color="#D4D4D4">
      <v-card-title class="justify-center py-5 py-md-10 pt-8">
        <h2 class="black--text">
          {{ statusTitles[form.reg_status] }}
        </h2>
      </v-card-title>
      <v-card-subtitle v-if="statusSubtitles[form.reg_status]">
        <h3 class="h45 black--text text-center mt-2 mt-md-3">
          ※解約してもデータは残ります。
        </h3>
      </v-card-subtitle>
      <v-divider />
      <v-card-actions class="py-0">
        <v-row no-gutters>
          <v-col cols="6" class="br-1-grey">
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
              {{ statusConfirmLabels[form.reg_status] }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

const DEFAULT_SCHEMA = {
  reg_status: ''
}

export default {
  name: 'UpdateConfirm',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA)),
    statusTitles: {
      approved: 'このデリバーを承認済みにしますか？',
      progress: '登録を仮登録中にしますか？',
      cancel: 'このデリバーを解約しますか？',
      recover: 'このデリバーを復帰させますか？'
    },
    statusSubtitles: {
      approved: '',
      progress: '',
      cancel: '※解約してもデータは残ります。',
      recover: ''
    },
    statusConfirmLabels: {
      approved: '仮登録から承認済みにする',
      progress: '仮登録中にする',
      cancel: '解約する',
      recover: '復帰から承認済みにする'
    }
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
    ...mapActions('admin/deliveries', ['updateDeliveryStatus']),
    onClose () {
      this.dialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
    },
    onConfirm () {
      this.loading = true
      this.updateDeliveryStatus({
        ...this.form
      }).then(() => {
        this.onClose()
        this.$bus.$emit('refresh_admin_badge', {})
      })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
