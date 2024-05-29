// Keep track of which names are used so that there are no duplicates

const client = require('./db')
const db = client.db('reactweb')

// export function for listening to the socket
module.exports = function (socket) {

  // notify other clients that a new user has joined
  socket.on('user:join', async function (data, fn) {

    let result, result2;

    try {
      result = await db.collection('chatting-room').updateOne(
        { roomName: data.roomName },
        {
          $addToSet: {
            users: data.userId
          }
        }
      )
      result2 = await db.collection('chatting-room').findOne({ roomName: data.roomName })
    } catch (err) {
      console.log(err)
      return fn({ state: 500 })
    }

    if (result2 === null) {
      return fn({ state: 400 })
    }
    socket.broadcast.emit('user:join', {
      roomName: data.roomName,
      userId: data.userId,
    });
    fn({ state: 200, messages: result2.messages, users: result2.users })
  })

  socket.on('user:left', async function (data, fn) {
    try {
      const result = await db.collection('chatting-room').updateOne(
        { roomName: data.roomName }, {
        $pull: {
          users: {
            $in: [data.userId]
          }
        }
      }
      )
    } catch (err) {
      console.log(err)
      return fn({ state: 500 })
    }
    socket.broadcast.emit('user:left', {
      roomName: data.roomName,
      userId: data.userId
    })
    return fn({ state: 200 })
  })

  // broadcast a user's message to other users
  socket.on('send:message', async function (data, fn) {
    let dateTime
    try {
      const today = new Date();
      let { year, month, date, hours, minutes } = { year: today.getFullYear(), month: today.getMonth() + 1, date: today.getDate(), hours: today.getHours(), minutes: today.getMinutes()}
      dateTime = `${year}.${month}.${date}/${hours}시${minutes}분`
      const result = await db.collection('chatting-room').updateOne(
        { roomName: data.roomName },
        {
          $addToSet: {
            messages: {
              userId: data.message.userId,
              text: data.message.text,
              dateTime: dateTime
            }
          }
        }
      )
    } catch (err) {
      console.log(err)
      return fn({ state: 500 })
    }
    socket.broadcast.emit('send:message', {
      roomName: data.roomName,
      message: {
        userId: data.message.userId,
        text: data.message.text,
        dateTime: dateTime
      }
    });
    return fn({ state: 200 })
  });

  // validate a user's name change, and broadcast it on success
  // socket.on('change:name', function (data, fn) {
  //   if (userNames.claim(data.name)) {
  //     var oldName = name;
  //     userNames.free(oldName);

  //     name = data.name;

  //     socket.broadcast.emit('change:name', {
  //       oldName: oldName,
  //       newName: name
  //     });

  //     fn(true);
  //   } else {
  //     fn(false);
  //   }
  // }); 

  // clean up when a user leaves, and broadcast it to other users
  // socket.on('disconnect', function () {
  //   socket.broadcast.emit('user:left', {
  //     name: name
  //   });
  //   userNames.free(name);
  // });

  socket.on('login', async function (data, fn) {
    if (data.id === '') return fn({ state: 400 })
    try {
      const results = await db.collection('user').findOne({ id: { $eq: data.id }, password: { $eq: data.password } })
      if (results === null) {
        return fn({ state: 400 })
      } else {
        return fn({ state: 200 })
      }
    } catch (err) {
      console.log(err);
      return fn({ state: 500 })
    }
  })

  socket.on('signOn', async function (data, fn) {
    try {
      const results = await db.collection('user').findOne({ id: { $eq: data.id } }) // 중복된 아이디 찾기
      if (results !== null) {
        return fn({ state: 400 })
      }
      const results2 = await db.collection('user').insertOne({ id: data.id, password: data.password }) // 계정 생성
      return fn({ state: 200 })
    } catch (err) {
      console.log(err)
      return fn({ state: 500 })
    }
  })

  socket.on('create:room', async function (data, fn) {
    if(data.roomName === ""){
      return fn({state: 400})
    }
    try {
      const result = await db.collection('chatting-room').insertOne({ roomName: data.roomName, messages: [], users: [] })
      return fn({ state: 200 })
    } catch (err) {
      console.log(err)
      return fn({ state: 500 })
    }
  })

  socket.on('find:room', async function (data, fn) {
    try {
      const results = await db.collection('chatting-room').find({ roomName: { $regex: data.roomName, $options: 'i' } }).toArray()
      return fn({ state: 200, rooms: results })
    } catch (err) {
      console.log(err)
      return fn({ state: 500 })
    }
  })
};
