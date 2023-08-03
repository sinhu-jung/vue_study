<template>
  <div class="alert-wrap">
    <div class="alert-box">
      <div class="flex-column">
        <h2>{{ props.errorInfo.status }} 에러</h2>
        <div class="content" v-for="(msg, index) in message" v-bind:key="index">
          {{ msg }}
        </div>
        <button @click="props.onCloseErrorAlert">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  errorInfo: {
    status: number;
    data: unknown | null;
    message: string;
  };
  onCloseErrorAlert: () => void;
}

const props = defineProps<Props>();
const message = computed(() => props.errorInfo.message.split("\n"));
</script>

<style lang="css" scoped>
@media screen and (max-width: 1000px) {
  .alert-wrap {
    background-color: rgba(0, 0, 0, 0.4);
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 15px;
    min-width: 1000px;
  }
}

.alert-wrap {
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 15px;
}

.alert-box {
  background-color: white;
  width: 400px;
  height: 230px;
  position: relative;
  border-radius: 5px;
}

.flex-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.alert-box h2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert-box .content {
  padding: 10px 40px;
}

.alert-box button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  padding: 8px 10px;
  border: 0px;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #1d81ff;
  color: white;
}
</style>
