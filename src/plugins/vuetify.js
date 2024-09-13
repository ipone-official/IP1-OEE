import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

const vuetify = new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#007fc4',
          green: '#0A7A42',
          success: colors.green.accent4,
          error: colors.red.darken1,
          warning: colors.orange.accent4,
        },
      },
    },
    defaultAssets: {
      font: {
        family: 'SukhumvitSet', // กำหนด font อื่นที่ต้องการใช้
      },
    },
  })
  
export default vuetify