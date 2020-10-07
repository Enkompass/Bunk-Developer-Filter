<template>
  <div class="store-coupons-manage">
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'ticket-alt']" class="secondary--text" />
        クーポンの設定
      </h3>
      <v-btn
        color="secondary"
        width="120"
        height="40"
        class="mt-2 mt-md-0"
        :block="$vuetify.breakpoint.xs"
        aria-label="new issue"
        @click="editedItem = {}"
      >
        新規発行
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="getCouponRows"
      :server-items-length="getCouponCount"
      :loading="getCouponLoading"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.edit="{ item }">
        <v-btn text color="secondary" @click="editItem(item)">
          編集
        </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
        <h6 :class="{ 'red--text': item.status === 'request', 'secondary--text': item.status === 'pending' }">
          {{ statusTypes[item.status] }}
        </h6>
      </template>
      <template v-slot:item.usable_count="{ item }">
        {{ item.usable_count | currency('枚', false) }}
      </template>
      <template v-slot:item.usable_date_range="{ item }">
        {{ `${item.usable_date_range[0]} ~ ${item.usable_date_range[1]}` }}
      </template>
      <template v-slot:item.qr_code="{ item }">
        <div class="d-flex align-center justify-center">
          <h6 class="secondary--text mr-2">
            <a :href="`https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=delivow://coupon?code=${item.qr_code}&chld=L|1&choe=UTF-8`" target="_blank" class="secondary--text">
              {{ item.qr_code }}
            </a>
          </h6>
          <v-btn v-if="item.qr_code" icon @click="forceDownload(`https://api.qrserver.com/v1/create-qr-code/?data=delivow://coupon?code=${item.qr_code}&size=500x500&margin=20`)">
            <font-awesome-icon :icon="['fas', 'download']" class="secondary--text" />
          </v-btn>
        </div>
      </template>
      <template v-slot:item.can_use="{ item }">
        <h6>{{ item.can_use ? '可' : '不可' }}</h6>
      </template>
      <template v-slot:item.value="{ item }">
        <h6>{{ item.value | currency }}</h6>
      </template>
    </v-data-table>
    <coupon-edit-dialog v-model="editedItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'
import CouponEditDialog from '~/components/store/Coupon/CouponEditDialog'

export default {
  name: 'CouponsManage',
  components: { CouponEditDialog },
  mixins: [validationRules],
  async fetch () {
    await this.getStoreCoupons()
  },
  data: () => ({
    headers: [
      { text: '編集', value: 'edit', align: 'center' },
      { text: '状態', value: 'status', align: 'center', width: '100px' },
      { text: 'クーポンコード', value: 'coupon_code', align: 'center' },
      { text: 'QRコード', value: 'qr_code', align: 'center' },
      { text: 'クーポン名', value: 'coupon_name', align: 'center', width: '120px' },
      { text: '利用可能枚数', value: 'usable_count', align: 'center', width: '120px' },
      { text: '配布期間', value: 'usable_date_range', align: 'center', width: '200px' },
      { text: '利用条件', value: 'use_condition', align: 'center', width: '250px' },
      { text: '割引金額', value: 'value', align: 'center', width: '90px' },
      { text: 'クーポン併用', value: 'can_use', align: 'center', width: '80px' }
    ],
    editedItem: null,
    statusTypes: {
      approved: '承認済',
      draft: '下書き',
      request: '修正依頼',
      pending: '申請中'
    }
  }),
  computed: {
    ...mapGetters('store/coupon', ['getCouponRows', 'getCouponCount', 'getCouponLoading'])
  },
  methods: {
    ...mapActions('store/coupon', ['getStoreCoupons', 'saveStoreCoupon']),
    async forceDownload (url) {
      const base64 = await this.$axios.get(url, {
        responseType: 'arraybuffer'
      }).then(response =>
        Buffer.from(response.data, 'binary').toString('base64')
      )
      const img = new Image()
      img.src = 'data:image/jpeg;base64, ' + base64
      const link = document.createElement('a')
      link.href = 'data:image/jpeg;base64, ' + base64
      link.download = 'qr_code.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    editItem (item) {
      if (item.is_publish === true || item.status === 'approved') {
        return
      }
      this.editedItem = item
    }
  },
  head: () => ({
    title: 'クーポンの設定'
  })
}
</script>
