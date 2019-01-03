import React, { Component } from 'react';

class MessageList extends Component {
  render() {
    return (
      <div className="message-list">
        { this.props.messages.map((message, index) => {
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