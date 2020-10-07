<template>
  <div class="single-file-upload">
    <VueFileAgent
      ref="image"
      v-model="image"
      class="profile-pic-upload-block"
      :multiple="false"
      :deletable="false"
      :meta="false"
      :compact="true"
      :accept="'image/*'"
      :help-text="helpText"
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
          <v-btn v-if="imageFile" icon fab @click="removePic()">
            <font-awesome-icon :icon="['fas', 'times-circle']" class="error--text" />
          </v-btn>
        </div>
      </template>
    </VueFileAgent>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SingleFileUpload',
  props: {
    image: {
      type: Object,
      default: () => null
    },
    value: {
      type: Object,
      default: () => null
    },
    helpText: {
      type: String,
      default: 'アップロード'
    },
    uploadField: {
      type: String,
      default: 'unknown'
    }
  },
  data: () => ({
    uploadHeaders: {}
  }),
  computed: {
    ...mapGetters(['imageUploadUrl']),
    imageFile: {
      get () {
        return this.image
      },
      set (val) {
        this.$emit('update:image', val)
      }
    }
  },
  methods: {
    removePic () {
      this.image = null
      this.value = null
      this.uploaded = false
    },
    onSelect (fileRecords) {
      this.uploaded = false
      const _vm = this
      this.$refs.image.upload(this.imageUploadUrl, this.uploadHeaders, [this.imageFile], function createFormData (fileData) {
        const formData = new FormData()
        formData.append('action', 'upload')
        formData.append('field', _vm.uploadField)
        formData.append('file', fileData.file)
        return formData
      }).then((res) => {
        this.imageFile.url = res[0].data.message
        this.uploaded = true
      })
    }
  }
}
</script>
