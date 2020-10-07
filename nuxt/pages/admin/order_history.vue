<template>
  <div class="admin-order-history">
    <div class="d-md-flex justify-start align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'box-open']" class="secondary--text" />
        注文履歴一覧表
      </h3>
    </div>
    <div>
      <v-chip-group
        v-model="params.filter"
        multiple
        active-class="secondary--text"
      >
        <v-chip
          v-for="(item, index) in filterItems"
          :key="index"
          color="#f2f2f2"
          pill
          text-color="black"
          :ripple="false"
          :value="item.value"
        >
          <v-icon color="grey">
            mdi-check-circle
          </v-icon>
          <h5>{{ item.text }}</h5>
        </v-chip>
      </v-chip-group>
    </div>
    <v-data-table
      :headers="headers"
      :items="getAdminOrders"
      :loading="getAdminOrderLoading"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      disable-pagination
      class="elevation-1 mt-2"
    >
      <template v-slot:header.complete_time>
        <div class="d-flex align-center">
          <h6 class="mr-1">
            完了時間
          </h6>
          <v-tooltip bottom color="white">
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="text-body-1 secondary--text"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <span class="black--text elevation-1 pa-3">※お届け(または受け渡し)の時間</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:header.completion_time>
        <div class="d-flex align-center">
          <h6 class="mr-1">
            所要時間
          </h6>
          <v-tooltip bottom color="white">
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="text-body-1 secondary--text"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <span class="black--text elevation-1 pa-3">※注文→お届け（または受け渡し）までの時間</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:item.order_date="{ item }">
        <h6>{{ item.order_date | dateFormat }}</h6>
      </template>
      <template v-slot:item.order_time="{ item }">
        <h6>{{ item.order_date | timeFormat }}</h6>
      </template>
      <template v-slot:item.product_price="{ item }">
        {{ item.product_price | currency }}
      </template>
      <template v-slot:item.customer_name="{ item }">
        {{ (item.first_name || '') + ' ' + (item.last_name || '') }}
      </template>
      <template v-slot:item.customer_phone="{ item }">
        {{ item.customer_phone | formatPhoneNumber }}
      </template>
      <template v-slot:item.delivery_phone="{ item }">
        {{ item.delivery_phone | formatPhoneNumber }}
      </template>
      <template v-slot:item.completion_time="{ item }">
        {{ item.completion_time | currency('分', false) }}
      </template>
      <template v-slot:item.complete_time="{ item }">
        <h6>{{ item.complete_time | timeFormat }}</h6>
      </template>
      <template v-slot:item.order_type="{ item }">
        <h6>{{ orderTypes[item.order_type] }}</h6>
      </template>
      <template v-slot:item.status="{ item }">
        <h6 :class="{'error--text': item.status !== 'complete'}">
          {{ statusTypes[item.status] }}
        </h6>
      </template>
      <template v-slot:item.order_cancel="{ item }">
        <v-menu transition="slide-y-transition" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="item.status === 'cancel' || item.status === 'complete' || item.status === 'cancelling' || item.status === 'created'"
              text
              height="35"
              color="error"
              v-bind="attrs"
              v-on="on"
            >
              キャンセル
            </v-btn>
          </template>
          <v-card class="pa-0 rounded">
            <v-card-title class="pa-0">
              <v-btn text color="error" block @click="cancelItem(item)">
                キャンセル
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-btn text color="grey" block>
                戻る
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:item.emergency_change_delivery="{ item }">
        <v-btn :disabled="item.status === 'complete' || item.status === 'created' || item.status === 'cancel' || item.status === 'cancelling'" text height="35" color="error" @click="showDialog(item)">
          変更
        </v-btn>
      </template>
      <template v-slot:item.note="{ item }">
        <v-menu transition="slide-reverse-x-transition" bottom left offset-y>
          <template v-slot:activator="{ on, attrs }">
            <h6 v-if="item.note" class="secondary--text" v-bind="attrs" v-on="on">
              備考
            </h6>
            <h6 v-else>
              -
            </h6>
          </template>
          <v-card class="pa-0 rounded-sm" min-width="200" max-width="250">
            <v-card-text class="black--text">
              <h6>{{ item.note }}</h6>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
      <v-form ref="form" @submit.prevent="save">
        <v-card color="#D4D4D4">
          <v-card-title class="justify-center py-5 pt-8">
            <h2 class="h23 black--text font-weight-bold">
              デリバーの緊急変更
            </h2>
          </v-card-title>
          <v-card-subtitle class="mt-2 mt-md-3">
            <h3 class="h45 black--text text-center">
              元のデリバーの報酬を停止し、新しいデリバーに移行します。
            </h3>
          </v-card-subtitle>
          <v-card-text>
            <v-row align="center" class="px-0 px-md-12">
              <v-col cols="12" class="pa-2">
                <v-text-field
                  v-model="editedItem.deliver_uid"
                  :rules="[rules.required]"
                  placeholder="新しいデリバーの管理番号"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="py-0">
            <v-row no-gutters>
              <v-col cols="6" class="br-1-grey">
                <v-btn
                  color="error"
                  height="56"
                  type="submit"
                  block
                  text
                  aria-label="Change"
                  class="font-weight-bold"
                >
                  変更
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="grey"
                  text
                  height="56"
                  aria-label="Cancel"
                  @click="dialog = false"
                >
                  キャンセル
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'

export default {
  name: 'OrderHistory',
  layout: 'admin',
  mixins: [validationRules],
  async fetch () {
    await this.loadAdminOrders({
      ...this.params
    })
  },
  data: () => ({
    params: {
      filter: ['order']
    },
    editedItem: {},
    filterItems: [
      { text: '今すぐ注文のみ', value: 'order' },
      { text: '予約注文のみ', value: 'book' },
      { text: 'テイクアウトの注文のみ', value: 'takeout' },
      { text: 'キャンセルのみ', value: 'cancel' }
    ],
    orderTypes: {
      order: '今すぐ',
      book: '予約',
      takeout: 'テイクアウト'
    },
    statusTypes: {
      created: '未完了',
      verified: '未完了',
      cooking: '未完了',
      delivering: '未完了',
      complete: '完了',
      cancel: 'キャンセル'
    },
    headers: [
      { text: '注文管理No', value: 'order_uid', align: 'center', width: '140px' },
      { text: '利用年日', value: 'order_date', align: 'center', width: '120px' },
      { text: '利用時間', value: 'order_time', align: 'center', width: '140px' },
      { text: '店舗名', value: 'store_name', align: 'center', width: '150px' },
      { text: '利用金額', value: 'product_price', align: 'center', width: '120px' },
      { text: 'ユーザー名', value: 'customer_name', align: 'center', width: '120px' },
      { text: 'ユーザーTEL', value: 'customer_phone', align: 'center', width: '160px' },
      { text: '担当デリバーTEL', value: 'delivery_phone', align: 'center', width: '160px' },
      { text: '完了時間', value: 'complete_time', align: 'center', width: '120px' },
      { text: '所要時間', value: 'completion_time', align: 'center', width: '120px' },
      { text: '注文種類', value: 'order_type', align: 'center', width: '120px' },
      { text: '状態', value: 'status', align: 'center', width: '120px' },
      { text: '備考', value: 'note', align: 'center', width: '120px' },
      { text: '受注キャンセル', value: 'order_cancel', align: 'center', width: '140px' },
      { text: '振込処理', value: 'bank_processing', align: 'center', width: '120px' },
      { text: 'デリバーの緊急変更', value: 'emergency_change_delivery', align: 'center', width: '150px' }
    ],
    items: [],
    dialog: false
  }),
  computed: {
    ...mapGetters('admin/order', ['getAdminOrders', 'getAdminOrderCount', 'getAdminOrderLoading'])
  },
  watch: {
    'params.filter': '$fetch'
  },
  methods: {
    ...mapActions('admin/order', ['loadAdminOrders', 'changeEmergencyDelivery']),
    cancelItem (item) {
      this.dialog = true
    },
    showDialog (item) {
      this.dialog = true
      this.editedItem.order_uid = item.order_uid
    },
    async save () {
      if (!this.$refs.form.validate()) {
        return
      }
      await this.changeEmergencyDelivery({
        order_uid: this.editedItem.order_uid,
        deliver_uid: this.editedItem.deliver_uid
      })
      this.dialog = false
    }
  },
  head: () => ({
    title: '注文履歴一覧表'
  })
}
</script>
