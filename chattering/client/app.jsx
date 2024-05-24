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
    return {
      users: [],
      messages: [],
      text: "",
      roomName: "",
      rooms: [],
      canMakeRoom: false,
    };
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

  createChatRoom(roomName) {
    socket.emit("create:room", { roomName: roomName }, (result) => {
      if (result) {
        alert("방 생성 완료!");
        this.setState({ canMakeRoom: false });
      }
    });
  },

  findChatRoom(roomName) {
    socket.emit("find:room", { roomName: roomName }, (results) => {
      if (results.length !== 0) {
        this.setState({ rooms: results });
        this.setState({ canMakeRoom: false });
      } else {
        this.setState({ canMakeRoom: true });
        this.setState({ rooms: [] });
      }
    });
  },

  render() {
    return (
      <div className="d-flex border border-2 border-primary-subtle">
        <div className="side border-end border-1">
          <div className="container text-center mb-3">
            <h4 className="mb-2">채팅방 검색</h4>
            <input
              onChange={(e) => this.setState({ roomName: e.target.value })}
            />
            <button onClick={() => this.findChatRoom(this.state.roomName)}>
              검색
            </button>
          </div>
          <div className="container">
            {this.state.canMakeRoom && (
              <div className="mb-3">
                <h5>찾으시는 방이 존재하지 않습니다.</h5>
                <span>방을 만드시겠습니까? </span>
                <button
                  onClick={() => this.createChatRoom(this.state.roomName)}
                >
                  확인
                </button>
                <button onClick={() => this.setState({ canMakeRoom: false })}>
                  취소
                </button>
              </div>
            )}
            <h5>채팅방 목록</h5>
            {this.state.rooms.length !== 0 &&
              this.state.rooms.map((room, idx) => {
                return (
                  <div className="card mb-3" key={idx}>
                    <div className="card-body">
                      <h5 className="card-title">방 제목: {room.name}</h5>
                      <button className="btn btn-primary">채팅방 입장</button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
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
      <div className="w-50 border border-3 border-primary-subtle mx-auto">
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
  getInitialState() {
    return { id: "", password: "" };
  },

  signOn() {
    const id = this.state.id;
    const password = this.state.password;
    socket.emit("signOn", { id, password }, (result) => {
      if (result === 400) {
        window.alert("아이디가 중복되었습니다. 다른 아이디를 사용해주세요!");
      } else if (result === 200) {
        window.alert("계정이 생성되었습니다!");
        this.props.setPageIndex(0);
      } else {
        window.alert("서버에 문제가 생겼습니다.");
      }
    });
  },

  render() {
    return (
      <div className="w-50 border border-3 border-primary-subtle mx-auto">
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
          className="btn btn-lg btn-success w-75 mx-auto d-block mb-2"
          onClick={() => this.signOn()}
        >
          회원가입
        </button>
        <div className="w-100 d-flex justify-content-center mb-5">
          <button
            className="w-75 btn btn-lg btn-secondary"
            onClick={() => this.props.setPageIndex(0)}
          >
            로그인 페이지 가기
          </button>
        </div>
      </div>
    );
  },
});

var App = React.createClass({
  getInitialState() {
    return { index: 2 };
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
