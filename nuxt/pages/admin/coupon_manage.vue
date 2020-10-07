<template>
  <div class="admin-coupon-manage">
    <div class="d-md-flex align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'ticket-alt']" class="secondary--text" />
        クーポンの管理
      </h3>
      <v-btn :block="$vuetify.breakpoint.xs" color="secondary" height="35" class="ml-md-3 ml-0 mt-3 mt-md-0" @click="editedItem = {}">
        <font-awesome-icon :icon="['fas', 'plus']" />
        新規作成
      </v-btn>
    </div>
    <v-chip-group
      v-model="params.filter"
      multiple
      mandatory
      active-class="secondary--text"
      class="mt-2"
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
    <v-data-table
      :headers="headers"
      :items="getCouponRows"
      :loading="getCouponLoading"
      mobile-breakpoint="0"
      disable-sort
      disable-pagination
      hide-default-footer
      class="elevation-1 mt-3"
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
      <template v-slot:item.distribution_period="{ item }">
        {{ `${item.distribution_period[0]} ~ ${item.distribution_period[1]}` }}
      </template>
      <template v-slot:item.distribution_target="{ item }">
        {{ targetItem[item.distribution_target] }}
      </template>
      <template v-slot:item.usable_count="{ item }">
        {{ item.usable_count | currency('枚', false) }}
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
      <template v-slot:item.value="{ item }">
        <h6>{{ item.value | currency }}</h6>
      </template>
      <template v-slot:item.author="{ item }">
        <h6>{{ item.author === 'admin' ? '本部' : item.author }}</h6>
      </template>
      <template v-slot:item.can_use="{ item }">
        <h6>{{ item.can_use ? '可' : '不可' }}</h6>
      </template>
      <template v-slot:item.publish="{ item }">
        <v-btn v-if="!item.is_publish && item.author !== 'admin' && item.status === 'approved'" text color="secondary" @click="publishItem(item)">
          配布
        </v-btn>
      </template>
    </v-data-table>
    <coupon-edit-form v-model="editedItem" />
    <publish-form v-model="publishedItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CouponEditForm from '~/components/admin/Coupon/CouponEditForm'
import PublishForm from '~/components/admin/Coupon/PublishForm'

export default {
  name: 'CouponManage',
  components: { PublishForm, CouponEditForm },
  layout: 'admin',
  async fetch () {
    await this.loadAdminCoupons({
      ...this.params
    })
  },
  data: () => ({
    params: {
      filter: ['pending', 'approved', 'draft']
    },
    filterItems: [
      { text: '未承認のみ表示', value: 'pending' },
      { text: '承認済のみ表示', value: 'approved' },
      { text: '下書きのみ表示', value: 'draft' }
    ],
    targetItem: {
      all_customer: '全ユーザー',
      all_delivery: '全デリバー',
      individual: '個別',
      user_near_3km: '店舗から6.5km圏内のユーザー'
    },
    headers: [
      { text: '編集', value: 'edit', align: 'center', width: '90px' },
      { text: '状態', value: 'status', align: 'center', width: '90px' },
      { text: 'クーポンコード', value: 'coupon_code', align: 'center', width: '150px' },
      { text: 'QRコード', value: 'qr_code', align: 'center', width: '150px' },
      { text: '作成者', value: 'author', align: 'center', width: '150px' },
      { text: 'クーポン名', value: 'coupon_name', align: 'center', width: '220px' },
      { text: '利用条件', value: 'terms_of_use', align: 'center', width: '170px' },
      { text: '利用可能枚数', value: 'usable_count', align: 'center', width: '120px' },
      { text: '配布期間', value: 'distribution_period', align: 'center', width: '250px' },
      { text: '配布対象', value: 'distribution_target', align: 'center', width: '200px' },
      { text: 'クーポン併用', value: 'can_use', align: 'center', width: '120px' },
      { text: '割引金額', value: 'value', align: 'center', width: '120px' },
      { text: '店舗クーポン配布', value: 'publish', align: 'center', width: '120px' }
    ],
    items: [],
    statusTypes: {
      approved: '承認済',
      draft: '下書き',
      request: '修正依頼',
      pending: '申請中'
    },
    editedItem: null,
    publishedItem: null
  }),
  computed: {
    ...mapGetters('admin/coupon', ['getCouponRows', 'getCouponLoading', 'getCouponCount'])
  },
  watch: {
    'params.filter': '$fetch'
  },
  methods: {
    ...mapActions('admin/coupon', ['loadAdminCoupons']),
    async forceDownload (url) {
      const base64 = await this.$axios.get(url, {
        responseType: 'arraybuffer'
      })
        .then(response =>
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
      if (item.is_publish === true) {
        return
      }
      const temp = JSON.parse(JSON.stringify(item))
      temp.can_use = temp.can_use ? '1' : '0'
      this.editedItem = temp
    },
    publishItem (item) {
      const temp = JSON.parse(JSON.stringify(item))
      temp.can_use = temp.can_use ? '1' : '0'
      this.publishedItem = temp
    }
  },
  head: () => ({
    title: 'クーポンの管理'
  })
}
</script>
