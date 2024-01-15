import React, { useEffect, useRef, useState } from 'react'
import 'firebase/analytics';
import { db, auth, firestore } from '../firebase';
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { faPaperPlane, faMagnifyingGlass, faGear, faUserPlus, faAngleDown, faUpRightAndDownLeftFromCenter, faUserTie, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from 'react-bootstrap';
import logo from '../../src/logo.svg';
import { useAuthState } from 'react-firebase-hooks/auth';


function ChatBox() {

  const scroll = useRef();

  const [messages, setMessages] = useState([]);

  const [user] = useAuthState(auth);

  useEffect(() => {
    console.log(user.uid);
    const q = query(
      collection(db, "chats/chats_dats/" + user.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, []);

  const [usermessage, setusermessage] = useState('');


  const fromMessages = ['hi', 'how are yoy ?', 'im also fine', 'hello', 'im fine what about you ?', 'good morning', 'hi', 'how are yoy ?', 'im also fine', 'hello', 'im fine what about you ?', 'good morning']

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {

    if (usermessage.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "chats/chats_dats/" + user.uid), {
      text: usermessage,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });
    setusermessage("");
  }



  return (
    <div>

      <button className="button_chat" onClick={handleClick}>
        chat with us
      </button>

      <div className={`text_area ${isOpen ? 'open' : ''}`}>

        <div className="chat_text_area_main">
          <p className="chat_text_area_heading">Aahaas support team</p>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className="chat_info_icon chat_info_icon2" />
        </div>
        <div className="suggestions_message">
          <p>suuggesion 1</p>
          <p>suuggesion 2</p>
          <p>suuggesion 3</p>
          <p>suuggesion 4</p>
        </div>

        <div className="chats_content">

          {
            messages.map((value, key) => {
              return (
                <span className="chat_msg">

                  <div className={`${value.uid === user.uid ? "chat-bubble right" : "chat-bubble left"}`}>
                    <p className="d-flex align-items-center justify-content-around">
                      <FontAwesomeIcon icon={faUserTie} className="admin_icon" style={{ display: `${key % 2 === 0 && key !== 3 && key !== 7 ? "none" : "block"}` }} />
                      {value.text}
                      <FontAwesomeIcon icon={faCircleUser} className="customer_icon" style={{ display: `${key % 2 === 1 ? "none" : "block"}` }} />
                    </p>
                    <span className="time">today mor 12.30</span>
                  </div>

                </span>
              )
            })
          }

        </div>



        <div className="message_area input-group mb-3">

          <input type="text" className="message " value={usermessage} placeholder="Enter your message here..." onChange={(e) => setusermessage(e.target.value)} />
          <button className="send_button">Send
            <FontAwesomeIcon icon={faPaperPlane} className="chat_send_icon" onClick={sendMessage} /></button>
        </div>

      </div>
    </div>
  )
}

export default ChatBox