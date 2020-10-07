<template>
  <div class="mt-4" style="width: 100% !important;">
    <div v-if="left" class="d-flex align-end">
      <v-avatar class="mr-2">
        <img
          :src="avatar"
          alt=""
        >
      </v-avatar>
      <v-card class="pa-0 mr-2" max-width="350">
        <v-card-text class="pa-2 font-weight-medium">
          {{ message }}
        </v-card-text>
      </v-card>
      <h6 class="h7">
        {{ timestamp | timeFormat }}
      </h6>
    </div>
    <div v-else class="d-flex align-end justify-end">
      <h6 class="h7">
        {{ timestamp | timeFormat }}
      </h6>
      <v-card class="pa-0 ml-2" max-width="350" color="secondary">
        <v-card-text class="pa-2 white--text font-weight-medium">
          {{ message }}
        </v-card-text>
      </v-card>
      <v-avatar class="ml-2">
        <img
          :src="avatar"
          alt=""
        >
      </v-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Number,
      default: 0
    },
    left: {
      type: Boolean,
      default: true
    }
  }
}
</script>
