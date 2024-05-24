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
  var rooms = {chat1: {name: 'chat1'}};

  var createRoom = function (name) {
    rooms[name] = {name: name}
  }

  var findRoom = function (name) {
    var roomKeys = Object.keys(rooms)
    var filteredRooms = []
    for(let i = 0; i<roomKeys.length; i++){
      if(rooms[roomKeys[i]].name.includes(name)){
        filteredRooms.push(rooms[roomKeys[i]])
      }
    }
    return filteredRooms
  }

  return {
    createRoom: createRoom,
    findRoom: findRoom
  }
}())

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.text
    });
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
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });

  socket.on('login', function (data) {
    connection.query('select * from user where id=? and password=?', [data.id, data.password], (err, results) => {
      if (err) {
        console.log(err)
        socket.emit('login', { state: 500 })
      }
      if (results.length === 0) {
        return socket.emit('login', { state: 400 })
      }
      return socket.emit('login', { state: 200 })
    })
  })

  socket.on('signOn', function (data,fn) {
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

  socket.on('find:room', function(data, fn){
    var roomName = data.roomName
    var results = roomNames.findRoom(roomName)
    fn(results)
  })
};
