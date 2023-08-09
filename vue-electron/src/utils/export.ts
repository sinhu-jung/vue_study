import Excel from "exceljs";
import { saveAs } from "file-saver";
import {
  getFilterData,
  getHeaderRow,
  getRowData,
  mergeCell,
  setHeaderStyle,
  setLowStyle,
} from "./exportFunc";
import { getNowDate } from ".";

export interface ResultTicket {
  label: string;
  title: string;
  startDate: string;
  endDate: string;
  priority: string;
  emergency: boolean;
  importent: boolean;
  status: string;
  name: string;
  progress: number;
  id: string;
}

const getPriority = (priority: string) => {
  switch (priority) {
    case "Low":
      return "하";
    case "Lowest":
      return "최하";
    case "Highest":
      return "최상";
    case "High":
      return "상";
    default:
      return "중";
  }
};

const getEmergency = (labelList: string[]) => {
  const emergency = labelList?.find((label) => label.includes("긴급"));
  return emergency === "긴급O";
};

const getImportant = (labelList: string[]) => {
  const emergency = labelList?.find((label) => label.includes("중요"));
  return emergency === "중요O";
};

const getStatus = (status: string) => {
  switch (status) {
    case "TO DO":
      return "예정";
    case "DONE":
      return "완료";
    default:
      return "진행중";
  }
};

const dataProcessing = (data: any) => {
  return data.map((ticket: any) => {
    const fileds = ticket.fields;
    const titleSplit = fileds.summary.match(/\S+/g);

    return {
      label: titleSplit[0] ?? "",
      title: titleSplit?.splice(1)?.join(" ") ?? "",
      startDate: fileds.customfield_10832,
      endDate: fileds.customfield_10833,
      priority: getPriority(fileds.priority ?? ""),
      emergency: getEmergency(fileds.labels ?? []),
      importent: getImportant(fileds.labels ?? []),
      status: getStatus(fileds.status.name ?? ""),
      name: fileds?.assignee?.displayName ?? "",
      progress: fileds?.aggregateprogress?.percent ?? 0,
      id: fileds?.assignee?.name ?? "",
    };
  });
};

export const getText = (data: any) => {
  const ticket = dataProcessing(data) as ResultTicket[];
  const labels = new Set();
  ticket.forEach((ticketData: any) => {
    labels.add(ticketData.label);
  });
  return {
    ticketList: ticket,
    labelList: Array.from(labels) as string[],
  };
};

const headerData = [
  { header: "", key: "empty", width: 2 },
  { header: `최종 수정일 : ${getNowDate()}`, key: "workdivide", width: 20 },
  { header: "", key: "cell", width: 10 },
  { header: "", key: "label", width: 20 },
  { header: "", key: "title", width: 85 },
  { header: "", key: "priority", width: 12 },
  { header: "", key: "progress", width: 12 },
  { header: "", key: "name", width: 12 },
  { header: "", key: "workPercent", width: 12 },
  { header: "", key: "workType", width: 12 },
  { header: "", key: "status", width: 12 },
  { header: "", key: "startDate", width: 12 },
  { header: "", key: "endDate", width: 12 },
  { header: "", key: "issue", width: 50 },
];

export const getExcelFile = async (
  data: any,
  cellInfo: {
    id: string;
    title: string;
    cellUserList: string[];
    selectId: string;
    index: number;
  }[]
) => {
  const ticket = dataProcessing(data) as ResultTicket[];

  const workbook = new Excel.Workbook();

  const firstList = ticket.filter((data) => data.emergency && data.importent);
  const secondList = ticket.filter((data) => data.emergency && !data.importent);
  const thirdList = ticket.filter((data) => !data.emergency && data.importent);
  const fourthList = ticket.filter(
    (data) => !data.emergency && !data.importent
  );

  cellInfo.forEach((info) => {
    const worksheet = workbook.addWorksheet(info.title);
    worksheet.columns = headerData;
    const firstRow = worksheet.getRow(1);
    firstRow.height = 35;
    firstRow.getCell(2).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    const headerStyle = worksheet.addRow(getHeaderRow());
    setHeaderStyle(headerStyle);

    const filterFirst = getFilterData(firstList, info);
    const filterSecond = getFilterData(secondList, info);
    const filterThird = getFilterData(thirdList, info);
    const filterFourth = getFilterData(fourthList, info);

    filterFirst.forEach((first) => {
      const type = "first";
      const firstRow = getRowData(info.title, first, type);
      const rowStyle = worksheet.addRow(firstRow);
      setLowStyle(rowStyle, type, filterFirst.length);
    });
    filterSecond.forEach((first) => {
      const type = "second";
      const firstRow = getRowData(info.title, first, type);
      const rowStyle = worksheet.addRow(firstRow);
      setLowStyle(rowStyle, type, filterSecond.length);
    });
    filterThird.forEach((first) => {
      const type = "third";
      const firstRow = getRowData(info.title, first, type);
      const rowStyle = worksheet.addRow(firstRow);
      setLowStyle(rowStyle, type, filterThird.length);
    });
    filterFourth.forEach((first) => {
      const type = "fourth";
      const firstRow = getRowData(info.title, first, type);
      const rowStyle = worksheet.addRow(firstRow);
      setLowStyle(rowStyle, type, filterFourth.length);
    });

    let rowStart = 3;
    rowStart = mergeCell(filterFirst, worksheet, rowStart);
    rowStart = mergeCell(filterSecond, worksheet, rowStart);
    rowStart = mergeCell(filterThird, worksheet, rowStart);
    mergeCell(filterFourth, worksheet, rowStart);
  });

  const mimeType = {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], mimeType);
  saveAs(blob, `****_업무진행현황.xlsx`);
};
