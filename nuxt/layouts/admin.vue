<template>
  <v-app>
    <div class="navbar">
      <appbar />
    </div>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <notify />
    <alert-dialog />
  </v-app>
</template>

<script>
import Appbar from '~/components/admin/Appbar'
import Notify from '~/components/Notify'
import AlertDialog from '~/components/AlertDialog'

export default {
  components: { AlertDialog, Notify, Appbar },
  middleware: ['auth', 'isAdmin']
}
</script>
