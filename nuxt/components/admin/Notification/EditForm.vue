<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
      <v-form ref="form" @submit.prevent="showConfirmDialog">
        <v-card color="#D4D4D4" :loading="loading">
          <v-card-title class="justify-center py-5 pt-8">
            <h2>
              {{ form.id ? '通知を編集' : '通知を新規作成' }}
            </h2>
          </v-card-title>
          <v-card-text>
            <v-row align="center" class="px-0 px-md-12">
              <v-col cols="12" class="pa-2">
                <v-text-field
                  v-model="form.name"
                  :rules="[rules.required]"
                  placeholder="件名"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row align="center" class="px-0 px-md-12">
              <v-col cols="12" class="pa-2">
                <v-textarea
                  v-model="form.content"
                  :rules="[rules.required]"
                  placeholder="文章"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row align="center" class="px-0 px-md-12">
              <v-col cols="12" sm="12" :md="form.target === 'individual' ? 4 : 6" class="pa-2">
                <v-autocomplete
                  v-model="form.target"
                  :rules="[rules.required]"
                  :items="targetItems"
                  placeholder="配信対象"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col v-if="form.target === 'individual'" cols="12" sm="12" :md="form.target === 'individual' ? 4 : 6" class="pa-2">
                <v-autocomplete
                  v-model="form.uid"
                  :rules="[rules.required]"
                  :items="getDeliveries"
                  placeholder=""
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="12" :md="form.target === 'individual' ? 4 : 6" class="pa-2">
                <v-datetime-picker
                  v-model="form.datetime"
                  :text-field-props="{'outlined': true, 'hide-details': true, 'dense': true, 'background-color': 'white', 'placeholder': '日時を選択してください', 'rules': [rules.required]}"
                  placeholder="配信対象"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                >
                  <template v-slot:dateIcon>
                    <font-awesome-icon
                      :icon="['fas', 'calendar-alt']"
                      class="secondary--text"
                      style="font-size: 25px;"
                    />
                  </template>
                  <template v-slot:timeIcon>
                    <font-awesome-icon :icon="['fas', 'clock']" class="secondary--text" style="font-size: 25px;" />
                  </template>
                </v-datetime-picker>
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
                  block
                  text
                  type="submit"
                  aria-label="create register and send email"
                  class="font-weight-bold"
                >
                  確認
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="secondary"
                  text
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  aria-label="Cancel"
                  @click="onClose"
                >
                  キャンセル
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="800" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2 class="font-weight-bold">
            通知・送信内容を確認
          </h2>
        </v-card-title>
        <v-card-text class="px-3 px-md-10">
          <h5 class="h45 black--text">
            対象：{{ targets[form.target] }}
          </h5>
          <h5 class="h45 black--text">
            送信日時：{{ form.datetime | datetimeFormat }}
          </h5>
          <br>
          <h5 class="h45 black--text">
            件名：{{ form.name }}
          </h5>
          <br>
          <h5 class="h45 black--text">
            {{ form.content }}
          </h5>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey">
              <v-btn
                color="secondary"
                height="56"
                block
                text
                aria-label="create register and send email"
                class="font-weight-bold"
                @click="onSubmit"
              >
                送信する
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="secondary"
                text
                height="56"
                aria-label="Cancel"
                @click="onClose"
              >
                キャンセル
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  uid: '',
  name: '',
  content: '',
  target: '',
  datetime: ''
}

export default {
  name: 'EditForm',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  async fetch () {
    await this.loadNotificationTargets()
  },
  data: () => ({
    loading: false,
    dialog: false,
    confirmDialog: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA)),
    targetItems: [
      { text: '全員：ユーザー・デリバー・飲食店', value: 'all' },
      { text: '全ユーザー', value: 'customers' },
      { text: '全デリバー', value: 'delivery' },
      { text: '全飲食店', value: 'stores' },
      { text: '個別', value: 'individual' }
    ],
    targets: {
      all: '全員：ユーザー・デリバー・飲食店',
      customers: '全ユーザー',
      delivery: '全デリバー',
      stores: '全飲食店',
      individual: '個別'
    }
  }),
  computed: {
    ...mapGetters('admin/notification', ['getDeliveries'])
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.form = JSON.parse(JSON.stringify(val))
          this.dialog = true
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/notification', ['saveNotification', 'loadNotificationTargets']),
    onClose () {
      this.dialog = false
      this.confirmDialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
      this.$refs.form.resetValidation()
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.saveNotification(this.form)
          .then(this.onClose)
          .finally(() => {
            this.loading = false
          })
      }
    },
    showConfirmDialog () {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.confirmDialog = true
      }
    }
  }
}
</script>
