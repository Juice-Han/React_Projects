"use strict";

var React = require("react");

var socket = io.connect();

var UsersList = React.createClass({
  render() {
    return (
      <div className="users">
        <h3> 참여자들 </h3>
        <ul>
          {this.props.users.map((user, i) => {
            return <li key={i}>{user}</li>;
          })}
        </ul>
      </div>
    );
  },
});

var Message = React.createClass({
  render() {
    return (
      <div className="message">
        <strong>{this.props.user} :</strong>
        <span>{this.props.text}</span>
      </div>
    );
  },
});

var MessageList = React.createClass({
  render() {
    return (
      <div className="messages">
        <h2> 채팅방 </h2>
        {this.props.messages.map((message, i) => {
          return <Message key={i} user={message.user} text={message.text} />;
        })}
      </div>
    );
  },
});

var MessageForm = React.createClass({
  getInitialState() {
    return { text: "" };
  },

  handleSubmit(e) {
    e.preventDefault();
    var message = {
      user: this.props.user,
      text: this.state.text,
    };
    this.props.onMessageSubmit(message);
    this.setState({ text: "" });
  },

  changeHandler(e) {
    this.setState({ text: e.target.value });
  },

  render() {
    return (
      <div className="message_form">
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="메시지 입력"
            className="textinput"
            onChange={this.changeHandler}
            value={this.state.text}
          />
          <h3></h3>
        </form>
      </div>
    );
  },
});

var ChangeNameForm = React.createClass({
  getInitialState() {
    return { newName: "" };
  },

  onKey(e) {
    this.setState({ newName: e.target.value });
  },

  handleSubmit(e) {
    e.preventDefault();
    var newName = this.state.newName;
    this.props.onChangeName(newName);
    this.setState({ newName: "" });
  },

  render() {
    return (
      <div className="change_name_form">
        <h3> 아이디 변경 </h3>
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="변경할 아이디 입력"
            onChange={this.onKey}
            value={this.state.newName}
          />
        </form>
      </div>
    );
  },
});

var ChatApp = React.createClass({
  getInitialState() {
    return { users: [], messages: [], text: "" };
  },

  componentDidMount() {
    socket.on("init", this._initialize);
    socket.on("send:message", this._messageRecieve);
    socket.on("user:join", this._userJoined);
    socket.on("user:left", this._userLeft);
    socket.on("change:name", this._userChangedName);
  },

  _initialize(data) {
    var { users, name } = data;
    this.setState({ users, user: name });
  },

  _messageRecieve(message) {
    var { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
  },

  handleMessageSubmit(message) {
    var { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
    socket.emit("send:message", message);
  },

  handleChangeName(newName) {
    var oldName = this.state.user;
    socket.emit("change:name", { name: newName }, (result) => {
      if (!result) {
        return alert("There was an error changing your name");
      }
      var { users } = this.state;
      var index = users.indexOf(oldName);
      users.splice(index, 1, newName);
      this.setState({ users, user: newName });
    });
  },

  render() {
    return (
      <div>
        <div className="center">
          <UsersList users={this.state.users} />
          <ChangeNameForm onChangeName={this.handleChangeName} />
          {/* <div> */}
          <MessageList messages={this.state.messages} />
          <MessageForm
            onMessageSubmit={this.handleMessageSubmit}
            user={this.state.user}
          />
          {/* </div> */}
        </div>
      </div>
    );
  },
});

var LoginPage = React.createClass({
  getInitialState() {
    return { id: "", password: "" };
  },

  componentDidMount() {
    socket.on("login", this._checkLogin);
  },

  login() {
    const id = this.state.id;
    const password = this.state.password;
    socket.emit("login", { id, password });
  },

  _checkLogin(check) {
    if (check.state === 200) {
      this.props.setPageIndex(2);
    } else if (check.state === 400) {
      window.alert("계정이 없거나 비밀번호가 틀렸습니다!");
    } else {
      window.alert("서버에 문제가 생겼습니다.");
    }
  },

  render() {
    return (
      <div className="w-100">
        <div className="w-75 mx-auto">
          <h1 className="h3 mb-3 fw-normal my-5">로그인 페이지</h1>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="id"
              placeholder="아이디 입력..."
              onChange={(e) => this.setState({ id: e.target.value })}
            />
            <label for="id">아이디</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <label for="pwd">비밀번호</label>
          </div>
          <button
            className="w-100 btn btn-lg btn-primary mb-2"
            onClick={() => this.login()}
          >
            로그인
          </button>
        </div>
        <button
          className="btn btn-lg btn-secondary w-75 mx-auto d-block mb-5"
          onClick={() => this.props.setPageIndex(1)}
        >
          회원가입
        </button>
      </div>
    );
  },
});

var SignOnPage = React.createClass({
  componentDidMount() {
    socket.on("signOn", this._checkSignOn);
  },

  _checkSignOn(check) {
    if (check.state === 400) {
      window.alert("아이디가 중복되었습니다. 다른 아이디를 사용해주세요!");
    } else if (check.state === 200) {
      window.alert("계정이 생성되었습니다!");
      this.props.setPageIndex(0);
    } else {
      window.alert("서버에 문제가 생겼습니다.");
    }
  },

  getInitialState() {
    return { id: "", password: "" };
  },

  signOn() {
    const id = this.state.id;
    const password = this.state.password;
    socket.emit("signOn", { id, password });
  },

  render() {
    return (
      <div className="w-100">
        <div className="w-75 mx-auto">
          <h1 className="h3 mb-3 fw-normal my-5">회원가입 페이지</h1>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="id"
              placeholder="아이디 입력..."
              onChange={(e) => this.setState({ id: e.target.value })}
            />
            <label for="id">아이디</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <label for="pwd">비밀번호</label>
          </div>
        </div>
        <button
          className="btn btn-lg btn-success w-75 mx-auto d-block mb-5"
          onClick={() => this.signOn()}
        >
          회원가입
        </button>
      </div>
    );
  },
});

var App = React.createClass({
  getInitialState() {
    return { index: 0 };
  },

  setPageIndex(index) {
    this.setState({ index: index });
  },

  render() {
    return [
      <LoginPage setPageIndex={this.setPageIndex} />,
      <SignOnPage setPageIndex={this.setPageIndex} />,
      <ChatApp />,
    ][this.state.index];
  },
});

React.render(<App />, document.getElementById("app"));
