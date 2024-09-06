"use client";

import io from "socket.io-client";
import * as React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

const socket = io("http://localhost:3001");

export default function Home() {
  // message state
  const [message, setMessage] = React.useState("");
  const [messageReceived, setMessageReceived] = React.useState("");

  // room state
  const [room, setRoom] = React.useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message, room })
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room)
    }
  };

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <React.Fragment>
      <div>
        <Input
          placeholder="room"
          onChange={(e) => {
            setRoom(e.target.value)
          }}
        />
        <Button onClick={joinRoom}>Join room</Button>
      </div>
      <div>
        <Input
          placeholder="Enter your name"
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
        <Button onClick={sendMessage}>Send Message</Button>
      </div>
      <div>
        message: {messageReceived}
      </div>
    </React.Fragment>
  );
}
