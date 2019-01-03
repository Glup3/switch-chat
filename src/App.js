import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit-client';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import RoomList from './components/RoomList';
import NewRoomForm from './components/NewRoomForm';
import { tokenUrl, instanceLocator } from './config';

class App extends Component {

  constructor() {
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: 'glup3',
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser;
      this.getRooms();
    })
    .catch(err => {
      console.log('ERROR connection', err)
    })
  }

  getRooms() {
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
      .catch(err => {
        console.log('ERROR on joinableRooms: ', err);
      })
  }

  subscribeToRoom(roomId) {
    this.setState({
      messages: []
    })

    this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          })
        }
      }
    })
    .then(room => {
      this.setState({
        roomId: room.id
      })
      this.getRooms();
    })
    .catch(err => {
      console.log('ERROR on subscribing to room: ', err);
    })
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text: text,
      roomId: this.state.roomId
    })
  }

  createRoom(roomName) {
    this.currentUser.createRoom({
      name: roomName
    })
    .then(room => {
      this.subscribeToRoom(room.id)
    })
    .catch(err => {
      console.log("ERROR create new room: ", err);
    })
  }

  render() {
    return (
      <div className="app">
        <RoomList 
          rooms={ [...this.state.joinableRooms, ...this.state.joinedRooms] } 
          subscribeToRoom={ this.subscribeToRoom }
          roomId={ this.state.roomId }/>
        <MessageList messages={ this.state.messages }/>
        <SendMessageForm sendMessage={ this.sendMessage }/>
        <NewRoomForm createRoom={ this.createRoom }/>
      </div>
    );
  }
}

export default App;
