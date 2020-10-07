<template>
  <div class="admin-notification">
    <div class="d-md-flex align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'bell']" class="secondary--text" />
        通知設定
      </h3>
      <div class="d-flex justify-space-between mt-2 mt-md-0 ml-0 ml-md-3">
        <v-btn color="secondary" height="35" class="ml-0 mr-3" :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'" @click="editedItem = {}">
          <font-awesome-icon :icon="['fas', 'plus']" />
          新規作成
        </v-btn>
        <v-btn
          color="secondary"
          height="35"
          outlined
          class="ml-0"
          :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
          @click="historyItem = {}"
        >
          <font-awesome-icon :icon="['fas', 'history']" />
          通知履歴一覧
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="getNotificationRows"
      :loading="getNotificationLoading"
      mobile-breakpoint="0"
      disable-sort
      disable-pagination
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.edit="{ item }">
        <v-btn text color="secondary" @click="editItem(item)">
          編集
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-menu transition="slide-y-transition" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="error" v-bind="attrs" v-on="on">
              削除
            </v-btn>
          </template>
          <v-card class="pa-0 rounded">
            <v-card-title class="pa-0">
              <v-btn text color="error" block @click="deleteItem(item)">
                削除する
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-btn text color="grey" block>
                キャンセル
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:item.status="{ item }">
        <h6>{{ statusTypes[item.status] }}</h6>
      </template>
      <template v-slot:item.target="{ item }">
        <h6>{{ targetTypes[item.target] }}</h6>
      </template>
    </v-data-table>
    <edit-form v-model="editedItem" />
    <history-dialog v-model="historyItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import HistoryDialog from '~/components/admin/Notification/HistoryDialog'
import EditForm from '~/components/admin/Notification/EditForm'

export default {
  name: 'Notification',
  components: { EditForm, HistoryDialog },
  layout: 'admin',
  async fetch () {
    await this.getAllNotifications()
  },
  data: () => ({
    headers: [
      { text: '編集', value: 'edit', align: 'center', width: '90px' },
      { text: '削除', value: 'delete', align: 'center', width: '90px' },
      { text: '件名', value: 'name', width: '150px' },
      { text: '文章', value: 'content', width: '250px' },
      { text: '配信対象', value: 'target', width: '120px' },
      { text: '状態', value: 'status', width: '90px' }
    ],
    statusTypes: {
      draft: '下書き',
      reserved: '送信済',
      submitted: '予約済'
    },
    targetTypes: {
      all: '全員',
      customers: '全ユーザー',
      delivery: '全デリバー',
      stores: '全飲食店',
      individual: '個別'
    },
    editedItem: null,
    historyItem: null
  }),
  computed: {
    ...mapGetters('admin/notification', ['getNotificationRows', 'getNotificationLoading'])
  },
  methods: {
    ...mapActions('admin/notification', ['getAllNotifications', 'getNotificationHistory', 'saveNotification', 'deleteNotification']),
    async deleteItem (item) {
      await this.deleteNotification({
        id: item.id
      })
    },
    editItem (item) {
      const temp = JSON.parse(JSON.stringify(item))
      temp.datetime = this.$moment(temp.datetime).format('YYYY-MM-DD HH:mm')
      this.editedItem = temp
    }
  },
  head: () => ({
    title: '通知設定'
  })
}
</script>
