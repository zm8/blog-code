import React from "react";

const langCN = {
  cancel: '取消',
  submit: '提交',
}

const langEN = {
  cancel: 'Cancel',
  submit: 'Submit',
}

const ThemeContext = React.createContext(langEN);

class All extends React.Component{
  state = {
    value: langCN,
    j: true
  }
  toggle(){
    this.setState({
      value: this.state.j ? langEN : langCN,
      j: !this.state.j
    });
  }
  render(){
    return (
      <div>
        <div><button onClick={this.toggle.bind(this)}>切换语言</button></div>
        <div>
          <br />
          <ThemeContext.Provider value={this.state.value}>
            <LangCom />
          </ThemeContext.Provider>
        </div>
        <LangCom />
      </div>
    )
  }
}


class LangCom extends React.Component{
  render(){
    return (
      <ThemeContext.Consumer>
        {value=>
          <div>
            <button>{value.cancel}</button>
            &nbsp;
            <button>{value.submit}</button>
          </div>
        }
      </ThemeContext.Consumer>
    )
  }
}

export default All