import React from 'react';

function RoomList(props) {
  const orderedRooms = [...props.rooms].sort((a, b) => a.id - b.id);
  return (
    <div className="rooms-list">
      <ul>
        <h3>Your rooms:</h3>
        { orderedRooms.map(room => {
          const active = props.roomId === room.id ? "active" : "";
          return (
            <li key={room.id} className={"room " + active}>
              <button type="button" className="link-button" onClick={ () => props.subscribeToRoom(room.id) }># { room.name }</button>
            </li>
          )
        }) }
      </ul>
    </div>
  )
}

export default RoomList