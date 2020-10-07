<template>
  <div class="store-business-hours">
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
        営業時間の編集
      </h3>
      <v-btn
        color="secondary"
        width="120"
        height="40"
        class="mt-2 mt-md-0"
        :block="$vuetify.breakpoint.xs"
        @click="save"
      >
        保存
      </v-btn>
    </div>
    <h6 class="mt-3" aria-label="You can register and modify business hours (order start ~ last order).">
      営業時間（注文開始～ラストオーダー）の登録・修正できます。
    </h6>
    <v-row no-gutters class="mt-3">
      <v-col cols="12" md="6" sm="12" class="pr-0 pr-md-12">
        <v-card class="pa-0">
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
          />
        </v-card>

        <div class="d-flex align-center mt-5">
          <font-awesome-icon :icon="['fas', 'calendar']" class="secondary--text" />
          <h6 class="font-weight-bold ml-1" aria-label="Regular holiday">
            定休日
          </h6>
        </div>
        <h6 class="h7 grey--text mt-1" aria-label="*Please select and set the date of calendar for unfixed holidays and individual holidays.">
          ※不定休や個別の休日は、カレンダーの日付を選び設定してください。
        </h6>
        <v-chip-group
          v-model="editedItem.weekday"
          multiple
          column
          active-class="secondary--text"
        >
          <v-chip
            v-for="(item, index) in weekdayItems"
            :key="index"
            :ripple="false"
            :value="item.value"
            color="#f2f2f2"
            text-color="black"
            pill
            class="pl-0 pr-0 pr-md-2 mr-1 mr-md-2"
          >
            <v-icon color="grey">
              mdi-check-circle
            </v-icon>
            <h5>{{ item.text }}</h5>
          </v-chip>
        </v-chip-group>

        <div class="d-flex align-center mt-5">
          <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" />
          <h6 class="font-weight-bold ml-1" aria-label="Base business hours">
            基本営業時間
          </h6>
        </div>
        <h6 class="h7 grey--text mt-1" aria-label="*Please enter only lunch time if you want to continue.">
          ※通しの場合はランチタイムのみ記入してください。
        </h6>
        <h6 class="h7 grey--text" aria-label="※ In case of unfixed time, please select the date of the calendar and set it individually.">
          ※不定時間の場合は、カレンダーの日付を選び個別に設定してください。
        </h6>
        <v-row no-gutters class="my-4">
          <v-col cols="6" sm="6" class="pr-2">
            <h6>{{ $t('top.lunch_time') }}</h6>
            <div class="d-flex align-center">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="menuItem.lunch_start_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="menuItem.lunch_start_time"
                    background-color="white"
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
                  v-model="menuItem.lunch_start_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu1.save(menuItem.lunch_start_time)"
                />
              </v-menu>
              <h6 class="mx-2">
                ~
              </h6>
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="menuItem.lunch_end_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="menuItem.lunch_end_time"
                    background-color="white"
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
                  v-model="menuItem.lunch_end_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu2.save(menuItem.lunch_end_time)"
                />
              </v-menu>
            </div>
          </v-col>
          <v-col cols="6" sm="6" class="pl-2">
            <h6>{{ $t('top.dinner_time') }}</h6>
            <div class="d-flex align-center">
              <v-menu
                ref="menu3"
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="menuItem.dinner_start_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="menuItem.dinner_start_time"
                    background-color="white"
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
                  v-model="menuItem.dinner_start_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu3.save(menuItem.dinner_start_time)"
                />
              </v-menu>
              <h6 class="mx-2">
                ~
              </h6>
              <v-menu
                ref="menu4"
                v-model="menu4"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="menuItem.dinner_end_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="menuItem.dinner_end_time"
                    background-color="white"
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
                  v-model="menuItem.dinner_end_time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu4.save(menuItem.dinner_end_time)"
                />
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-data-table
          :headers="headers"
          :items="items"
          hide-default-footer
          disable-pagination
          mobile-breakpoint="0"
          class="elevation-0 rounded-lg"
        >
          <template v-slot:item.date="{ item }">
            <h6 :class="item.regular ? 'grey--text' : 'black--text'">
              {{ item.date }}
            </h6>
          </template>
          <template v-slot:item.lunch="{ item }">
            <v-edit-dialog
              large
              cancel-text="キャンセル"
              save-text="保存"
              @save="dialogSave(item.hours, 'lunch', item.dates)"
            >
              <h6 v-if="item.hours.lunch_start_time" :class="item.regular ? 'grey--text' : 'black--text'">
                {{ `${item.hours.lunch_start_time} ~ ${item.hours.lunch_end_time}` }}
              </h6>
              <h6 v-else :class="item.regular ? 'grey--text' : 'black--text'">
                -
              </h6>
              <template v-slot:input>
                <v-row justify="space-around" align="center" class="timepicker-dialog">
                  <v-col style="width: 200px; flex: 0 1 auto;">
                    <v-time-picker v-model="item.hours.lunch_start_time" :max="item.hours.lunch_end_time" width="175" format="24hr" />
                  </v-col>
                  <v-col style="width: 200px; flex: 0 1 auto;">
                    <v-time-picker v-model="item.hours.lunch_end_time" :min="item.hours.lunch_start_time" width="175" format="24hr" />
                  </v-col>
                </v-row>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.dinner="{ item }">
            <v-edit-dialog
              large
              cancel-text="キャンセル"
              save-text="保存"
              @save="dialogSave(item.hours, 'dinner', item.dates)"
            >
              <h6 v-if="item.hours.dinner_start_time" :class="item.regular ? 'grey--text' : 'black--text'">
                {{ `${item.hours.dinner_start_time} ~ ${item.hours.dinner_end_time}` }}
              </h6>
              <h6 v-else :class="item.regular ? 'grey--text' : 'black--text'">
                -
              </h6>
              <template v-slot:input>
                <v-row justify="space-around" align="center" class="timepicker-dialog">
                  <v-col style="width: 200px; flex: 0 1 auto;">
                    <v-time-picker v-model="item.hours.dinner_start_time" :max="item.hours.dinner_end_time" width="175" format="24hr" />
                  </v-col>
                  <v-col style="width: 200px; flex: 0 1 auto;">
                    <v-time-picker v-model="item.hours.dinner_end_time" :min="item.hours.dinner_start_time" width="175" format="24hr" />
                  </v-col>
                </v-row>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.regular="{ item }">
            <v-icon :color="item.regular ? 'error' : 'grey'" @click="saveAsHoliday(item)">
              mdi-check-circle
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'BusinessHours',
  middleware: 'check-before-move',
  data: () => ({
    arrayEvents: null,
    picker: null,
    picker_max_date: null,
    pickerDate: null,
    editedItem: {
      weekday: []
    },
    weekdayItems: [
      { text: '月', value: '1' },
      { text: '火', value: '2' },
      { text: '水', value: '3' },
      { text: '木', value: '4' },
      { text: '金', value: '5' },
      { text: '土', value: '6' },
      { text: '日', value: '0' }
    ],
    menuItem: {
      lunch_start_time: null,
      lunch_end_time: null,
      dinner_start_time: null,
      dinner_end_time: null
    },
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    headers: [
      { text: '日付', value: 'date', align: 'center' },
      { text: 'ランチタイム', value: 'lunch', align: 'center' },
      { text: 'ディナータイム', value: 'dinner', align: 'center' },
      { text: '定休日', value: 'regular', align: 'center' }
    ],
    items: []
  }),
  watch: {
    picker: 'fetchData',
    pickerDate (val) {
      setTimeout(() => {
        this.setColor(this.$moment(val).format('MM'))
      }, 300)
    },
    'editedItem.weekday' () {
      this.setColor(this.$moment(this.pickerDate).format('MM'))
    },
    editedItem: {
      deep: true,
      handler () {
        const tempWeekday = this.$auth.$state.user.user.weekdays.map((item, index) => {
          if (item !== '1') {
            return index.toString()
          }
        }).filter(item => item !== undefined)
        if (JSON.stringify(tempWeekday) !== JSON.stringify(this.editedItem.weekday)) {
          this.setModalShow(false)
        }
      }
    },
    menuItem: {
      deep: true,
      handler () {
        const temp = {}
        const business = JSON.parse(this.$auth.$state.user.user.business_hours)
        const weekday = this.$moment().weekday()
        if (business[weekday % 7].length === 2) {
          temp.lunch_start_time = business[weekday % 7][0]
          temp.lunch_end_time = business[weekday % 7][1]
        }
        if (business[weekday % 7].length === 4) {
          temp.lunch_start_time = business[weekday % 7][0]
          temp.lunch_end_time = business[weekday % 7][1]
          temp.dinner_start_time = business[weekday % 7][2]
          temp.dinner_end_time = business[weekday % 7][3]
        }
        if (JSON.stringify(temp) !== JSON.stringify(this.menuItem)) {
          this.setModalShow(false)
        }
      }
    }
  },
  created () {
    this.picker = this.$moment().format('YYYY-MM-DD')
    this.picker_max_date = this.$moment().add(2, 'months').endOf('months').add(1, 'days').format('YYYY-MM-DD')
    this.editedItem.weekday = this.$auth.$state.user.user.weekdays.map((item, index) => {
      if (item !== '1') {
        return index.toString()
      }
    }).filter(item => item !== undefined)
    const business = JSON.parse(this.$auth.$state.user.user.business_hours)
    const weekday = this.$moment().weekday()
    if (business[weekday % 7].length === 2) {
      this.menuItem.lunch_start_time = business[weekday % 7][0]
      this.menuItem.lunch_end_time = business[weekday % 7][1]
    }
    if (business[weekday % 7].length === 4) {
      this.menuItem.lunch_start_time = business[weekday % 7][0]
      this.menuItem.lunch_end_time = business[weekday % 7][1]
      this.menuItem.dinner_start_time = business[weekday % 7][2]
      this.menuItem.dinner_end_time = business[weekday % 7][3]
    }
  },
  mounted () {
    this.setColor(this.$moment().format('MM'))
    this.fetchData()
  },
  methods: {
    ...mapActions(['setModalShow']),
    ...mapActions('store/business', ['saveBusinessHours', 'getBusinessMonth', 'saveBusinessHourByType', 'saveHoliday']),
    enumerateDaysBetweenDates (startDate, endDate) {
      const dates = []
      const currDate = this.$moment(startDate).startOf('day')
      const lastDate = this.$moment(endDate).startOf('day')
      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate())
      }
      return dates
    },
    getDay (date) {
      return this.$moment(date).format('D')
    },
    async save () {
      await this.saveBusinessHours({
        $axios: this.$axios,
        params: {
          weekday: this.editedItem.weekday,
          hours: this.menuItem
        }
      })
      await this.$auth.fetchUser()
      await this.fetchData()
      this.setModalShow(true)
    },
    setColor (month) {
      const dates = this.enumerateDaysBetweenDates(this.picker, this.picker_max_date)
      this.arrayEvents = dates.map((date) => {
        const weekday = this.$moment(date).weekday()
        if (this.editedItem.weekday.includes((weekday % 7).toString())) {
          return this.$moment(date).format('YYYY-MM-DD')
        }
      })
      const allDates = document.querySelectorAll('.v-date-picker-table .v-btn .v-btn__content')
      const filterDates = this.arrayEvents
        .filter(item => item !== undefined)
        .filter(item => this.$moment(item).format('MM') === month)
        .map(x => parseInt(x.split('-')[2]))
      allDates.forEach((x, i) => {
        if (filterDates.includes(parseInt(x.innerHTML))) {
          allDates[i].classList.add('date-color')
        } else {
          allDates[i].classList.remove('date-color')
        }
      })
    },
    async fetchData () {
      this.items = await this.getBusinessMonth({
        $axios: this.$axios,
        params: {
          date: this.picker || this.$moment().format('YYYY-MM-DD')
        }
      })
    },
    async dialogSave (val, type, date) {
      await this.saveBusinessHourByType({
        $axios: this.$axios,
        params: {
          type,
          date,
          time: val
        }
      })
      await this.fetchData()
    },
    async saveAsHoliday (val) {
      await this.saveHoliday(val)
      await this.fetchData()
    }
  },
  head: () => ({
    title: '営業時間の編集'
  })
}
</script>
