<script setup lang="ts">
import { reactive, ref, watchEffect, type Ref } from 'vue'
import Loading from '../components/Loading.vue'
interface LoginType {
  address: string
  id: string
  pw: string
}

const isLoading: Ref<boolean> = ref(false)
const loginInfo: LoginType = reactive({
  address: '',
  id: '',
  pw: ''
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

watchEffect(() => {
  console.log(loginInfo.address)
  console.log(loginInfo.id)
  console.log(loginInfo.pw)
})
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
            placeholder="http://지라주소:8080/"
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
        <button>로그인</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import '../assets/login.css';
</style>
