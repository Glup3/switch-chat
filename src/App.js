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
      messages: []
    }
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
      currentUser.subscribeToRoom({
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
      console.log('Error connection', err)
    })
  }

  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList messages={ this.state.messages }/>
        <SendMessageForm />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
