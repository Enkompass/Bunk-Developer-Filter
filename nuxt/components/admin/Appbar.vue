<template>
  <div class="navbar">
    <v-app-bar
      v-if="$vuetify.breakpoint.mdAndDown"
      fixed
      color="primary"
      class="white--text"
      app
    >
      <v-toolbar-title @click="$router.push('/admin/top')">
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
      <v-list-item class="list-item">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            <h2 class="ml-2" style="cursor:pointer;" @click="$router.push('/admin/top')">
              DELIVOW
            </h2>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list>
        <SidebarItem v-for="item in items" :key="item.alias" :item="item" />
        <div class="pa-2 safari-margin">
          <v-btn block height="40" color="secondary" @click="logout">
            ログアウト
          </v-btn>
        </div>
      </v-list>
    </v-navigation-drawer>
    <delay-dialog v-model="delayItem" />
    <coupon-request-dialog v-model="requestCouponItem" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SidebarItem from '~/components/SidebarItem'
import DelayDialog from '@/components/admin/Dialog/DelayDialog'
import CouponRequestDialog from '@/components/admin/Dialog/CouponRequestDialog'

export default {
  name: 'Appbar',
  components: { CouponRequestDialog, DelayDialog, SidebarItem },
  data: () => ({
    drawer: true,
    delayItem: null,
    requestCouponItem: null,
    items: [
      {
        icon: ['fas', 'box-open'],
        title: '注文履歴一覧表',
        to: '/admin/order_history'
      },
      {
        icon: ['fas', 'users'],
        title: '顧客情報管理',
        badge: 1,
        children: [
          {
            alias: 'store',
            to: '/admin/customers',
            title: 'ユーザー'
          },
          {
            alias: 'stores',
            to: '/admin/stores',
            title: '登録店舗'
          },
          {
            alias: 'delivery',
            to: '/admin/deliveries',
            title: 'デリバー',
            badge: 1
          }
        ]
      },
      {
        icon: ['fas', 'coins'],
        title: '本部売上管理',
        to: '/admin/sales_manage'
      },
      {
        icon: ['fas', 'ad'],
        title: '広告設定',
        to: '/admin/advertise_manage'
      },
      {
        icon: ['fas', 'bars'],
        title: 'カテゴリ・タグ設定',
        to: '/admin/category_manage'
      },
      {
        icon: ['fas', 'comments'],
        title: 'チャットルーム確認',
        to: '/admin/chat_room'
      },
      {
        icon: ['fas', 'bell'],
        title: '通知設定',
        to: '/admin/notification'
      },
      {
        icon: ['fas', 'ticket-alt'],
        title: 'クーポンの管理',
        to: '/admin/coupon_manage'
      },
      {
        icon: ['fas', 'file-alt'],
        title: '概要ページの編集',
        to: '/admin/summary'
      },
      {
        icon: ['fas', 'map-marker-alt'],
        title: 'エリアの編集',
        to: '/admin/area_manage'
      },
      {
        icon: ['fas', 'map-marker-alt'],
        title: '店舗入金管理',
        to: '/admin/store_deposit_manage'
      },
      {
        icon: ['fas', 'map-marker-alt'],
        title: 'デリバー入金管理',
        to: '/admin/deliver_deposit_manage'
      }
    ]
  }),
  async mounted () {
    await this.refreshBadge()
    this.$bus.$on('refresh_admin_badge', async () => {
      await this.refreshBadge()
    })
    this.$socket.client.on('delayed_order', (payload) => {
      this.playSound()
      this.delayItem = payload
    })
    this.$socket.client.on('request_coupon', () => {
      this.playSound()
      this.requestCouponItem = {}
    })
  },
  beforeDestroy () {
    this.$socket.client.off('delayed_order')
    this.$socket.client.off('request_coupon')
  },
  methods: {
    ...mapActions('admin/badge', ['getAdminBadge']),
    ...mapActions(['handleSignedOut']),
    async refreshBadge () {
      const temp = JSON.parse(JSON.stringify(this.items))
      const counts = await this.getAdminBadge({
        $axios: this.$axios
      })
      temp[1].children[2].badge = counts.delivery_count
      temp[1].children[1].badge = counts.store_count
      temp[1].children[0].badge = counts.customer_count
      temp[1].badge = counts.delivery_count + counts.customer_count + counts.store_count
      this.items = JSON.parse(JSON.stringify(temp))
    },
    async logout () {
      await this.$auth.logout()
      this.handleSignedOut()
      this.$router.push('/auth/login')
    },
    playSound () {
      const audio = new Audio('http://18.220.134.54:5000/bot_operator.mp3')
      audio.play()
    }
  }
}
</script>
