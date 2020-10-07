<template>
  <div class="admin-sales-manage">
    <div class="d-md-flex align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
        本部売上管理
      </h3>
      <div class="d-flex align-center">
        <v-btn
          :color="params.type === 'day' ? 'secondary' : 'grey'"
          text
          class="px-2 ml-0 ml-md-3 rounded-0"
          :class="{'border-active': params.type === 'day'}"
          :ripple="false"
          :width="$vuetify.breakpoint.mdAndUp ? 70 : '33%'"
          @click="params.type = 'day'"
        >
          <h4 :class="{'font-weight-bold': params.type === 'day'}">
            日別
          </h4>
        </v-btn>
        <v-btn
          :color="params.type === 'month' ? 'secondary' : 'grey'"
          text
          class="px-2 rounded-0"
          :ripple="false"
          :class="{'border-active': params.type === 'month'}"
          :width="$vuetify.breakpoint.mdAndUp ? 70 : '33%'"
          @click="params.type = 'month'"
        >
          <h4 :class="{'font-weight-bold': params.type === 'month'}">
            月別
          </h4>
        </v-btn>
        <v-btn
          :color="params.type === 'year' ? 'secondary' : 'grey'"
          text
          class="px-2 rounded-0"
          :ripple="false"
          :class="{'border-active': params.type === 'year'}"
          :width="$vuetify.breakpoint.mdAndUp ? 70 : '33%'"
          @click="params.type = 'year'"
        >
          <h4 :class="{'font-weight-bold': params.type === 'year'}">
            年別
          </h4>
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="params.date"
              background-color="white"
              outlined
              readonly
              dense
              hide-details
              class="ml-md-3 ml-0 mt-3 mt-md-0"
              v-bind="attrs"
              style="width: 150px;"
              v-on="on"
            >
              <template v-slot:append>
                <v-icon color="secondary">
                  mdi-chevron-down
                </v-icon>
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            ref="picker"
            v-model="params.date"
            :type="params.type === 'day' ? 'date' : 'month'"
            :max="new Date().toISOString().substr(0, 10)"
            no-title
            scrollable
            @input="menu = false"
          />
        </v-menu>
      </div>
    </div>
    <v-row class="mt-4">
      <v-col cols="12" md="6" sm="12">
        <v-card v-if="loaded" class="pa-0">
          <v-card-title class="pb-0">
            <h5>
              <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
              時間帯別売上
            </h5>
          </v-card-title>
          <v-card-text>
            <div class="total text-center">
              <h4>日別総売上</h4>
              <h3>{{ totalPrice | currency }}</h3>
            </div>
            <timely-chart v-if="loaded" :data="timelyData" />
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pr-0 pr-md-10">
                <template v-for="(item, index) in timelyData">
                  <div v-if="index < timelyData.length / 2" :key="index" class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-badge
                        :color="item.color"
                        dot
                        inline
                      />
                      <h6>{{ item.hour }}</h6>
                    </div>
                    <h6 class="font-weight-bold black--text">
                      {{ `${item.percentage}%` }}
                    </h6>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <template v-for="(item, index) in timelyData">
                  <div v-if="index >= timelyData.length / 2" :key="index" class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-badge
                        :color="item.color"
                        dot
                        inline
                      />
                      <h6>{{ item.hour }}</h6>
                    </div>
                    <h6 class="font-weight-bold black--text">
                      {{ `${item.percentage}%` }}
                    </h6>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="12">
        <v-card v-if="loaded" class="pa-0">
          <v-card-title class="pb-0">
            <h5>
              <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
              曜日別売上
            </h5>
          </v-card-title>
          <v-card-text>
            <div class="total text-center">
              <h4>曜日別売上</h4>
              <h3>{{ totalPrice | currency }}</h3>
            </div>
            <weekday-chart v-if="loaded" :data="weekdayData" />
            <v-row no-gutters>
              <v-col cols="12">
                <template v-for="(item, index) in weekdayData">
                  <div :key="index" class="d-flex align-center justify-space-around">
                    <div class="d-flex align-center">
                      <v-badge
                        :color="item.color"
                        dot
                        inline
                      />
                      <h6>{{ item.day }}</h6>
                    </div>
                    <h6 class="font-weight-bold black--text">
                      {{ `${item.percentage}%` }}
                    </h6>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="12">
        <v-card v-if="loaded" class="pa-0" height="100%">
          <v-card-title class="pb-0">
            <h5>
              <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
              利用方法別売上
            </h5>
          </v-card-title>
          <v-card-text>
            <div class="total text-center">
              <h4>利用方法別売上</h4>
              <h3>{{ totalPrice | currency }}</h3>
            </div>
            <method-by-chart v-if="loaded" :data="typeData" />
            <v-row no-gutters>
              <v-col cols="12">
                <template v-for="(item, index) in typeData">
                  <div :key="index" class="d-flex align-center justify-space-between mx-5 mx-md-10">
                    <div class="d-flex align-center">
                      <v-badge
                        :color="item.color"
                        dot
                        inline
                      />
                      <h6>{{ item.method }}</h6>
                    </div>
                    <h6 class="font-weight-bold black--text">
                      {{ `${item.percentage}%` }}
                    </h6>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.date="{ item }">
        <h6 v-if="params.type === 'day'">
          {{ item.date | dateFormat }}
        </h6>
        <h6 v-if="params.type === 'month'">
          {{ item.date | dateMonthFormat }}
        </h6>
        <h6 v-if="params.type === 'year'">
          {{ item.date | yearFormat }}
        </h6>
      </template>
      <template v-slot:item.customer_count="{ item }">
        <h6>{{ item.customer_count | currency('人', false) }}</h6>
      </template>
      <template v-slot:item.store_count="{ item }">
        <h6>{{ item.store_count | currency('店', false) }}</h6>
      </template>
      <template v-slot:item.deliver_count="{ item }">
        <h6>{{ item.deliver_count | currency('人', false) }}</h6>
      </template>
      <template v-slot:item.income="{ item }">
        <h6>{{ item.income | currency() }}</h6>
      </template>
      <template v-slot:item.order_count="{ item }">
        <h6>{{ item.order_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.coupon_use_count="{ item }">
        <h6>{{ item.coupon_use_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.cancel_count="{ item }">
        <h6>{{ item.cancel_count | currency('回', false) }}</h6>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TimelyChart from '~/components/admin/Chart/TimelyChart'
import WeekdayChart from '~/components/admin/Chart/WeekdayChart'
import MethodByChart from '~/components/admin/Chart/MethodByChart'

export default {
  name: 'SalesManage',
  components: { MethodByChart, WeekdayChart, TimelyChart },
  layout: 'admin',
  data: () => ({
    date: null,
    loaded: false,
    menu: false,
    totalPrice: 0,
    params: {
      type: 'day',
      date: null
    },
    headers: [
      { text: '日付', value: 'date', align: 'center', width: '120px' },
      { text: 'ユーザー数', value: 'customer_count', align: 'center', width: '120px' },
      { text: '加盟店舗数', value: 'store_count', align: 'center', width: '120px' },
      { text: 'デリバー数', value: 'deliver_count', align: 'center', width: '120px' },
      { text: '売上', value: 'income', align: 'center', width: '120px' },
      { text: '注文数', value: 'order_count', align: 'center', width: '120px' },
      { text: '初回利用者', value: 'first_time_user', align: 'center', width: '120px' },
      { text: 'クーポン使用', value: 'coupon_use_count', align: 'center', width: '120px' },
      { text: 'キャンセル数', value: 'cancel_count', align: 'center', width: '120px' }
    ],
    timelyData: [],
    weekdayData: [],
    typeData: [],
    items: []
  }),
  watch: {
    menu (val) {
      val && this.params.type === 'year' && setTimeout(() => {
        this.$refs.picker.activePicker = 'YEAR'
      })
    },
    'params.type': 'fetchData',
    'params.date': 'fetchData'
  },
  created () {
    this.params.date = this.$moment().format('YYYY-MM-DD')
    this.fetchData()
  },
  methods: {
    ...mapActions('admin/sales', ['getAdminSalesData']),
    async fetchData () {
      this.loaded = false
      const { timelyData, weekdayData, typeData, items, total } = await this.getAdminSalesData({
        $axios: this.$axios,
        params: this.params
      })
      this.timelyData = timelyData
      this.weekdayData = weekdayData
      this.typeData = typeData
      this.totalPrice = total
      this.items = items
      this.loaded = true
    }
  },
  head: () => ({
    title: '本部売上管理'
  })
}
</script>
