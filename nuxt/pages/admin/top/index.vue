<template>
  <div class="admin-store-top">
    <div class="d-md-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <h3 class="mr-2">
          {{ server_date_time }}
        </h3>
        <v-item-group v-model="weather" mandatory>
          <v-item v-slot:default="{ active, toggle }" active-class="secondary--text" value="sunny">
            <v-btn fab icon :ripple="false" @click="toggle">
              <font-awesome-icon :icon="['fas', 'sun']" />
            </v-btn>
          </v-item>
          <v-item v-slot:default="{ active, toggle }" active-class="secondary--text" value="rainy">
            <v-btn fab icon :ripple="false" @click="toggle">
              <font-awesome-icon :icon="['fas', 'umbrella']" />
            </v-btn>
          </v-item>
        </v-item-group>
      </div>
      <v-btn
        color="primary"
        dark
        height="30"
        class="rounded-lg"
        to="top/shifts"
        :block="$vuetify.breakpoint.xs"
      >
        シフト登録状況を確認
      </v-btn>
    </div>
    <v-row>
      <v-col cols="12" md="6" sm="12" class="mt-3 mt-md-0">
        <v-card>
          <v-card-title class="pa-0 mb-3">
            <h5>
              <font-awesome-icon :icon="['fas', 'box-open']" class="secondary--text" />
              本日の注文件数
            </h5>
          </v-card-title>
          <v-card-text class="pb-0">
            <div class="d-flex justify-center align-end black--text">
              <h1 class="h0 font-weight-bold">
                {{ order.today | currency('') }}
              </h1>
              <h4>
                件
              </h4>
            </div>
            <div class="d-flex justify-center align-end mt-3">
              <h4 :class="{'error--text': order.today - order.yesterday <= 0, 'secondary--text': order.today - order.yesterday > 0}">
                昨日比{{ order.today - order.yesterday > 0 ? '+' : '-' }}
              </h4>
              <h4 :class="{'error--text': order.today - order.yesterday <= 0, 'secondary--text': order.today - order.yesterday > 0}">
                {{ (order.today - order.yesterday) | currency('') }}
              </h4>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-card>
          <v-card-title class="pa-0 mb-3">
            <h5>
              <font-awesome-icon :icon="['fas', 'coins']" class="secondary--text" />
              本日の売上
            </h5>
          </v-card-title>
          <v-card-text class="pb-0">
            <div class="d-flex justify-center align-end black--text">
              <h1 class="h0 font-weight-bold">
                {{ sales.today | currency('¥') }}
              </h1>
            </div>
            <div class="d-flex justify-center align-end mt-3">
              <h4 :class="{'error--text': sales.today - sales.yesterday <= 0, 'secondary--text': sales.today - sales.yesterday > 0}">
                昨日比{{ sales.today - sales.yesterday > 0 ? '+' : '-' }}
              </h4>
              <h4 :class="{'error--text': sales.today - sales.yesterday <= 0, 'secondary--text': sales.today - sales.yesterday > 0}">
                {{ (sales.today - sales.yesterday) | currency('') }}
              </h4>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="px-0 pb-0">
          <v-card-title class="pa-0 mx-3">
            <div class="d-md-flex align-center">
              <h5>
                <font-awesome-icon :icon="['fas', 'box-open']" class="secondary--text" />
                本日の出勤状況
              </h5>
              <div class="d-flex align-center">
                <v-chip
                  class="ml-md-2 m-0 px-2"
                  color="grey"
                  label
                  text-color="black"
                >
                  出勤中{{ total }}名
                </v-chip>
                <v-menu rounded offset-y>
                  <template v-slot:activator="{ attrs, on }">
                    <v-chip
                      class="ml-2 px-2"
                      color="primary"
                      label
                      text-color="white"
                      v-bind="attrs"
                      v-on="on"
                    >
                      待機中{{ waiting.length }}名
                    </v-chip>
                  </template>
                  <v-list dense max-height="250">
                    <v-list-item
                      v-for="(item, index) in waiting"
                      :key="index"
                      dense
                      link
                      style="background-color: white;"
                      @click="doCopy(item.uid)"
                    >
                      <v-list-item-title v-text="item.uid" />
                      <v-list-item-action>
                        <v-btn icon>
                          <font-awesome-icon :icon="['fas', 'copy']" />
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-menu rounded offset-y>
                  <template v-slot:activator="{ attrs, on }">
                    <v-chip
                      class="ml-2 px-2"
                      color="secondary"
                      label
                      text-color="white"
                      v-bind="attrs"
                      v-on="on"
                    >
                      配達中{{ ordering.length }}名
                    </v-chip>
                  </template>
                  <v-list dense max-height="250">
                    <v-list-item
                      v-for="(item, index) in ordering"
                      :key="index"
                      dense
                      link
                      style="background-color: white;"
                    >
                      <v-list-item-title v-text="item.uid" />
                      <v-list-item-action>
                        <v-btn icon>
                          <font-awesome-icon :icon="['fas', 'copy']" @click="doCopy(item.uid)" />
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-card-title>
          <v-card-text class="pa-0 map-card">
            <client-only>
              <GMap
                v-if="mapLoaded"
                ref="gMap"
                :cluster="{options: {styles: clusterStyle}}"
                :center="{lat: 34.8093953, lng: 137.3035407}"
                :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'cooperative', styles: mapStyle, scrollwheel: true}"
                :zoom="10"
                language="ja"
                class="mt-4"
                @bounds_changed="checkForMarkers"
              >
                <GMapMarker
                  v-for="(location, index) in locations"
                  :key="index"
                  :position="{lat: location.lat, lng: location.lng}"
                  :options="{icon: getIcon(location)}"
                  @click="currentLocation = location"
                >
                  <GMapInfoWindow :options="{maxWidth: 250}">
                    <div class="d-flex justify-space-between align-center black--text">
                      <h6>
                        管理番号
                      </h6>
                      <h6 class="font-weight-bold ml-3">
                        {{ location.order_uid }}
                      </h6>
                    </div>
                    <div class="d-flex justify-space-between align-center black--text">
                      <h6>
                        状態
                      </h6>
                      <h6 class="font-weight-bold ml-3">
                        {{ location.status }}
                      </h6>
                    </div>
                  </GMapInfoWindow>
                </GMapMarker>
              </GMap>
            </client-only>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'isAdmin'],
  layout: 'admin',
  async fetch () {
    this.weather = await this.loadWeather()
  },
  data: () => ({
    order: {
      today: 0,
      yesterday: 0
    },
    sales: {
      today: 0,
      yesterday: 0
    },
    server_date_time: '2020/06/21 11:20',
    waiting: {},
    ordering: {},
    locations: [],
    currentLocation: {},
    pins: {
      bike_deactive:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAlCAYAAAAnQjt6AAAABHNCSVQICAgIfAhkiAAAA5hJREFUWEftV01oE0EUfm82KWKy8aQpNkG9ay8Kpg3Sg+LBSr0ICoKiF38QpaB4socWhKJQ7KEqnpQKHrxYrV7soUjaeMhFvXhSSCqtnswmIsnujMy4EyfTTTebRClob9OdefPN973vvReEdfKH6wQH/AeiK/GfkX+TkUhP334DyAAQOCQYoPDCATpfXlqc+zuMxHsj0XD0BkG85FkeKIwVbWscVt6W5XffZN3QndreZRhnGIFtyJypYiH7Rg3OX42IQ4yxGfnSaKL/dkMQ7mEG9KqVX7zVNBAz0f8cEQflAVolW0rLr7+Kdbw3Eusy5wFgNwDkivnMnmiyfycBfOfuzzEHRq3PmRm+Nremh9CApzJWpers+LGc/cTXvozEkmmmMkCB7SrlF96vCszpXsqMmMm+KwjkJv/OHDgiQcgYsUT6BCBMi5Sh9FxpafFeU0CiPX1nCSF3RWCAh1bFusC1FYlIyLjLBkiAqix17LlIVMYoY5OlwsLlpoDwTfxSwkjEcqy5SCiSIojDqlwCYD5ziu9VgajUS0baAiKDmMn0AwQ4WScVY5O2TSek1iqD4Mql7o/1pEeBwHVdOt8ckUGEe8LGxzo7MieluyjavW8zCdMvtX0UxgCdWYdhlLtLcVOuWLEGpIWbBiKScy0HKQh1d9SBdxcOpQfUwhYMiOIIlVrBQogerNhORkrkghmRyayAyTmUXtOrayAgsURqL6CRrdUUxiaR4hwaULuQOwEQ7guLx3sjPLkNJN38jMPoctkuZ9WKKmMFAsIP6XXFi3bBFmOzlLEJr77idSY4ECXrdfcQxLQuBQdkVUvHvFhQzwcG4hayVzIIvwiBjgn3uFLodcarnuisBAbi2vMlf7ko0XZ5mr+W25sHl8kq8okZg4DwoVjIPGokYcs5Ig7yNo+bNpbYt+9mV+Q8AjmuSJJjQB9blfIdPznakkYrcE887Cm2cMmYbZyudWofSgJLI+OtKm7ctgCgziFqD/oj0qgJy19etelFmRtuK/jNlEcb6Ih9RS1RLexxUR1QbRJrxExL0qitvpjPrIrRqNWvJU/bQMCDEbUV6LNpRxlRu6s6tUlrm13mlJxb9C7bUSDa0PzLqow9QwKmWlNEeS8sHPZzDP/ekjT8oDate92Vq1Sdo9JNfmBaBsIDc6uGQmRY/w3DRwF1fPQD0RYjanDefyDsxMX/qsZKs9W0IyW+mVcG2dOWNEEu8tv7E5C96zUAOfk4AAAAAElFTkSuQmCC',
      bike_active:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAmCAYAAACsyDmTAAAABHNCSVQICAgIfAhkiAAAA2dJREFUWEftl7trFFEUxr+z6yokOxErJYWdqKCNYJoUAfUPiIqNlQ8s1SJxhLCrwdkms0ZRbAQhipDKFwiCheIWWsQ2RdROULRIk10j7Dpz5N6ZO7kzO+s8EiVC0mXuzL2/+53vPJawzv5onfFgAygpIhsKbSiUpEDS+n/sIXPK6Ef7JgHbAGq07MrtpNuq9T5zcrCI4hCDdhL4swNnbtme/Br3fWqF+k3rXgF0Vm3iOO7Q8vSV9+p/w7R2g3GOGS9a16uv5XNzyjC4fRVEY9HDmVFt1Su16PPUQGXTekygY2oDFzj1w648UAeXufOOCPsY+N6yKzvE8/Il6w0RjfRSksFPWnb1uL6eGsgwrVGAnoqP5aEo7YJ9uekdXKsQwfLWvEPKZu0CAbfU+2DcAWEJjAH1rr92UQ9/aiDxsQwLsLeJza8MtAeZ6QTAR8Iq8J6mXf1QNmvfCNju3d57Fnhq7NrBYrEwJ1cY8616Zb9aywSkoJjpkQhPly8AeVsPnBZ0xaLv6uFsojSg1M4MFDW3d0tuMNGM8lSfrkCMT2SYQ55cUTAzkO4NCePy4SCrlAwiu9BZivNbkATofFIhbdqVgGP1QH6YoiHRlRRGd+GcF7VH1KQCF2cD3zFPN+vV8dwe0sOhZ0lgeLv6LPAaqLFi7O7kF9nq4tcBvUhmVqgLiDEP4o+qRomscV33jCia5XHrEAo0GwclYAg8omefQM4M5N2+xr2KnXouKzGVZB0qo3Ma4BGAhgF+K1sPSjMqs/S9cgGFa4xfaYRS4EW9JulqJV0gt4fEh1HDEvCw6XsnmoXi/Wjf+xNcLoVE0xRhIPBL4QFhaMfhgeXilgURBvE/M+6uqMVHFXCSUvmAxK4+FIAJ3bQixQmY8EFHXdDWoAkn0eQ1tYTh9vNenVxkEFw+2VUw/xaQ3t1Vv/LOomGlVlyNScGTPe296W/TF9UWQrVEhrF9X6tJsUPYmpo6NBfFTH1h4O4BLEmlzKaODF6h4UodpgpndNZJgslVqXWFEGmMYsN/rpAc3P3RQvpIHz8i2cc9JoE19ZDsTdoMLaGYGyAsRrNMn7vThCtXyNTG0V8h+oG9OnkaqMym1jcVfmImKzRfM0875Nzo9UMwCWpVQMHm5pTRh59GXggdcm2Akq6dYX3dAf0GlJXPNjiMy8AAAAAASUVORK5CYII=',
      car_active:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAiCAYAAADYmxC7AAAABHNCSVQICAgIfAhkiAAAAv9JREFUWEftVz1oFGEQfbObpEj20graKlpoqRYWirYK/hIQxaDYiRGS21jcSsgegewlQuxEjdprFLQThTSCWppGLKwiWljdmcLc7sjsuXGz9337czklRa68nW/m7Zt5b74lbMIfbUJM2AKVtytbTP0Xpkq2ezIAjhPTQSZ+xz7fXZm99SFvcV1c4faVbHc3M50D4RoB29oSM8/65N9e8Sa+dgouHyh7ulTCr2PMuEFEh7OKMfAdwFTDq9zJilU9TwXVPzq53zRoCESjqsPMvMhEDxnNVwb3XCaCG49jxhKYRxozzpsi4LSgSmV3Rg8GS0R8tu45n+LFwtYCUwQ6vQ4ceIEYX6J8ApaInbrnPM/NlAwwQM+SiQFaJGBO/vfR3KGbG2vMPQqiOSLsTWWIebZec8aSMUqmLLt6PSrODCeg5nwEwCpXP0oxBkZUMyMvxMDFJFs6cL4fHEgqNhNU8lAEWFrQqFX2STFpGxhXmeiCUpFpdCnYKgyq357YbqJnWeoIiwCGMtuUAkqU2kDvLnjj9SisMKjc81JEbuBT8aHPBQpmsCyS3ygrOpwMXmh4zpncTLXkm6GiDFakRQyMSxgxxqJ8oY8R7gVoPokrWcnUgO3eN0BXCnUgXft71jzNni5ZWP3cEsT6tmmZittBN0CJ6zdqzpF4Lst2n4pl6GyljanoQDcARTnq6B1cU5cwxatvpYUBMPzTqzzONM9ugArADwzgJTO5odEyL4IxGTDXDZNu/mGpzQq07Ruwq5cM4JFWKVKA8AOgQ3GjVA2t2AcZ9FqdSz1PoRiSB+Lm2JYs7r6xNkCzwyK3D4ByJBxhMesyWEh9ySW8tnISPrPReVSbp5Z2/ittAFa5WpE7VNL8/gkoSWrZ1W8yM0I3MXbKjVMGNiD/vBidXAAN03jRilGrqFNw2kuezJYkjQCYpvFeVST0Ieo7EV+onYJJXTOqpCEzhjEfXzlh29A33E1ASvVlvaXcnXyfB2VJb+SLJa1Ovq+ZLKRdfr4FKi+hm5Kp3wYUkjJSr/EFAAAAAElFTkSuQmCC',
      car_deactive:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAiCAYAAADYmxC7AAAABHNCSVQICAgIfAhkiAAAAxpJREFUWEftV79rFFEQnpm9C8L96DTBXFB7TaGFSQ5JoaCgRhALQYkgRIOIEoiNkCbXCApBC7HUoIiCgmIa0SJIfijGQv0DhDsl0UZuLyC32TfhPbPHZu+9293kCCly5d7szPe+me+btwib8IebEBNsgYralS2mNoSpVHv3YQuol5H3I+MXQfy8Upz+HrW4KS52+7a1de1OWHiUiAYA4EAwMYO4wU7iUWX+w5+1gosGqrUzlUqkuoioHwH6IxSbA4axcmnqSYTYupCGoNIdPXsR+BgC3dYlZ4BxcOEFC5oBa+k0ET3wxzHzBIIolEuzH+OAM4LKdHQPG8EwTzhL4uq/+dkf/mKqtQkaIsRr/ueC+R4iF718EqxgHlv8OfNeB1YLSg0w0btgYgL8BAiP5XPh0A7T3GRzXQcZaAQRjzdiSM6fXZy5E4zRgsrm8udqxYUYBDfx0gOQyfW8UcUYzutmRh4IEfuCbJnACeB9QcWGgwq85AGWLbBL0ydkMdm2ZBLPINBZnSLjshUbVLrt0HZKit+qhUIMIuLJsDaFDPlcuWr3wsLXRS8uNqio8xJHba4QR/xDHwkUONaClHwTWNFileqslKavR2ZKeU2IiiKwMscujKo44ktevv8+hk/FEr31K1nPVHt+FAhGIhSLFFJ13D01T2vtTGVbMpNSEMG2GZny20GkiiFB0vXt4tQFf1g613NXWYbBVuqYqr3QDEQrOcpVO11TV2tnKpNMP5MtZBdO2b+mXoeaZ1NACSi4ICYJcUgVBxhHdu8LpEVgGFgx1jorMLYvszPfhxa8MhElCzDzX0LM+41SN7TSPgCtWV0u0zzJ2Pr2+cwxmGzVrvK3wbDDPLdvsayLNeEIKIRdBmOpL7iEPVEEfWa942gwTz3tq6QNAOn27svyDrUhoORJsx35z2pmBBSYYJe8cap5cmhYGp28ABLgQxljUtFaGTNe8uTilUl9AL7piigfqtpX/At1rWAarhldUnU1ZrjlXzmqbU7lZjMBadUXdkp15U1SWi7p9XyxNKoT7WsmDGmT/98CFZXQTcnUMv8AlzK8o/L5AAAAAElFTkSuQmCC',
      selected:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
      notSelected:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABHElEQVR42uVVyw4BMRQdC98lsbPwG5YSH+BzWFtLZilh0oQgFh6J54IwBmGYtrfaBREdcTvDhpM0adrec3rb+7Csn8fRdrLg7VzBubhDzmHrudRuZ2KRs/miLd6AThfNaOTTGRFIsMm8bkSuXBeGoLVaGi0g39wLI4GTf1EjdE/+E1pAAGgEAenkb/tBo1vQFUDgBbSbny6al77uSQwB/6wJSNHoAo8xj30iaYMW4Lv9wfSTpc0eH6atXtE4TKWNUS4AY2hyddY4k/lwVEZncm9QilQuBGPwnp1B5GIXGi3P0eU0c7EqKrje5hU5d7fr2P2AEJIESkNqB1XJkvhI0/GrTuqZX619tLMF/VHlfnk5/0r7ZMvVWA3rr3AF6LIMZ7PmSlUAAAAASUVORK5CYII='
    },
    clusterStyle: [
      {
        url:
          'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
        width: 56,
        height: 56,
        textColor: '#fff'
      }
    ],
    mapStyle: [
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ],
    mapLoaded: false,
    snackbar: false,
    snackbarText: '',
    weather: ''
  }),
  computed: {
    ...mapGetters('admin/top', ['getWeather']),
    total () {
      return this.ordering.length + this.waiting.length
    }
  },
  watch: {
    weather: {
      deep: true,
      async handler (val) {
        if (val !== this.getWeather) {
          await this.updateWeather({
            weather: val
          })
          this.weather = await this.loadWeather()
        }
      }
    }
  },
  async created () {
    const deliveryInfos = await this.getDeliveryInfos({
      $axios: this.$axios
    })
    this.locations = deliveryInfos.locations
    this.mapLoaded = true
    const data = await this.getTodays({
      $axios: this.$axios
    })
    this.order.today = data.order.today
    this.order.yesterday = data.order.yesterday
    this.sales.today = data.sales.today
    this.sales.yesterday = data.sales.yesterday
    this.server_date_time = data.server_time
    this.waiting = deliveryInfos.waiting_deliveries
    this.ordering = deliveryInfos.ordering_deliveries
  },
  methods: {
    ...mapActions('admin/top', ['loadWeather', 'updateWeather', 'getTodays', 'getDeliveryInfos']),
    checkForMarkers () {
      this.locations.forEach((location, i) => {
        location.visible = this.$refs.gMap.map
          .getBounds()
          .contains(this.$refs.gMap.markers[i].getPosition())
      })
    },
    getIcon (item) {
      if (item.type === 'car') {
        return item.active === true ? this.pins.car_active : this.pins.car_deactive
      } else {
        return item.active === true ? this.pins.bike_active : this.pins.bike_deactive
      }
    },
    doCopy (text) {
      this.$copyText(text).then((e) => {
        this.snackbarText = this.$t('top.copied_to_clipboard')
        this.snackbar = true
      }, () => {
        this.snackbarText = this.$t('top.cannot_copy')
        this.snackbar = true
      })
    }
  },
  head: () => ({
    title: 'HOME'
  })
}
</script>

<style lang="scss" scoped>
  * {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }

  h1 {
    color: #206569;
    margin-bottom: 5px;
    & + p {
      margin-top: 0;
      font-size: 16px;
      a {
        color: #206569;
      }
    }
  }

  span,
  p,
  a {
    color: #206569;
    font-size: 16px;
  }

  .visibleCities {
    position: absolute;
    span {
      font-weight: bold;
    }
  }

  .flex {
    position: relative;
    padding-bottom: 50px;
  }

  .GMap,
  p {
    margin-top: 30px;
  }

  .GMap__Wrapper {
    width: 100%;
    height: 600px;
  }

  .button {
    background-color: #206569;
    color: #fff;
    outline: 0;
    border: 0;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 200ms;
    backface-visibility: hidden;
    &:hover {
      background-color: #12957b;
    }
  }
</style>
