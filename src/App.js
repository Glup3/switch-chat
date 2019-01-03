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
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }

    this.sendMessage = this.sendMessage.bind(this);
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

      this.currentUser.subscribeToRoom({
        roomId: '19381264',
        hooks: {
          onMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            })
          }
        }
      })
    })
    .catch(err => {
      console.log('ERROR connection', err)
    })
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text: text,
      roomId:'19381264'
    })
  }

  render() {
    return (
      <div className="app">
        <RoomList rooms={ [...this.state.joinableRooms, ...this.state.joinedRooms] }/>
        <MessageList messages={ this.state.messages }/>
        <SendMessageForm sendMessage={ this.sendMessage }/>
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
