import React from 'react';

function Message(props) {
  return (
    <div className="message">
        <div>{ props.username }</div>
        <div>{ props.text }</div>
    </div>
  )
}

export default Message