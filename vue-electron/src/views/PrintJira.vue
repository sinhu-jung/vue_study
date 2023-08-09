<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { getNowDate, getSendJql } from "../utils";
import {
  addUserId,
  deleteUserId,
  getDB,
  getJiraInfo,
} from "@/stores/indexedDB";
import { jqlExample } from "../utils";
import { ipcRenderer } from "electron";
import { getText, type ResultTicket } from "../utils/export";
import DayDialog from "../components/DayDialog.vue";
import Loading from "@/components/Loading.vue";
import WeekDialog from "@/components/WeekDialog.vue";

const loginTable = "jiraInfo";
const searchTable = "searchInfo";
const dbData = ref<IDBDatabase | null>(null);
const writeJql = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const openDialog = ref<boolean>(false);
const openWeekDialog = ref<boolean>(false);
const userId = ref<string>("");
const jql = ref<string>("");
const ticketInfo: {
  ticketList: ResultTicket[];
  labelList: string[];
} = reactive({
  ticketList: [],
  labelList: [],
});
const searchInfo: {
  startDate: string;
  endDate: string;
  idList: string[];
} = reactive({
  startDate: getNowDate(),
  endDate: getNowDate(),
  idList: [],
});

onBeforeMount(async () => {
  const dbInfo = (await getDB()) as IDBDatabase;
  const userListData = await getJiraInfo(dbInfo, searchTable);
  searchInfo.idList = userListData.map((data) => data.id);
  dbData.value = dbInfo;
});

const onAddUserId = () => {
  searchInfo.idList = Array.from(new Set([...searchInfo.idList, userId.value]));
  addUserId(dbData.value as IDBDatabase, userId.value, searchTable);
  userId.value = "";
};

const onClickDelete = (id: string) => {
  searchInfo.idList = searchInfo.idList.filter((userId) => userId !== id);
  deleteUserId(dbData.value as IDBDatabase, id, searchTable);
};

const onClickCheckBox = () => {
  writeJql.value = !writeJql.value;
};

const getJiraData = async () => {
  const dbInfo = (await getDB()) as IDBDatabase;
  const loginInfoData = await getJiraInfo(dbInfo, loginTable);
  const jqlData = getSendJql(searchInfo);

  const jiraTicket = await ipcRenderer.invoke(
    "postJiraTicket",
    JSON.stringify({
      loginInfo: loginInfoData[0] ?? { address: "", id: "", pw: "" },
      jql: jqlData,
    })
  );

  return jiraTicket.data?.issues ?? [];
};

const getDayReport = async () => {
  isLoading.value = true;
  const issueList = await getJiraData();
  const data = getText(issueList);
  ticketInfo.ticketList = data.ticketList;
  ticketInfo.labelList = data.labelList;
  isLoading.value = false;
  openDialog.value = true;
};

const onChangeJQL = (e: Event) => {
  const input = e.target as HTMLInputElement;
  jql.value = input.value;
};

const onCloseDialog = () => {
  openDialog.value = false;
};

const onCloseWeek = () => {
  openWeekDialog.value = false;
};

const onClickWeek = () => {
  openWeekDialog.value = true;
};
</script>

<template>
  <WeekDialog
    v-if="openWeekDialog"
    :onCloseWeek="onCloseWeek"
    :getJiraData="getJiraData"
    :idList="searchInfo.idList"
  />
  <Loading v-if="isLoading" />
  <DayDialog
    v-if="openDialog"
    :ticketInfo="ticketInfo"
    :onCloseDialog="onCloseDialog"
  />
  <div id="print-jira">
    <div class="print-center">
      <h1>업무 보고 출력</h1>
      <div class="print-container">
        <div class="flexStyle">
          <span>시작일 : </span>
          <input type="date" v-model="searchInfo.startDate" />
          <div>~</div>
          <span>종료일 : </span>
          <input type="date" v-model="searchInfo.endDate" />
        </div>
        <div class="comment">
          * 출력할 지라의 시작일과 종료일을 선택 해 주세요.
        </div>
        <h3>검색할 아이디</h3>
        <div class="id_control">
          <span
            class="tag"
            v-for="(name, index) in searchInfo.idList"
            v-bind:key="index"
          >
            {{ name }}
            <span class="delete-tag" @click="onClickDelete(name)"
          /></span>
          <input
            class="id_control_input"
            v-model="userId"
            @keyup.enter="onAddUserId"
          />
        </div>
        <div class="flexStyle">
          <h3>JQL 직접 입력</h3>
          <input
            class="checkbox"
            type="checkbox"
            v-model="writeJql"
            @click="onClickCheckBox"
          />
        </div>
        <textarea
          :disabled="!writeJql"
          v-model="jql"
          @input="onChangeJQL"
          :placeholder="jqlExample"
        />
        <div class="flexStyle" style="margin-left: auto">
          <button @click="getDayReport">일일보고 출력</button>
          <button @click="onClickWeek">주간보고 출력</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/print_jira.css";
</style>
