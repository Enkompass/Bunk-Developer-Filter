<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="640" overlay-opacity="0.6">
      <v-card color="#D4D4D4">
        <v-card-title class="justify-center py-5 py-md-8">
          <h2 class="text-center font-weight-bold">
            {{ title }}
          </h2>
          <h3 v-if="subtitle" class="text-center mt-3" style="font-size: 18px !important;">
            {{ subtitle }}
          </h3>
        </v-card-title>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col md="6" sm="6" class="br-1-grey">
              <v-btn
                block
                color="error"
                text
                height="56"
                aria-label="Discard and Move"
                @click="returnSave(true)"
              >
                破棄して移動
              </v-btn>
            </v-col>
            <v-col md="6" sm="6">
              <v-btn
                block
                color="secondary"
                text
                height="56"
                aria-label="Go back and save"
                class="font-weight-bold"
                @click="returnSave(false)"
              >
                戻って保存
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
export default {
  name: 'Notification',
  data: () => ({
    dialog: false,
    title: '',
    subtitle: ''
  }),
  computed: {
    ...mapGetters(['next_path'])
  },
  created () {
    this.$bus.$on('notification.warning', (res) => {
      this.title = res.title
      this.subtitle = res.subtitle
      this.dialog = true
    })
  },
  methods: {
    ...mapActions(['setModalShow']),
    returnSave (status) {
      this.dialog = false
      this.setModalShow(status)
      if (status === true) {
        this.$router.push(this.next_path)
      }
      // this.$bus.$emit('notification.gotopage', status)
    }
  }
}
</script>
