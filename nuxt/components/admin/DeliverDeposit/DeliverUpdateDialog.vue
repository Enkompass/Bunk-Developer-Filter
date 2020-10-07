<template>
  <div>
    <div class="d-flex align-center justify-start mt-3">
      <v-select
        v-model="value"
        :items="weeklyItems"
        outlined
        background-color="white"
        dense
        hide-details
        class="mr-3"
        style="max-width: 220px;"
      />
      <!--<v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="value"
            background-color="white"
            outlined
            readonly
            dense
            hide-details
            class="mr-3"
            v-bind="attrs"
            style="max-width: 150px;"
            v-on="on"
          >
            <template v-slot:append>
              <v-icon color="secondary" @click="menu = !menu">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          ref="picker"
          v-model="value"
          type="month"
          :max="new Date().toISOString().substr(0, 10)"
          no-title
          scrollable
          @input="menu = false"
        />
      </v-menu>-->
      <v-btn
        color="secondary"
        width="80"
        height="40"
        aria-label="update"
        @click="update"
      >
        更新する
      </v-btn>
    </div>
    <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2 class="black--text">
            入金情報を更新しますか？
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
                更新する
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'DeliverUpdateDialog',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    dialog: false,
    menu: false,
    weeklyItems: []
  }),
  created () {
    let startDate = ''
    let endDate = ''
    for (let i = 1; i < 8; i++) {
      startDate = this.$moment().subtract(i, 'weeks').startOf('week').format('YYYY-MM-DD')
      endDate = this.$moment().subtract(i, 'weeks').endOf('week').format('YYYY-MM-DD')
      this.weeklyItems.push({
        text: `${this.$moment(startDate).format('YYYY/MM/DD')}~${this.$moment(endDate).format('MM/DD')}`,
        value: [startDate, endDate]
      })
    }
  },
  methods: {
    ...mapActions('admin/deliver_deposit', ['loadDeliveryDeposits', 'updateDeliveryDeposits']),
    onClose () {
      this.dialog = false
    },
    async onConfirm () {
      this.$emit('input', this.value)
      await this.updateDeliveryDeposits({
        date: this.value
      })
      await this.loadDeliveryDeposits({
        date: this.value
      })
      this.onClose()
    },
    update () {
      this.dialog = true
    }
  }
}
</script>
