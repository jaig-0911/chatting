import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import Message from "../../../components/message/Message";
import axios from "axios";
import "./chatengine.css";
import { io } from "socket.io-client";




const ChatEngine = props => {
    const { user } = useContext(AuthContext);
    const [conversation, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();

    const task = "2";
    const scrollRef = useRef();


    console.log(user)
    useEffect(() => {
      socket.current = io("ws://localhost:8900");
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }, []);


    useEffect(() => {
      arrivalMessage &&
      conversation[0]?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, conversation[0]]);
  
    useEffect(() => {
      socket.current.emit("addUser", user._id);
      console.log("HEREEEEE");
      socket.current.on("getUsers", (users) => {
      });
    }, [user]);    

    useEffect(() => {
        const getConversations = async () => {
          try {
            const res = await axios.get("/conversations/" + user._id + "/" + task);
            console.log("###", res)
            setConversations(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getConversations();
      }, [user._id]);


      useEffect(() => {
        const getMessages = async () => {
          try {
            const res = await axios.get("/messages/" + conversation[0]?._id);
            setMessages(res.data);
            console.log(res.data)

          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
      }, [conversation]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
          sender: user._id,
          text: newMessage,
          conversationId: conversation[0]._id,
        };
    
        const receiverId = conversation[0].members.find(
          (member) => member !== user._id
        );

        socket.current.emit("sendMessage", {
          senderId: user._id,
          receiverId,
          text: newMessage,
        });
    
    
        try {
          const res = await axios.post("/messages", message);
          setMessages([...messages, res.data]);
          setNewMessage("");
        } catch (err) {
          console.log(err);
        }
      };
    
      useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);
    








    return (
      <>
  
  <div className="chatBox">
          <div className="chatBoxWrapper">
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
          </div>
        </div>
         </>
    )
}

export default ChatEngine;

const styles = {
    chatEngineWindow: {
        width: '100%',  
        backgroundColor: '#fff',
    }
}
