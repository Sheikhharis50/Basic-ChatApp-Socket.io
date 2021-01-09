import React, { useState, useEffect, useRef } from 'react';
import {
  Page, PartnerMessage,
  PartnerRow, Form, Input,
  Container, TextArea, Button, MyRow, MyMessage
} from './style'
import io from 'socket.io-client'

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("")

  const API_PATH = 'http://localhost:5000'

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect(`${API_PATH}/`);

    socketRef.current.emit("initials")

    socketRef.current.on("getId", id => {
      setYourID(id);
    })

    socketRef.current.on("fetchMessages", messages => {
      setMessages(messages);
    })

    socketRef.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (name === '') {
      return
    }
    const messageObject = {
      body: message,
      id: yourID,
      name: name
    };
    setMessage("");
    socketRef.current.emit("sendMessage", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <Page>
      <Container>
        {name !== '' && messages.map((message, index) => {
          if (message.name === name) {
            return (
              <MyRow key={index}>
                <MyMessage>
                  {message.body}
                </MyMessage>
              </MyRow>
            )
          }
          return (
            <PartnerRow key={index}>
              <PartnerMessage>
                {message.body}
              </PartnerMessage>
            </PartnerRow>
          )
        })}
      </Container>
      <Form onSubmit={sendMessage}>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
        <TextArea value={message} onChange={handleChange} placeholder="Say something..." />
        <Button>Send</Button>
      </Form>
    </Page>
  );
};

export default App;