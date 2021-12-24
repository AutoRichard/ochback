import 'dotenv/config';


import _ from 'lodash';

import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import socketIO from 'socket.io'
import http from 'http'


import tokenRoute from './routes/token.route';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';
import linkRoute from './routes/link.route';
import mesgRoute from './routes/message.route';
import linkImage from './routes/image.route';
import mtnRoute from './routes/meeting.route';
import bookingRoute from './routes/booking.route';
import subscriptionRoute from './routes/subscription.route';
import postRoute from './routes/post.route';
import inviteRoute from './routes/invite.route'
import adminRoute from './routes/admin.route'
import adminAuthRoute from './routes/adminauth.route'
import newsRoute from './routes/news.route'
import contactRoute from './routes/contact.route'
import newsletterRoute from './routes/newletter.route'
import instructorRoute from './routes/instructor.route'
import sessionRoute from './routes/session.route';
import joinSessionRoute from './routes/joinsession.route';



import mongoose from 'mongoose'
import Message from './models/message.model'
import Conversation from './models/conversation.model'
import errorHandler from './helpers/dbErrorHandler'

import Post from './models/post.model'


const CURRENT_WORKING_DIR = process.cwd()
const app = express()

const server = http.createServer(app);

const io = socketIO(server);


let interval = [];
let allConservation = {};
let allConservations = {};
let _showMessage = {};
let _showComment = {};
let _showLikes = {};

io.on("connection", socket => {
  console.log("New client connected" + socket.id);
  //console.log(socket);
  // Returning the initial data of food menu from FoodItems collection
  socket.on("show_message", message => {
    let user1 = mongoose.Types.ObjectId(message.sender);
    let user2 = mongoose.Types.ObjectId(message.reciever);
 
    Conversation.findOneAndUpdate(
      {
        recipients: {
          $all: [
            { $elemMatch: { $eq: user1 } },
            { $elemMatch: { $eq: user2 } },
          ],
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      function (err, conversation) {
        if (err) {
          io.sockets.emit('messages', errorHandler.getErrorMessage(err))
        } else {

          if (conversation) {
            if (message.sender != conversation.sendLast) {

              let convUpdate = {
                read: true
              }
              Conversation.findByIdAndUpdate(conversation._id, convUpdate, function (err, _conversation2) {
                if (err) {
                  io.sockets.emit('messages', errorHandler.getErrorMessage(err))
                }
              })
            }
          }


          Message.aggregate([
            {
              $lookup: {
                from: 'User',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
              },
            },
            {
              $lookup: {
                from: 'User',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
              },
            },
          ])
            .match({
              $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
              ],
            })
            .project({
              'toObj.password': 0,
              'toObj.__v': 0,
              'toObj.date': 0,
              'fromObj.password': 0,
              'fromObj.__v': 0,
              'fromObj.date': 0,
            })
            .exec((err, messages) => {

              if (err) {
                io.sockets.emit('messages', errorHandler.getErrorMessage(err))
              } else {

                _showMessage[socket.id] = {
                  messages
                }
                io.sockets.emit('messages', _showMessage)
              }
            });
        }
      }
    );
  });

  socket.on("send_message", message => {
    let from = mongoose.Types.ObjectId(message.sender);
    let to = mongoose.Types.ObjectId(message.reciever);


    Conversation.findOneAndUpdate(
      {
        recipients: {
          $all: [
            { $elemMatch: { $eq: from } },
            { $elemMatch: { $eq: to } },
          ],
        },
      },
      {

        recipients: [message.sender, message.reciever],
        lastMessage: message.body,
        read: false,
        sendLast: message.sender,
        recieveLast: message.reciever,
        deleivered: false,
        date: Date.now()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      function (err, conversation) {
        if (err) {
          let update = false
          io.sockets.emit('fetch_update', update)
        } else {

          let _message = new Message({
            conversation: conversation._id,
            to: message.reciever,
            from: message.sender,
            body: message.body,
          });

          _message.save(err => {
            if (err) {
              let update = false
              io.sockets.emit('fetch_update', update)
            } else {

              let update = true
              io.sockets.emit('fetch_update', update)
            }
          });
        }
      }
    );
    //io.sockets.emit("get_data", 'docs');
  });

  socket.on("show_conversation", message => {
    //interval[socket.id] = setInterval(() => showConversation(socket, message), 2000)
    let from = mongoose.Types.ObjectId(message.sender);

    let _conversations = {
      sender: message.sender,
    }
    Conversation.aggregate([{
      $lookup: {
        from: 'User',
        localField: 'recipients',
        foreignField: '_id',
        as: 'recipientObj',
      },
    },
    ])
      .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
      .project({
        'recipientObj.password': 0,
        'recipientObj.__v': 0,
        'recipientObj.date': 0,
      })
      .exec((err, conversations) => {
        if (err) {

          io.sockets.emit('conversations', [errorHandler.getErrorMessage(err)])

        } else {
          let bulkConversation = conversations.map((item) => {
            return item._id
          });
          let _bulkConversation = {
            "_id": {
              "$in": bulkConversation
            }
          }

          Conversation.find(_bulkConversation, (_err2, _conversation2) => {
            if (_err2) {
              io.sockets.emit('conversations', [errorHandler.getErrorMessage(_err2)])
            } else {

              allConservations[socket.id] = {
                sender: message.sender,
                conversation: _conversation2
              }

              io.sockets.emit('conversations', allConservations)

              Conversation.count({ 'recieveLast': from, "deleivered": false }).exec((_err4, _conversation4) => {
                if (_err4) {
                  io.sockets.emit('conversations', [errorHandler.getErrorMessage(_err4)])
                } else {

                  allConservation[socket.id] = {
                    sender: message.sender,
                    conversation4: _conversation4
                  }

                  //_allConversation(socket, allConservation)

                  io.sockets.emit('conversationNotification', allConservation)


                  if (_conversation4 > 0) {
                    Conversation.updateMany({ 'recieveLast': from }, { "$set": { "deleivered": true } }).exec((_err3, _conversations3) => {
                      if (_err3) {
                        io.sockets.emit('conversations', [errorHandler.getErrorMessage(_err3)])
                      } else {

                        //io.sockets.emit('conversationNotification', _conversation4)
                      }
                    })
                  }
                }
              })
            }
          }).populate('recipients', '_id firstName lastName displayName userStatus');
        }
      });

  })
  // disconnect is fired when a client leaves the server

  socket.on('send_comment', message => {
    let comment = {}
    comment.text = message.comment;
    comment.postedBy = message.userId;
    let postId = mongoose.Types.ObjectId(message.postId)

    Post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true })
      .populate('postedBy', '_id firstName lastName displayName')
      .populate('comments.postedBy', '_id firstName lastName displayName')
      .populate('likes.postedBy', '_id firstName lastName displayName')
      .exec((err, result) => {
        if (err) {
          io.sockets.emit('fetch_comment', errorHandler.getErrorMessage(err))
        }
        _showComment[postId] = {
          result
        }
        io.sockets.emit('fetch_comment', _showComment)

        delete _showComment[postId]
      })
  })

  socket.on('send_like', message => {


    let postId = mongoose.Types.ObjectId(message.postId)
    let userId = mongoose.Types.ObjectId(message.userId)



    Post.find({
      "_id": postId, "likes.postedBy": userId
    }).exec((err, _post) => {
      if (err) {
        io.sockets.emit('fetch_like', errorHandler.getErrorMessage(err))
      } else {
        if (_post.length == 0) {

          Post.findById(postId).exec((err, result) => {
            if (err) {
              io.sockets.emit('fetch_like', errorHandler.getErrorMessage(err))
            } else {
              let like = {}
              like.postedBy = message.userId;
              like.liker = result.likes.length + 1;

              Post.findByIdAndUpdate(postId, { $push: { likes: like } }, { new: true })
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, result) => {
                  if (err) {
                    io.sockets.emit('fetch_like', errorHandler.getErrorMessage(err))
                  } else {
                    _showLikes[postId] = {
                      result,
                      you: 0
                    }
                    io.sockets.emit('fetch_like', _showLikes)

                    delete _showLikes[postId]
                  }
                })
            }
          })

        } else {
          Post.findById(postId).exec((err, result) => {
            if (err) {
              io.sockets.emit('fetch_like', errorHandler.getErrorMessage(err))
            } else {
              _showLikes[postId] = {
                result,
                you: 1
              }
              io.sockets.emit('fetch_like', _showLikes)

              delete _showLikes[postId]
            }
          })

        }
      }
    })



  })

  socket.on('fetch_new_post', message => {
    Post.find((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      io.sockets.emit('fetch_posts', result)
    }).populate('postedBy', '_id firstName lastName displayName').populate('comments.postedBy', '_id firstName lastName displayName').populate('likes.postedBy', '_id firstName lastName displayName').select('text comments likes imageExist mediaLink createDate postedBy')

  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
    stopFetching(socket.id);
    delete allConservation[socket.id]
    delete allConservations[socket.id]

    if (_showMessage[socket.id] != undefined) {
      delete _showMessage[socket.id]
    }

    if (_showComment[socket.id] != undefined) {
      delete _showComment[socket.id]
    }

    if (_showLikes[socket.id] != undefined) {
      delete _showLikes[socket.id]
    }



  });
});


function stopFetching(id) {
  clearInterval(interval[id])
}

function showConversation(socket, message) {
  let from = mongoose.Types.ObjectId(message.sender);

  let _conversations = {
    sender: message.sender,
  }
  Conversation.aggregate([{
    $lookup: {
      from: 'User',
      localField: 'recipients',
      foreignField: '_id',
      as: 'recipientObj',
    },
  },
  ])
    .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
    .project({
      'recipientObj.password': 0,
      'recipientObj.__v': 0,
      'recipientObj.date': 0,
    })
    .exec((err, conversations) => {
      if (err) {

        io.sockets.emit('conversations', [errorHandler.getErrorMessage(err)])

      } else {
        let bulkConversation = conversations.map((item) => {
          return item._id
        });
        let _bulkConversation = {
          "_id": {
            "$in": bulkConversation
          }
        }

        Conversation.find(_bulkConversation, (_err2, _conversation2) => {
          if (_err2) {
            io.sockets.emit('conversations', [errorHandler.getErrorMessage(_err2)])
          } else {

            allConservations[socket.id] = {
              sender: message.sender,
              conversation: _conversation2
            }

            io.sockets.emit('conversations', allConservations)

            Conversation.count({ 'recieveLast': from, "deleivered": false }).exec((_err4, _conversation4) => {
              if (_err4) {
                io.sockets.emit('conversations', [errorHandler.getErrorMessage(_err4)])
              } else {

                allConservation[socket.id] = {
                  sender: message.sender,
                  conversation4: _conversation4
                }

                //_allConversation(socket, allConservation)

                io.sockets.emit('conversationNotification', allConservation)


                if (_conversation4 > 0) {
                  Conversation.updateMany({ 'recieveLast': from }, { "$set": { "deleivered": true } }).exec((_err3, _conversations3) => {
                    if (_err3) {
                      io.sockets.emit('conversations', [errorHandler.getErrorMessage(_err3)])
                    } else {

                      //io.sockets.emit('conversationNotification', _conversation4)
                    }
                  })
                }
              }
            })
          }
        }).populate('recipients', '_id firstName lastName displayName userStatus');
      }
    });
}




app.set('views', './client/views');
app.set('view engine', 'jade');
// parse body params and attache them to req.body
app.use((req, res, next) => {
  res.io = io
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))
app.use(express.static(path.join(__dirname, 'client/public')));



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});



app.use('/', adminAuthRoute)
app.use('/', linkImage)
app.use('/', tokenRoute)
app.use('/', userRoute)
app.use('/', authRoute)
app.use('/', linkRoute)
app.use('/', mesgRoute)
app.use('/', mtnRoute)
app.use('/', bookingRoute)
app.use('/', subscriptionRoute)
app.use('/', postRoute)
app.use('/', newsRoute)
app.use('/', inviteRoute)
app.use('/', adminRoute)
app.use('/', contactRoute)
app.use('/', newsletterRoute)
app.use('/', instructorRoute)
app.use('/', sessionRoute)
app.use('/', joinSessionRoute)

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": err.name + ": " + err.message })
  }
})

export default server
