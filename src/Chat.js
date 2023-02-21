import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";  

const Chat = ({ socket, name, room }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (newMessage !== "") {
      const messageData = {
        room: room,
        author: name,
        message: newMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setNewMessage("")
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      return setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((x) => {
            return (
              <div className="message" id={name === x.author ? "you" : "other"}>
                <div>
                  <div className="message-content">
                    <p>{x.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{x.time}</p>
                    <p id="author">{x.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          placeholder="Message....."
          style={{
            borderRadius: "7px",
            letterSpacing: "1px",
            paddingLeft: "6px",
          }}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          onKeyPress={(e)=>{
            e.key= "Enter" && sendMessage();
          }}
        />
        <button style={{ borderRadius: "8px " }} onClick={sendMessage}>
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default Chat;
