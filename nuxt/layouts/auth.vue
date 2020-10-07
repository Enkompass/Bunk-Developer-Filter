<template>
  <v-app class="auth-layout">
    <v-main class="d-flex align-center">
      <v-card class="mx-auto elevation-0 fill-height rounded-0 overflow-y-hidden">
        <v-row no-gutters class="h-100">
          <v-col
            class="d-none d-md-flex justify-center align-center image"
            md="6"
            cols="12"
          />

          <v-col md="6" cols="12">
            <v-row align="center" justify="center" class="h-100" no-gutters>
              <nuxt />
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-main>
    <notify />
  </v-app>
</template>
<script>
import Notify from '~/components/Notify'

export default {
  components: { Notify }
}
</script>
