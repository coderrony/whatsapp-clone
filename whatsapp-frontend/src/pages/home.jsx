import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/sidebar';
import {
  getConversations,
  updateMessagesAndConversations,
} from '../features/chatSlice';
import { ChatContainer, WhatsappHome } from '../components/chat';
import SocketContext from '../context/SocketContext';

function Home({ socket }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { activeConversation } = useSelector(state => state.chat);
  //typing
  const [typing, setTyping] = useState(false);


  // join user into the socket io
  useEffect(() => {
    socket.emit('join', user._id);
    // get-online-users
    socket.on('get-online-users', users => {
      // console.log("online users ",users);

      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);

  // listening to received message
  useEffect(() => {
    socket.on('message received', message => {
      console.log('message from server ', message);
      dispatch(updateMessagesAndConversations(message));
    });

    // listening when a user typing
    socket.on('typing', conversationId => {
      console.log('yes typing ');
      setTyping(conversationId);
    });

    socket.on('stop typing', () => {
      console.log('stop typing event');
      setTyping(false);
    });
  }, []);

  return (
    <div className='h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden'>
      {/* container */}
      <div className='container h-screen flex py-[19px]'>
        {/* sidebar */}
        <Sidebar onlineUsers={onlineUsers} typing={typing} />
        {activeConversation?._id ? (
          <ChatContainer
            onlineUsers={onlineUsers}
            // callUser={callUser}
            typing={typing}
          />
        ) : (
          <WhatsappHome />
        )}
      </div>
    
    </div>
  );
}

// ...props এখানে props মানে হচ্ছে, যেই props HomeWithSocket এ আসছে সেগুলোও Home কম্পোনেন্টে পাঠানো হচ্ছে।

// এখানে, Consumer একটি function child নেয় — যেটার আর্গুমেন্টে সেই context এর ভ্যালু (socket) পাওয়া যায়। তারপর সেই socket কে <Home /> কম্পোনেন্টে prop হিসেবে পাঠানো হচ্ছে।
const HomeWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
