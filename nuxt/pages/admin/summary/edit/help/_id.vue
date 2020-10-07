<template>
  <div class="summary-help-edit">
    <v-form ref="form" @submit.prevent="save">
      <div class="d-sm-flex justify-space-between align-center mb-3 mb-md-5">
        <h3 class="font-weight-bold">
          <font-awesome-icon :icon="['fas', 'question-circle']" class="secondary--text" />
          ヘルプ
        </h3>
        <div class="d-flex justify-space-between mt-2 mt-md-0">
          <v-btn
            color="secondary"
            :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
            height="40"
            class="mr-3"
            @click="edit = !edit"
          >
            編集する
          </v-btn>
          <v-btn
            color="secondary"
            :width="$vuetify.breakpoint.mdAndUp ? 120 : '50%'"
            height="40"
            type="submit"
          >
            完了
          </v-btn>
        </div>
      </div>
      <v-row>
        <v-col cols="12" md="6" sm="12" class="py-0">
          <div class="d-flex align-center textdiv">
            <v-text-field
              v-model="editedItem.title"
              :rules="[rules.required]"
              placeholder="題名："
              solo
              flat
              dense
              class="mt-3"
            />
          </div>
        </v-col>
        <v-col cols="12" md="6" sm="12" class="py-0">
          <v-chip-group v-model="editedItem.type" column mandatory>
            <v-row no-gutters>
              <template v-for="(item, index) in filterItems">
                <v-col :key="index" cols="12" sm="12">
                  <v-chip
                    :key="index"
                    color="#f2f2f2"
                    pill
                    text-color="black"
                    :ripple="false"
                    :value="item.value"
                  >
                    <v-icon color="grey">
                      mdi-check-circle
                    </v-icon>
                    <h5>{{ item.text }}</h5>
                  </v-chip>
                </v-col>
              </template>
            </v-row>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-textarea
        v-if="edit"
        v-model="editedItem.content"
        background-color="white"
        :rules="[rules.required]"
        outlined
        wrap="hard"
        cols="20"
        height="calc(100vh - 250px)"
      />
      <h6 v-else>
        <pre style="font-family: SF-Pro;white-space: pre-wrap;">
          {{ editedItem.content }}
        </pre>
      </h6>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'
export default {
  name: 'Help',
  layout: 'admin',
  mixins: [validationRules],
  data: () => ({
    editedIndex: -1,
    edit: true,
    filterItems: [
      { text: '注文に関するヘルプ', value: 'order' },
      { text: 'アカウントとお支払いに関するヘルプ', value: 'account' },
      { text: 'DELIVOWに関するガイド', value: 'delivow' }
    ],
    editedItem: {
      id: -1,
      title: '',
      type: 'account',
      content: ''
    }
  }),
  async created () {
    this.editedIndex = this.$route.params.id
    await this.fetchData()
  },
  methods: {
    ...mapActions('admin/summary', ['getHelpContent', 'saveHelpContent']),
    async fetchData () {
      if (this.editedIndex !== 'new') {
        this.editedItem = await this.getHelpContent({
          $axios: this.$axios,
          params: {
            id: this.editedIndex
          }
        })
      }
    },
    async save () {
      if (!this.$refs.form.validate()) {
        return
      }
      await this.saveHelpContent({
        $axios: this.$axios,
        params: this.editedItem
      })
      this.edit = false
      this.$router.push('/admin/summary/edit/help')
    }
  },
  head: () => ({
    title: '概要ページの編集'
  })
}
</script>
