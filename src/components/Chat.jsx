import React, { useEffect, useState } from 'react';
import '../styles/Chat.css';
import { useParams } from 'react-router-dom';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import db from '../firebase/config';
import { useStateValue } from '../context/StateProvider';
import firebase from 'firebase';
import MoonLoader from 'react-spinners/MoonLoader';
import { css } from '@emotion/react';

function Chat() {
  const [seed, setSeed] = useState('');
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState([]);
  const [messages, setMessage] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#0a8d48');

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: green;
  `;

  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setMessage(snapshot.docs.map((doc) => doc.data()));
          setLoading(false);
        });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection('rooms').doc(roomId).collection('messages').add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput('');
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen at{' '}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString() === 'Invalid Date'
              ? '...'
              : new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {true && (
          <MoonLoader
            color={color}
            loading={loading}
            css={override}
            size={100}
          />
        )}
        {messages.length === 0 ? (
          <h3 style={{ display: 'grid', placeItems: 'center' }}>No Message</h3>
        ) : (
          messages.map((message) => (
            <p
              className={`chat__message ${
                message.name === user.displayName && 'chat__receiver'
              }`}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          ))
        )}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form action="">
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
