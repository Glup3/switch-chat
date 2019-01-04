import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Message from './Message';

class MessageList extends Component {

  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    if (!this.props.roomId) {
      return (
        <div className="message-list">
          <div className="join-room">
            &larr; Join a room!
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="message-list">
          { this.props.messages.map((message, index) => {
            if (this.props.user.encodedId !== message.senderId) {
              return (
                <Message key={ index } username={ message.senderId } text={ message.text } other={ 'color' }/> 
              )
            }
            else {
              return (
                <Message key={ index } username={ message.senderId } text={ message.text } other={ '' }/> 
              )
            }
          }) }
        </div>
      )
    }
  }
}

export default MessageList