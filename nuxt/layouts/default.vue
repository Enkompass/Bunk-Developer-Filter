<template>
  <v-app>
    <store-appbar />
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <notification />
    <notify />
    <alert-dialog />
    <order-dialog />
  </v-app>
</template>

<script>
import StoreAppbar from '~/components/store/StoreAppbar'
import Notification from '~/components/Notification'
import Notify from '~/components/Notify'
import AlertDialog from '~/components/AlertDialog'
import OrderDialog from '~/components/store/OrderDialog'

export default {
  components: { OrderDialog, AlertDialog, Notify, Notification, StoreAppbar },
  middleware: ['auth', 'isStore']
}
</script>
