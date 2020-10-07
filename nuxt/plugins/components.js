import Vue from 'vue'
import CodeInput from 'vue-verification-code-input'
import VueClipboard from 'vue-clipboard2'
import VueFileAgent from 'vue-file-agent'
import DatetimePicker from 'vuetify-datetime-picker'
import 'vue-file-agent/dist/vue-file-agent.css'
import VueHtml2pdf from 'vue-html2pdf'
import VueHtmlToPaper from 'vue-html-to-paper'
import Print from 'vue-print-nb'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes'
  ],
  styles: []
}

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueHtmlToPaper, options)
Vue.use(VueHtml2pdf)
Vue.use(VueClipboard)
Vue.use(DatetimePicker)
Vue.use(Print)
Vue.use(VueFileAgent)
Vue.component('code-input', CodeInput)
