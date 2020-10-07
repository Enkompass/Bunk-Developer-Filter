<template>
  <v-dialog v-model="dialog" persistent max-width="800" overlay-opacity="0.6">
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-card color="#D4D4D4" :loading="uploading">
        <v-card-title class="justify-center py-5 pt-8">
          <h2>
            {{ form.id ? '広告を編集' : '広告を新規作成' }}
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row align="center" class="px-0 px-md-12">
            <v-col cols="12" class="text-center">
              <VueFileAgent
                ref="image"
                v-model="form.image"
                class="profile-pic-upload-block"
                :multiple="false"
                :deletable="false"
                :meta="false"
                :compact="true"
                :accept="'image/*'"
                :help-text="'画像アップロード'"
                style="width: 200px; margin: auto;"
                @select="onSelect($event)"
              >
                <template v-slot:file-preview-new>
                  <div key="new">
                    <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                      <div class="d-flex align-center justify-center">
                        <span class="file-preview">
                          <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                            <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                          </span>
                          <span class="secondary--text" style="margin-top: 130%;">画像アップロード</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-slot:after-inner>
                  <div class="delete-button">
                    <v-btn v-if="form.image" icon fab @click="removePic">
                      <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                    </v-btn>
                  </div>
                  <!--<div class="upload-button">
                    <v-btn icon fab :class="{'disabled': uploading || !form.image}" @click="upload('image')">
                      <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="secondary&#45;&#45;text" />
                    </v-btn>
                  </div>-->
                </template>
              </VueFileAgent>
            </v-col>
            <v-col cols="12">
              <v-radio-group v-model="form.type" hide-details row>
                <v-radio active-class="active-radio-label" color="secondary" label="内部リンク" value="internal" />
                <v-radio active-class="active-radio-label" color="secondary" label="外部リンク" value="external" />
              </v-radio-group>
            </v-col>
            <v-col v-if="params.filter === 'home_search_store'" cols="12" class="pa-2">
              <v-autocomplete
                v-model="form.store_uid"
                :rules="[rules.required]"
                :items="getStoreItems"
                placeholder="店舗名"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_search_store'" cols="12" class="pa-2">
              <v-text-field
                v-model="form.address"
                :rules="[rules.required]"
                placeholder="住所"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_search_featured' || params.filter === 'home_search_food'" cols="12" class="pa-2">
              <v-autocomplete
                v-model="form.store_uid"
                :rules="[rules.required]"
                :items="getStoreItems"
                placeholder="店舗名"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_search_featured' || params.filter === 'home_search_food'" cols="12" class="pa-2">
              <v-autocomplete
                v-model="form.product_name"
                :items="getProductItems"
                :rules="[rules.required]"
                placeholder="商品名"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_search_featured' || params.filter === 'home_search_food'" cols="12" class="pa-2">
              <v-text-field
                v-model="form.price"
                :rules="[rules.required, rules.number]"
                placeholder="価格"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_category_frame' || params.filter === 'home_category_frame2'" cols="12" class="pa-2">
              <v-autocomplete
                v-model="form.store_uid"
                :rules="[rules.required]"
                :items="getStoreItems"
                placeholder="店舗名"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_category_frame' || params.filter === 'home_category_frame2'" cols="12" class="pa-2">
              <v-text-field
                v-model="form.product_name"
                :rules="[rules.required]"
                placeholder="商品名"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_category_frame' || params.filter === 'home_category_frame2'" cols="12" class="pa-2">
              <v-text-field
                v-model="form.price"
                :rules="[rules.required, rules.number]"
                placeholder="価格"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col v-if="params.filter === 'home_category_frame' || params.filter === 'home_category_frame2'" cols="12" class="pa-2">
              <v-autocomplete
                v-model="form.category"
                :rules="[rules.required]"
                :items="categoryItems"
                placeholder="カテゴリ"
                item-text="category"
                item-value="id"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" class="pa-2">
              <v-text-field
                v-if="form.type === 'external'"
                v-model="form.hyper_link"
                :rules="[rules.required, rules.isValidUrl]"
                placeholder="リンク先"
                background-color="white"
                outlined
                dense
                hide-details
              />
              <v-autocomplete
                v-if="form.type === 'internal'"
                v-model="form.hyper_link"
                :rules="[rules.required]"
                :items="getStoreItems"
                placeholder="リンク先"
                background-color="white"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" class="pa-2">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateRangeText"
                    :rules="[rules.required]"
                    background-color="white"
                    placeholder="表示期間"
                    readonly
                    outlined
                    dense
                    hide-details
                    clearable
                    v-on="on"
                    @click:clear="form.display_date = []"
                  />
                </template>
                <v-date-picker v-model="form.display_date" range>
                  <v-spacer />
                  <v-btn text color="primary" @click="menu = false">
                    {{ $t('common.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(form.display_date)">
                    {{ $t('common.save') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="py-0">
          <v-row no-gutters>
            <v-col cols="6" class="br-1-grey-fixed">
              <v-btn
                :disabled="uploading"
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                color="secondary"
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
                :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                block
                color="secondary"
                text
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
    <v-dialog
      v-model="loading"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          ストアメニューを読み取り中です。
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'

const DEFAULT_SCHEMA = {
  id: null,
  image: null,
  store_name: '',
  store_uid: '',
  address: '',
  product_name: '',
  price: 0,
  category: null,
  hyper_link: '',
  store_link: null,
  display_date: [],
  type: 'internal'
}

export default {
  name: 'AdvertiseEditDialog',
  mixins: [validationRules],
  props: {
    value: {
      type: Object,
      default: null
    },
    params: {
      type: Object,
      default: () => ({
        filter: 'home_search_store'
      })
    }
  },
  data: () => ({
    dialog: false,
    categoryItems: [],
    storeItems: [],
    image: null,
    loading: false,
    uploading: false,
    uploadHeaders: {},
    menu: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  computed: {
    ...mapGetters('common', ['getStoreItems']),
    ...mapGetters('admin/advertise', ['getProductItems']),
    ...mapGetters(['imageUploadUrl']),
    dateRangeText () {
      return this.form.display_date ? this.form.display_date.length > 0 ? this.form.display_date.join(' ~ ') : '' : ''
    }
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.dialog = true
          this.form = JSON.parse(JSON.stringify(val))
        }
      }
    },
    'form.store_uid': {
      deep: true,
      async handler (val) {
        this.loading = true
        await this.loadProducts({
          store_uid: val
        })
        this.loading = false
        console.log(this.getProductItems)
      }
    }
  },
  async created () {
    this.categoryItems = await this.getStoreCategory({
      $axios: this.$axios
    })
    await this.loadStoreItem()
  },
  methods: {
    ...mapActions('common', ['loadStoreItem']),
    ...mapActions('admin/advertise', ['saveAdvertise', 'loadProducts']),
    ...mapActions('admin/category', ['getStoreCategory']),
    onSelect () {
      this.uploading = true
      this.$refs.image.upload(this.imageUploadUrl, this.uploadHeaders, [this.form.image], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', 'advertise')
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.form.image.url = res[0].data.message
        this.uploading = false
      })
    },
    removePic () {
      this.form.image = null
      this.uploading = false
    },
    upload (ref) {
      this.$refs.image.upload(this.imageUploadUrl, this.uploadHeaders, [this.form.image], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', ref)
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.form.image.url = res[0].data.message
        this.uploading = true
      })
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        const temp = JSON.parse(JSON.stringify(this.form))
        if (!temp.image) {
          return this.$notify.warning({
            title: '警鐘',
            message: 'イメージを選択する必要があります。'
          })
        }
        const payload = {
          id: temp.id,
          type: this.params.filter,
          image: temp.image ? temp.image.url : null,
          hyper_link: temp.hyper_link,
          display_date: temp.display_date,
          store_name: temp.store_name,
          store_uid: temp.store_uid,
          product_name: temp.product_name,
          price: temp.price,
          category: temp.category,
          address: temp.address
        }
        this.saveAdvertise({
          ...payload
        }).then(this.onClose)
      }
    },
    onClose () {
      this.dialog = false
      this.$emit('input', null)
    }
  }
}
</script>
