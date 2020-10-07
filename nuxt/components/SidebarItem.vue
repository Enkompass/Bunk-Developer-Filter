<template>
  <v-list-item v-if="!item.children" :to="item.to" exact link>
    <v-list-item-icon v-if="item.icon" class="mr-2">
      <font-awesome-icon :icon="item.icon" style="color: #878e9d;" />
    </v-list-item-icon>

    <v-list-item-title>
      {{ item.title }}
    </v-list-item-title>

    <v-list-item-action v-if="item.badge">
      <v-badge
        :content="item.badge"
        :value="item.badge"
        color="error"
        inline
      />
    </v-list-item-action>
  </v-list-item>

  <v-list-group v-else no-action color="white">
    <template v-slot:prependIcon>
      <font-awesome-icon :icon="item.icon" style="color: #878e9d;" />
    </template>

    <template v-slot:activator>
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>
    </template>

    <template v-slot:appendIcon>
      <v-badge
        :content="item.badge"
        :value="item.badge"
        color="error"
        inline
      />
      <v-icon>mdi-menu-down</v-icon>
    </template>

    <SidebarItem v-for="childItem in item.children" :key="childItem.alias" :item="childItem" sub-group />
  </v-list-group>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  name: 'SidebarItem',
  components: {
    SidebarItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
