const defaultState = {
  loginStatus: -1, // -2 登录失败, -1 未登录, 0 正在登录, 1 登录成功
  loginRes: '', // 登录结果返回值
}

export default function counter(state = defaultState, action) {
  const {type, loginRes} = action;
  switch (type) {
    case 'LOGIN_ING':
      return {
        ...state,
        loginStatus: 0,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loginRes,
        loginStatus: 1,
      }
    case 'LOGIN_FAIL':
      return {
        ...state,
        loginRes,
        loginStatus: -2,
      }
    case 'LOGIN_OUT':
    case 'LOGIN_BACK':
    case 'LOGIN_CANCEL':
      return {
        ...state,
        loginStatus: -1,
      }
    default:
      return state
  }
}
