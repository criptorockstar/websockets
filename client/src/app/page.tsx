"use client";

import io from "socket.io-client";
import * as React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const socket = io("http://localhost:3001");

const FormSchema = z.object({
  mode: z
    .string()
})

export default function Home() {
  // message state
  const [message, setMessage] = React.useState("");
  const [messageReceived, setMessageReceived] = React.useState("");

  // room state
  const [room, setRoom] = React.useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message, room })
  };

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mode: "1 vs 1",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const room = data.mode;
    setRoom(room);
    if (room) {
      socket.emit("join_room", room);
    }
    console.log(room);
  }

  return (
    <React.Fragment>
      <div className="mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="1 vs 1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1 vs 1">1 vs 1</SelectItem>
                      <SelectItem value="2 vs 2">2 vs 2</SelectItem>
                      <SelectItem value="3 vs 3">3 vs 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Jugar</Button>
          </form>
        </Form>
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
