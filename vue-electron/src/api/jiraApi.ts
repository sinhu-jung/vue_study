const getBasicAuth = (loginInfo: {
  address: string;
  id: string;
  pw: string;
}) => {
  return `Basic ${Buffer.from(`${loginInfo.id}:${loginInfo.pw}`).toString(
    "base64"
  )}`;
};

// const sendJira = async (loginInfo: LoginType) => {
//   return fetch()
// }

export { getBasicAuth };
