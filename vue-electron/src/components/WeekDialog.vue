<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { v4 as uuid } from "uuid";
import {
  addCellInfo,
  deleteCellInfo,
  getDB,
  getJiraInfo,
  updateCellInfo,
} from "@/stores/indexedDB";
import { getExcelFile } from "@/utils/export";

interface Props {
  onCloseWeek: () => void;
  getJiraData: () => any;
  idList: string[];
}

const props = defineProps<Props>();
const dbData = ref<IDBDatabase | null>(null);
const cellInfo = ref<
  {
    id: string;
    title: string;
    cellUserList: string[];
    selectId: string;
    index: number;
  }[]
>([]);

onBeforeMount(async () => {
  const dbInfo = (await getDB()) as IDBDatabase;
  const userListData = await getJiraInfo(dbInfo, "weekCellInfo");
  cellInfo.value = userListData.sort((a, b) => {
    if (a.index > b.index) {
      return 1;
    } else if (a.index < b.index) {
      return -1;
    } else {
      return 0;
    }
  });
  dbData.value = dbInfo;
});

const selectList = computed(() => {
  const idList = props.idList.map((id) => ({ name: id, value: id }));
  return idList;
});

const onClickAddCell = () => {
  const newData = {
    id: uuid(),
    title: "",
    cellUserList: [],
    selectId: "",
    index: (cellInfo.value[cellInfo.value.length - 1]?.index ?? 0) + 1,
  };
  const newCellInfoList = [...cellInfo.value, newData];
  cellInfo.value = newCellInfoList;
  addCellInfo(dbData.value as IDBDatabase, newData);
};

const onChangeTitle = (e: Event, id: string) => {
  const inputData = e.target as HTMLInputElement;
  cellInfo.value = cellInfo.value.map((info) => {
    if (info.id === id) {
      return {
        ...info,
        title: inputData.value,
      };
    }

    return info;
  });
  const data = cellInfo.value?.find((data) => data.id === id);
  if (data) {
    updateCellInfo(dbData.value as IDBDatabase, {
      id: data.id,
      title: data.title,
      cellUserList: [...data.cellUserList],
      selectId: data.selectId,
      index: data.index,
    });
  }
};

const onDeleteCell = (id: string) => {
  cellInfo.value = cellInfo.value.filter((cell) => cell.id !== id);
  deleteCellInfo(dbData.value as IDBDatabase, id);
};

const onChangeSelect = (e: Event, id: string) => {
  const inputData = e.target as HTMLSelectElement;
  cellInfo.value = cellInfo.value.map((info) => {
    if (info.id === id) {
      const setData = new Set(info.cellUserList);
      setData.add(inputData.value);
      return {
        ...info,
        cellUserList: Array.from(setData),
        selectId: "",
      };
    }

    return info;
  });
  const data = cellInfo.value?.find((data) => data.id === id);
  if (data) {
    updateCellInfo(dbData.value as IDBDatabase, {
      id: data.id,
      title: data.title,
      cellUserList: [...data.cellUserList],
      selectId: data.selectId,
      index: data.index,
    });
  }
};

const onDeleteUserList = (id: string, userData: string) => {
  cellInfo.value = cellInfo.value.map((info) => {
    if (info.id === id) {
      return {
        ...info,
        cellUserList: info.cellUserList.filter((user) => user !== userData),
        selectId: "",
      };
    }

    return info;
  });
  const data = cellInfo.value?.find((data) => data.id === id);
  if (data) {
    updateCellInfo(dbData.value as IDBDatabase, {
      id: data.id,
      title: data.title,
      cellUserList: [...data.cellUserList],
      selectId: data.selectId,
      index: data.index,
    });
  }
};

const onClickPrintWeekReport = async () => {
  const jiraData = await props.getJiraData();
  await getExcelFile(jiraData, cellInfo.value);
  props.onCloseWeek();
};
</script>

<template>
  <div class="alert-wrap">
    <div class="alert-box">
      <div class="flex-column">
        <h2>주간 업무보고</h2>
        <button style="margin: 0px auto" @click="onClickAddCell">추가</button>
        <div class="content">
          <div class="cell-container" v-for="item in cellInfo" :key="item.id">
            <div style="display: flex">
              <input
                class="cell-title"
                placeholder="cell 명을 입력하세요."
                v-model="item.title"
                @input="onChangeTitle($event, item.id)"
              />
              <span class="delete-cell" @click="onDeleteCell(item.id)" />
            </div>
            <div class="cell-box">
              <span
                class="tag"
                v-for="(tag, index) in item.cellUserList"
                :key="index"
              >
                {{ tag }}
                <span
                  class="delete-tag"
                  @click="onDeleteUserList(item.id, tag)"
              /></span>
              <select
                class="select-filed"
                v-model="item.selectId"
                @change="onChangeSelect($event, item.id)"
              >
                <option :value="''">선택해주세요</option>
                <option
                  v-for="(item, index) in selectList"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="button-flex">
          <button @click="props.onCloseWeek">취소</button>
          <button @click="onClickPrintWeekReport">출력</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/week-dialog.css";
</style>
