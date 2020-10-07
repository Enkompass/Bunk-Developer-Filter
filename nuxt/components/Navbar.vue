<template>
  <div class="navbar">
    <v-navigation-drawer
      v-model="drawer"
      :right="$vuetify.breakpoint.smAndDown"
      width="190px"
      color="primary"
      fixed
      app
      dark
    >
      <v-list-item class="list-item">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            <h2 class="ml-2">
              DELIVOW
            </h2>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <font-awesome-icon :icon="item.icon" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      v-if="!$vuetify.breakpoint.mdAndUp"
      :clipped-left="false"
      fixed
      color="primary"
      class="white--text"
      app
    >
      <v-toolbar-title class="font-weight-bold">
        DELIVOW
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        dark
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => ({
    clipped: false,
    drawer: true,
    fixed: false,
    items: [
      {
        icon: ['fas', 'box-open'],
        title: '受注管理',
        to: '/'
      },
      {
        icon: ['fas', 'store'],
        title: '店舗情報・アカウント',
        to: '/inspire'
      },
      {
        icon: ['fas', 'utensils'],
        title: 'メニューの編集',
        to: '/inspire'
      },
      {
        icon: ['fas', 'money-check'],
        title: 'クーポンの設定',
        to: '/inspire'
      },
      {
        icon: ['fas', 'clock'],
        title: '営業時間の編集',
        to: '/inspire'
      },
      {
        icon: ['fas', 'coins'],
        title: '売上集計',
        to: '/inspire'
      },
      {
        icon: ['fas', 'users'],
        title: '顧客情報',
        to: '/inspire'
      },
      {
        icon: ['fas', 'box-open'],
        title: 'チャットルーム',
        to: '/inspire'
      },
      {
        icon: ['fas', 'file-image'],
        title: '発注書・その他DL',
        to: '/inspire'
      },
      {
        icon: ['fas', 'unlock-alt'],
        title: '個人情報保護方針',
        to: '/inspire'
      },
      {
        icon: ['fas', 'file-alt'],
        title: '利用規約',
        to: '/inspire'
      }
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: 'Vuetify.js'
  })
}
</script>
