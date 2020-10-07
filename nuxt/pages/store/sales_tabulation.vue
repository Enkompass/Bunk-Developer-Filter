<template>
  <div class="store-sales-tabulation">
    <div class="d-flex justify-space-between align-start">
      <div class="d-sm-flex">
        <h3 class="font-weight-bold">
          <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
          売上集計
        </h3>
        <div class="d-flex align-center">
          <v-btn
            :color="type === 'prev_month' ? 'secondary' : 'grey'"
            text
            class="tabbtn px-2 ml-0 ml-md-3 rounded-0"
            :class="{'border-active': type === 'prev_month'}"
            :ripple="false"
            :width="$vuetify.breakpoint.mdAndUp ? 70 : '50%'"
            @click="type = 'prev_month'"
          >
            <h4>
              先月
            </h4>
          </v-btn>
          <v-btn
            :color="type === 'this_month' ? 'secondary' : 'grey'"
            text
            class="tabbtn ml-2 px-2 rounded-0"
            :ripple="false"
            :class="{'border-active': type === 'this_month'}"
            :width="$vuetify.breakpoint.mdAndUp ? 70 : '50%'"
            @click="type = 'this_month'"
          >
            <h4>
              今月
            </h4>
          </v-btn>
        </div>
      </div>
      <v-btn
        color="secondary"
        width="120"
        :height="$vuetify.breakpoint.mdAndUp ? 40 : 30"
        aria-label="Print"
        @click="print"
      >
        印刷
      </v-btn>
    </div>
    <div id="printable" ref="printable">
      <v-row no-gutters class="mt-4">
        <v-col cols="12" md="6" sm="12" class="pr-0 pr-md-12 mb-5 mb-md-0">
          <v-card class="pa-0">
            <v-card-title>
              <div class="d-flex align-center">
                <h6>
                  <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text mr-1" />
                  月間総売上
                </h6>
              </div>
            </v-card-title>
            <v-card-text>
              <h1 class="h0 text-center black--text">
                {{ sales.total_price | currency }}
              </h1>
              <h4 class="text-center mt-4 mb-6" :class="{'secondary--text': sales.total_price - sales.prev_price > 0, 'error--text': sales.total_price - sales.prev_price <= 0}">
                先月比{{ (sales.total_price - sales.prev_price > 0 ? '+' : '') + (sales.total_price - sales.prev_price) }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-card class="pa-0">
            <v-card-title>
              <div class="d-flex align-center">
                <h6>
                  <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text mr-1" />
                  月間総受注件数
                </h6>
              </div>
            </v-card-title>
            <v-card-text>
              <h1 class="h0 text-center black--text">
                {{ sales.total_orders | currency('件', false) }}
              </h1>
              <h4 class="text-center mt-4 mb-6" :class="{'secondary--text': sales.total_orders - sales.prev_orders > 0, 'error--text': sales.total_orders - sales.prev_orders <= 0}">
                先月比{{ (sales.total_orders - sales.prev_orders > 0 ? '+' : '') + (sales.total_orders - sales.prev_orders) }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="pa-0 mt-5" :loading="!loaded">
        <v-card-title class="align-center justify-space-between">
          <h6>
            <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
            日別売上と受注件数
          </h6>
          <div class="d-flex align-center">
            <div class="d-flex align-center">
              <span class="secondary mr-2" style="width: 10px; height: 10px; border-radius: 50%;" />
              <h6 class="secondary--text">
                売上(円)
              </h6>
            </div>
            <div class="d-flex align-center ml-2">
              <span class="primary mr-2" style="width: 10px; height: 10px; border-radius: 50%;" />
              <h6 class="primary--text">
                受注件数
              </h6>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <mix-chart v-if="loaded" :data="sales.dailyData" />
        </v-card-text>
      </v-card>

      <v-row no-gutters class="mt-5">
        <v-col cols="12" sm="12" md="6" class="pr-0 pr-md-12">
          <v-card class="pa-0" :loading="!loaded">
            <v-card-title>
              <div class="d-flex align-center">
                <h6>
                  <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
                  曜日別売上
                </h6>
              </div>
            </v-card-title>
            <v-card-text>
              <div v-if="loaded" class="total text-center">
                <h6 class="grey--text h7">
                  総売上
                </h6>
                <h3 class="font-weight-bold black--text">
                  {{ sales.weeklyData.total_price | currency }}
                </h3>
              </div>
              <week-chart v-if="loaded" :data="sales.weeklyData" />
              <div v-if="loaded" class="weekly">
                <div class="d-flex align-content-center flex-column">
                  <div v-for="(item, index) in sales.weeklyData.data" :key="index" class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center mr-md-8 mr-5">
                      <v-badge
                        :color="colors[index]"
                        dot
                        inline
                      />
                      <h6>{{ item.label }}</h6>
                    </div>
                    <h6 class="font-weight-bold black--text">
                      {{ `${item.percentage}%` }}
                    </h6>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6" class="mt-5 mt-md-0">
          <v-card class="pa-0" :loading="!loaded">
            <v-card-title>
              <div class="d-flex align-center">
                <h6>
                  <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
                  時間帯別売上
                </h6>
              </div>
            </v-card-title>
            <v-card-text>
              <div v-if="loaded" class="total text-center">
                <h6 class="grey--text h7">
                  総売上
                </h6>
                <h3 class="font-weight-bold black--text">
                  {{ sales.timelyData.total | currency }}
                </h3>
              </div>
              <time-chart v-if="loaded" :data="sales.timelyData" />
              <div v-if="loaded" class="weekly">
                <div class="d-flex align-content-center flex-column">
                  <div v-for="(item, index) in sales.timelyData.data" :key="index" class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center mr-md-8 mr-5">
                      <v-badge
                        :color="timeColors[index]"
                        dot
                        inline
                      />
                      <h6>{{ item.label }}</h6>
                    </div>
                    <h6 class="font-weight-bold black--text">
                      {{ `${item.percentage}%` }}
                    </h6>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="d-none">
      <span>asdfasdfasdf</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MixChart from '~/components/store/Chart/MixChart'
import TimeChart from '~/components/store/Chart/TimeChart'
import WeekChart from '~/components/store/Chart/WeekChart'

export default {
  name: 'SalesTabulation',
  components: { WeekChart, TimeChart, MixChart },
  data: () => ({
    type: 'this_month',
    loaded: false,
    colors: ['#0d7684', '#86bac1', '#9d931f', '#cec98f', '#0e1d3b', '#868e9d', '#e6e8eb'],
    timeColors: ['#0d7684', '#9d931f', '#0e1d3b', '#868e9d'],
    sales: {
      prev_price: 0,
      prev_orders: 0,
      total_price: 0,
      total_orders: 0,
      dailyData: {
        days: ['1', '2', '3', 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        price: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        order_count: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      },
      weeklyData: {},
      timelyData: {}
    }
  }),
  watch: {
    type: 'fetchData'
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions('store/sales', ['getStoreSalesData']),
    async fetchData () {
      this.loaded = false
      this.sales = await this.getStoreSalesData({
        $axios: this.$axios,
        params: {
          type: this.type
        }
      })
      this.loaded = true
    },
    print () {
      window.print()
    }
  },
  head: () => ({
    title: '売上集計'
  })
}
</script>
