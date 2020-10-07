<template>
  <div class="d-flex align-center mt-2">
    <v-text-field
      v-model="params.option"
      placeholder="オプション内容を入力…"
      aria-label="Enter options..."
      background-color="white"
      outlined
      dense
      hide-details
      class="mr-2"
      style="width: 70%;"
    />
    <v-text-field
      v-model="params.price"
      placeholder="価格"
      aria-label="Price"
      background-color="white"
      outlined
      dense
      hide-details
      class="mr-2"
      style="width: 25%;"
    />
    <h5 style="width: 5%;">
      円
    </h5>
  </div>
</template>

<script>
export default {
  name: 'OptionItem',
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
