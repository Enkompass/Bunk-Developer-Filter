<template>
  <div class="admin-deliveries">
    <div class="d-md-flex justify-start align-center">
      <h3>
        <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
        顧客情報管理-デリバー
      </h3>
      <v-select
        v-model="params.filter"
        :items="filterItems"
        background-color="white"
        outlined
        dense
        hide-details
        class="ml-0 ml-md-5 mt-3 mt-md-0"
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="getDeliveryRows"
      :server-items-length="getDeliveryCount"
      :loading="getDeliveryLoading"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.contact_date="{ item }">
        <div class="d-flex">
          <h6>{{ item.contact_date | dateFormat }}</h6>
          <v-badge
            v-if="(item.is_verified === false && item.is_delete === false) || (item.is_updated === true)"
            content="1"
            value="1"
            color="error"
            inline
          />
        </div>
      </template>
      <template v-slot:item.delivery_uid="{ item }">
        <h6>{{ item.delivery_uid }}</h6>
      </template>
      <template v-slot:item.name="{ item }">
        <h6>{{ `${item.first_name} ${item.last_name}` }}</h6>
      </template>
      <template v-slot:item.address="{ item }">
        <div class="d-flex align-center">
          <h6>{{ item.address }}</h6>
          <v-menu transition="slide-reverse-x-transition" bottom left>
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="secondary--text"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-card class="pa-0" style="border-radius: 5px !important;">
              <!--<v-card-text class="black&#45;&#45;text">
              </v-card-text>-->
            </v-card>
          </v-menu>
        </div>
      </template>
      <template v-slot:item.phone="{ item }">
        <h6>{{ item.phone | formatPhoneNumber }}</h6>
      </template>
      <template v-slot:item.vehicle_type="{ item }">
        <h6>{{ typesItem[item.vehicle_type] ? typesItem[item.vehicle_type] : item.vehicle_type }}</h6>
      </template>
      <template v-slot:item.document_image="{ item }">
        <v-btn text color="secondary" @click="editedItem = item">
          書類画像
        </v-btn>
      </template>
      <template v-slot:item.insurance_valid_date="{ item }">
        <h6 v-if="item.insurance_valid_date">
          {{ item.insurance_valid_date | dateFormat }}
        </h6>
        <h6 v-else class="grey--text">
          入力…
        </h6>
      </template>
      <template v-slot:item.voluntary_expire_date="{ item }">
        <h6 v-if="item.voluntary_expire_date">
          {{ item.voluntary_expire_date | dateFormat }}
        </h6>
        <h6 v-else class="grey--text">
          入力…
        </h6>
      </template>
      <template v-slot:item.license_expire_date="{ item }">
        <h6 v-if="item.license_expire_date">
          {{ item.license_expire_date | dateFormat }}
        </h6>
        <h6 v-else class="grey--text">
          入力…
        </h6>
      </template>
      <template v-slot:item.details="{ item }">
        <v-btn text color="secondary" @click="printItem = item">
          明細書
        </v-btn>
      </template>
      <template v-slot:item.deliver_count="{ item }">
        <h6>{{ item.deliver_count | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.attend_days="{ item }">
        <h6>{{ item.attend_days | currency('日', false) }}</h6>
      </template>
      <template v-slot:item.entry="{ item }">
        <h6>{{ item.entry | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.reg_status="{ item }">
        <v-select
          :value="item.reg_status"
          :items="statusItems"
          color="error"
          item-color="error"
          outlined
          solo
          dense
          flat
          hide-details
          placeholder="登録状況"
          height="30"
          style="width: 140px;"
          @change="(status) => updateStatus(item.delivery_uid, status)"
        />
      </template>
      <template v-slot:item.coin_value="{ item }">
        <div class="d-flex align-center justify-center">
          <h6>{{ item.coin_value | currency }}</h6>
          <v-btn text color="secondary" @click="coinItem = item">
            {{ item.coin_value ? '更新' : '入力' }}
          </v-btn>
        </div>
      </template>
      <template v-slot:item.shift="{ item }">
        <v-menu transition="slide-reverse-x-transition" offset-y bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              color="grey"
              v-bind="attrs"
              v-on="on"
            >
              確認
            </v-btn>
          </template>
          <v-card class="pa-0 rounded-sm" min-width="200">
            <v-card-text class="black--text">
              <div v-for="(times, index) in item.weekly" :key="index" class="d-flex align-center justify-space-between">
                <h6>{{ times.label }}</h6>
                <div v-if="times.hours.lunch_start_time" class="d-flex align-center justify-space-between">
                  <h6>{{ times.hours.lunch_start_time }}</h6>
                  <h6 class="mx-1 mx-md-2">
                    ~
                  </h6>
                  <h6>{{ times.hours.lunch_end_time }}</h6>
                </div>
                <div v-else class="error--text">
                  定休日
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>
    <update-confirm v-model="updatedItem" />
    <delivery-image-upload v-model="editedItem" />
    <print-dialog v-model="printItem" />
    <insert-coin-dialog v-model="coinItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UpdateConfirm from '~/components/admin/Deliveries/UpdateConfirm'
import DeliveryImageUpload from '~/components/admin/Deliveries/DeliveryImageUpload'
import PrintDialog from '~/components/admin/Deliveries/PrintDialog'
import InsertCoinDialog from '~/components/admin/Deliveries/InsertCoinDialog'

export default {
  name: 'Deliveries',
  components: { InsertCoinDialog, PrintDialog, DeliveryImageUpload, UpdateConfirm },
  layout: 'admin',
  async fetch () {
    await this.getDeliveries({
      ...this.params
    })
  },
  data: () => ({
    params: {
      filter: 'deliver_count'
    },
    filterItems: [
      { text: '50音順', value: 'first_name' },
      { text: '配達回数順', value: 'deliver_count' },
      { text: '出勤日数順', value: 'attend_days' },
      { text: '免許期限順', value: 'license_expire_date' },
      { text: '自賠責期限順', value: 'insurance_valid_date' },
      { text: '任意保険期限順', value: 'voluntary_expire_date' }
    ],
    typesItem: {
      motor: '二輪バイク(125㏄以下)',
      bike: '自転車',
      car: '自動車(事業用限定)'
    },
    statusItems: [
      { text: '承認済み', value: 'approved' },
      { text: '仮登録中', value: 'progress' },
      { text: '解約', value: 'cancel' },
      { text: '復帰', value: 'recover' }
    ],
    headers: [
      { text: '契約日', value: 'contact_date', align: 'center', width: '120px' },
      { text: 'デリバー管理No', value: 'delivery_uid', align: 'center', width: '140px' },
      { text: '氏名', value: 'name', align: 'center', width: '120px' },
      { text: '住所', value: 'address', align: 'center', width: '180px' },
      { text: 'TEL', value: 'phone', align: 'center', width: '160px' },
      { text: 'メールアドレス', value: 'email', align: 'center', width: '200px' },
      { text: '振込口座', value: 'bank_account', align: 'center', width: '120px' },
      { text: '車両の種類', value: 'vehicle_type', align: 'center', width: '180px' },
      { text: '書類画像', value: 'document_image', align: 'center', width: '120px' },
      { text: '自賠責期限', value: 'insurance_valid_date', align: 'center', width: '120px' },
      { text: '任意保険期限', value: 'voluntary_expire_date', align: 'center', width: '120px' },
      { text: '免許証期限', value: 'license_expire_date', align: 'center', width: '120px' },
      { text: '明細書', value: 'details', align: 'center', width: '100px' },
      { text: '配達回数', value: 'deliver_count', align: 'center', width: '100px' },
      { text: '出勤日数', value: 'attend_days', align: 'center', width: '100px' },
      { text: 'エントリースルー', value: 'entry', align: 'center', width: '100px' },
      { text: '登録抹消', value: 'reg_status', align: 'center', width: '100px' },
      { text: 'リュック預り金', value: 'coin_value', align: 'center', width: '120px' },
      { text: 'シフト', value: 'shift', align: 'center', width: '100px' }
    ],
    editedItem: null,
    updatedItem: null,
    printItem: null,
    coinItem: null
  }),
  computed: {
    ...mapGetters('admin/deliveries', ['getDeliveryRows', 'getDeliveryLoading', 'getDeliveryCount'])
  },
  watch: {
    'params.filter': '$fetch'
  },
  methods: {
    ...mapActions('admin/deliveries', ['getDeliveries']),
    updateStatus (uid, status) {
      this.updatedItem = { reg_status: status, uid }
    }
  },
  head: () => ({
    title: '顧客情報管理-デリバー'
  })
}
</script>
