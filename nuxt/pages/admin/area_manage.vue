<template>
  <div class="admin-area-manage">
    <div class="d-md-flex align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="secondary--text" />
        エリアの編集
      </h3>
      <v-btn :block="$vuetify.breakpoint.xs" color="secondary" height="35" class="ml-md-3 ml-0 mt-3 mt-md-0" @click="editedItem = {}">
        <font-awesome-icon :icon="['fas', 'plus']" />
        新規作成
      </v-btn>
    </div>
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-data-table
          :headers="headers"
          :items="getAreaRows"
          :loading="getAreaLoading"
          mobile-breakpoint="0"
          disable-sort
          disable-pagination
          hide-default-footer
          class="elevation-1 mt-4"
        >
          <template v-slot:item.edit="{ item }">
            <v-btn text color="secondary" @click="editedItem = item">
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
        </v-data-table>
      </v-col>
    </v-row>
    <area-edit-dialog v-model="editedItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'
import AreaEditDialog from '@/components/admin/Area/AreaEditDialog'

export default {
  name: 'AreaManage',
  components: { AreaEditDialog },
  layout: 'admin',
  mixins: [validationRules],
  async fetch () {
    await this.loadAreaItems()
  },
  data: () => ({
    headers: [
      { text: 'エリア名', value: 'text', align: 'center' },
      { text: '編集', value: 'edit', align: 'center' },
      { text: '削除', value: 'delete', align: 'center' }
    ],
    editedItem: null
  }),
  computed: {
    ...mapGetters('admin/area', ['getAreaRows', 'getAreaLoading'])
  },
  methods: {
    ...mapActions('admin/area', ['loadAreaItems', 'deleteAreaItem']),
    async deleteItem (item) {
      await this.deleteAreaItem({
        ...item
      })
      await this.$fetch()
    }
  },
  head: () => ({
    title: 'エリアの編集'
  })
}
</script>
