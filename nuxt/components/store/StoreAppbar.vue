<template>
  <div class="navbar">
    <v-app-bar
      v-if="$vuetify.breakpoint.mdAndDown"
      :clipped-left="false"
      fixed
      color="primary"
      class="white--text"
      app
    >
      <v-toolbar-title @click="$router.push('/store/top')">
        <h2 class="font-weight-bold">
          DELIVOW
        </h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        dark
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :right="$vuetify.breakpoint.mdAndDown"
      width="190"
      color="primary"
      app
      fixed
      dark
    >
      <v-list-item class="list-item" active-class="white--text">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            <h2 class="ml-2" style="cursor:pointer;" @click="$router.push('/store/top')">
              DELIVOW
            </h2>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-menu offset-x nudge-right="10">
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon
                v-if="getNotifications.length > 0"
                v-bind="attrs"
                size="2x"
                :icon="['fas', 'bell']"
                style="color: gold;"
                v-on="on"
              />
            </template>
            <v-card class="rounded-0" min-width="350">
              <v-list>
                <v-list-item v-for="(item, index) in getNotifications" :key="index" dense>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.content }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <v-list>
        <SidebarItem v-for="(item, index) in items" :key="index" :item="item" />
        <div class="pa-2 safari-margin">
          <v-btn
            block
            outlined
            light
            :ripple="false"
            height="40"
            color="primary"
            class="white--text rounded-lg mb-2"
            to="/store/order_manage"
          >
            <v-badge
              color="error"
              :content="getOrderBadge.toString()"
              inline
              overlap
            >
              新規注文数
            </v-badge>
          </v-btn>
          <v-btn block height="40" color="secondary" @click="logout">
            ログアウト
          </v-btn>
        </div>
      </v-list>
    </v-navigation-drawer>
    <update-policy v-model="policyItem" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SidebarItem from '~/components/SidebarItem'
import UpdatePolicy from '~/components/store/UpdatePolicy'
export default {
  components: { UpdatePolicy, SidebarItem },
  async fetch () {
    await this.loadStoreBadge()
    await this.loadNotifications()
  },
  data: () => ({
    drawer: true,
    policyItem: null,
    items: []
  }),
  computed: {
    ...mapGetters('store/badge', ['getOrderBadge', 'getCouponCount', 'getNotifications', 'getUnreadCount'])
  },
  async mounted () {
    this.items = [
      {
        icon: ['fas', 'box-open'],
        title: '受注管理',
        to: '/store/order_manage'
      },
      {
        icon: ['fas', 'store'],
        title: '店舗情報・アカウント',
        to: '/store/store_account'
      },
      {
        icon: ['fas', 'utensils'],
        title: 'メニューの編集',
        to: '/store/product_manage'
      },
      {
        icon: ['fas', 'ticket-alt'],
        title: 'クーポンの設定',
        to: '/store/coupons_manage'
      },
      {
        icon: ['fas', 'clock'],
        title: '営業時間の編集',
        to: '/store/business_hours'
      },
      {
        icon: ['fas', 'coins'],
        title: '売上集計',
        to: '/store/sales_tabulation'
      },
      {
        icon: ['fas', 'users'],
        title: '顧客情報',
        to: '/store/customer_manage'
      },
      {
        icon: ['fas', 'comments'],
        title: 'チャットルーム',
        to: '/store/chat_room'
      },
      {
        icon: ['fas', 'file-image'],
        title: '売上明細表',
        to: '/store/purchase_orders'
      },
      {
        icon: ['fas', 'unlock-alt'],
        title: '個人情報保護方針',
        to: '/store/privacy_policy'
      },
      {
        icon: ['fas', 'file-alt'],
        title: '利用規約',
        to: '/store/terms_of_use'
      }
    ]
    const uid = this.$auth.$state.user.user.uid
    await this.refreshBadge()
    this.$socket.client.on('updated_policy', async () => {
      this.policyItem = {}
      await this.$auth.fetchUser()
      await this.refreshBadge()
    })
    this.$socket.client.on('send_notify', async () => {
      await this.loadNotifications()
    })
    this.$socket.client.on(`arrived_chat_${uid}`, () => {
      this.refreshUnreadCount()
    })
    this.$bus.$on('refresh_badge', async () => {
      await this.refreshBadge()
    })
    this.$bus.$on('refresh_notify_badge', async () => {
      await this.refreshUnreadCount()
    })
  },
  beforeDestroy () {
    this.$bus.$off('refresh_badge')
    this.$bus.$off('refresh_notify_badge')
  },
  methods: {
    ...mapActions(['handleSignedOut']),
    ...mapActions('store/badge', ['loadStoreBadge', 'loadNotifications', 'loadUnreadMessage']),
    async refreshBadge () {
      await this.$fetch()
      const temp = JSON.parse(JSON.stringify(this.items))
      temp[3].badge = this.getCouponCount
      temp[9].badge = !this.$auth.$state.user.user.is_accepted_personal ? 1 : 0
      temp[10].badge = !this.$auth.$state.user.user.is_accepted_terms ? 1 : 0
      this.items = JSON.parse(JSON.stringify(temp))
    },
    async refreshUnreadCount () {
      await this.loadUnreadMessage()
      const temp = JSON.parse(JSON.stringify(this.items))
      temp[7].badge = this.getUnreadCount
      this.items = JSON.parse(JSON.stringify(temp))
    },
    logout () {
      this.$auth.logout()
        .then(() => {
          this.handleSignedOut()
          window.location.reload()
        })
    }
  }
}
</script>
