<template>
  <div>
    <client-only>
      <div id="profile-pic-demo" class="pt-3">
        <div class="d-flex mb-2">
          <h6>店舗画像のアップロード</h6>
          <h6 class="error--text">
            ※必須
          </h6>
        </div>
        <v-row no-gutters>
          <v-col cols="12" md="6" sm="12">
            <div class="d-sm-flex align-end">
              <h6>●メイン画像</h6>
              <h6 class="h7">
                (料理画像)
              </h6>
            </div>
            <VueFileAgent
              ref="main_photo"
              v-model="main_photo"
              class="profile-pic-upload-block"
              :multiple="false"
              :deletable="false"
              :meta="false"
              :compact="true"
              :accept="'image/*'"
              :help-text="' '"
              @select="onSelect($event, 'main_photo')"
            >
              <template v-slot:file-preview-new>
                <div key="new">
                  <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                    <div class="d-flex align-center justify-center">
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
                <div class="delete-button">
                  <v-btn v-if="main_photo" icon fab @click="removePic('main_photo')">
                    <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                  </v-btn>
                </div>
                <!--<div class="upload-button">
                  <v-btn icon fab :class="{'disabled': uploaded || !profilePic}" @click="upload('main_photo')">
                    <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="secondary&#45;&#45;text" />
                  </v-btn>
                </div>-->
              </template>
            </VueFileAgent>
          </v-col>
          <v-col cols="12" md="6" sm="12">
            <div class="d-sm-flex align-end">
              <h6>
                ●サブ画像
              </h6>
              <h6 class="h7">
                (料理・手書きメニュー・チラシの画像)
              </h6>
            </div>
            <v-row no-gutters>
              <v-col cols="6" sm="6">
                <VueFileAgent
                  ref="image2"
                  v-model="image2"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  :help-text="' '"
                  @select="onSelect($event, 'image2')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
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
                    <div class="delete-button">
                      <v-btn v-if="image2" icon fab @click="removePic('image2')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                    <!--<div class="upload-button">
                      <v-btn icon fab :class="{'disabled': uploaded || !profilePic}" @click="upload('image2')">
                        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="secondary&#45;&#45;text" />
                      </v-btn>
                    </div>-->
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="6" sm="6">
                <VueFileAgent
                  ref="image3"
                  v-model="image3"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  :help-text="' '"
                  @select="onSelect($event, 'image3')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
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
                    <div class="delete-button">
                      <v-btn v-if="image3" icon fab @click="removePic('image3')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                    <!--<div class="upload-button">
                      <v-btn icon fab :class="{'disabled': uploaded || !profilePic}" @click="upload('image3')">
                        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="secondary&#45;&#45;text" />
                      </v-btn>
                    </div>-->
                  </template>
                </VueFileAgent>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6" sm="6">
                <VueFileAgent
                  ref="image4"
                  v-model="image4"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  :help-text="' '"
                  @select="onSelect($event, 'image4')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
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
                    <div class="delete-button">
                      <v-btn v-if="image4" icon fab @click="removePic('image4')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                    <!--<div class="upload-button">
                      <v-btn icon fab :class="{'disabled': uploaded || !profilePic}" @click="upload('image4')">
                        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="secondary&#45;&#45;text" />
                      </v-btn>
                    </div>-->
                  </template>
                </VueFileAgent>
              </v-col>
              <v-col cols="6" sm="6">
                <VueFileAgent
                  ref="image5"
                  v-model="image5"
                  class="profile-pic-upload-block"
                  :multiple="false"
                  :deletable="false"
                  :meta="false"
                  :compact="true"
                  :accept="'image/*'"
                  :help-text="' '"
                  @select="onSelect($event, 'image5')"
                >
                  <template v-slot:file-preview-new>
                    <div key="new">
                      <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                        <div class="d-flex align-center justify-center">
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
                    <div class="delete-button">
                      <v-btn v-if="image5" icon fab @click="removePic('image5')">
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
                      </v-btn>
                    </div>
                    <!--<div class="upload-button">
                      <v-btn icon fab :class="{'disabled': uploaded || !profilePic}" @click="upload('image5')">
                        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="secondary&#45;&#45;text" />
                      </v-btn>
                    </div>-->
                  </template>
                </VueFileAgent>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div class="d-flex justify-end mt-3">
          <v-btn outlined rounded color="secondary" @click="uploadAllImages">
            画像を保存
          </v-btn>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ImageUpload',
  data: () => ({
    profilePic: null,
    main_photo: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    uploaded: false,
    uploadHeaders: {},
    dialog: false
  }),
  computed: {
    ...mapGetters(['imageUploadUrl'])
  },
  mounted () {
    const mainPhoto = this.$auth.$state.user.user.main_photo
    const photos = this.$auth.$state.user.user.photos
    if (mainPhoto) {
      this.main_photo = {
        name: 'Main Photo',
        sizeText: '549 KB',
        size: 0,
        type: 'image/jpeg',
        ext: 'jpeg',
        dimensions: {
          width: 1920,
          height: 1080
        },
        url: mainPhoto
      }
    }
    if (photos) {
      photos.forEach((item, index) => {
        if (item) {
          this['image' + (index + 2)] = {
            name: `Photo ${index + 2}`,
            sizeText: '549 KB',
            size: 0,
            type: 'image/jpeg',
            ext: 'jpeg',
            dimensions: {
              width: 1920,
              height: 1080
            },
            url: item
          }
        }
      })
    }
  },
  methods: {
    ...mapActions('store/account', ['updateImages']),
    removePic (ref) {
      const profilePic = this[ref]
      this.$refs[ref].deleteUpload(this.imageUploadUrl, this.uploadHeaders, [profilePic])
      this[ref] = null
      this.uploaded = false
    },
    upload (ref) {
      this.$refs[ref].upload(this.imageUploadUrl, this.uploadHeaders, [this[ref]], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', ref)
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.main_photo.url = res[0].data.message
        this.uploaded = true
      })
    },
    onSelect (fileRecords, ref) {
      this.uploaded = false
      this.$refs[ref].upload(this.imageUploadUrl, this.uploadHeaders, [this[ref]], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', ref)
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this[ref].url = res[0].data.message
        this.uploaded = true
      })
    },
    uploadAllImages () {
      this.updateImages({
        main_photo: this.main_photo ? this.main_photo.url : null,
        image2: this.image2 ? this.image2.url : null,
        image3: this.image3 ? this.image3.url : null,
        image4: this.image4 ? this.image4.url : null,
        image5: this.image5 ? this.image5.url : null
      }).then(() => {
        this.$auth.fetchUser()
      })
    }
  }
}
</script>
