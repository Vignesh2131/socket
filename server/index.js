import express from "express"
import { Server } from "socket.io";
import { createServer } from "http"
import cors from "cors"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
const app = express();
const secretKey = "qwerty";
const server = createServer(app);

//Circuit creaated
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods:['GET','POST']
    }
});

app.use(cookieParser())
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

app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "asdafdsfd" },secretKey);
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).json({message:"Login success"})

});


io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)
        const token = socket.request.cookies.token;
        if (!token) return next(new Error("Auth error"))
        
        const decoded = jwt.verify(token, secretKey);

        next();
    })
  next();
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.roomMessage).emit("receive-message", data);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});


server.listen(3000, () => {
    console.log("Server is running on 3000")
})