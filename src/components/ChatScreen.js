import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit-client';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import RoomList from './RoomList';
import NewRoomForm from './NewRoomForm';
import TypingIndicator from './TypingIndicator'
import { tokenUrl, instanceLocator } from '../config';

class ChatScreen extends Component {
  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    usersWhoAreTyping: []
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: this.props.currentUsername,
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

  sendTypingEvent = () => {
    console.log(this.state);
    this.currentUser
      .isTypingIn({
        roomId: this.state.roomId
      })
      .catch(err => {
        console.log('ERROR typing', err);
      })
    
  }

  getRooms = () => {
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

  subscribeToRoom = (roomId) => {
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
        },
        onUserStartedTyping: user => {
          this.setState({
            usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name]
          })
        },
        onUserStoppedTyping: user => {
          this.setState({
            usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
              username => username !== user.name
            )
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

  sendMessage = (text) => {
    this.currentUser.sendMessage({
      text: text,
      roomId: this.state.roomId
    })
  }

  createRoom = (roomName) => {
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
        <MessageList messages={ this.state.messages } roomId={ this.state.roomId }/>
        <TypingIndicator usersWhoAreTyping={ this.state.usersWhoAreTyping }/>
        <SendMessageForm sendMessage={ this.sendMessage } disabled={!this.state.roomId} onChange={ this.sendTypingEvent }/>
        <NewRoomForm createRoom={ this.createRoom }/>
      </div>
    );
  }
}

export default ChatScreen;
