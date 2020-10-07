<template>
  <div class="store-customer-manage">
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
        顧客情報
      </h3>
    </div>
    <h6 class="h7 grey--text mt-2">
      ※メルマガなど送る場合は、「配信停止」ができるようにしてください。
    </h6>
    <v-data-table
      :headers="headers"
      :items="items"
      mobile-breakpoint="0"
      hide-default-footer
      disable-sort
      class="elevation-1 mt-4"
    >
      <template v-slot:item.frequency_use="{ item }">
        <h6>{{ item.frequency_use | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.unit_cost="{ item }">
        <h6>{{ item.unit_cost | currency('円', false) }}</h6>
      </template>
      <template v-slot:item.total_amount="{ item }">
        <h6>{{ item.total_amount | currency('円', false) }}</h6>
      </template>
      <template v-slot:item.phone="{ item }">
        <h6>{{ item.phone | formatPhoneNumber }}</h6>
      </template>
      <template v-slot:item.address="{ item }">
        <div class="d-flex align-center">
          <h6>{{ item.address }}</h6>
          <v-menu transition="slide-reverse-x-transition" bottom left>
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="secondary--text"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-card class="pa-0" style="border-radius: 5px !important;" max-width="200" min-width="120">
              <v-card-text class="black--text">
                <h6>{{ item.postcode }}</h6>
                <h6>{{ item.address }}</h6>
                <h6>{{ item.address1 }}</h6>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CustomerManage',
  data: () => ({
    headers: [
      { text: 'お客様氏名', value: 'customer_name', align: 'center', width: '120px' },
      { text: '住所', value: 'address', align: 'center', width: '230px' },
      { text: '連絡先', value: 'phone', align: 'center', width: '200px' },
      { text: 'メールアドレス', value: 'email', align: 'center', width: '280px' },
      { text: '利用回数', value: 'frequency_use', align: 'center', width: '100px' },
      { text: '利用単価', value: 'unit_cost', align: 'center', width: '120px' },
      { text: '合計利用金額', value: 'total_amount', align: 'center', width: '150px' }
    ],
    items: []
  }),
  async created () {
    await this.fetchData()
  },
  methods: {
    ...mapActions('store/customer', ['getStoreCustomer']),
    async fetchData () {
      this.items = await this.getStoreCustomer({
        $axios: this.$axios
      })
    }
  },
  head: () => ({
    title: '顧客情報'
  })
}
</script>
