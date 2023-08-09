import { Worksheet, type Row } from "exceljs";
import { ResultTicket } from "./export";

export const headerList = [
  "",
  "업무구분",
  "담당셀",
  "대분류",
  "업무",
  "우선순위",
  "진행율",
  "담당자",
  "업무비중",
  "진행상태",
  "진행여부",
  "개발시작일",
  "개발목표",
  "이슈사항",
];

export const keyList = [
  "empty",
  "workdivide",
  "cell",
  "label",
  "title",
  "priority",
  "progress",
  "name",
  "workPercent",
  "workType",
  "status",
  "startDate",
  "endDate",
  "issue",
];

export const getHeaderRow = () => {
  const headerRow = {} as any;
  headerList.forEach((header, index) => {
    headerRow[keyList[index]] = header;
  });

  return headerRow;
};

export const setHeaderStyle = (headerStyle: Row) => {
  headerStyle.eachCell((cell, cellNumber) => {
    if (cellNumber > 1) {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "EFEFEF",
        },
        bgColor: {
          argb: "EFEFEF",
        },
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      cell.font = {
        bold: true,
      };
    }
  });
  headerStyle.height = 21;
};

const divideType = {
  first: "중요O\n긴급O",
  second: "중요X\n긴급O",
  third: "중요O\n긴급X",
  fourth: "중요X\n긴급X",
} as any;

const rowEmptyData = {
  label: "",
  title: "",
  startDate: "",
  endDate: "",
  priority: "",
  emergency: false,
  importent: false,
  status: "",
  name: "",
  progress: 0,
  id: "",
} as ResultTicket;

export const getRowData = (cell: string, data: ResultTicket, type: string) => {
  const labelString = data.label.match(/[^\[|^\]]+/g)?.[0];

  return {
    empty: "",
    workdivide: divideType[type],
    cell,
    label: labelString,
    title: data.title,
    priority: data.priority,
    progress: `${data.progress}%`,
    name: data.name,
    workPercent: "",
    workType: "개발",
    status: data.status,
    startDate: data.startDate,
    endDate: data.endDate,
    issue: "",
  };
};

const getColor = (type: string) => {
  if (type === "first") {
    return "474747";
  } else if (type === "second") {
    return "6C6C6C";
  } else if (type === "third") {
    return "B2B2B2";
  } else {
    return "D1D1D1";
  }
};

export const setLowStyle = (rowStyle: Row, type: string, length: number) => {
  rowStyle.eachCell((cell, cellNumber) => {
    if (cellNumber === 1) {
      return;
    }

    cell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    switch (cellNumber) {
      case 2:
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: getColor(type),
          },
          bgColor: {
            argb: getColor(type),
          },
        };
        cell.font = {
          size: 10,
          color: { argb: "ffffff" },
          bold: true,
        };
        return;
      case 3:
        cell.font = {
          bold: true,
        };
        return;
      case 5:
        cell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
        return;
      case 7:
        cell.alignment = {
          horizontal: "right",
          vertical: "middle",
        };
        return;
      case 11:
        if (cell.value === "완료") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "FFFF0A",
            },
            bgColor: {
              argb: "FFFF0A",
            },
          };
        } else if (cell.value === "진행중") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "82CA3F",
            },
            bgColor: {
              argb: "82CA3F",
            },
          };
        }
        return;

      default:
        break;
    }
  });

  if (length > 1) {
    rowStyle.height = 20;
  } else {
    rowStyle.height = 40;
  }
};

export const getFilterData = (
  list: ResultTicket[],
  info: {
    id: string;
    title: string;
    cellUserList: string[];
    selectId: string;
    index: number;
  }
) => {
  const filterData = list.filter((first) =>
    info.cellUserList.some((user) => user === first.id)
  );

  if (filterData.length === 0) {
    return filterData.concat([rowEmptyData]);
  } else {
    return filterData;
  }
};

export const mergeCell: (
  list: ResultTicket[],
  worksheet: Worksheet,
  rowStart: number
) => number = (
  list: ResultTicket[],
  worksheet: Worksheet,
  rowStart: number
) => {
  if (list.length > 1) {
    worksheet.mergeCells(`B${rowStart}:B${rowStart + list.length - 1}`);
    return rowStart + list.length;
  } else {
    return rowStart + 1;
  }
};
