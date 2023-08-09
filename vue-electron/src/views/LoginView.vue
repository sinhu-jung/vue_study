<script setup lang="ts">
import { reactive, ref, type Ref, onBeforeMount } from "vue";
import Loading from "../components/Loading.vue";
import Alert from "../components/Alert.vue";
import {
  addJiraInfo,
  getDB,
  getJiraInfo,
  type LoginType,
} from "@/stores/indexedDB";
import { ipcRenderer } from "electron";
import { useRouter } from "vue-router";

interface ResultTypes {
  status: number;
  data: unknown | null;
  message: string;
}
const tableName = "jiraInfo";
const router = useRouter();
const dbData: Ref<IDBDatabase | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);
const errorAlert: Ref<boolean> = ref(false);
const errorInfo: ResultTypes = reactive({
  status: 0,
  data: null,
  message: "",
});
const loginInfo: LoginType = reactive({
  address: "",
  id: "",
  pw: "",
});

onBeforeMount(async () => {
  isLoading.value = true;
  const dbInfo = (await getDB()) as IDBDatabase;
  const loginInfoData = await getJiraInfo(dbInfo, tableName);

  loginInfo.address = loginInfoData[0]?.address ?? "http://jira.com:8080/";
  loginInfo.id = loginInfoData[0]?.id ?? "";
  loginInfo.pw = loginInfoData[0]?.pw ?? "";

  setTimeout(() => {
    isLoading.value = false;
  }, 500);
  dbData.value = dbInfo;
});

const onCloseErrorAlert = () => {
  errorAlert.value = false;
};

const onClickLogin = async () => {
  isLoading.value = true;
  const data: ResultTypes = (await ipcRenderer.invoke(
    "login",
    JSON.stringify(loginInfo)
  )) as ResultTypes;

  if (data.status === 200) {
    addJiraInfo(dbData.value as IDBDatabase, loginInfo, tableName);
    router.push({
      path: "print-jira",
    });
    isLoading.value = false;
  } else {
    errorAlert.value = true;
    errorInfo.status = data.status;
    errorInfo.message = data.message;
    isLoading.value = false;
  }
};
</script>

<template>
  <div id="login-container">
    <Alert
      v-if="errorAlert"
      :errorInfo="errorInfo"
      :onCloseErrorAlert="onCloseErrorAlert"
    />
    <Loading v-if="isLoading" />
    <div class="center">
      <div class="img_center">
        <img src="../assets/V-image.png" height="70" width="70" />
      </div>
      <h1>**** 업무보고</h1>
      <div class="container">
        <div>
          <span>지라 주소</span>
          <input
            v-model="loginInfo.address"
            @keyup.enter="onClickLogin"
            placeholder="http://jira.com:8080/"
          />
        </div>
        <div>
          <span>ID</span>
          <input
            v-model="loginInfo.id"
            @keyup.enter="onClickLogin"
            placeholder="지라 접속 계정을 입력하세요."
          />
        </div>
        <div>
          <span>PW</span>
          <input
            type="password"
            v-model="loginInfo.pw"
            @keyup.enter="onClickLogin"
            placeholder="지라 접속 비밀번호를 입력하세요."
          />
        </div>
        <button @click="onClickLogin">로그인</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import "../assets/login.css";
</style>
