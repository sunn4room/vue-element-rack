<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-header style="box-shadow: 0px 0px 4px 4px rgba(0,0,0,0.1); z-index:10000">
        <component v-for="comp in componentList" :key="comp" :is="comp"></component>
      </el-header>
      <el-main style="background-color: #EEEEEE">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {scanComponents} from '@/util'
const context = require.context("@/navigation", false, /\.vue$/)
const scanResult = scanComponents(context)

export default {
  data: () => ({
    componentList: scanResult.componentList
  }),
  components: scanResult.components,
}
</script>

<style>
</style>