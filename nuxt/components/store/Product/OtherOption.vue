<template>
  <div>
    <v-text-field
      v-model="params.category"
      placeholder="オプションカテゴリ1を入力…"
      aria-label="Enter Option Category 1…"
      background-color="white"
      outlined
      dense
      hide-details
      class="my-1"
    />
    <v-radio-group v-model="params.required" hide-details dense row class="mt-1">
      <v-radio active-class="active-radio-label" color="secondary" label="必須選択" :value="true" />
      <v-radio active-class="active-radio-label" color="secondary" label="任意選択" :value="false" />
    </v-radio-group>
    <option-item v-for="(item, index) in params.options" :key="index" :params="item" />
    <v-btn
      text
      small
      color="secondary"
      class="px-0 mt-2"
      :ripple="false"
      @click="addOptionItem"
    >
      <font-awesome-icon :icon="['fas', 'plus-circle']" class="secondary--text" />
      オプション内容を追加
    </v-btn>
  </div>
</template>

<script>
import OptionItem from '~/components/store/Product/OptionItem'
export default {
  name: 'OtherOption',
  components: { OptionItem },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    addOptionItem () {
      if (this.params.options.length >= 5) {
        return this.$notify.warning({
          title: '警鐘',
          message: '最大に5つオプションを追加できます。'
        })
      }
      this.params.options.push({ option: '', price: '' })
    }
  }
}
</script>
