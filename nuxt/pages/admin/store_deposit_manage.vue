<template>
  <div class="store-deposit-manage">
    <h3 class="font-weight-bold">
      <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
      店舗 - 入金管理表
    </h3>
    <div class="mt-3">
      <update-dialog v-model="params" />
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="getDepositLoading"
        mobile-breakpoint="0"
        disable-sort
        disable-pagination
        hide-default-footer
        class="elevation-1 mt-4"
      >
        <template v-slot:header.delivery_sales_total>
          <span>
            デリバリー<br>売上（計）
          </span>
        </template>
        <template v-slot:header.delivery_fees_total>
          <span>
            デリバリー<br>手数料（計）
          </span>
        </template>
        <template v-slot:header.takeout_sales_total>
          <span>
            テイクアウト<br>売上（計）
          </span>
        </template>
        <template v-slot:header.takeout_sales_fee>
          <span>
            テイクアウト<br>手数料（計）
          </span>
        </template>
        <template v-slot:header.store_coupon_usage_amount>
          <span>
            店舗設定<br>クーポン 利用金額
          </span>
        </template>
        <template v-slot:header.multiple_fee>
          <span>
            1件の配達で 二輪<br>デリバー 複数台 手配料
          </span>
        </template>
        <template v-slot:header.first_time_coupon_amount>
          <span>
            初回利用者<br>クーポン利用金額
          </span>
        </template>
        <template v-slot:header.cancel_by_delay>
          <span>
            調理遅延による<br>キャンセル
          </span>
        </template>
        <template v-slot:item.income="{ item }">
          <h6>{{ item.income | floatCurrency }}</h6>
        </template>
        <template v-slot:item.delivery_sales_total="{ item }">
          <h6>{{ item.delivery_sales_total | floatCurrency }}</h6>
        </template>
        <template v-slot:item.delivery_fees_total="{ item }">
          <h6>-{{ item.delivery_fees_total | floatCurrency }}</h6>
        </template>
        <template v-slot:item.takeout_sales_total="{ item }">
          <h6>{{ item.takeout_sales_total | floatCurrency }}</h6>
        </template>
        <template v-slot:item.takeout_sales_fee="{ item }">
          <h6>-{{ item.takeout_sales_fee | floatCurrency }}</h6>
        </template>
        <template v-slot:item.store_coupon_usage_amount="{ item }">
          <h6>-{{ item.store_coupon_usage_amount | currency }}</h6>
        </template>
        <template v-slot:item.multiple_fee="{ item }">
          <h6>-{{ item.multiple_fee | floatCurrency }}</h6>
        </template>
        <template v-slot:item.support_money="{ item }">
          <h6>{{ item.support_money | currency }}</h6>
        </template>
        <template v-slot:item.first_time_coupon_amount="{ item }">
          <h6>-{{ item.first_time_coupon_amount | currency }}</h6>
        </template>
        <template v-slot:item.cancel_by_delay="{ item }">
          <h6>-{{ item.cancel_by_delay | currency }}</h6>
        </template>
        <template v-slot:item.payment_completed="{ item }">
          <v-icon :color="item.payment_completed ? 'secondary' : 'grey'" @click="confirmComplete(item)">
            mdi-check-circle
          </v-icon>
        </template>
        <template v-slot:item.notes="{ item }">
          <v-edit-dialog
            :return-value.sync="item.notes"
            large
            persistent
            :cancel-text="$t('common.cancel')"
            :save-text="$t('common.save')"
            @save="save(item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <h6>
              {{ item.notes || '-' }}
            </h6>
            <template v-slot:input>
              <v-text-field
                v-model="item.notes"
                background-color="white"
                hide-details
                dense
                outlined
                class="mt-2"
              />
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UpdateDialog from '~/components/admin/StoreDeposit/UpdateDialog'

export default {
  name: 'StoreDepositManage',
  components: { UpdateDialog },
  layout: 'admin',
  async fetch () {
    await this.loadStoreDeposits({
      date: this.params
    })
  },
  data: () => ({
    headers: [
      { text: '店舗名', value: 'store_name', align: 'center', width: '220px' },
      { text: '入金額', value: 'income', align: 'center', width: '120px' },
      { text: '入金済', value: 'payment_completed', align: 'center', width: '80px' },
      { text: 'デリバリー売上（計）', value: 'delivery_sales_total', align: 'center', width: '120px' },
      { text: 'デリバリー手数料（計）', value: 'delivery_fees_total', align: 'center', width: '120px' },
      { text: 'テイクアウト売上（計）', value: 'takeout_sales_total', align: 'center', width: '120px' },
      { text: 'テイクアウト手数料（計）', value: 'takeout_sales_fee', align: 'center', width: '120px' },
      { text: '店舗設定クーポン利用金額', value: 'store_coupon_usage_amount', align: 'center', width: '170px' },
      { text: '1件の配達で二輪デリバー複数台手配料', value: 'multiple_fee', align: 'center', width: '170px' },
      { text: '支援金', value: 'support_money', align: 'center', width: '120px' },
      { text: '初回利用者クーポン利用金額', value: 'first_time_coupon_amount', align: 'center', width: '140px' },
      { text: '調理遅延によるキャンセル', value: 'cancel_by_delay', align: 'center', width: '120px' },
      { text: '備考', value: 'notes', align: 'center', width: '200px' }
    ],
    items: [],
    params: null
  }),
  computed: {
    ...mapGetters('admin/store_deposit', ['getDepositRows', 'getDepositLoading'])
  },
  watch: {
    getDepositRows: {
      deep: true,
      handler (val) {
        this.items = JSON.parse(JSON.stringify(val))
      }
    }
  },
  created () {
    this.params = this.$moment().format('YYYY-MM')
  },
  methods: {
    ...mapActions('admin/store_deposit', ['loadStoreDeposits', 'updateStorePayment', 'updateStoreNotes']),
    save (val) {
      this.updateStoreNotes(val)
    },
    confirmComplete (val) {
      this.updateStorePayment(val)
    },
    cancel () {},
    open () {},
    close () {}
  },
  head: () => ({
    title: '店舗入金管理'
  })
}
</script>
