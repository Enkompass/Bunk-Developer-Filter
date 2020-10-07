<template>
  <div class="deliver-deposit-manage">
    <h3 class="font-weight-bold">
      <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
      デリバー入金管理表
    </h3>
    <div class="mt-3">
      <deliver-update-dialog v-model="params" />
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
        <template v-slot:header.cancel_by>
          <span>
            配達遅延による<br>キャンセル
          </span>
        </template>
        <template v-slot:item.income="{ item }">
          <h6>{{ item.income | floatCurrency }}</h6>
        </template>
        <template v-slot:item.main_delivery_fee="{ item }">
          <h6>{{ item.main_delivery_fee | floatCurrency }}</h6>
        </template>
        <template v-slot:item.distance_fees="{ item }">
          <h6>{{ item.distance_fees | currency }}</h6>
        </template>
        <template v-slot:item.bad_weather_fees="{ item }">
          <h6>{{ item.bad_weather_fees | currency }}</h6>
        </template>
        <template v-slot:item.car_fees="{ item }">
          <h6>{{ item.car_fees | currency }}</h6>
        </template>
        <template v-slot:item.cancel_by="{ item }">
          <h6>{{ item.cancel_by | currency }}</h6>
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
import DeliverUpdateDialog from '~/components/admin/DeliverDeposit/DeliverUpdateDialog'
export default {
  name: 'DeliverDepositManage',
  components: { DeliverUpdateDialog },
  layout: 'admin',
  async fetch () {
    await this.loadDeliveryDeposits({
      date: this.params
    })
  },
  data: () => ({
    headers: [
      { text: 'デリバー名', value: 'delivery_name', align: 'center', width: '220px' },
      { text: '日付', value: 'date', align: 'center', width: '150px' },
      { text: '入金額', value: 'income', align: 'center', width: '120px' },
      { text: '入金済', value: 'payment_completed', align: 'center', width: '80px' },
      { text: '基本配達料', value: 'main_delivery_fee', align: 'center', width: '120px' },
      { text: '長距離報酬', value: 'distance_fees', align: 'center', width: '120px' },
      { text: '悪天候報酬', value: 'bad_weather_fees', align: 'center', width: '120px' },
      { text: '事業用車両', value: 'car_fees', align: 'center', width: '120px' },
      { text: '配達遅延によるキャンセル', value: 'cancel_by', align: 'center', width: '120px' },
      { text: '備考', value: 'notes', align: 'center', width: '200px' }
    ],
    items: [],
    params: null
  }),
  computed: {
    ...mapGetters('admin/deliver_deposit', ['getDepositRows', 'getDepositLoading'])
  },
  watch: {
    getDepositRows: {
      deep: true,
      handler (val) {
        this.items = JSON.parse(JSON.stringify(val))
      }
    },
    params: '$fetch'
  },
  created () {
    const startDate = this.$moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD')
    const endDate = this.$moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')
    this.params = [startDate, endDate]
  },
  methods: {
    ...mapActions('admin/deliver_deposit', ['loadDeliveryDeposits', 'updateDeliveryNotes', 'updateDeliveryPayment']),
    save (val) {
      this.updateDeliveryNotes(val)
    },
    confirmComplete (val) {
      this.updateDeliveryPayment(val)
    }
  },
  head: () => ({
    title: '本部売上管理'
  })
}
</script>
