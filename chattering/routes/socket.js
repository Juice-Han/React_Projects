// Keep track of which names are used so that there are no duplicates

const connection = require('./db')

var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

var roomNames = (function () {
  var rooms = { chat1: { name: 'chat1', messages: [], users: [] } };

  var createRoom = function (name) {
    rooms[name] = { name: name, messages: [], users: [] }
  }

  var findRoom = function (name) {
    var roomKeys = Object.keys(rooms)
    var filteredRooms = []
    for (let i = 0; i < roomKeys.length; i++) {
      if (rooms[roomKeys[i]].name.includes(name)) {
        filteredRooms.push(rooms[roomKeys[i]])
      }
    }
    return filteredRooms
  }

  var chatRecord = function (roomName) {
    if (!rooms[roomName]) {
      return false
    }
    return rooms[roomName]
  }

  var addChat = function (roomName, message) {
    if (!rooms[roomName]) {
      return false
    }
    rooms[roomName].messages.push(message)
    return true
  }

  var addUser = function (roomName, userId){
    if(!rooms[roomName]){
      return false
    }
    rooms[roomName].users.push(userId)
    return true
  }

  var freeUser = function(roomName, userId){
    if(!rooms[roomName]){
      return false
    }
    for(let i = 0; i<rooms[roomName].users.length; i++){
      if(rooms[roomName].users[i] === userId){
        rooms[roomName].users.splice(i,1)
        return true
      } 
    }
    return false
  }

  return {
    createRoom: createRoom,
    findRoom: findRoom,
    chatRecord: chatRecord,
    addChat: addChat,
    addUser: addUser,
    freeUser: freeUser
  }
}())

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  // socket.emit('init', {
  //   name: name,
  //   users: userNames.get()
  // });

  // notify other clients that a new user has joined
  socket.on('user:join', function (data, fn) {
    var record = roomNames.chatRecord(data.roomName)
    var addUser = roomNames.addUser(data.roomName, data.name)
    if (!record || !addUser) {
      return fn({ state: 400 })
    }
    socket.broadcast.emit('user:join', {
      name: data.name,
    });
    fn({ state: 200, messages: record.messages, users: record.users })
  })

  socket.on('user:left',function(data,fn){
    var result = roomNames.freeUser(data.roomName, data.name)
    if(!result) return fn(false);
    socket.broadcast.emit('user:left',{
      roomName: data.roomName,
      name: data.name
    })
    return fn(true)
  })

  // broadcast a user's message to other users
  socket.on('send:message', function (data,fn) {
    var result = roomNames.addChat(data.selectedRoomName, { user: data.message.user, text: data.message.text })
    if (!result) {
      return fn(false)
    }
    socket.broadcast.emit('send:message', {
      roomName: data.selectedRoomName,
      message: {
        user: data.message.user,
        text: data.message.text
      }
    });
    fn(true)
  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;

      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  }); 

  // clean up when a user leaves, and broadcast it to other users
  // socket.on('disconnect', function () {
  //   socket.broadcast.emit('user:left', {
  //     name: name
  //   });
  //   userNames.free(name);
  // });

  socket.on('login', function (data, fn) {
    connection.query('select * from user where id=? and password=?', [data.id, data.password], (err, results) => {
      if (err) {
        console.log(err)
        return fn(500)
      }
      if (results.length === 0) {
        return fn(400)
      }
      return fn(200)
    })
  })

  socket.on('signOn', function (data, fn) {
    // 중복된 아이디 찾기
    connection.query('select * from user where id=?', [data.id], (err, results) => {
      if (err) {
        console.log(err)
        return fn(500)
      }
      if (results.length !== 0) {
        return fn(400) // 아이디가 중복되었을 경우 400 상태 전송
      }
      connection.query('insert into user (id,password) values (?,?)', [data.id, data.password], (err2, results2) => {
        if (err2) {
          console.log(err2)
          return fn(500)
        }
        return fn(200) // 계정 생성 완료
      })
    })
  })

  socket.on('create:room', function (data, fn) {
    var roomName = data.roomName
    roomNames.createRoom(roomName)
    fn(true)
  })

  socket.on('find:room', function (data, fn) {
    var roomName = data.roomName
    var results = roomNames.findRoom(roomName)
    fn(results)
  })
};
