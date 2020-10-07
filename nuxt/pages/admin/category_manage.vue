<template>
  <div class="admin-category-manage">
    <div class="d-md-flex justify-start align-center">
      <h3>
        <font-awesome-icon :icon="['fas', 'bars']" class="secondary--text" />
        カテゴリ・タグ設定
      </h3>
    </div>
    <v-row class="mt-1">
      <v-col cols="12" md="6" sm="12">
        <v-btn color="secondary" height="35" :block="$vuetify.breakpoint.xs" @click="addItem('store')">
          <font-awesome-icon :icon="['fas', 'plus']" />
          カテゴリを新規作成
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="items"
          mobile-breakpoint="0"
          disable-sort
          hide-default-footer
          class="elevation-1 mt-4"
        >
          <template v-slot:body>
            <draggable
              :list="items"
              tag="tbody"
              handle=".page__grab-icon"
            >
              <tr
                v-for="(item, index) in items"
                :key="index"
              >
                <td> {{ item.category }} </td>
                <td> {{ index + 1 }} </td>
                <td class="text-center">
                  <v-btn text color="secondary" @click="editItem(item, 'store')">
                    編集
                  </v-btn>
                </td>
                <td>
                  <v-menu transition="slide-y-transition" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text color="error" v-bind="attrs" v-on="on">
                        削除
                      </v-btn>
                    </template>
                    <v-card class="pa-0 rounded">
                      <v-card-title class="pa-0">
                        <v-btn text color="error" block @click="deleteItem(item, 'store')">
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
                </td>
                <td class="text-center">
                  <font-awesome-icon
                    :icon="['fas', 'sort']"
                    class="page__grab-icon secondary--text"
                  />
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-btn color="secondary" height="35" :block="$vuetify.breakpoint.xs" @click="addItem('product')">
          <font-awesome-icon :icon="['fas', 'plus']" />
          タグを新規作成
        </v-btn>
        <v-data-table
          :headers="product_headers"
          :items="product_items"
          mobile-breakpoint="0"
          disable-sort
          hide-default-footer
          class="elevation-1 mt-4"
        >
          <template v-slot:body>
            <draggable
              :list="product_items"
              tag="tbody"
              handle=".page__grab-icon"
            >
              <tr
                v-for="(item, index) in product_items"
                :key="index"
              >
                <td> {{ item.category }} </td>
                <td> {{ index + 1 }} </td>
                <td class="text-center">
                  <v-btn text color="secondary" @click="editItem(item, 'product')">
                    編集
                  </v-btn>
                </td>
                <td>
                  <v-menu transition="slide-y-transition" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text color="error" v-bind="attrs" v-on="on">
                        削除
                      </v-btn>
                    </template>
                    <v-card class="pa-0 rounded">
                      <v-card-title class="pa-0">
                        <v-btn text color="error" block @click="deleteItem(item, 'product')">
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
                </td>
                <td class="text-center">
                  <font-awesome-icon
                    :icon="['fas', 'sort']"
                    class="page__grab-icon secondary--text"
                  />
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
      <v-form ref="form" @submit.prevent="save">
        <v-card color="#D4D4D4">
          <v-card-title class="justify-center py-5 pt-8">
            <h2>
              {{ type === 'store' ? 'カテゴリを新規作成' : 'タグを新規作成' }}
            </h2>
          </v-card-title>
          <v-card-text>
            <v-row align="center" class="px-0 px-md-12">
              <v-col cols="12" class="pa-2">
                <v-text-field
                  v-model="editedItem.category"
                  :rules="[rules.required]"
                  :placeholder="type === 'store' ? 'カテゴリ名' : 'タグ名'"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="py-0">
            <v-row no-gutters>
              <v-col cols="6" class="br-1-grey-fixed">
                <v-btn
                  color="secondary"
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  type="submit"
                  block
                  text
                  aria-label="create register and send email"
                  class="font-weight-bold"
                >
                  作成
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="secondary"
                  text
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  aria-label="Cancel"
                  @click="dialog = false"
                >
                  キャンセル
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'

export default {
  name: 'CategoryManage',
  layout: 'admin',
  components: { draggable },
  mixins: [validationRules],
  data: () => ({
    headers: [
      { text: '店舗カテゴリ', value: 'category', align: 'center', width: '150px' },
      { text: '表示順', value: 'order', align: 'center', width: '80px' },
      { text: '編集', value: 'edit', align: 'center', width: '80px' },
      { text: '削除', value: 'delete', align: 'center', width: '80px' },
      { text: '', value: 'icon', align: 'center', width: '80px' }
    ],
    items: [],
    product_headers: [
      { text: '商品タグ', value: 'product_tag', align: 'center', width: '150px' },
      { text: '表示順', value: 'order', align: 'center', width: '80px' },
      { text: '編集', value: 'edit', align: 'center', width: '80px' },
      { text: '削除', value: 'delete', align: 'center', width: '80px' },
      { text: '', value: 'icon', align: 'center', width: '80px' }
    ],
    product_items: [],
    type: 'store',
    dialog: false,
    editedItem: {}
  }),
  watch: {
    items: {
      deep: true,
      async handler (val) {
        await this.updateStoreCategoryOrder({
          $axios: this.$axios,
          params: { store: val }
        })
      }
    },
    product_items: {
      deep: true,
      async handler (val) {
        await this.updateProductCategoryOrder({
          $axios: this.$axios,
          params: { store: val }
        })
      }
    }
  },
  async created () {
    await this.fetchData()
  },
  methods: {
    ...mapActions('admin/category', ['getStoreCategory', 'getProductCategory', 'updateStoreCategoryOrder', 'updateProductCategoryOrder', 'saveCategory', 'deleteCategory']),
    async fetchData () {
      this.items = await this.getStoreCategory({
        $axios: this.$axios
      })
      this.product_items = await this.getProductCategory({
        $axios: this.$axios
      })
    },
    editItem (item, type) {
      this.type = type
      this.editedItem = JSON.parse(JSON.stringify(item))
      this.editedItem.type = type
      this.dialog = true
    },
    addItem (type) {
      this.type = type
      this.editedItem = {}
      this.editedItem.type = type
      this.dialog = true
    },
    async deleteItem (item, type) {
      this.type = type
      this.editedItem = JSON.parse(JSON.stringify(item))
      this.editedItem.type = type
      await this.deleteCategory({
        $axios: this.$axios,
        params: this.editedItem
      })
      await this.fetchData()
    },
    async save () {
      if (!this.$refs.form.validate()) {
        return
      }
      await this.saveCategory({
        $axios: this.$axios,
        params: this.editedItem
      })
      this.dialog = false
      await this.fetchData()
    }
  },
  head: () => ({
    title: 'カテゴリ・タグ設定'
  })
}
</script>
