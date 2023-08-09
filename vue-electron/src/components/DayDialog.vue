<script setup lang="ts">
import { ResultTicket } from "@/utils/export";
import { computed } from "vue";

interface Props {
  ticketInfo: {
    ticketList: ResultTicket[];
    labelList: string[];
  };
  onCloseDialog: () => void;
}

const getDayDateFormat = (date: string) => {
  const splitDate = date.split("-");
  return `${splitDate[1]}/${splitDate[2]}`;
};

const props = defineProps<Props>();
const text = computed(() => {
  const resultData: string[] = [];
  props.ticketInfo.labelList.forEach((label) => {
    resultData.push(`${label} \n`);
    let index = 0;
    props.ticketInfo.ticketList.forEach((ticket) => {
      if (ticket.label === label) {
        resultData.push(
          `${index + 1}) ${ticket.title} (${ticket.name}, ${
            ticket.progress
          }%, ${getDayDateFormat(ticket.endDate)})\n`
        );
        index++;
      }
    });
    resultData.push("\n");
  });
  return resultData.join("");
});

const onClickCopy = () => {
  navigator.clipboard.writeText(text.value).then(() => {
    props.onCloseDialog();
    alert("복사완료");
  });
};
</script>

<template>
  <div class="alert-wrap">
    <div class="alert-box">
      <div class="flex-column">
        <h2>일일 업무보고</h2>
        <div class="content">{{ text }}</div>
        <div class="button-flex">
          <button @click="props.onCloseDialog">확인</button>
          <button @click="onClickCopy">복사</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 800px) {
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
    min-width: 790px;
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
  width: 500px;
  height: 400px;
  position: relative;
  border-radius: 5px;
}

.flex-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  white-space: pre-wrap;
}

.alert-box h2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert-box .content {
  padding: 10px 40px;
  overflow-y: auto;
}

.button-flex {
  display: flex;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
}

.alert-box button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  padding: 8px 10px;
  border: 0px;
  margin: 5px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #1d81ff;
  color: white;
  cursor: pointer;
}
</style>
