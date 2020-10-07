<template>
  <div class="admin-summary">
    <div class="d-md-flex align-center">
      <h3 class="font-weight-bold">
        <font-awesome-icon :icon="['fas', 'file-alt']" class="secondary--text" />
        概要ページの編集
      </h3>
    </div>
    <div>
      <v-card v-for="(item, index) in items" :key="index" height="80" class="pa-0 mt-4" :to="item.to">
        <v-card-title style="height: 80px;">
          <div class="d-flex justify-space-between align-center px-3" style="width: 100%;">
            <div class="d-flex align-center">
              <font-awesome-icon :icon="item.icon" class="secondary--text" />
              <h4 class="ml-2">
                {{ item.text }}
              </h4>
            </div>
            <font-awesome-icon :icon="['fas', 'caret-right']" class="grey--text" />
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Summary',
  layout: 'admin',
  data: () => ({
    items: [
      {
        icon: ['fas', 'question-circle'],
        text: 'ヘルプ',
        to: '/admin/summary/edit/help'
      },
      {
        icon: ['fas', 'file-image'],
        text: '特定商取引法',
        to: '/admin/summary/edit/commercial'
      },
      {
        icon: ['fas', 'file-image'],
        text: '利用規約',
        to: '/admin/summary/edit/terms'
      },
      {
        icon: ['fas', 'unlock-alt'],
        text: '個人情報保護法',
        to: '/admin/summary/edit/personal'
      },
      {
        icon: ['fas', 'file-alt'],
        text: 'ソフトウェアライセンス',
        to: '/admin/summary/edit/software'
      },
      {
        icon: ['fas', 'copyright'],
        text: 'コピーライト',
        to: '/admin/summary/edit/copyright'
      },
      {
        icon: ['fas', 'building'],
        text: '運営会社情報',
        to: '/admin/summary/edit/company'
      }
    ]
  }),
  head: () => ({
    title: '概要ページの編集'
  })
}
</script>
