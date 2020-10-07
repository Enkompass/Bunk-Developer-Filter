<template>
  <div class="store-product-manage">
    <div class="d-sm-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <h3 class="font-weight-bold">
          <font-awesome-icon :icon="['fas', 'utensils']" class="secondary--text" />
          メニューの編集
        </h3>
        <div class="ml-md-5 ml-2">
          <h5>
            ※70件まで登録可
          </h5>
          <h5 class="d-none d-sm-block">
            追加購入商品は、5件まで選択可 ※任意
          </h5>
        </div>
      </div>
      <div class="d-flex justify-space-between mt-2 mt-md-0">
        <v-btn
          outlined
          color="secondary"
          :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
          height="40"
          class="mr-3"
          @click="deselect"
        >
          {{ selected.length === 0 ? '一括選択' : 'キャンセル' }}
        </v-btn>
        <v-btn
          v-if="newly && selected.length === 0"
          color="secondary"
          :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
          height="40"
          to="/store/product_manage/edit/-1"
        >
          新規登録
        </v-btn>
        <v-btn v-else :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'" height="40" color="error" @click="multiDelete">
          削除
        </v-btn>
      </div>
    </div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :show-select="selectable"
      mobile-breakpoint="0"
      disable-sort
      hide-default-footer
      class="elevation-1 mt-4"
    >
      <template v-slot:item.data-table-select="{ select, isSelected }">
        <v-btn icon color="transparent" @click="select(!isSelected)">
          <v-icon :color="isSelected ? 'secondary' : 'grey'">
            mdi-check-circle
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:header.data-table-select>
        <h6>選択</h6>
      </template>
      <template v-slot:item.price="{ item }">
        <h6>{{ item.price | currency }}</h6>
      </template>
      <template v-slot:item.stock="{ item }">
        <h6>{{ item.stock | currency('') }}</h6>
      </template>
      <template v-slot:item.null_stock="{ item }">
        <v-menu transition="slide-y-transition" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text :color="item.null_stock ? 'error' : 'secondary'" v-bind="attrs" v-on="on">
              <h6>
                {{ item.null_stock ? '品切れを解除' : '品切れにする' }}
              </h6>
            </v-btn>
          </template>
          <v-card class="pa-0 rounded">
            <v-card-title class="pa-0">
              <v-btn :color="item.null_stock ? 'error' : 'secondary'" text block @click="saveNullStock(item)">
                {{ item.null_stock ? '品切れを解除' : '品切れにする' }}
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
      <template v-slot:item.delete="{ item }">
        <v-menu transition="slide-y-transition" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="error" v-bind="attrs" v-on="on">
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="error--text" />
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
      <template v-slot:item.details="{ item }">
        <v-btn text color="secondary" :to="`/store/product_manage/edit/${item.id}`">
          編集をする
        </v-btn>
      </template>
      <template v-slot:item.additional="{ item }">
        <v-btn icon color="transparent" @click="registerAdditional(item)">
          <v-icon :color="item.is_additional ? 'secondary' : 'grey'">
            mdi-check-circle
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog.delete" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="h23 font-weight-bold black--text">
            {{ selected.length }}件を一括削除しますか？
          </h2>
        </v-card-title>
        <v-card-subtitle class="pb-2 pb-md-5">
          <h6 class="h45 black--text text-center">
            この動作は戻せません。
          </h6>
        </v-card-subtitle>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col md="6" sm="6" class="br-1-grey">
              <v-btn
                block
                color="grey"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="dialog.delete = false"
              >
                キャンセル
              </v-btn>
            </v-col>
            <v-col md="6" sm="6">
              <v-btn
                block
                color="error"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                @click="confirmDelete"
              >
                削除
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProductManage',
  data: () => ({
    selectable: false,
    newly: true,
    selected: [],
    headers: [
      { text: 'メニュー名', value: 'name', width: '320px' },
      { text: '商品代(税込)', value: 'tax_price', width: '130px' },
      { text: '在庫数', value: 'stock', width: '90px' },
      { text: '品切れ', value: 'null_stock', width: '130px' },
      { text: '削除', value: 'delete', width: '75px' },
      { text: '詳細', value: 'details', align: 'center', width: '120px' },
      { text: '追加購入商品', value: 'additional', align: 'center', width: '120px' }
    ],
    items: [],
    dialog: {
      delete: false
    },
    editedItem: {}
  }),
  created () {
    this.fetchData()
  },
  methods: {
    ...mapActions('store/products', ['getStoreProductList', 'deleteProducts', 'saveAsAdditional', 'saveAsNullStock']),
    async fetchData () {
      this.items = await this.getStoreProductList({
        $axios: this.$axios
      })
    },
    deselect () {
      this.selectable = !this.selectable
      if (this.selected.length > 0) {
        this.selected = []
      }
    },
    async deleteItem (item) {
      this.editedItem = JSON.parse(JSON.stringify(item))
      await this.deleteProducts({
        $axios: this.$axios,
        params: {
          uids: [this.editedItem.uid]
        }
      })
      await this.fetchData()
    },
    multiDelete () {
      this.dialog.delete = true
    },
    async confirmDelete () {
      const uids = this.selected.filter(item => item.uid).map(item => item.uid)
      await this.deleteProducts({
        $axios: this.$axios,
        params: {
          uids
        }
      })
      this.dialog.delete = false
      await this.fetchData()
    },
    async saveNullStock (item) {
      await this.saveAsNullStock({
        $axios: this.$axios,
        params: {
          uid: item.uid,
          status: !item.null_stock
        }
      })
      await this.fetchData()
    },
    async registerAdditional (item) {
      await this.saveAsAdditional({
        $axios: this.$axios,
        params: {
          uid: item.uid,
          status: !item.is_additional
        }
      })
      await this.fetchData()
    }
  },
  head: () => ({
    title: 'メニューの編集'
  })
}
</script>
