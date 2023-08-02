<script setup lang="ts">
import { reactive, ref, type Ref, onBeforeMount } from 'vue'
import Loading from '../components/Loading.vue'
import { addJiraInfo, getDB, getJiraInfo, type LoginType } from '@/stores/indexedDB'
import { getBasicAuth } from '@/api/jiraApi'
import axios from 'axios'
const dbData: Ref<IDBDatabase | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const loginInfo: LoginType = reactive({
  address: '',
  id: '',
  pw: ''
})

onBeforeMount(async () => {
  isLoading.value = true
  const dbInfo = (await getDB()) as IDBDatabase
  const loginInfoData = await getJiraInfo(dbInfo)

  loginInfo.address = loginInfoData[0]?.address ?? ''
  loginInfo.id = loginInfoData[0]?.id ?? ''
  loginInfo.pw = loginInfoData[0]?.pw ?? ''

  setTimeout(() => {
    isLoading.value = false
  }, 500)
  dbData.value = dbInfo
})

const onChangeAddress = (e: Event) => {
  const inputData = e.target as HTMLInputElement
  loginInfo.address = inputData.value
}

const onChangeId = (e: Event) => {
  const inputData = e.target as HTMLInputElement
  loginInfo.id = inputData.value
}

const onChangePw = (e: Event) => {
  const inputData = e.target as HTMLInputElement
  loginInfo.pw = inputData.value
}

const onClickLogin = async () => {
  try {
    const result = await axios.post(
      '',
      {},
      {
        headers: {
          Authorization: getBasicAuth(loginInfo),
          ['Access-Control-Allow-Origin']: '*'
        }
      }
    )
  } catch (error) {
    throw new Error(error as string)
  }
}
</script>

<template>
  <div id="login-container">
    <Loading v-if="isLoading" />
    <div class="center">
      <div class="img_center">
        <img src="../assets/V-image.png" height="70" width="70" />
      </div>
      <h1>*** 업무보고</h1>
      <div class="container">
        <div>
          <span>지라 주소</span>
          <input
            v-model="loginInfo.address"
            @input="onChangeAddress"
            placeholder="http://jira:8080/"
          />
        </div>
        <div>
          <span>ID</span>
          <input
            v-model="loginInfo.id"
            @input="onChangeId"
            placeholder="지라 접속 계정을 입력하세요."
          />
        </div>
        <div>
          <span>PW</span>
          <input
            v-model="loginInfo.pw"
            @input="onChangePw"
            placeholder="지라 접속 비밀번호를 입력하세요."
          />
        </div>
        <button @click="onClickLogin">로그인</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import '../assets/login.css';
</style>
