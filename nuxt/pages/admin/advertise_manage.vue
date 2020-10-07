<template>
  <div class="admin-advertise-manage">
    <div class="d-md-flex align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'ad']" class="secondary--text" />
        広告設定
      </h3>
      <v-select
        v-model="params.filter"
        :items="filterItems"
        background-color="white"
        outlined
        dense
        hide-details
        class="ml-0 ml-md-10 mt-3 mt-md-0"
        style="max-width: 400px;"
      />
      <v-btn
        color="secondary"
        height="35"
        class="ml-0 ml-md-10 mt-3 mt-md-0"
        :block="$vuetify.breakpoint.xs"
        @click="addItem"
      >
        <v-icon>mdi-plus</v-icon>
        新規作成
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="getAdvertiseRows"
      :loading="getAdvertiseLoading"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.edit="{ item }">
        <v-btn text color="secondary" @click="editItem(item)">
          編集
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-menu transition="slide-y-transition" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="error" v-bind="attrs" v-on="on">
              削除
            </v-btn>
          </template>
          <v-card class="pa-0 rounded">
            <v-card-title class="pa-0">
              <v-btn text color="error" block @click="deleteItem(item)">
                削除する
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-btn text color="grey" block>
                キャンセル
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:item.image="{ item }">
        <a :href="item.image" target="_blank" class="secondary--text">
          {{ item.image }}
        </a>
      </template>
      <template v-slot:item.hyper_link="{ item }">
        <a :href="item.hyper_link" target="_blank" class="secondary--text">
          {{ item.hyper_link }}
        </a>
      </template>
      <template v-slot:item.display_date="{ item }">
        <h6>{{ `${$moment(item.display_date[0]).format('YYYY/MM/DD')} ~ ${$moment(item.display_date[1]).format('YYYY/MM/DD')}` }}</h6>
      </template>
      <template v-slot:item.category="{ item }">
        <h6>{{ item.category_name }}</h6>
      </template>
      <template v-slot:item.price="{ item }">
        <h6>{{ item.price | currency }}</h6>
      </template>
    </v-data-table>
    <advertise-edit-dialog v-model="editedItem" :params="params" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AdvertiseEditDialog from '~/components/admin/Advertise/AdvertiseEditDialog'

export default {
  name: 'AdvertiseManage',
  components: { AdvertiseEditDialog },
  layout: 'admin',
  async fetch () {
    await this.getAdvertise({
      ...this.params
    })
  },
  data: () => ({
    params: {
      filter: 'home_autoslider'
    },
    filterItems: [
      { text: 'HOME画面：オートスライダー', value: 'home_autoslider' },
      { text: 'HOME画面：「お店から探す」広告枠', value: 'home_search_store' },
      { text: 'HOME画面：「料理から探す」広告枠', value: 'home_search_food' },
      { text: 'HOME画面：「特集Pick up!」広告枠', value: 'home_search_featured' },
      { text: 'HOME画面：カテゴリ広告枠(上)', value: 'home_category_frame' },
      { text: 'HOME画面：カテゴリ広告枠(下)', value: 'home_category_frame2' },
      { text: '検索画面：特集バナー(オートスライダー)', value: 'search_featured_banner' }
    ],
    editedItem: null
  }),
  computed: {
    ...mapGetters('admin/advertise', ['getAdvertiseRows', 'getAdvertiseLoading', 'getAdvertiseCount']),
    headers () {
      if (this.params.filter === 'home_autoslider') {
        return [
          { text: '編集', value: 'edit', align: 'center', width: '90px' },
          { text: '削除', value: 'delete', align: 'center', width: '90px' },
          { text: '画像', value: 'image', align: 'center', width: '120px' },
          { text: 'リンク先', value: 'hyper_link', align: 'center', width: '120px' },
          { text: '表示期間', value: 'display_date', align: 'center', width: '230px' }
        ]
      } else if (this.params.filter === 'home_search_store') {
        return [
          { text: '編集', value: 'edit', align: 'center', width: '90px' },
          { text: '削除', value: 'delete', align: 'center', width: '90px' },
          { text: '画像', value: 'image', align: 'center', width: '120px' },
          { text: '店舗名', value: 'store_name', align: 'center', width: '120px' },
          { text: '住所', value: 'address', align: 'center', width: '120px' },
          { text: 'リンク先', value: 'hyper_link', align: 'center', width: '120px' },
          { text: '表示期間', value: 'display_date', align: 'center', width: '230px' }
        ]
      } else if (this.params.filter === 'home_search_featured') {
        return [
          { text: '編集', value: 'edit', align: 'center', width: '90px' },
          { text: '削除', value: 'delete', align: 'center', width: '90px' },
          { text: '画像', value: 'image', align: 'center', width: '120px' },
          { text: '店舗名', value: 'store_name', align: 'center', width: '120px' },
          { text: '商品名', value: 'product_name', align: 'center', width: '120px' },
          { text: '価格', value: 'price', align: 'center', width: '120px' },
          { text: 'リンク先', value: 'hyper_link', align: 'center', width: '120px' },
          { text: '表示期間', value: 'display_date', align: 'center', width: '230px' }
        ]
      } else if (this.params.filter === 'home_search_food') {
        return [
          { text: '編集', value: 'edit', align: 'center', width: '90px' },
          { text: '削除', value: 'delete', align: 'center', width: '90px' },
          { text: '画像', value: 'image', align: 'center', width: '120px' },
          { text: '店舗名', value: 'store_name', align: 'center', width: '120px' },
          { text: '商品名', value: 'product_name', align: 'center', width: '120px' },
          { text: '価格', value: 'price', align: 'center', width: '120px' },
          { text: 'リンク先', value: 'hyper_link', align: 'center', width: '120px' },
          { text: '表示期間', value: 'display_date', align: 'center', width: '230px' }
        ]
      } else if (this.params.filter === 'home_category_frame') {
        return [
          { text: '編集', value: 'edit', align: 'center', width: '90px' },
          { text: '削除', value: 'delete', align: 'center', width: '90px' },
          { text: 'カテゴリ', value: 'category', align: 'center', width: '120px' },
          { text: '画像', value: 'image', align: 'center', width: '120px' },
          { text: '店舗名', value: 'store_name', align: 'center', width: '120px' },
          { text: '商品名', value: 'product_name', align: 'center', width: '120px' },
          { text: '価格', value: 'price', align: 'center', width: '120px' },
          { text: 'リンク先', value: 'hyper_link', align: 'center', width: '120px' },
          { text: '表示期間', value: 'display_date', align: 'center', width: '230px' }
        ]
      }
      return [
        { text: '編集', value: 'edit', align: 'center', width: '90px' },
        { text: '削除', value: 'delete', align: 'center', width: '90px' },
        { text: '画像', value: 'image', align: 'center', width: '120px' },
        { text: 'リンク先', value: 'hyper_link', align: 'center', width: '120px' },
        { text: '表示期間', value: 'display_date', align: 'center', width: '230px' }
      ]
    }
  },
  watch: {
    'params.filter': '$fetch'
  },
  methods: {
    ...mapActions('admin/advertise', ['getAdvertise', 'deleteAdvertise']),
    async deleteItem (item) {
      const payload = {
        id: item.id
      }
      await this.deleteAdvertise({
        ...payload
      })
      await this.$fetch()
    },
    editItem (item) {
      const temp = JSON.parse(JSON.stringify(item))
      if (item.image) {
        temp.image = {
          name: 'Main Photo',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.image
        }
      }
      temp.type = temp.hyper_link.startsWith('http') ? 'external' : 'internal'
      this.editedItem = JSON.parse(JSON.stringify(temp))
    },
    addItem () {
      this.editedItem = {}
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    }
  },
  head: () => ({
    title: '広告設定'
  })
}
</script>
