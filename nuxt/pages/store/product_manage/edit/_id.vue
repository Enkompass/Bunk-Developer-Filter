<template>
  <div class="store-product-manage-edit">
    <v-form ref="form" @submit.prevent="save">
      <div class="d-sm-flex justify-space-between align-center">
        <h3 class="font-weight-bold">
          <font-awesome-icon :icon="['fas', 'utensils']" class="secondary--text" />
          メニューの編集
        </h3>
        <div class="d-flex justify-space-around mt-2 mt-md-0">
          <v-btn
            outlined
            color="secondary"
            :width="$vuetify.breakpoint.mdAndUp ? 120 : '33%'"
            height="40"
            aria-label="cancel"
            class="mr-1 mr-md-3"
            to="/store/product_manage"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="secondary"
            :width="$vuetify.breakpoint.mdAndUp ? 120 : '33%'"
            height="40"
            aria-label="save"
            type="submit"
          >
            保存
          </v-btn>
        </div>
      </div>
      <v-row no-gutters class="mt-5">
        <v-col cols="12" md="6" sm="12" class="pr-0 pr-md-12">
          <div class="d-flex">
            <h6 aria-label="product name" class="font-weight-bold">
              商品名
            </h6>
            <h6 class="error--text ml-2">
              ※必須
            </h6>
          </div>
          <v-text-field
            v-model="form.product_name"
            :rules="[rules.required]"
            placeholder="商品名を入力…"
            background-color="white"
            outlined
            dense
            hide-details
            class="my-1"
          />

          <div class="d-flex">
            <h6 aria-label="product price" class="font-weight-bold">
              商品価格(税込)
            </h6>
            <h6 class="error--text ml-2">
              ※必須 (※数値の入力は半角で行ってください)
            </h6>
          </div>
          <v-text-field
            v-model="form.tax_price"
            :rules="[rules.required, rules.number]"
            placeholder="商品価格(税込)を入力…"
            background-color="white"
            outlined
            dense
            hide-details
            class="my-1"
          />

          <div class="d-flex">
            <h6 aria-label="Product introduction" class="font-weight-bold">
              商品の紹介文(最大120文字)
            </h6>
            <h6 class="error--text ml-2">
              ※必須
            </h6>
          </div>
          <v-textarea
            v-model="form.description"
            :rules="[rules.required, rules.max]"
            :rows="$vuetify.breakpoint.mdAndUp ? 6 : 3"
            placeholder="商品の紹介文を入力(最大120文字)…"
            background-color="white"
            counter
            no-resize
            outlined
            dense
            class="my-1"
          />

          <div class="d-flex">
            <h6 aria-label="Upload Menu Image" class="font-weight-bold">
              メニュー画像のアップロード
            </h6>
            <h6 class="black--text ml-2">
              ※2MB以下
            </h6>
          </div>
          <v-row id="profile-pic" no-gutters>
            <v-col cols="12" md="6">
              <client-only>
                <VueFileAgent
                  id="menu_photo"
                  ref="menu_photo"
                  v-model="menu_photo"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  :max-size="'2MB'"
                  :help-text="'画像をここにドラッグする'"
                  style="cursor: pointer;"
                  @select="onSelect($event)"
                  @click="showEditImageDialog"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div
                        class="file-preview-wrapper grid-box-item grid-block file-preview-new"
                        @click="showEditImageDialog"
                      >
                        <div class="d-flex align-center justify-center" style="width: 100%; height: 100%;">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'plus-circle']" class="secondary--text" />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="displayed-image" style="cursor: pointer;" @click="showEditImageDialog" />
                  </template>
                </VueFileAgent>
              </client-only>
            </v-col>
          </v-row>

          <div class="d-flex mt-2">
            <h6 aria-label="number of inventory">
              在庫数
            </h6>
            <h6 class="error--text ml-2">
              ※必須 (※数値の入力は半角で行ってください)
            </h6>
          </div>
          <v-text-field
            v-model="form.stocks"
            :rules="[rules.required]"
            placeholder="在庫数を入力…"
            background-color="white"
            outlined
            dense
            hide-details
            class="my-1"
          />
          <div class="d-flex justify-end">
            <v-btn v-if="form.null_stock" outlined color="error" @click="setNullStock(false)">
              品切れを解除
            </v-btn>
            <v-btn v-else outlined color="secondary" @click="setNullStock(true)">
              品切れにする
            </v-btn>
          </div>

          <div class="d-flex">
            <h6 aria-label="Sales hours" class="font-weight-bold">
              販売時間
            </h6>
            <h6 class="error--text ml-2">
              ※必須
            </h6>
          </div>
          <v-radio-group v-model="form.is_day_sale" :rules="[rules.required]" hide-details class="mt-2">
            <v-radio active-class="active-radio-label" color="secondary" label="終日販売" value="day" />
            <v-radio active-class="active-radio-label" color="secondary" label="タイムサービス商品" value="time" />
          </v-radio-group>
          <v-row no-gutters class="mt-2">
            <v-col cols="12" sm="12" md="6" class="pl-0">
              <div class="d-flex align-center">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.sales_time[0]"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.sales_time[0]"
                      background-color="white"
                      placeholder="00:00"
                      readonly
                      outlined
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="menu1"
                    v-model="form.sales_time[0]"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menu1.save(form.sales_time[0])"
                  />
                </v-menu>
                <h6 class="mx-1 mx-md-3">
                  ~
                </h6>
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.sales_time[1]"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.sales_time[1]"
                      background-color="white"
                      placeholder="00:00"
                      readonly
                      outlined
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="form.sales_time[1]"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menu2.save(form.sales_time[1])"
                  />
                </v-menu>
              </div>
            </v-col>
          </v-row>

          <div class="d-flex mt-3">
            <h6 aria-label="List price" class="font-weight-bold">
              商品定価
            </h6>
            <h6 class="error--text ml-2">
              ※必須 (※数値の入力は半角で行ってください)
            </h6>
          </div>
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12">
              <div class="d-flex align-center">
                <v-text-field
                  v-model="form.price"
                  :rules="[rules.required, rules.number]"
                  placeholder="価格"
                  background-color="white"
                  outlined
                  dense
                  hide-details
                  class="my-1"
                  style="width: 70%;"
                />
                <h5>円(税込)</h5>
              </div>
            </v-col>
          </v-row>

          <div class="mt-3">
            <div class="d-flex">
              <h6 aria-label="Discount" class="font-weight-bold">
                値引き
              </h6>
              <h6 class="error--text ml-2">
                ※必須 (※数値の入力は半角で行ってください)
              </h6>
            </div>
            <h6 class="h7 grey--text" aria-label="* Up to 50% of the list price is allowed.">
              ※定価の最大50%まで可
            </h6>
          </div>
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12">
              <div class="d-flex align-center">
                <v-text-field
                  v-model="form.discount_price"
                  :rules="[rules.discount(form.discount_price, form.price), rules.number]"
                  placeholder="価格"
                  background-color="white"
                  outlined
                  dense
                  class="my-1 mr-2"
                  style="width: 100px;"
                />
                <h5>円値引きを適用</h5>
              </div>
            </v-col>
          </v-row>

          <div class="mt-3">
            <div class="d-flex align-end">
              <h6 aria-label="Package size of the product (sum of length, width, and height)" class="font-weight-bold">
                商品の梱包サイズ
              </h6>
              <h6 class="h7 black--text font-weight-bold ml-2">
                ※3辺…縦・横・高さ
              </h6>
              <h6 class="error--text ml-2">
                ※必須
              </h6>
            </div>
            <h6 class="h7 grey--text" aria-label="*If you want to pack one item in multiple parts, please add it up.">
              ※1つの商品を複数に分けて梱包する場合は足し算してください。
            </h6>
          </div>
          <v-radio-group
            v-model="form.size"
            column
            hide-details
            :rules="[rules.required]"
            class="mt-2"
            color="white"
          >
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="6">
                <v-radio active-class="active-radio-label" color="secondary" label="3辺の合計が30cm未満" value="0" />
                <v-radio active-class="active-radio-label" color="secondary" label="3辺の合計が30〜40cm未満" value="1" />
                <v-radio active-class="active-radio-label" color="secondary" label="3辺の合計が40〜50cm未満" value="2" />
                <v-radio active-class="active-radio-label" color="secondary" label="3辺の合計が50cm以上" value="3" />
              </v-col>
              <v-col cols="12" sm="12" md="6" class="mt-2 mt-md-0">
                <v-radio active-class="active-radio-label" color="secondary" label="直径16cm以上の丼物" value="4" />
                <v-radio active-class="active-radio-label" color="secondary" label="ドリンク類" value="5" />
                <v-radio active-class="active-radio-label" color="secondary" label="底面が32×23cm以上" value="6" />
              </v-col>
            </v-row>
          </v-radio-group>
        </v-col>

        <v-col cols="12" md="6" sm="12">
          <div class="d-flex mt-3">
            <h6
              aria-label="Do you want to describe 'order conditions: 20 years old or older'?"
              class="font-weight-bold"
            >
              「注文条件：20歳以上」を表記しますか？
            </h6>
            <h6 class="error--text ml-2">
              ※必須
            </h6>
          </div>
          <v-radio-group v-model="form.is_overage" row hide-details class="mt-2">
            <v-radio active-class="active-radio-label" color="secondary" aria-label="Yes" label="はい" :value="true" />
            <v-radio active-class="active-radio-label" color="secondary" aria-label="No" label="いいえ" :value="false" />
          </v-radio-group>

          <div class="d-flex mt-5">
            <h6 aria-label="COMMODITY TAG" class="font-weight-bold">
              商品タグ
            </h6>
            <h6 class="error--text ml-2" aria-label="*One or more required">
              ※1つ以上必須
            </h6>
          </div>
          <v-chip-group
            v-model="form.categories"
            multiple
            column
          >
            <v-chip
              v-for="(item, index) in categoryItems"
              :key="index"
              :ripple="false"
              :value="item.value"
              active-class="secondary--text secondary"
              text-color="grey"
              pill
              outlined
              label
            >
              <h5>{{ item.text }}</h5>
            </v-chip>
          </v-chip-group>
          <v-textarea
            v-model="form.othertags"
            placeholder="その他商品タグを入力…（単語は半角カンマで区切ってください）"
            aria-label="Enter other product tags..."
            :rows="$vuetify.breakpoint.mdAndUp ? 4 : 3"
            background-color="white"
            no-resize
            outlined
            dense
            hide-details
            class="mt-3"
          />

          <div class="d-flex mt-5">
            <h6 aria-label="Register Options" class="font-weight-bold">
              オプションを登録
            </h6>
          </div>
          <h6 class="h7 grey--text" aria-label="*You can register up to 3 options per item.">
            ※1商品につき、オプションは3個まで登録できます。
          </h6>
          <other-option
            v-for="(item, index) in form.otherOptions"
            :key="index"
            :params="item"
            class="mt-8"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-dialog
      v-model="dialog.image_edit"
      content-class="image_edit_dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      class="rounded-0"
    >
      <v-card class="rounded-0" color="#f2f2f2" :loading="uploading">
        <v-card-title class="pa-md-10 pt-6 pl-4 d-flex justify-space-between align-center">
          <div>
            <h3 class="font-weight-bold font28">
              <font-awesome-icon :icon="['fas', 'utensils']" class="secondary--text" />
              メニュー画像管理
            </h3>
            <h5 class="mt-3 mt-md-1">
              ※画像は1枚につき2MB以下 70枚まで保存可
            </h5>
          </div>
          <div class="d-flex justify-space-between mt-2 mt-md-0" style="width: 100%;">
            <v-btn
              v-if="!mode.delete"
              :width="$vuetify.breakpoint.mdAndUp ? 120 : '25%'"
              outlined
              color="error"
              height="40"
              class="mr-1 mr-md-3 rounded-md h67"
              @click="multiDelete"
            >
              一括削除
            </v-btn>
            <v-btn
              v-if="!mode.delete"
              :width="$vuetify.breakpoint.mdAndUp ? 120 : '25%'"
              outlined
              color="secondary"
              height="40"
              class="mr-1 mr-md-3 rounded-md h67"
              @click="uploadSelected"
            >
              アップロード
            </v-btn>
            <v-btn
              outlined
              :width="$vuetify.breakpoint.mdAndUp ? 120 : '25%'"
              height="40"
              color="secondary"
              class="mr-1 mr-md-3 rounded-md"
              @click="cancel"
            >
              キャンセル
            </v-btn>
            <v-btn
              v-if="!mode.delete"
              :width="$vuetify.breakpoint.mdAndUp ? 120 : '25%'"
              depressed
              height="40"
              color="secondary"
              class="rounded-md"
              @click="register"
            >
              登録
            </v-btn>
            <v-btn
              v-else
              :width="$vuetify.breakpoint.mdAndUp ? 120 : '25%'"
              depressed
              height="40"
              color="error"
              class="rounded-md"
              @click="confirmDelete"
            >
              削除
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text class="px-4">
          <client-only>
            <VueFileAgent
              v-if="agentLoading"
              ref="vueFileAgent"
              v-model="fileRecords"
              class="multi-select-vue-file-agent"
              :theme="'grid'"
              :multiple="true"
              :deletable="false"
              :meta="false"
              :accept="'image/*'"
              :max-size="'2MB'"
              :max-files="70"
              :help-text="'画像をここにドラッグする'"
              :error-text="{
                type: 'Invalid file type. Only images Allowed',
                size: 'Files should not exceed 2MB in size',
              }"
              @select="filesSelected($event)"
            >
              <template v-slot:file-preview="{ fileRecord, index }">
                <div
                  class="file-preview-wrapper-jpg file-preview-wrapper-image file-category-image is-deletable"
                  @click="selectImage(fileRecord, index, !fileRecord.active)"
                >
                  <span
                    class="file-preview image-preview border"
                    :class="{ 'active': fileRecord.active === true, 'error-color': mode.delete }"
                    :style="{'background-color': fileRecord.color}"
                  >
                    <span class="file-preview-overlay" />
                    <span
                      class="thumbnail"
                      style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden;"
                    >
                      <img class="file-preview-img" :src="fileRecord.urlResized">
                    </span>
                    <span class="file-name">
                      <span class="file-name-text">
                        {{ fileRecord.active }}
                        {{ fileRecord.file.name }}
                      </span>
                    </span>
                    <span class="image-dimension">
                      <span class="image-dimension-width">{{ fileRecord.dimensions.width }}</span>
                      <span class="image-dimension-height">{{ fileRecord.dimensions.height }}</span>
                    </span>
                  </span>
                  <span
                    class="selected"
                    :class="{ 'active': fileRecord.active === true, 'inactive': !fileRecord.active }"
                    style="position: absolute; top: 15px; right: 15px; z-index: 11;"
                  >
                    <v-icon :color="mode.delete ? 'error' : '#0d7684'">
                      mdi-check-circle
                    </v-icon>
                  </span>
                </div>
              </template>
            </VueFileAgent>
          </client-only>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="uploaded">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationRules from '~/mixins/validationRules'
import OtherOption from '~/components/store/Product/OtherOption'

export default {
  components: { OtherOption },
  mixins: [validationRules],
  data: () => ({
    params: {
      id: -1
    },
    form: {
      description: '',
      sales_time: ['', ''],
      otherOptions: [
        {
          category: '',
          required: false,
          options: [
            {
              option: '',
              price: ''
            },
            {
              option: '',
              price: ''
            },
            {
              option: '',
              price: ''
            }
          ]
        },
        {
          category: '',
          required: false,
          options: [
            {
              option: '',
              price: ''
            },
            {
              option: '',
              price: ''
            },
            {
              option: '',
              price: ''
            }
          ]
        },
        {
          category: '',
          required: false,
          options: [
            {
              option: '',
              price: ''
            },
            {
              option: '',
              price: ''
            },
            {
              option: '',
              price: ''
            }
          ]
        }
      ]
    },
    profilePic: null,
    menu_photo: null,
    uploaded: false,
    uploadHeaders: {},
    menu1: false,
    menu2: false,
    categoryItems: [],
    sizeItems: [
      {
        text: '3辺の合計が30cm未満',
        value: '0'
      },
      {
        text: '3辺の合計が30〜40cm未満',
        value: '1'
      },
      {
        text: '3辺の合計が40〜50cm未満',
        value: '2'
      },
      {
        text: '3辺の合計が50cm以上',
        value: '3'
      },
      {
        text: '直径16cm以上の丼物',
        value: '4'
      },
      {
        text: 'ドリンク類',
        value: '5'
      },
      {
        text: '底面が32×23cm以上',
        value: '6'
      }
    ],
    editedItem: {},
    dialog: { image_edit: false },
    notifications: false,
    sound: true,
    widgets: false,
    fileRecords: [],
    fileRecordsForUpload: [],
    selectedIndex: [],
    selectedImage: [],
    selectLimit: 1,
    compKey: 0,
    mode: {
      delete: false
    },
    agentLoading: true,
    uploading: false
  }),
  computed: {
    ...mapGetters(['imageUploadUrl']),
    ...mapGetters('store/products', ['getMenuImages'])
  },
  async mounted () {
    this.params.id = this.$route.params.id
    this.categoryItems = await this.getCategory({
      $axios: this.$axios,
      type: 'product'
    })
    await this.fetchData()
    if (this.form.photo) {
      this.menu_photo = {
        name: 'Menu Photo',
        sizeText: '549 KB',
        size: 0,
        type: 'image/jpeg',
        ext: 'jpeg',
        dimensions: {
          width: 1920,
          height: 1080
        },
        url: this.form.photo
      }
    }
  },
  methods: {
    ...mapActions('common/category', ['getCategory']),
    ...mapActions('store/products', ['getProductItem', 'saveProduct', 'saveMenuImages', 'loadMenuImage', 'deleteImageUrls']),
    async fetchData () {
      if (this.params.id !== '-1') {
        try {
          this.form = await this.getProductItem({
            $axios: this.$axios,
            params: this.params
          })
        } catch (e) {
          if (e) {
            this.$router.push('/store/product_manage')
          }
        }
      }
      await this.loadMenuImage()
      this.fileRecords = this.getMenuImages.map((item) => {
        return {
          name: 'Menu Photo',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.img_link
        }
      })
    },
    removePic (ref) {
      const profilePic = this[ref]
      this.$refs[ref].deleteUpload(this.imageUploadUrl, this.uploadHeaders, [profilePic])
      this[ref] = null
      this.uploaded = false
    },
    upload (ref) {
      this.uploading = true
      this.$refs[ref].upload(this.imageUploadUrl, this.uploadHeaders, [this[ref]]).then(() => {
        this.uploaded = true
        this.uploading = false
        setTimeout(function () {
          this[ref].progress(0)
        }, 500)
      })
    },
    onSelect (fileRecords) {
      this.uploaded = true
      this.$refs.menu_photo.upload(this.imageUploadUrl, this.uploadHeaders, [this.menu_photo], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', 'menu_photo')
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.menu_photo.url = res[0].data.message
        this.form.photo = res[0].data.message
        this.uploaded = false
      })
    },
    async save () {
      if (!this.$refs.form.validate()) {
        return
      }
      await this.saveProduct({
        $axios: this.$axios,
        params: this.form
      })
      this.$router.push('/store/product_manage')
    },
    setNullStock (status) {
      this.form.null_stock = status
    },
    showEditImageDialog () {
      this.dialog.image_edit = true
    },
    filesSelected (fileRecordsNewlySelected) {
      this.uploaded = true
      this.$refs.vueFileAgent.upload(this.imageUploadUrl, this.uploadHeaders, fileRecordsNewlySelected, function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', 'menu_photo')
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        const validRecords = fileRecordsNewlySelected.map((item, index) => {
          const temp = item
          temp.url = res[index].data.message
          return temp
        })
        const validFileRecords = validRecords.filter(fileRecord => !fileRecord.error)
        this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords)
        this.uploaded = false
      })
    },
    multiDelete () {
      this.mode.delete = !this.mode.delete
    },
    confirmDelete () {
      this.selectedIndex = this.fileRecords.map((item, index) => {
        if (item.active === true) {
          return index
        }
      }).filter(item => item !== undefined)
      const deleteurls = []
      for (let i = this.selectedIndex.length; i > 0; i--) {
        deleteurls.push(this.fileRecords[i].url)
        this.fileRecords.splice(this.selectedIndex[i - 1], 1)
      }
      this.fileRecords = this.fileRecords.map((item) => {
        item.active = false
        return item
      })
      this.deleteImageUrls({
        images: deleteurls
      })
      this.selectedIndex = []
      this.mode.delete = false
    },
    cancel () {
      if (this.mode.delete === true) {
        this.agentLoading = false
        for (let i = 0; i < this.fileRecords.length; i++) {
          const record = this.fileRecords[i]
          delete record.active
          this.fileRecords[i] = record
        }
        this.selectedIndex = []
        this.agentLoading = true
        // this.$refs.vueFileAgent.updateFileRecord()
        // this.fileRecords = this.fileRecords.reverse()
        // this.fileRecords = this.fileRecords.reverse()
        // this.agentLoading = true
        this.mode.delete = false
        return
      }
      this.dialog.image_edit = false
    },
    uploadSelected () {
      /* this.uploaded = false
      const selected = this.selectedIndex.map(item => this.fileRecordsForUpload[item])
      this.$refs.vueFileAgent.upload(this.imageUploadUrl, this.uploadHeaders, selected, function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', 'menu_photo')
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.$notify.success({
          title: 'アップロードに成功しました'
        })
        const temp = selected[0]
        temp.url = res[0].data.message
        // this.menu_photo = selected[0]
        // this.menu_photo.url = res[0].data.message
        this.selectedImage[0] = temp
        this.uploaded = true
      }) */
      const menuUrls = this.fileRecords.map((item) => {
        if (typeof item.url === 'function') {
          return item.urlResized
        }
        return item.url
      })
      const valid = menuUrls.filter(item => item.startsWith('data:')).length > 0
      if (valid) {
        return this.$notify.warning({
          message: '現在イメージアップロード中です。'
        })
      }
      this.saveMenuImages({
        images: menuUrls
      })
    },
    register () {
      const selected = this.fileRecords.map((item, index) => {
        if (item.active === true) {
          return index
        }
      }).filter(item => item !== undefined)
      if (selected.length === 0) {
        return this.$notify.warning({
          title: '登録前に必ず1つ以上のイメージを選択してください。'
        })
      }
      const fileRecord = this.fileRecords[selected[0]]
      if (fileRecord.url) {
        let url = ''
        if (typeof fileRecord.url === 'function') {
          this.form.photo = fileRecord.urlResized
          url = fileRecord.urlResized
        } else {
          this.form.photo = fileRecord.url
          url = fileRecord.url
        }
        this.menu_photo = {
          name: 'Menu Photo',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url
        }
        this.dialog.image_edit = false
      }
    },
    deleteUploadedFile (fileRecord) {
      // Using the default uploader. You may use another uploader instead.
      this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord)
    },
    selectImage (record, index, status) {
      if ((status === true || status === undefined) && this.mode.delete === false) {
        if (this.selectedIndex.length >= this.selectLimit) {
          return this.$notify.warning({
            title: 'ウォーニング',
            message: `選択できるイメージは ${this.selectLimit} つだけです。`
          })
        }
      }
      record.active = status
      this.fileRecords[index].active = status
      this.fileRecords = this.fileRecords.reverse()
      this.fileRecords = this.fileRecords.reverse()
      this.selectedIndex = this.fileRecords.map((item, index) => {
        if (item.active === true) {
          return index
        }
      }).filter(item => item !== undefined)
    }
  },
  head: () => ({
    title: 'メニューの編集'
  })
}
</script>
