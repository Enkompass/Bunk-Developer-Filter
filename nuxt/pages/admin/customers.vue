<template>
  <div class="admin-customer">
    <div class="d-md-flex justify-start align-center">
      <h3>
        <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
        顧客情報管理-ユーザー
      </h3>
      <v-select
        v-model="params.filter"
        :items="filterItems"
        background-color="white"
        outlined
        dense
        hide-details
        class="ml-0 ml-md-5 mt-3 mt-md-0"
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.reg_date="{ item }">
        <div class="d-flex">
          <h6>
            {{ item.reg_date | dateFormat }}
          </h6>
          <v-badge
            v-if="item.is_update === true"
            content="1"
            value="1"
            color="error"
            inline
          />
        </div>
      </template>
      <template v-slot:item.name="{ item }">
        <h6>{{ `${item.first_name} ${item.last_name}` }}</h6>
      </template>
      <template v-slot:item.address="{ item }">
        <div class="d-flex align-center">
          <h6>{{ item.address }}</h6>
          <v-menu transition="slide-reverse-x-transition" bottom left>
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="secondary--text"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-card class="pa-0" style="border-radius: 5px !important;">
              <v-card-text class="black--text">
                <h6>{{ item.address }}</h6>
                <h6>{{ item.address1 }}</h6>
                <h6>{{ item.address2 }}</h6>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </template>
      <template v-slot:item.birthday="{ item }">
        <h6>{{ item.birthday | dateFormat }}</h6>
      </template>
      <template v-slot:item.phone="{ item }">
        <h6>{{ item.phone | formatPhoneNumber }}</h6>
      </template>
      <template v-slot:item.use_count="{ item }">
        <h6>{{ item.use_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.use_sum_amount="{ item }">
        <h6>{{ item.use_sum_amount | currency }}</h6>
      </template>
      <template v-slot:item.cancel_count="{ item }">
        <h6>{{ item.cancel_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.use_history="{ item }">
        <v-btn text color="secondary" block @click="showUseHistory(item)">
          利用履歴
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn text color="error" :disabled="item.is_delete" @click="showDeleteDialog(item)">
          退会
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog.history" scrollable max-width="800" overlay-opacity="0.6">
      <v-card color="white" :loading="subloading" class="rounded-0">
        <v-data-table
          :headers="subheaders"
          :items="subitems"
          mobile-breakpoint="0"
          disable-sort
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:item.date="{ item }">
            <h6>{{ item.date | dateFormat }}</h6>
          </template>
          <template v-slot:item.total_amount="{ item }">
            <h6>{{ item.total_amount | currency }}</h6>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.delete" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="h23 black--text font-weight-bold">
            退会させますか？
          </h2>
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey-fixed">
              <v-btn
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="dialog.delete = false"
              >
                キャンセル
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="error"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="confirmDelete"
              >
                退会
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
  name: 'Customers',
  layout: 'admin',
  data: () => ({
    params: {
      filter: 'register_date'
    },
    filterItems: [
      { text: '登録順', value: 'register_date' },
      { text: '回数実績順', value: 'use_count' },
      { text: '50音順', value: 'first_name' }
    ],
    headers: [
      { text: '登録日', value: 'reg_date', align: 'center', width: '120px' },
      { text: 'ユーザー登録No', value: 'customer_uid', align: 'center', width: '150px' },
      { text: '氏名', value: 'name', align: 'center', width: '120px' },
      { text: '自宅住所', value: 'address', align: 'center', width: '190px' },
      { text: '生年月日', value: 'birthday', align: 'center', width: '120px' },
      { text: 'TEL', value: 'phone', align: 'center', width: '150px' },
      { text: 'メールアドレス', value: 'email', align: 'center', width: '200px' },
      { text: '利用回数', value: 'use_count', align: 'center', width: '120px' },
      { text: '利用合計金額', value: 'use_sum_amount', align: 'center', width: '120px' },
      { text: 'キャンセル', value: 'cancel_count', align: 'center', width: '120px' },
      { text: '利用履歴', value: 'use_history', align: 'center', width: '110px' },
      { text: '退会', value: 'delete', align: 'center', width: '90px' },
      { text: '備考', value: 'note', align: 'center', width: '90px' }
    ],
    subheaders: [
      { text: 'ご利用日時', value: 'date', align: 'center' },
      { text: '利用合計金額', value: 'total_amount', align: 'center' },
      { text: '注文管理No', value: 'order_uid', align: 'center' }
    ],
    subitems: [],
    items: [],
    dialog: {
      history: false,
      delete: false
    },
    subloading: false,
    editedItem: {}
  }),
  watch: {
    'params.filter': 'fetchData'
  },
  async created () {
    await this.fetchData()
  },
  methods: {
    ...mapActions('admin/customers', ['getCustomers', 'getUseHistory', 'deleteCustomer']),
    async fetchData () {
      const { data } = await this.getCustomers({
        $axios: this.$axios,
        params: this.params
      })
      this.items = data.list
    },
    async fetchSubData (uid) {
      this.subloading = true
      this.subitems = await this.getUseHistory({
        $axios: this.$axios,
        params: {
          customer_uid: uid
        }
      })
      this.subloading = false
    },
    showUseHistory (item) {
      this.dialog.history = true
      this.fetchSubData(item.customer_uid)
    },
    showDeleteDialog (item) {
      this.dialog.delete = true
      this.editedItem = item
    },
    async confirmDelete () {
      await this.deleteCustomer({
        $axios: this.$axios,
        params: {
          customer_uid: this.editedItem.customer_uid
        }
      })
      this.dialog.delete = false
      await this.fetchData()
    }
  },
  head: () => ({
    title: '顧客情報管理-ユーザー'
  })
}
</script>
