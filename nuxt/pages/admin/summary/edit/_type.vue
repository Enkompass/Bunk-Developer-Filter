<template>
  <div class="summary-type">
    <div class="d-sm-flex justify-space-between align-center mb-3 mb-md-5">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="icons[params.type]" class="secondary--text" />
        {{ titles[params.type] }}
      </h3>
      <div class="d-flex justify-space-between mt-2 mt-md-0">
        <v-btn
          color="secondary"
          :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
          height="40"
          class="mr-3"
          @click="edit = true"
        >
          編集する
        </v-btn>
        <v-btn
          color="secondary"
          :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
          height="40"
          @click="save"
        >
          完了
        </v-btn>
      </div>
    </div>
    <v-textarea
      v-if="edit"
      v-model="content"
      background-color="white"
      outlined
      wrap="hard"
      cols="20"
      height="calc(100vh - 130px)"
    />
    <h6 v-else>
      <pre>
        {{ content }}
      </pre>
    </h6>
    <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-10">
          <h2 class="black--text font-weight-bold text-center">
            利用規約・個人情報保護法・特定商取引法を更新して、通知をしますか？
          </h2>
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col md="6" sm="6" class="br-1-grey-fixed">
              <v-btn
                block
                color="secondary"
                text
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                aria-label="Discard and Move"
                @click="dialog = false"
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
                aria-label="Go back and save"
                class="font-weight-bold"
                @click="continueSave"
              >
                更新する
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
  name: 'Type',
  layout: 'admin',
  data: () => ({
    params: {
      type: ''
    },
    dialog: false,
    editedIndex: -1,
    content: '',
    icons: {
      commercial: ['fas', 'file-image'],
      terms: ['fas', 'file-image'],
      personal: ['fas', 'unlock-alt'],
      software: ['fas', 'file-alt'],
      copyright: ['fas', 'copyright'],
      company: ['fas', 'building']
    },
    titles: {
      commercial: '特定商取引法',
      terms: '利用規約',
      personal: '個人情報保護法',
      software: 'ソフトウェアライセンス',
      copyright: 'コピーライト',
      company: '運営会社情報'
    },
    edit: false
  }),
  async created () {
    this.params.type = this.$route.params.type
    await this.fetchData()
  },
  methods: {
    ...mapActions('admin/summary', ['getSummaryContent', 'saveSummary']),
    async fetchData () {
      const data = await this.getSummaryContent({
        $axios: this.$axios,
        params: this.params
      })
      this.editedIndex = data.id
      this.content = data.content
    },
    async save () {
      if (['commercial', 'personal', 'terms'].includes(this.params.type)) {
        this.dialog = true
      } else {
        await this.saveSummary({
          $axios: this.$axios,
          params: {
            type: this.params.type,
            content: this.content
          }
        })
        this.$router.push('/admin/summary')
        this.edit = false
      }
    },
    async continueSave () {
      await this.saveSummary({
        $axios: this.$axios,
        params: {
          type: this.params.type,
          content: this.content
        }
      })
      this.$router.push('/admin/summary')
      this.edit = false
      this.dialog = false
    }
  },
  head: () => ({
    title: '概要ページの編集'
  })
}
</script>
