<template>
  <div class="summary-help-edit">
    <div class="d-sm-flex justify-space-between align-center mb-3 mb-md-5">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'question-circle']" class="secondary--text" />
        ヘルプページの編集
      </h3>
      <div class="d-flex justify-space-between mt-2 mt-md-0">
        <v-btn
          color="secondary"
          width="120"
          height="40"
          class="mr-3"
          to="/admin/summary/edit/help/new"
        >
          新規作成
        </v-btn>
      </div>
    </div>
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-data-table
          :headers="headers"
          :items="items"
          mobile-breakpoint="0"
          disable-sort
          disable-pagination
          hide-default-footer
          class="elevation-1 mt-4"
        >
          <template v-slot:item.edit="{ item }">
            <v-btn text color="secondary" :to="`/admin/summary/edit/help/${item.id}`">
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Id',
  layout: 'admin',
  data: () => ({
    headers: [
      { text: '題名', value: 'title' },
      { text: '編集', value: 'edit', align: 'center', width: '100px' },
      { text: '削除', value: 'delete', align: 'center', width: '100px' }
    ],
    items: []
  }),
  async created () {
    await this.fetchData()
  },
  methods: {
    ...mapActions('admin/summary', ['getSummaryHelpList', 'deleteSummaryContent']),
    async fetchData () {
      this.items = await this.getSummaryHelpList({
        $axios: this.$axios
      })
    },
    async deleteItem (item) {
      await this.deleteSummaryContent({
        $axios: this.$axios,
        params: {
          id: item.id
        }
      })
      await this.fetchData()
    }
  }
}
</script>
