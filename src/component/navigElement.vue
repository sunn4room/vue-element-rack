<template>
  <div class="navig-element" :style="{float: rely}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    rely: {
      default: "left"
    }
  }
}
</script>

<style scoped>
.navig-element {
  height: 60px;
  padding: 0px 20px;
  line-height: 60px;
  text-align: center;
}
.navig-element:hover {
  background-color: #EEEEEE;
  cursor:pointer
}
</style>