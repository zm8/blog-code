import React from 'react';


export default class extends React.Component{
  state = {
    username: '',
    password: '',
  }
  store = this.props.store
  action = (type, payload)=>{
    this.store.dispatch({type, payload});
  }
  reduxState = ()=>this.store.getState()
  getLoginStatus(){
    return  this.reduxState().loginStatus;
  }
  // 取消
  loginCancel = ()=>{
    this.setState({
      username: '',
      password: '',
    });
    this.action('LOGIN_CANCEL');
  }
  // 退出登录
  logout = ()=>{
    this.setState({
      username: '',
      password: '',
    });
    this.action('LOGIN_OUT');
  }
  // 登录提交
  loginSubmit = ()=>{
    this.action('LOGIN_ING', {
      username: this.state.username,
      password: this.state.password,
    });
  }
  // 登录取消
  loginCancel = ()=>{
    this.action('LOGIN_CANCEL');
  }
  // 处理表单提交
  formHandle = (e)=>{
    e.preventDefault();
    this.getLoginStatus() === 0 ? this.loginCancel(): this.loginSubmit();
  }
  onChangeUsername = (evt)=>{
    this.setState({
      username: evt.target.value
    });
  }
  onChangePassword = (evt)=>{
    this.setState({
      password: evt.target.value
    });
  }
  // 登录成功
  loginSuccess(){
    return (
      <div>
        <h1>Login Success</h1>
        <p>用户名和密码: {this.reduxState().loginRes}</p>
        <input type='button' value='退出登录' onClick={this.logout} />
      </div>
    )
  }
  // 登录失败
  loginFail(){
    return (
      <div>
        <h1>Login Fail</h1>
        <p>错误原因: {this.reduxState().loginRes}</p>
        <input type='button' value='返回登录' onClick={this.loginCancel} />
      </div>
    )
  }
  // 未登录
  notLogged(loginStatus){
    let isLogining = loginStatus === 0;
    return <div>
      <h3>请登录:</h3>
      <form onSubmit={this.formHandle}>
        <p><input type='text' placeholder='username' value={this.state.username} onChange={this.onChangeUsername} /></p>
        <p><input type='password' placeholder='password' value={this.state.password} onChange={this.onChangePassword} /></p>
        <p>
          <input type='submit' value={isLogining ? '取消登录' : '登录'} />
        </p>
        <p>{isLogining ? '登录中...' : ''}</p>
      </form>
    </div>
  }
  // 获取 render 内容
  getRenderCnt(){
    let loginStatus = this.getLoginStatus();
    switch(loginStatus){
      case -1:
      case 0:
        return this.notLogged(loginStatus);
      case 1:
        return this.loginSuccess();
      case -2:
        return this.loginFail();
    }
  }
  render(){
    return <div> 
      { this.getRenderCnt() }
    </div>
  }

}
