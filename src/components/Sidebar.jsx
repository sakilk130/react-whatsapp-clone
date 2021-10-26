import React, { useState, useEffect } from 'react';

import '../styles/Sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import db from '../firebase/config';
import { useStateValue } from '../context/StateProvider';
import ContentLoader from 'react-content-loader';

function Sidebar() {
  const [{ user }, dispach] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(true);
  useEffect(() => {
    const unsubscribe = db.collection('rooms').onSnapshot(
      (snapshot) =>
        setRooms(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        ),
      setLoadingRoom(false)
    );
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />

        {loadingRoom && (
          <ContentLoader
            speed={2}
            width={400}
            height={160}
            viewBox="0 0 400 160"
            backgroundColor="#a39f9f"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="54" y="25" rx="3" ry="3" width="52" height="6" />
            <circle cx="24" cy="22" r="20" />
            <circle cx="28" cy="80" r="20" />
            <rect x="52" y="66" rx="3" ry="3" width="88" height="6" />
            <rect x="57" y="83" rx="3" ry="3" width="52" height="6" />
            <circle cx="28" cy="138" r="20" />
            <rect x="55" y="122" rx="3" ry="3" width="88" height="6" />
            <rect x="62" y="140" rx="3" ry="3" width="52" height="6" />
          </ContentLoader>
        )}
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
