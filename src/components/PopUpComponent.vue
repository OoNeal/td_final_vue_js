<script>

</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="popup">
        <div class="top">
          <div class="title"><slot name="title"></slot></div>
          <img src="/icons/crossOrange.svg" alt="cross icon" @click="$emit('close')">
        </div>
        <div class="content"><slot name="content"></slot></div>
        <button><slot name="button"></slot></button>
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

  display: flex;
  flex-direction: column;
  gap: 1em;
}

img {
  height: 1em;
  cursor: pointer;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  font-weight: 600
}

button {
  border: none;
  width: fit-content;
  background-color: unset;
  color: #ECBA07;
  font-size: 1em;
  font-weight: 300;
  text-align: center;
  margin: 0 auto;
  &:hover {
    color: darken(#ECBA07, 7%)
  }
}

</style>