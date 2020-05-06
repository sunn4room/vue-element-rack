<template>
  <navig-element>
    <el-image :src="require('@/assets/logo.png')" @click="onClick"></el-image>
  </navig-element>
</template>

<script>
import navigElement from '@/component/navigElement'
export default {
  componentIndex: 5,
  components: {
    navigElement
  },
  methods: {
    onClick() {
      this.$router.push("/home")
    }
  }
}
</script>

<style>

</style>