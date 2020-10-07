<template>
  <div class="store-top">
    <div v-if="getDelivering.length > 0" class="top-badge">
      <h6 class="text-center" style="cursor:pointer;" @click="gotoOrderDetails">
        現在デリバーが向かっています。注文内容を確認 »
      </h6>
    </div>
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-card height="100%">
          <v-card-title class="mb-3">
            <h2>{{ is_opened ? '現在営業中' : '現在準備中' }}</h2>
          </v-card-title>
          <v-divider />
          <v-card-subtitle>
            <h5>
              <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
              {{ business.date }} {{ $t('top.business_hours') }}
            </h5>
          </v-card-subtitle>
          <v-card-text>
            <h1 v-for="(item, index) in open_hours" :key="index">
              {{ item.indexOf('null') > -1 ? '' : item }}
            </h1>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="is_opened" block color="error" @click="stopReceiveOrder">
              受注ストップ
            </v-btn>
            <v-btn v-else block color="secondary" @click="startReceiveOrder">
              {{ $t('top.order_receive') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-card class="px-0 pb-0 orders" height="100%">
          <v-card-title class="justify-center mb-3">
            <h3 class="text-center">
              <font-awesome-icon :icon="['fas', 'utensils']" class="secondary--text" />
              {{ $t('top.today_reserve') }}
            </h3>
          </v-card-title>
          <v-divider />
          <v-card-text class="py-0 black--text">
            <v-row no-gutters>
              <v-col cols="6" sm="6" class="pa-5 pa-md-10 py-5 py-md-12 br-1-grey-fixed">
                <div class="d-flex flex-column justify-center align-center">
                  <h4 class="mb-3">
                    {{ $t('top.preorder') }}
                  </h4>
                  <div class="d-flex align-end my-4">
                    <h1 class="h0">
                      {{ today.book }}
                    </h1>
                    <h5>件</h5>
                  </div>
                  <v-btn block outlined color="secondary" to="/store/order_manage">
                    {{ $t('top.goto_order_details') }}
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="6" sm="6" class="pa-5 pa-md-10 py-5 py-md-12">
                <div class="d-flex flex-column justify-center align-center">
                  <h4 class="mb-3">
                    {{ $t('top.takeout') }}
                  </h4>
                  <div class="d-flex align-end my-4">
                    <h1 class="h0">
                      {{ today.takeout }}
                    </h1>
                    <h5>件</h5>
                  </div>
                  <v-btn block outlined color="secondary" to="/store/order_manage">
                    {{ $t('top.goto_order_details') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-card height="100%">
          <v-row class="px-4">
            <v-col cols="5" sm="5">
              <h6>
                <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
                {{ $t('top.today_business_hours') }}
              </h6>
            </v-col>
            <v-col cols="7" sm="7" class="text-right text-md-left">
              <h5 v-for="(item, index) in open_hours" :key="index">
                {{ item.indexOf('null') > -1 ? '' : item }}
              </h5>
            </v-col>
          </v-row>
          <v-divider />
          <v-row class="px-4">
            <v-col cols="4" sm="5">
              <h6>
                <font-awesome-icon :icon="['fas', 'store']" class="secondary--text" />
                {{ $t('top.store_name') }}
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right text-md-left">
              <h5>
                {{ name }}
              </h5>
            </v-col>
          </v-row>
          <v-divider />
          <v-row class="px-4">
            <v-col cols="4" sm="5">
              <h6>
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="secondary--text" />
                {{ $t('top.address') }}
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right text-md-left">
              <h5>
                {{ address }}
              </h5>
            </v-col>
          </v-row>
          <v-divider />
          <v-row class="px-4">
            <v-col cols="4" sm="5">
              <h6>
                <font-awesome-icon :icon="['fas', 'phone-alt']" class="secondary--text" />
                TEL
              </h6>
            </v-col>
            <v-col cols="8" sm="7" class="text-right text-md-left">
              <h5>
                {{ telephone | formatPhoneNumber }}(固定)
              </h5>
              <h5>
                {{ mobile_phone | formatPhoneNumber }}(携帯)
              </h5>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-card class="pa-0" height="100%">
          <v-date-picker
            v-model="picker"
            full-width
            no-title
            color="secondary"
            locale="ja"
            first-day-of-week="1"
            :day-format="getDay"
            :min="$moment().format('YYYY-MM-DD')"
            :max="picker_max_date"
            :picker-date.sync="pickerDate"
            @click:date="clickDate"
          />
          <v-overlay
            :value="overlay"
            absolute
          >
            <v-card light class="pa-4" max-width="360">
              <v-card-title class="pa-0">
                <v-row no-gutters justify="space-around" align="center">
                  <h6 class="font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
                    {{ editedItem.title }}
                  </h6>
                  <v-spacer />
                  <div class="d-flex">
                    <v-btn text small outlined @click="overlay = false">
                      {{ $t('common.cancel') }}
                    </v-btn>
                    <v-btn
                      text
                      small
                      outlined
                      color="secondary"
                      class="ml-2"
                      @click="saveHours"
                    >
                      {{ $t('common.save') }}
                    </v-btn>
                  </div>
                </v-row>
              </v-card-title>
              <v-card-subtitle class="px-0 py-4">
                <h6 class="h7">
                  {{ $t('top.time_insert_warning') }}
                </h6>
              </v-card-subtitle>
              <v-card-text class="px-0 pb-3">
                <v-row no-gutters>
                  <v-col cols="12" sm="6" class="pr-2">
                    <h6 class="h7">
                      {{ $t('top.lunch_time') }}
                    </h6>
                    <div class="d-flex align-center">
                      <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="editedItem.lunch_start_time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.lunch_start_time"
                            placeholder="00:00"
                            readonly
                            outlined
                            dense
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="menu1"
                          v-model="editedItem.lunch_start_time"
                          full-width
                          format="24hr"
                          @click:minute="$refs.menu1.save(editedItem.lunch_start_time)"
                        />
                      </v-menu>
                      <h6> ~ </h6>
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="editedItem.lunch_end_time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.lunch_end_time"
                            placeholder="00:00"
                            readonly
                            outlined
                            dense
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="menu2"
                          v-model="editedItem.lunch_end_time"
                          full-width
                          format="24hr"
                          @click:minute="$refs.menu2.save(editedItem.lunch_end_time)"
                        />
                      </v-menu>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6" class="pl-2">
                    <h6 class="h7">
                      {{ $t('top.dinner_time') }}
                    </h6>
                    <div class="d-flex align-center">
                      <v-menu
                        ref="menu3"
                        v-model="menu3"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="editedItem.dinner_start_time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.dinner_start_time"
                            placeholder="00:00"
                            readonly
                            outlined
                            dense
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="menu3"
                          v-model="editedItem.dinner_start_time"
                          full-width
                          format="24hr"
                          @click:minute="$refs.menu3.save(editedItem.dinner_start_time)"
                        />
                      </v-menu>
                      <h6> ~ </h6>
                      <v-menu
                        ref="menu4"
                        v-model="menu4"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="editedItem.dinner_end_time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.dinner_end_time"
                            placeholder="00:00"
                            readonly
                            outlined
                            dense
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="menu4"
                          v-model="editedItem.dinner_end_time"
                          full-width
                          format="24hr"
                          @click:minute="$refs.menu4.save(editedItem.dinner_end_time)"
                        />
                      </v-menu>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  middleware: ['auth', 'isStore'],
  data: () => ({
    name: '',
    address: '',
    telephone: '',
    mobile_phone: '',
    business: {
      date: '',
      time: ['10:00 - 14:00', '17:00 - 21:00']
    },
    today: {
      book: 0,
      takeout: 0
    },
    editedItem: {
      lunch_start_time: null,
      lunch_end_time: null,
      dinner_start_time: null,
      dinner_end_time: null,
      title: '',
      date: ''
    },
    picker: null,
    picker_max_date: null,
    pickerDate: null,
    overlay: false,
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    time: null,
    dialog_date: '',
    weekdays: null,
    arrayEvents: null
  }),
  computed: {
    ...mapGetters(['is_opened', 'open_hours']),
    ...mapGetters('store/badge', ['getOrderBadge', 'getCouponCount', 'getDelivering'])
  },
  watch: {
    pickerDate (val) {
      setTimeout(() => {
        this.setColor(this.$moment(val).format('MM'))
      }, 300)
    }
  },
  async created () {
    this.business.date = this.$moment().format('YYYY/MM/DD')
    this.picker = this.$moment().format('YYYY-MM-DD')
    this.picker_max_date = this.$moment().add(2, 'months').endOf('months').add(1, 'days').format('YYYY-MM-DD')
    this.weekdays = this.$auth.$state.user.user.weekdays.map((item, index) => {
      if (item !== '1') {
        return index.toString()
      }
    }).filter(item => item !== undefined)
    const dates = this.enumerateDaysBetweenDates(this.picker, this.picker_max_date)
    this.arrayEvents = dates.map((date) => {
      const weekday = this.$moment(date).weekday()
      if (this.weekdays.includes((weekday % 7).toString())) {
        return this.$moment(date).format('YYYY-MM-DD')
      }
    })
    this.name = this.$auth.$state.user.user.name
    this.address = this.$auth.$state.user.user.address
    this.telephone = this.$auth.$state.user.user.telephone
    this.mobile_phone = this.$auth.$state.user.user.mobile_phone
    await this.fetchData()
  },
  async mounted () {
    await this.loadStoreBadge()
    await this.$auth.fetchUser()
    this.setColor(this.$moment().format('MM'))
  },
  methods: {
    ...mapActions('store/badge', ['loadStoreBadge']),
    ...mapActions('store/top', ['getTodayOrders', 'getBusinessHours', 'saveBusinessHours', 'startReceive', 'stopReceive']),
    async fetchData () {
      const orders = await this.getTodayOrders({
        $axios: this.$axios
      })
      this.today.book = orders.book_count
      this.today.takeout = orders.takeout_count
    },
    async getHours (date) {
      const hours = await this.getBusinessHours({
        $axios: this.$axios,
        params: {
          date
        }
      })
      this.editedItem.lunch_start_time = hours.lunch_start_time
      this.editedItem.lunch_end_time = hours.lunch_end_time
      this.editedItem.dinner_start_time = hours.dinner_start_time
      this.editedItem.dinner_end_time = hours.dinner_end_time
    },
    async saveHours () {
      await this.saveBusinessHours({
        $axios: this.$axios,
        params: this.editedItem
      })
      await this.$auth.fetchUser()
      this.overlay = false
    },
    async startReceiveOrder () {
      await this.startReceive({
        $axios: this.$axios
      })
      await this.$auth.fetchUser()
    },
    async stopReceiveOrder () {
      await this.stopReceive({
        $axios: this.$axios
      })
      await this.$auth.fetchUser()
    },
    enumerateDaysBetweenDates (startDate, endDate) {
      const dates = []
      const currDate = this.$moment(startDate).startOf('day')
      const lastDate = this.$moment(endDate).startOf('day')
      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate())
      }
      return dates
    },
    async clickDate (date) {
      this.editedItem.date = date
      this.editedItem.title = `${this.$moment(date).format('MM/DD')} の営業時間`
      this.overlay = true
      await this.getHours(date)
    },
    getDay (date) {
      return this.$moment(date).format('DD')
    },
    setColor (month) {
      const allDates = document.querySelectorAll('.v-date-picker-table .v-btn .v-btn__content')
      const dates = this.arrayEvents
        .filter(item => item !== undefined)
        .filter(item => this.$moment(item).format('MM') === month)
        .map(x => parseInt(x.split('-')[2]))
      allDates.forEach((x, i) => {
        if (dates.includes(parseInt(x.innerHTML))) {
          allDates[i].classList.add('date-color')
        } else {
          allDates[i].classList.remove('date-color')
        }
      })
    },
    gotoOrderDetails () {
      this.$router.push('/store/order_manage')
    }
  },
  head: () => ({
    title: 'HOME'
  })
}
</script>
