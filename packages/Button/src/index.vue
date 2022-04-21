<template>
  <div class="le-button">
    <slot></slot>
  </div>
</template>
 
<script>
export default {
  name: 'le-button',
  props: {
    type: String
  }
}
</script>
 
<style scoped>
  .le-button {
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      margin: 16px 0;
      padding: 3px 6px;
      background: green;
      color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
  }
</style>