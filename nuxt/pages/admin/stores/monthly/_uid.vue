<template>
  <div class="admin-stores">
    <div>
      <div class="d-md-flex justify-start align-center">
        <h3>
          <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
          顧客情報管理-登録店舗-月別明細表
        </h3>
      </div>
      <div class="d-flex mt-3">
        <v-select
          v-model="params.year"
          :items="yearItems"
          background-color="white"
          dense
          solo
          hide-details
          class="mt-3 mt-md-0 elevation-0"
        />
        <div class="store_name ml-4">
          <h5>{{ getStoreName }}</h5>
        </div>
      </div>
    </div>
    <v-data-table
      ref="datatable"
      :headers="headers"
      :items="getMonthlyRows"
      :server-items-length="getMonthlyCount"
      :loading="getMonthlyLoading"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.year_month="{ item }">
        <h6>
          {{ item.year_month | dateMonthFormat }}
        </h6>
      </template>
      <template v-slot:item.products_price="{ item }">
        <h6>{{ item.products_price | currency }}</h6>
      </template>
      <template v-slot:item.order_count="{ item }">
        <h6>{{ item.order_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.book_count="{ item }">
        <h6>{{ item.book_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.takeout_count="{ item }">
        <h6>{{ item.takeout_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.first_count="{ item }">
        <h6>{{ item.first_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.pdf="{ item }">
        <h6 class="secondary--text" @click="showPrintDialog(item)">
          PDF
        </h6>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog.pdf"
      content-class="print-dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      class="rounded-0"
    >
      <v-card color="#606060" class="rounded-0">
        <v-row no-gutters>
          <v-col cols="12" md="3" sm="12">
            <h5 class="white--text font-weight-bold ma-8" style="cursor:pointer;" @click="dialog.pdf = false">
              <font-awesome-icon :icon="['fas', 'chevron-left']" />
              戻る
            </h5>
          </v-col>
          <v-col cols="12" md="6" sm="12">
            <vue-html2pdf
              ref="html2Pdf"
              :filename="filename"
              :enable-download="true"
              :paginate-elements-by-height="1400"
              :pdf-quality="2"
              :manual-pagination="false"
              pdf-format="a4"
            >
              <section slot="pdf-content">
                <div id="print" ref="download" class="white pdf-background">
                  <div style="padding: 20px;">
                    <h6 style="font-size: 12px; text-align: right;" class="text-right">
                      株式会社WATASHI AGENCY
                    </h6>
                    <h2 style="margin-top: 55px; text-align: center; font-weight: bold;">
                      月別明細表
                    </h2>
                    <div style="padding: 45px;">
                      <h6 style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">
                        <span style="border-bottom: 2px solid black;">
                          {{ getStoreName }}
                        </span>
                      </h6>
                      <h6 style="font-size: 14px; margin-bottom: 5px;">
                        {{ editedItem.year_month | dateMonthFormat }}月分
                      </h6>
                      <div style="margin-bottom: 45px;">
                        <span style="border-bottom: 2px solid black;">
                          <span style="font-size: 20px; font-weight: bold;">
                            ご入金金額
                          </span>
                          <span style="font-size: 20px; font-weight: bold; margin-left: 60px;">
                            {{ details.total_amount | currency }} -
                          </span>
                        </span>
                      </div>
                      <table style="border-collapse: collapse; width: 100%; margin-bottom: 25px;">
                        <thead>
                          <tr style="border: solid 1px #b5b5b5;">
                            <th style="width: 70%; height: 28px; background-color: #f2f2f2;" colspan="2">
                              内容
                            </th>
                            <th style="width: 30%; height: 28px; background-color: #f2f2f2;">
                              金額
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in details.table_data" :key="index" style="border: solid 1px #b5b5b5; height: 28px;">
                            <td style="text-align: left; padding-left: 8px;" colspan="2">
                              {{ item.label }}
                            </td>
                            <td style="text-align: right; padding-right: 8px;">
                              {{ item.value >= 0 ? '' : '-' }}{{ item.value | currency }}
                            </td>
                          </tr>
                          <tr style="border: solid 1px #b5b5b5; height: 28px;">
                            <td style="text-align: left; padding-left: 8px;" colspan="2" />
                            <td style="text-align: right; padding-right: 8px;" />
                          </tr>
                          <tr style="border: solid 1px #b5b5b5; height: 28px;">
                            <td style="text-align: left; padding-left: 8px;" colspan="2" />
                            <td style="text-align: right; padding-right: 8px;" />
                          </tr>
                          <tr style="height: 28px;">
                            <td style="width: 30%; border: none;" />
                            <td style="width: 40%; text-align: left; padding-left: 8px; border: solid 1px #b5b5b5;">
                              計
                            </td>
                            <td style="text-align: right; padding-right: 8px; border: solid 1px #b5b5b5;">
                              {{ details.total_amount | currency }}
                            </td>
                          </tr>
                          <tr style="height: 28px;">
                            <td style="width: 30%; border: none;" />
                            <td style="width: 40%; text-align: left; padding-left: 8px; border: solid 1px #b5b5b5;">
                              消費税(内税10%)
                            </td>
                            <td style="text-align: right; padding-right: 8px; border: solid 1px #b5b5b5;">
                              {{ details.total_amount * 0.1 | currency }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h5 style="font-size: 13px; margin-bottom: 5px;">
                        備考：
                      </h5>
                      <div style="border: solid 1px #b5b5b5; height: 80px; width: 100%; padding: 9px;">
                        <h5 style="font-size: 13px;">
                          {{ details.note }}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </vue-html2pdf>
          </v-col>
          <v-col cols="12" md="3" sm="12" class="d-flex flex-column align-start">
            <div class="d-flex align-center justify-end mt-auto" style="width: 100%;">
              <v-btn
                color="#707070"
                fab
                large
                class="white--text ma-2 mb-5"
                @click="print"
              >
                <font-awesome-icon :icon="['fas', 'print']" size="lg" />
              </v-btn>
              <v-btn color="#707070" fab large class="white--text ma-2 mb-5 mr-5" @click="download">
                <font-awesome-icon :icon="['fas', 'download']" size="lg" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'

export default {
  layout: 'admin',
  mixins: [validationRules],
  async fetch () {
    await this.getStoreYearly({
      ...this.params
    })
  },
  data: () => ({
    params: {
      year: '2020',
      store_uid: ''
    },
    yearItems: [],
    headers: [
      { text: '年月', value: 'year_month', align: 'center', width: '100px' },
      { text: '売上(商品代)', value: 'products_price', align: 'center', width: '130px' },
      { text: '今すぐ注文回数', value: 'order_count', align: 'center', width: '130px' },
      { text: '予約注文回数', value: 'book_count', align: 'center', width: '120px' },
      { text: 'テイクアウト回数', value: 'takeout_count', align: 'center', width: '160px' },
      { text: '初回利用者クーポン回数', value: 'first_count', align: 'center', width: '160px' },
      { text: 'PDF', value: 'pdf', align: 'center', width: '160px' }
    ],
    items: [],
    dialog: {
      pdf: false
    },
    details: {
      total_amount: 0,
      table_data: [
        { label: 'デリバリー売上(商品代)', value: 0 },
        { label: '手数料(売上×33.5％)', value: 0 },
        { label: 'テイクアウト売上(商品代)', value: 0 },
        { label: 'テイクアウト手数料(売上×10％)', value: 0 },
        { label: '店舗設定クーポン利用金額　　', value: 0 },
        { label: '1件の配達で二輪デリバー複数台手配料', value: 0 },
        { label: '支援金', value: 0 },
        { label: '初回利用者クーポン', value: 0 },
        { label: '調理遅延によるキャンセル', value: 0 }
      ]
    },
    filename: '',
    editedItem: {
      year_month: ''
    }
  }),
  computed: {
    ...mapGetters('admin/stores', ['getMonthlyRows', 'getMonthlyCount', 'getMonthlyLoading', 'getStoreName'])
  },
  watch: {
    'params.year': '$fetch'
  },
  created () {
    this.params.store_uid = this.$route.params.uid
    if (this.params.store_uid === undefined) {
      return this.$router.push('/admin/stores')
    }
    const year = this.$moment().format('YYYY')
    const startYear = 2018
    for (let i = startYear; i <= parseInt(year); i++) {
      this.yearItems.unshift({
        text: `${i}年`,
        value: i.toString()
      })
    }
    this.params.year = year
    this.filename = '月別明細表' + this.$moment().unix()
  },
  methods: {
    ...mapActions('admin/stores', ['getStoreYearly', 'getMonthlyDetails']),
    async showPrintDialog (item) {
      this.editedItem = JSON.parse(JSON.stringify(item))
      this.editedItem.uid = this.params.store_uid
      this.details = await this.getMonthlyDetails(this.editedItem)
      this.dialog.pdf = true
    },
    print () {
      this.$htmlToPaper('print')
    },
    download () {
      this.filename = '月別明細表' + this.$moment().unix()
      this.$refs.html2Pdf.downloadPdf()
    }
  },
  head: () => ({
    title: '顧客情報管理-登録店舗-月別明細表'
  })
}
</script>
