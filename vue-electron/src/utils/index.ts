export const jqlExample =
  'assignee in (userList) AND project = "projectName"  AND status in (DONE, "TO DO", "IN PROGRESS") AND ((시작일 >= "2023/07/24" AND 시작일 <= "2023/07/28") OR (종료일 >= "2023/07/24" AND 종료일 <= "2023/07/28")OR (시작일 <= "2023/07/24" AND 종료일 >= "2023/07/28")) ORDER BY 시작일';

export const getNowDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2);
  const day = `0${now.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

export const getSendJql = (searchInfo: {
  startDate: string;
  endDate: string;
  idList: string[];
}) => {
  const stDate = searchInfo.startDate.replaceAll("-", "/");
  const edDate = searchInfo.endDate.replaceAll("-", "/");
  const userList = searchInfo.idList.join(",");

  // eslint-disable-next-line no-useless-escape
  return `assignee in (${userList}) AND project = \"****\"  AND status in (DONE, \"TO DO\", \"IN PROGRESS\") AND ((시작일 >= \"${stDate}\" AND 시작일 <= \"${edDate}\") OR (종료일 >= \"${stDate}\" AND 종료일 <= \"${edDate}\")OR (시작일 <= \"${stDate}\" AND 종료일 >= \"${edDate}\")) ORDER BY 시작일`;
};
