<template>
  <v-dialog
    v-model="dialog"
    content-class="print-dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
    class="rounded-0"
  >
    <v-card color="#606060" class="rounded-0">
      <v-row no-gutters>
        <v-col cols="12" md="3" sm="12">
          <h5 class="white--text font-weight-bold ma-8" style="cursor:pointer;" @click="onClose">
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
                    配達報酬明細表
                  </h2>
                  <div style="padding: 45px;">
                    <h6 style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">
                      <span style="border-bottom: 2px solid black;">
                        {{ details.delivery_name }}
                      </span>
                    </h6>
                    <h6 style="font-size: 14px; margin-bottom: 5px;">
                      {{ details.date_range }}
                    </h6>
                    <div style="margin-bottom: 45px;">
                      <span style="border-bottom: 2px solid black;">
                        <span style="font-size: 20px; font-weight: bold;">
                          ご入金金額
                        </span>
                        <span style="font-size: 20px; font-weight: bold; margin-left: 60px;">{{ details.total_amount | currency }} -</span>
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
          <v-tabs v-model="params.type" background-color="transparent" color="white" right>
            <v-tab>週別</v-tab>
            <v-tab>月別</v-tab>
            <v-tab>年別</v-tab>
            <v-tab-item>
              <div class="d-flex align-center justify-end">
                <v-select
                  v-model="params.weekly"
                  :items="weeklyItems"
                  outlined
                  background-color="white"
                  dense
                  hide-details
                  class="mx-3 mx-md-6 mt-5"
                />
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="d-flex align-center justify-end">
                <v-select
                  v-model="params.month"
                  :items="monthItems"
                  outlined
                  background-color="white"
                  dense
                  hide-details
                  class="mx-3 mx-md-6 mt-5"
                />
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="d-flex align-center justify-end">
                <v-select
                  v-model="params.year"
                  :items="yearItems"
                  outlined
                  background-color="white"
                  dense
                  hide-details
                  class="mx-3 mx-md-6 mt-5"
                />
              </div>
            </v-tab-item>
          </v-tabs>
          <div class="d-flex align-center justify-end mb-auto" style="width: 100%;">
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
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PrintDialog',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    weeklyItems: [],
    monthItems: [],
    yearItems: [],
    details: {
      delivery_name: '',
      date_range: '',
      total_amount: 0,
      table_data: [
        { label: '配達料', value: 0 },
        { label: '長距離報酬', value: 0 },
        { label: '悪天候報酬', value: 0 },
        { label: '事業車両報酬', value: 0 },
        { label: '配達遅延によるキャンセル（ぺナルティー）', value: 0 }
      ]
    },
    params: {
      type: 0,
      delivery_uid: '',
      weekly: '',
      month: '',
      year: ''
    },
    filename: ''
  }),
  watch: {
    value: {
      deep: true,
      async handler (val) {
        if (val) {
          this.dialog = true
          this.params.delivery_uid = val.delivery_uid
          await this.fetchDetails()
        }
      }
    },
    params: {
      deep: true,
      async handler (val) {
        await this.fetchDetails()
      }
    }
  },
  created () {
    let startDate = ''
    let endDate = ''
    let startMonth = ''
    let startYear = ''
    for (let i = 1; i < 8; i++) {
      startDate = this.$moment().subtract(i, 'weeks').startOf('week').format('YYYY-MM-DD')
      endDate = this.$moment().subtract(i, 'weeks').endOf('week').format('YYYY-MM-DD')
      this.weeklyItems.push({
        text: `${this.$moment(startDate).format('YYYY/MM/DD')}~${this.$moment(endDate).format('MM/DD')}`,
        value: [startDate, endDate]
      })
    }
    for (let i = 0; i < 7; i++) {
      startMonth = this.$moment().subtract(i, 'months').format('YYYY-MM')
      this.monthItems.push({
        text: this.$moment(startMonth).format('YYYY/MM'),
        value: startMonth + '-01'
      })
    }
    for (let i = 0; i < 2; i++) {
      startYear = this.$moment().subtract(i, 'years').format('YYYY')
      this.yearItems.push({
        text: startYear,
        value: startYear + '-01-01'
      })
    }
    this.params.weekly = this.weeklyItems[0].value
    this.params.month = this.monthItems[0].value
    this.params.year = this.yearItems[0].value
    this.filename = '配達報酬明細表-' + this.$moment().unix()
  },
  methods: {
    ...mapActions('admin/deliveries', ['getDeliveryFeeDetails']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    },
    print () {
      this.$htmlToPaper('print')
    },
    download () {
      this.filename = '配達報酬明細表-' + this.$moment().unix()
      this.$refs.html2Pdf.downloadPdf()
    },
    async fetchDetails () {
      if (this.params.delivery_uid) {
        this.details = await this.getDeliveryFeeDetails({
          ...this.params
        })
      }
    }
  }
}
</script>
