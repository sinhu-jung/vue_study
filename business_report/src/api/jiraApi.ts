const getBasicAuth = (loginInfo: { address: string; id: string; pw: string }) => {
  return `Basic ${btoa(`${loginInfo.id}:${loginInfo.pw}`)}`
}

// const sendJira = async (loginInfo: LoginType) => {
//   return fetch()
// }

export { getBasicAuth }
