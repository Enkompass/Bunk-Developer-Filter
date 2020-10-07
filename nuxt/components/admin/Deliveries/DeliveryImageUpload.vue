<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="940" overlay-opacity="0.6">
      <v-form ref="form">
        <v-card color="#D4D4D4" :loading="saving || uploading">
          <v-card-title class="justify-center py-5 pt-8">
            <h2 class="black--text">
              書類画像を編集
            </h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  顔写真
                </h6>
                <VueFileAgent
                  ref="face_image"
                  v-model="form.face_image"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'face_image')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.face_image" icon fab @click="removePic('face_image')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  免許証(表)
                </h6>
                <VueFileAgent
                  ref="license_image_front"
                  v-model="form.license_image_front"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'license_image_front')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.license_image_front" icon fab @click="removePic('license_image_front')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  免許証(裏)
                </h6>
                <VueFileAgent
                  ref="license_image_back"
                  v-model="form.license_image_back"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'license_image_back')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.license_image_back" icon fab @click="removePic('license_image_back')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  車両ナンバープレート
                </h6>
                <VueFileAgent
                  ref="vehicle_number_image"
                  v-model="form.vehicle_number_image"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'vehicle_number_image')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.vehicle_number_image" icon fab @click="removePic('vehicle_number_image')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  自賠責保険証書
                </h6>
                <VueFileAgent
                  ref="insurance_image"
                  v-model="form.insurance_image"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'insurance_image')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.insurance_image" icon fab @click="removePic('insurance_image')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  任意保険証書
                </h6>
                <VueFileAgent
                  ref="voluntary_image"
                  v-model="form.voluntary_image"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'voluntary_image')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.voluntary_image" icon fab @click="removePic('voluntary_image')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  通帳(表紙)
                </h6>
                <VueFileAgent
                  ref="cashcard_image_front"
                  v-model="form.cashcard_image_front"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'cashcard_image_front')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.cashcard_image_front" icon fab @click="removePic('cashcard_image_front')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <h6 class="px-2">
                  通帳(見開き)
                </h6>
                <VueFileAgent
                  ref="cashcard_image_back"
                  v-model="form.cashcard_image_back"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  help-text="アップロード"
                  style="width: 200px; margin: auto;"
                  @select="onSelect($event, 'cashcard_image_back')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
                          <span class="file-preview">
                            <span style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
                              <font-awesome-icon :icon="['fas', 'upload']" class="secondary--text" />
                            </span>
                            <span class="secondary--text" style="margin-top: 115%;">アップロード</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-slot:after-inner>
                    <div class="delete-button">
                      <v-btn v-if="form.cashcard_image_back" icon fab @click="removePic('cashcard_image_back')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                  </template>
                </VueFileAgent>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="py-0">
            <v-row no-gutters>
              <v-col cols="6" class="br-1-grey-fixed">
                <v-btn
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  :disabled="uploading"
                  color="secondary"
                  block
                  text
                  aria-label="cancel"
                  @click="onClose"
                >
                  キャンセル
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  :height="$vuetify.breakpoint.mdAndUp ? 56 : 44"
                  :disabled="uploading"
                  color="secondary"
                  block
                  text
                  aria-label="delete"
                  class="font-weight-bold"
                  @click="onSave"
                >
                  登録
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const DEFAULT_SCHEMA = {
  face_image: null,
  license_image_front: null,
  license_image_back: null,
  vehicle_number_image: null,
  insurance_image: null,
  voluntary_image: null,
  cashcard_image_front: null,
  cashcard_image_back: null
}
export default {
  name: 'DeliveryImageUpload',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    saving: false,
    uploading: false,
    form: JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  }),
  computed: {
    ...mapGetters(['imageUploadUrl'])
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (val) {
          this.form = JSON.parse(JSON.stringify(val))
          this.getImageDetails(this.form)
          this.dialog = true
        }
      }
    }
  },
  methods: {
    ...mapActions('admin/deliveries', ['saveDeliveryImages']),
    onClose () {
      this.dialog = false
      this.form = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
      this.$emit('input', null)
    },
    onSave () {
      const temp = JSON.parse(JSON.stringify(this.form))
      const payload = {
        delivery_uid: temp.delivery_uid,
        face_image: temp.face_image ? temp.face_image.url : null,
        license_image_front: temp.license_image_front ? temp.license_image_front.url : null,
        license_image_back: temp.license_image_back ? temp.license_image_back.url : null,
        vehicle_number_image: temp.vehicle_number_image ? temp.vehicle_number_image.url : null,
        insurance_image: temp.insurance_image ? temp.insurance_image.url : null,
        voluntary_image: temp.voluntary_image ? temp.voluntary_image.url : null,
        cashcard_image_front: temp.cashcard_image_front ? temp.cashcard_image_front.url : null,
        cashcard_image_back: temp.cashcard_image_back ? temp.cashcard_image_back.url : null
      }
      this.saving = true
      this.saveDeliveryImages({
        ...payload
      }).then(this.onClose)
        .finally(() => {
          this.saving = false
        })
    },
    getImageDetails (item) {
      const temp = item
      this.loading = true
      if (item.photo) {
        temp.face_image = {
          name: 'Face',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.photo
        }
      }
      if (item.license_image_front) {
        temp.license_image_front = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.license_image_front
        }
      }
      if (item.license_image_back) {
        temp.license_image_back = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.license_image_back
        }
      }
      if (item.vehicle_number_image) {
        temp.vehicle_number_image = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.vehicle_number_image
        }
      }
      if (item.insurance_image) {
        temp.insurance_image = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.insurance_image
        }
      }
      if (item.voluntary_image) {
        temp.voluntary_image = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.voluntary_image
        }
      }
      if (item.cashcard_image_front) {
        temp.cashcard_image_front = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.cashcard_image_front
        }
      }
      if (item.cashcard_image_back) {
        temp.cashcard_image_back = {
          name: 'License Image Front',
          sizeText: '549 KB',
          size: 0,
          type: 'image/jpeg',
          ext: 'jpeg',
          dimensions: {
            width: 1920,
            height: 1080
          },
          url: item.cashcard_image_back
        }
      }
      this.form = temp
      this.loading = false
    },
    onSelect (fileRecords, ref) {
      this.uploading = true
      this.$refs[ref].upload(this.imageUploadUrl, this.uploadHeaders, [this.form[ref]], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', ref)
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.form[ref].url = res[0].data.message
        this.uploading = false
      })
    },
    removePic (ref) {
      this.form[ref] = null
    }
  }
}
</script>
