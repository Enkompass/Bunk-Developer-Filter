<template>
  <div class="admin-top-shifts">
    <v-row>
      <v-col cols="12" md="6" sm="12" style="height: 100%;" class="d-flex flex-column align-stretch">
        <h3 class="font-weight-bold mt-auto">
          <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
          デリバー シフト登録状況
        </h3>
        <v-card height="100%" class="mt-3">
          <v-card-title>
            <div class="d-flex align-stretch">
              <h6>
                <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
                登録人数
              </h6>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-end black--text">
              <h1 class="h0 font-weight-bold">
                {{ deliveries.total | currency('') }}
              </h1>
              <h4>
                名
              </h4>
            </div>
            <div class="d-flex justify-center align-end secondary--text mt-3">
              <h4>
                先月比
              </h4>
              <h4 :class="{'secondary--text': deliveries.total - deliveries.prev > 0, 'error--text': deliveries.total - deliveries.prev <= 0}">
                {{ deliveries.total - deliveries.prev > 0 ? '+' : '' }}{{ (deliveries.total - deliveries.prev) | currency('名', false) }}
              </h4>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-card>
          <v-card-title class="mb-0 pb-0">
            <div class="d-flex align-center">
              <h6>
                <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
                曜日別
              </h6>
            </div>
          </v-card-title>
          <v-card-text class="pa-0" style="position:relative;">
            <div v-if="loaded" class="total text-center">
              <h6 class="grey--text h7">
                総登録日数
              </h6>
              <h3 class="font-weight-bold black--text">
                週{{ deliveries.weekSum | currency('日', false) }}
              </h3>
            </div>
            <top-chart v-if="loaded" :data="deliveries.weekly" />
            <div v-if="loaded" class="weekly">
              <div class="d-flex align-content-center flex-column">
                <div v-for="(item, index) in deliveries.weekly" :key="index" class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center mr-md-12 mr-8">
                    <v-badge
                      :color="colors[index]"
                      dot
                      inline
                    />
                    <h6>{{ item.name }}</h6>
                  </div>
                  <h6 class="font-weight-bold black--text">
                    {{ `${item.value}名` }}
                  </h6>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" offset-md="1" md="10" sm="12">
        <v-card :loading="!timelyLoaded">
          <v-card-title>
            <h6 class="font-weight-bold">
              <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
              時間帯別登録人数
            </h6>
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
                  height="30"
                  outlined
                  readonly
                  dense
                  hide-details
                  class="ml-md-3 ml-0 mt-3 mt-md-0"
                  v-bind="attrs"
                  style="max-width: 150px;"
                  v-on="on"
                />
              </template>
              <v-date-picker
                ref="picker"
                v-model="params.date"
                :max="new Date().toISOString().substr(0, 10)"
                no-title
                scrollable
                @input="menu = false"
              />
            </v-menu>
          </v-card-title>
          <v-card-text>
            <top-line-chart v-if="timelyLoaded" :data="timely" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TopChart from '~/components/admin/Chart/TopChart'
import TopLineChart from '~/components/admin/Chart/TopLineChart'
export default {
  name: 'Shifts',
  layout: 'admin',
  components: { TopLineChart, TopChart },
  data: () => ({
    loaded: false,
    timelyLoaded: false,
    colors: ['#0d7684', '#86bac1', '#9d931f', '#cec98f', '#0e1d3b', '#868e9d', '#e6e8eb'],
    menu: false,
    params: {
      date: null
    },
    deliveries: {
      weekly: [],
      total: 0,
      prev: 0,
      weekSum: 0
    },
    timely: {
      days: ['1', '2', '3', '4', '5', '6'],
      count: [2, 5, 12, 25, 45, 12, 14]
    }
  }),
  watch: {
    params: {
      deep: true,
      async handler (val) {
        this.timelyLoaded = false
        this.timely = await this.getTimelyData({
          ...val
        })
        this.timelyLoaded = true
      }
    }
  },
  async created () {
    this.loaded = false
    this.timelyLoaded = false
    this.deliveries = await this.getWeeklyData({
      $axios: this.$axios
    })
    this.params.date = this.$moment().format('YYYY-MM-DD')
    this.timely = await this.getTimelyData({
      ...this.params
    })
    this.loaded = true
    this.timelyLoaded = true
  },
  methods: {
    ...mapActions('admin/top', ['getWeeklyData', 'getTimelyData'])
  },
  head: () => ({
    title: 'デリバー シフト登録状況'
  })
}
</script>
