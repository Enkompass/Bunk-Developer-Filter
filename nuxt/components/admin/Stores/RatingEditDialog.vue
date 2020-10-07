<template>
  <v-dialog v-model="dialog" persistent max-width="500" overlay-opacity="0.6">
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 pt-8">
          <h2>
            評価を編集できます
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="px-8 px-md-12 py-1">
              <div class="d-flex align-center">
                <v-rating :value="1" readonly dense color="warning" class="mr-4" />
                <v-text-field
                  v-model="form.rating.one"
                  :rules="[rules.required, rules.number]"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12" class="px-8 px-md-12 py-1">
              <div class="d-flex align-center">
                <v-rating :value="2" readonly dense color="warning" class="mr-4" />
                <v-text-field
                  v-model="form.rating.two"
                  :rules="[rules.required, rules.number]"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12" class="px-8 px-md-12 py-1">
              <div class="d-flex align-center">
                <v-rating :value="3" readonly dense color="warning" class="mr-4" />
                <v-text-field
                  v-model="form.rating.three"
                  :rules="[rules.required, rules.number]"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12" class="px-8 px-md-12 py-1">
              <div class="d-flex align-center">
                <v-rating :value="4" readonly dense color="warning" class="mr-4" />
                <v-text-field
                  v-model="form.rating.four"
                  :rules="[rules.required, rules.number]"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12" class="px-8 px-md-12 py-1">
              <div class="d-flex align-center">
                <v-rating :value="5" readonly dense color="warning" class="mr-4" />
                <v-text-field
                  v-model="form.rating.five"
                  :rules="[rules.required, rules.number]"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey-fixed">
              <v-btn
                color="secondary"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                type="submit"
                block
                text
                aria-label="update"
                class="font-weight-bold"
              >
                アップデート
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
  rating: {
    one: '',
    two: '',
    three: '',
    four: '',
    five: ''
  },
  uid: ''
}

export default {
  name: 'RatingEditDialog',
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
    ...mapActions('admin/stores', ['updateRatingValue']),
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    },
    onSubmit () {
      this.updateRatingValue(this.form)
        .then(this.onClose)
    }
  }
}
</script>
