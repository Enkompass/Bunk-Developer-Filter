<template>
  <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2>
            {{ form.id ? 'エリアを編集' : 'エリアを新規作成' }}
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row align="center" class="px-0 px-md-12">
            <v-col cols="12" class="pa-2">
              <v-text-field
                v-model="form.text"
                :rules="[rules.required]"
                placeholder="エリア名"
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
</template>

<script>
import { mapActions } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  id: null,
  text: ''
}

export default {
  name: 'AreaEditDialog',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.dialog = true
          this.form = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/area', ['saveAreaItem']),
    onSubmit () {
      if (this.$refs.form.validate()) {
        this.saveAreaItem({ ...this.form })
          .then(this.onClose)
      }
    },
    onClose () {
      this.dialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
    }
  }
}
</script>
