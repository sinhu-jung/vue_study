<script setup lang="ts"></script>

<template>
  <div id="print-jira">
    <div class="print-center">
      <h1>옵션 선택</h1>
      <div class="print-container">
        <div class="flexStyle">
          <span>시작일 : </span>
          <input type="date" />
          <div>~</div>
          <span>종료일 : </span>
          <input type="date" />
        </div>
        <div class="comment">
          * 출력할 지라의 시작일과 종료일을 선택 해 주세요.
        </div>
        <h3>추가할 아이디</h3>
        <div class="id_control">
          <span class="tag"
            >testtesttesttesttesttesttesttesttesttesttesttesttesttest</span
          >
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <span class="tag">testtest</span>
          <input class="id_control_input" />
        </div>
        <h3>제거할 아이디</h3>
        <div class="id_control">
          <span class="tag">testtest</span>
          <input class="id_control_input" />
        </div>
        <div class="flexStyle">
          <h3>JQL 직접 입력</h3>
          <input class="checkbox" type="checkbox" />
        </div>
        <textarea></textarea>
        <div class="flexStyle" style="margin-left: auto">
          <button>일일보고 출력</button>
          <button>주간보고 출력</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/print_jira.css";
</style>
