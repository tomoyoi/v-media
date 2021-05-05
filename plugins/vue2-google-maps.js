import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDpNLUHvzqaNheYONDKIHZymOa3gr8CPfA',
    libraries: 'places',
  },
})
