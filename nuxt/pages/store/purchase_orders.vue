<template>
  <div class="store-purchase-order">
    <div class="d-sm-flex justify-space-between align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'file-image']" class="secondary--text" />
        発注書・その他DL
      </h3>
    </div>
    <div>
      <!--<v-card height="80" class="pa-0 mt-4" style="cursor: pointer;">
        <v-card-title style="height: 80px;">
          <div class="d-flex justify-space-between align-center px-3" style="width: 100%;">
            <div class="d-flex align-center">
              <font-awesome-icon :icon="['fas', 'car-side']" class="secondary&#45;&#45;text" />
              <h4 class="ml-2">
                梱包資材・備品の発注をする
              </h4>
            </div>
            <font-awesome-icon :icon="['fas', 'caret-right']" class="grey&#45;&#45;text" />
          </div>
        </v-card-title>
      </v-card>-->
      <v-card height="80" class="pa-0 mt-4" style="cursor: pointer;" @click="sales_download = true">
        <v-card-title style="height: 80px;">
          <div class="d-flex justify-space-between align-center px-3" style="width: 100%;">
            <div class="d-flex align-center">
              <font-awesome-icon :icon="['fas', 'car-side']" class="secondary--text" />
              <h4 class="ml-2">
                売上明細表を印刷する(PDF)
              </h4>
            </div>
            <font-awesome-icon :icon="['fas', 'caret-right']" class="grey--text" />
          </div>
        </v-card-title>
      </v-card>
      <!--<v-card height="80" class="pa-0 mt-4" style="cursor: pointer;">
        <v-card-title style="height: 80px;">
          <div class="d-flex justify-space-between align-center px-3" style="width: 100%;">
            <div class="d-flex align-center">
              <font-awesome-icon :icon="['fas', 'car-side']" class="secondary&#45;&#45;text" />
              <h4 class="ml-2">
                食品表示の見本(PDF)
              </h4>
            </div>
            <font-awesome-icon :icon="['fas', 'caret-right']" class="grey&#45;&#45;text" />
          </div>
        </v-card-title>
      </v-card>-->
    </div>
    <sales-statement v-model="sales_download" />
  </div>
</template>

<script>
import SalesStatement from '~/components/store/Downloads/SalesStatement'
export default {
  name: 'PurchaseOrders',
  components: { SalesStatement },
  data: () => ({
    sales_download: null
  }),
  head: () => ({
    title: '発注書・その他DL'
  })
}
</script>
