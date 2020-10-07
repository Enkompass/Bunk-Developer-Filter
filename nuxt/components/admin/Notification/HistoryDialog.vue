<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="800"
    overlay-opacity="0.6"
    content-class="none-box-shadow"
  >
    <v-card color="transparent" flat tile :loading="getHistoryLoading" class="rounded-0">
      <v-card-title class="justify-space-around py-4">
        <h5 class="white--text font-weight-bold" style="cursor:pointer;" @click="onClose">
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
          戻る
        </h5>
        <h2 class="font-weight-bold white--text h23">
          通知履歴一覧
        </h2>
        <h5 />
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="getHistoryRows"
          mobile-breakpoint="0"
          disable-sort
          hide-default-footer
          class="elevation-1 white rounded-lg"
        >
          <template v-slot:item.datetime="{ item }">
            <h6>{{ item.datetime | dateFormat }}</h6>
          </template>
          <template v-slot:item.target="{ item }">
            <h6>{{ targets[item.target] }}</h6>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HistoryDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  async fetch () {
    await this.getNotificationHistory()
  },
  data: () => ({
    dialog: false,
    headers: [
      { text: '配信日時', value: 'datetime', align: 'center' },
      { text: '件名', value: 'name' },
      { text: '文章', value: 'content' },
      { text: '配信対象', value: 'target' }
    ],
    targets: {
      all: '全員：ユーザー・デリバー・飲食店',
      customers: '全ユーザー',
      delivery: '全デリバー',
      stores: '全飲食店',
      individual: '個別'
    }
  }),
  computed: {
    ...mapGetters('admin/notification', ['getHistoryRows', 'getHistoryLoading'])
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.$fetch()
          this.dialog = true
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/notification', ['getNotificationHistory']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    }
  }
}
</script>
