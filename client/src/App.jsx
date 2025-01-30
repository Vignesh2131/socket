import { useEffect, useMemo, useState } from "react";
import {io} from "socket.io-client"
import {Button, Container, Stack, TextField, Typography} from "@mui/material"
function App() {
  const socket = useMemo(() => io("http://localhost:3000",{withCredentials:true}), []);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [roomMessage, setRoomMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
   
    socket.emit("message", { message, roomMessage })
    setMessage("");
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room', roomName)
    setRoomMessage("")
  }
  useEffect(() => {
  
    socket.on("connect", () => {
      console.log("connected");
       setSocketId(socket.id);
      socket.on("receive-message", (data) => {
        console.log(data);
        setMessages((messages)=>[...messages,data])
      })

      return () => {
        socket.disconnect();
      }
      
    }, [])
 
  }, [])
  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h3" component="div" gutterBottom>
          Welcome to Socket.io
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          {socketId}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="outlined-basic"
            label="Room name"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="peer message"
            variant="outlined"
          />
          <TextField
            value={roomMessage}
            onChange={(e) => setRoomMessage(e.target.value)}
            id="outlined-basic"
            label="room message"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m.message}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default App
