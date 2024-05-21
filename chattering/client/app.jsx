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
  render() {
    return (
      <div className="w-100">
        <form method="POST" action="http://localhost:3000/login" className="w-75 mx-auto">
          <h1 className="h3 mb-3 fw-normal my-5">로그인 페이지</h1>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="id"
              placeholder="아이디 입력..."
            />
            <label for="id">아이디</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="Password"
            />
            <label for="pwd">비밀번호</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary mb-2" type="submit">
            로그인
          </button>
        </form>
		<button className="btn btn-lg btn-secondary w-75 mx-auto d-block mb-5">회원가입</button>
      </div>
    );
  },
});

var App = React.createClass({

	render(){
		return (
			<div>
				
			</div>
		)
	}
})

React.render(<LoginPage />, document.getElementById("app"));
