<template>
  <div class="admin-stores">
    <div class="d-md-flex justify-space-between align-center">
      <div class="d-md-flex justify-start align-center">
        <h3>
          <font-awesome-icon :icon="['fas', 'users']" class="secondary--text" />
          顧客情報管理-登録店舗
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
      <v-btn height="35" color="secondary" class="mt-3 mt-md-0" :block="$vuetify.breakpoint.xs" @click="editedItem = {}">
        新規店舗コードの発行
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="getStoreRows"
      :loading="getStoreLoading"
      :server-items-length="getStoreCount"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.edit="{ item }">
        <v-btn text color="secondary" @click="editedItem = item">
          編集
        </v-btn>
      </template>
      <template v-slot:item.store_uid="{ item }">
        <h6>
          {{ item.store_uid }}
        </h6>
      </template>
      <template v-slot:item.contract_date="{ item }">
        <div class="d-flex">
          <h6>{{ item.contract_date | dateFormat }}</h6>
          <v-badge
            v-if="item.is_update === true"
            content="1"
            value="1"
            color="error"
            inline
          />
        </div>
      </template>
      <template v-slot:item.mobile_phone="{ item }">
        <h6>{{ item.mobile_phone | formatPhoneNumber }}</h6>
      </template>
      <template v-slot:item.telephone="{ item }">
        <h6>{{ item.telephone | formatPhoneNumber }}</h6>
      </template>
      <template v-slot:item.is_liquid="{ item }">
        <h6 v-if="item.is_liquid === true">
          ○
        </h6>
        <h6 v-else>
          X
        </h6>
      </template>
      <template v-slot:item.month_income="{ item }">
        <h6>{{ item.month_income | currency }}</h6>
      </template>
      <template v-slot:item.monthly_menus="{ item }">
        <v-btn text color="secondary" :to="`/admin/stores/monthly/${item.store_uid}`">
          月別明細表
        </v-btn>
      </template>
      <template v-slot:item.order_delay="{ item }">
        <h6>{{ item.order_delay | currency('回', false) }}</h6>
      </template>
      <template v-slot:item.rating="{ item }">
        <div class="d-flex justify-space-around align-center">
          <v-menu transition="slide-y-transition" bottom>
            <template v-slot:activator="{ on, attrs }">
              <h6>
                <font-awesome-icon :icon="['fas', 'star']" class="secondary--text" v-bind="attrs" v-on="on" />
                {{ rating_value(item.rating) }}
              </h6>
            </template>
            <v-card class="pa-2 rounded">
              <v-card-text class="pa-0">
                <div class="d-flex align-center">
                  <v-rating :value="1" readonly dense small color="warning" />
                  <h6 class="ml-2">
                    {{ `(${ item.rating ? item.rating.one : 0 })` }}
                  </h6>
                </div>
                <div class="d-flex align-center">
                  <v-rating :value="2" readonly dense small color="warning" />
                  <h6 class="ml-2">
                    {{ `(${item.rating ? item.rating.two : 0 })` }}
                  </h6>
                </div>
                <div class="d-flex align-center">
                  <v-rating :value="3" readonly dense small color="warning" />
                  <h6 class="ml-2">
                    {{ `(${item.rating ? item.rating.three : 0 })` }}
                  </h6>
                </div>
                <div class="d-flex align-center">
                  <v-rating :value="4" readonly dense small color="warning" />
                  <h6 class="ml-2">
                    {{ `(${item.rating ? item.rating.four : 0 })` }}
                  </h6>
                </div>
                <div class="d-flex align-center">
                  <v-rating :value="5" readonly dense small color="warning" />
                  <h6 class="ml-2">
                    {{ `(${item.rating ? item.rating.five : 0 })` }}
                  </h6>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
          <font-awesome-icon :icon="['fas', 'sync-alt']" class="secondary--text" @click="ratingItem = item" />
        </div>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn :disabled="item.is_cancel" text color="error" @click="deletedItem = item">
          解約させる
        </v-btn>
      </template>
    </v-data-table>
    <new-dialog v-model="editedItem" />
    <delete-dialog v-model="deletedItem" />
    <rating-edit-dialog v-model="ratingItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'
import NewDialog from '~/components/admin/Stores/NewDialog'
import DeleteDialog from '~/components/admin/Stores/DeleteDialog'
import RatingEditDialog from '~/components/admin/Stores/RatingEditDialog'

export default {
  name: 'Stores',
  components: { RatingEditDialog, DeleteDialog, NewDialog },
  layout: 'admin',
  mixins: [validationRules],
  async fetch () {
    await this.getStoreItems({
      ...this.params
    })
  },
  data: () => ({
    params: {
      filter: 'register'
    },
    filterItems: [
      { text: '登録順', value: 'register' },
      { text: '回数実績順', value: 'count' },
      { text: '50音順', value: 'alphabet' }
    ],
    headers: [
      { text: '編集', value: 'edit', align: 'center', width: '100px' },
      { text: '飲食店コード', value: 'store_uid', align: 'center', width: '130px' },
      { text: 'パスワード', value: 'password', align: 'center', width: '130px' },
      { text: '契約日', value: 'contract_date', align: 'center', width: '120px' },
      { text: '店舗名', value: 'name', align: 'center', width: '160px' },
      { text: 'TEL(固定)', value: 'telephone', align: 'center', width: '160px' },
      { text: 'TEL(携帯)', value: 'mobile_phone', align: 'center', width: '160px' },
      { text: 'メールアドレス', value: 'email', align: 'center', width: '200px' },
      { text: '店舗責任者名', value: 'boss_name', align: 'center', width: '150px' },
      { text: '酒類の免許', value: 'is_liquid', align: 'center', width: '150px' },
      { text: '今月の入金額', value: 'month_income', align: 'center', width: '150px' },
      { text: '月別明細表', value: 'monthly_menus', align: 'center', width: '150px' },
      { text: '受注承認遅延', value: 'order_delay', align: 'center', width: '120px' },
      { text: '評価', value: 'rating', align: 'center', width: '100px' },
      { text: '解約', value: 'delete', align: 'center', width: '120px' },
      { text: '備考', value: 'note', align: 'center', width: '100px' }
    ],
    editedItem: null,
    deletedItem: null,
    ratingItem: null
  }),
  computed: {
    ...mapGetters('admin/stores', ['getStoreRows', 'getStoreLoading', 'getStoreCount'])
  },
  watch: {
    'params.filter': '$fetch'
  },
  methods: {
    ...mapActions('admin/stores', ['getStoreItems']),
    rating_value (rating) {
      if (rating) {
        const totalCount = rating.one * 1 + rating.two * 1 + rating.three * 1 + rating.four * 1 + rating.five * 1
        return totalCount === 0 ? 0 : ((rating.one * 1 + rating.two * 2 + rating.three * 3 + rating.four * 4 + rating.five * 5) / totalCount).toFixed(1)
      }
      return 0
    }
  },
  head: () => ({
    title: '顧客情報管理-登録店舗'
  })
}
</script>
