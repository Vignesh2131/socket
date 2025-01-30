import express from "express"
import { Server } from "socket.io";
import { createServer } from "http"
import cors from "cors"

const app = express();

const server = createServer(app);

//Circuit creaated
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods:['GET','POST']
    }
});

io.on("connection", (socket) => {
    console.log("User connected")

    socket.on("message", (data) => {
        console.log(data);
        socket.to(data.roomMessage).emit("receive-message",data)
    })

    socket.on('join-room', (room) => {
        socket.join(room)
    })

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
    })
})

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.get('/',(req, res) => {
    res.send("Hello world")
})

server.listen(3000, () => {
    console.log("Server is running on 3000")
})