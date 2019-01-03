import React, { Component } from 'react';

const DUMMY_DATA = [
  {
    senderId: 'glup',
    text: "aloa"
  },
  {
    senderId: 'max',
    text: "servas"
  },
  {
    senderId: 'glup',
    text: "wie gehts"
  },
]

class MessageList extends Component {
  render() {
    return (
      <div className="message-list">
        { DUMMY_DATA.map((message, index) => {
          return (
            <div key={ index }>
              <div>{ message.senderId }</div>
              <div>{ message.text }</div>
            </div>
          )
        }) }
      </div>
    )
  }
}

export default MessageList