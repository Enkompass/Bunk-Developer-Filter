<template>
  <div class="store-store-account">
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'store']" class="secondary--text" />
        店舗・アカウント情報
      </h3>
      <v-btn
        color="secondary"
        width="120"
        height="40"
        class="mt-2 mt-md-0"
        :block="$vuetify.breakpoint.xs"
        @click="save"
      >
        保存
      </v-btn>
    </div>
    <v-row no-gutters class="mt-5">
      <v-col cols="12" md="6" sm="12" class="pr-0 pr-md-12">
        <password />
        <phone-verify v-model="phoneItem" />
        <image-upload />
      </v-col>
      <v-col cols="12" md="6" sm="12" class="mt-3 mt-md-0">
        <v-form ref="form" @submit.prevent="save">
          <div class="d-flex">
            <h6>調理時間目安(受注から梱包完了まで)</h6>
            <h6 class="error--text ml-2">
              ※必須
            </h6>
          </div>
          <v-radio-group v-model="editedItem.cooking_time" :rules="[rules.required]" row class="mt-2" active-class="active-label">
            <v-radio active-class="active-radio-label" color="secondary" label="15分" value="15" />
            <v-radio active-class="active-radio-label" color="secondary" label="25分" value="25" />
            <v-radio active-class="active-radio-label" color="secondary" label="35分" value="35" />
            <v-radio active-class="active-radio-label" color="secondary" label="45分" value="45" />
          </v-radio-group>

          <div class="d-flex mt-5 mt-md-10">
            <h6>店舗エリア</h6>
            <h6 class="error--text ml-2">
              ※1つ必須
            </h6>
          </div>
          <h6 class="h7 grey--text">
            ※一番近いエリアを選択してください。
          </h6>
          <v-radio-group v-model="editedItem.area" :rules="[rules.required]" class="mt-2" active-class="active-label">
            <v-radio
              v-for="(item, index) in getAreaRows"
              :key="index"
              active-class="active-radio-label"
              color="secondary"
              :label="item.text"
              :value="item.value"
            />
          </v-radio-group>

          <div class="d-flex mt-5 mt-md-10">
            <h6>店舗カテゴリの選択</h6>
            <h6 class="error--text ml-2">
              ※必須
            </h6>
          </div>
          <h6 class="h7 grey--text">
            ※複数選択可ですが、本部が該当しないと判断した場合は修正させて頂きます。
          </h6>
          <v-chip-group
            v-model="editedItem.filter"
            multiple
            column
            active-class="active-label"
          >
            <v-row no-gutters>
              <template v-for="(item, index) in filterItems">
                <v-col :key="index" :sm="$vuetify.breakpoint.mdAndUp ? 4 : 6">
                  <v-chip
                    color="#f2f2f2"
                    pill
                    text-color="black"
                    :ripple="false"
                    :value="item.value"
                  >
                    <v-icon color="grey">
                      mdi-check-circle
                    </v-icon>
                    <h5>{{ item.text }}</h5>
                  </v-chip>
                </v-col>
              </template>
            </v-row>
          </v-chip-group>

          <div class="d-md-flex mt-5 mt-md-10">
            <h6>店舗ページに表示させるクーポン</h6>
            <h6 class="error--text ml-md-2 ml-0">
              ※どれか1つ選択可
            </h6>
          </div>
          <v-radio-group v-model="editedItem.coupon" :rules="[]" class="mt-2" active-class="active-label">
            <v-radio
              v-for="(item, index) in getCoupons"
              :key="index"
              active-class="active-radio-label"
              color="secondary"
              :label="item.text"
              :value="item.value"
            />
          </v-radio-group>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Password from '~/components/store/Account/Password'
import PhoneVerify from '~/components/store/Account/PhoneVerify'
import ImageUpload from '~/components/store/Account/ImageUpload'
import validationRules from '~/mixins/validationRules'

export default {
  name: 'StoreAccount',
  components: { ImageUpload, PhoneVerify, Password },
  mixins: [validationRules],
  async fetch () {
    await this.loadCouponItems()
  },
  data: () => ({
    editedItem: {
      cooking_time: '',
      filter: [],
      area: '',
      coupon: 2000
    },
    phoneItem: {
      store_name: '',
      address: '',
      email: '',
      telephone: '',
      mobile_phone: ''
    },
    areaItems: [],
    filterItems: [],
    couponItems: []
  }),
  computed: {
    ...mapGetters('common/coupon', ['getCoupons']),
    ...mapGetters('admin/area', ['getAreaRows'])
  },
  async created () {
    await this.loadAreaItems()
    this.filterItems = await this.getCategory({
      $axios: this.$axios,
      type: 'store'
    })
    const category = []
    if (this.$auth.$state.user.user.categories) {
      this.$auth.$state.user.user.categories.forEach((item) => {
        category.push(parseInt(item))
      })
    }
    this.editedItem.cooking_time = this.$auth.$state.user.user.cooking_time
    this.editedItem.filter = category
    this.editedItem.area = parseInt(this.$auth.$state.user.user.near_area)
    this.editedItem.coupon = this.$auth.$state.user.user.coupon
    this.phoneItem.store_name = this.$auth.$state.user.user.name
    this.phoneItem.address = this.$auth.$state.user.user.address
    this.phoneItem.email = this.$auth.$state.user.user.email
    this.phoneItem.telephone = this.$auth.$state.user.user.telephone
    this.phoneItem.mobile_phone = this.$auth.$state.user.user.mobile_phone
  },
  methods: {
    ...mapActions('admin/area', ['loadAreaItems']),
    ...mapActions('common/category', ['getCategory']),
    ...mapActions('common/coupon', ['loadCouponItems']),
    ...mapActions('store/account', ['saveInfos']),
    async save () {
      if (!this.$refs.form.validate()) {
        return this.$bus.$emit('alert.required')
      }
      if (this.phoneItem.store_name === 'admin') {
        return this.$notify.warning({
          message: 'ストア名は「管理者」にすることはできません'
        })
      }
      await this.saveInfos({
        $axios: this.$axios,
        params: Object.assign(this.editedItem, this.phoneItem)
      })
      await this.$auth.fetchUser()
    }
  },
  head: () => ({
    title: '店舗・アカウント情報'
  })
}
</script>
