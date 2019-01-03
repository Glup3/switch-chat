import React, { Component } from 'react';

class RoomList extends Component {
  render() {
    console.log(this.props.rooms)
    return (
      <div className="">
        <ul>
          <h3>Your rooms:</h3>
          { this.props.rooms.map(room => {
            return (
              <li key={room.id}>
                <a href="#">{ room.name }</a>
              </li>
            )
          }) }
        </ul>
      </div>
    )
  }
}

export default RoomList