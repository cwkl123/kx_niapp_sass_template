<!--
 * @Author: August_rush
 * @Date: 2025-06-18 11:04:58
 * @LastEditors: August_rush 864011713@qq.com
 * @LastEditTime: 2025-06-19 10:49:47
 * @FilePath: \huijiashenghuo_uniapp\src\layouts\tabbar.vue
 * @Description: 
 * 
-->
<template>
  <wd-config-provider :themeVars="themeVars">
    <slot />
    <!-- 注意下面，多了一个自定义tabbar -->
    <au-tabbar />
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const themeVars: ConfigProviderThemeVars = {
  // colorTheme: 'red',
  // buttonPrimaryBgColor: '#07c160',
  // buttonPrimaryColor: '#07c160',
}
</script>
