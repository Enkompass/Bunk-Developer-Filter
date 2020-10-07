<template>
  <v-dialog
    v-model="dialog"
    content-class="print-dialog"
    fullscreen
    hide-overlay
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
                    月別明細表
                  </h2>
                  <div style="padding: 45px;">
                    <h6 style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">
                      <span style="border-bottom: 2px solid black;">
                        {{ $auth.$state.user.user.name }}
                      </span>
                    </h6>
                    <h6 style="font-size: 14px; margin-bottom: 5px;">
                      {{ details.date }}
                    </h6>
                    <div style="margin-bottom: 45px;">
                      <span style="border-bottom: 2px solid black;">
                        <span style="font-size: 20px; font-weight: bold;">
                          ご入金金額
                        </span>
                        <span style="font-size: 20px; font-weight: bold; margin-left: 60px;">{{ details.total | currency }} -</span>
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
                            {{ details.total | currency }}
                          </td>
                        </tr>
                        <tr style="height: 28px;">
                          <td style="width: 30%; border: none;" />
                          <td style="width: 40%; text-align: left; padding-left: 8px; border: solid 1px #b5b5b5;">
                            消費税(内税10%)
                          </td>
                          <td style="text-align: right; padding-right: 8px; border: solid 1px #b5b5b5;">
                            {{ details.total * 0.1 | currency }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table style="border-collapse: collapse; width: 100%; margin-bottom: 25px;">
                      <thead>
                        <tr style="border: solid 1px #b5b5b5;">
                          <th style="width: 70%; height: 28px; background-color: #f2f2f2;" colspan="2">
                            内容
                          </th>
                          <th style="width: 30%; height: 28px; background-color: #f2f2f2;">
                            回数
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in details.subtable_data" :key="index" style="border: solid 1px #b5b5b5; height: 28px;">
                          <td style="text-align: left; padding-left: 8px;" colspan="2">
                            {{ item.label }}
                          </td>
                          <td style="text-align: right; padding-right: 8px;">
                            {{ item.value >= 0 ? '' : '-' }}{{ item.value | currency('回', false) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </vue-html2pdf>
        </v-col>
        <v-col cols="12" md="3" sm="12" class="d-flex flex-column align-end">
          <v-select
            v-model="params.month"
            :items="monthItems"
            outlined
            background-color="white"
            dense
            hide-details
            class="mx-3 mx-md-6 mt-5"
          />
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SalesStatement',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  async fetch () {
    this.details = await this.loadMonthlySalesStatement({
      ...this.params
    })
  },
  data: () => ({
    dialog: false,
    monthItems: [],
    params: {
      month: ''
    },
    details: {
      date: '2020/12分',
      total: 78150,
      table_data: [],
      subtable_data: []
    }
  }),
  computed: {
    ...mapGetters('store/downloads', ['getSalesStatement']),
    filename () {
      return '月別明細表 - ' + this.$moment().unix()
    }
  },
  watch: {
    'params.month': '$fetch',
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.dialog = true
          this.$fetch()
        }
      }
    }
  },
  created () {
    let startMonth = ''
    for (let i = 0; i < 7; i++) {
      startMonth = this.$moment().subtract(i, 'months').format('YYYY-MM')
      this.monthItems.push({
        text: this.$moment(startMonth).format('YYYY/MM'),
        value: startMonth + '-01'
      })
    }
    this.params.month = this.$moment().format('YYYY-MM') + '-01'
  },
  methods: {
    ...mapActions('store/downloads', ['loadMonthlySalesStatement']),
    onClose () {
      this.dialog = false
      this.$emit('input', false)
    },
    print () {
      this.$htmlToPaper('print')
    },
    download () {
      this.filename = '月別明細表 - ' + this.$moment().unix()
      this.$refs.html2Pdf.downloadPdf()
    }
  }
}
</script>
