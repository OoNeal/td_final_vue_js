<script>

</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="popup">
        <img src="/icons/crossOrange.svg" alt="cross icon" @click="$emit('close')">
        <div class="popup-title"><slot name="title"></slot></div>
        <div class="popup-content"><slot name="content"></slot></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.popup {
  width: 40vw;
  max-width: 25em;
  min-width: 20em;

  background-color: #323333;
  font-size: 1.1em;
  border-radius: 10px;
  padding: 1em;
  margin: 0 auto;
}

</style>