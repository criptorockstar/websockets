"use client";

import io from "socket.io-client";
import * as React from "react";
import { Button } from "@/components/ui/button"

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
import { useAppSelector, RootState } from "@/store/store";

const socket = io("http://localhost:3001");

const FormSchema = z.object({
  mode: z
    .string()
})

export default function DuelModal() {
  const user = useAppSelector((state: RootState) => state.user);

  // room state
  const [room, setRoom] = React.useState("");

  React.useEffect(() => {
    socket.on("exited", () => {
      console.log("exited")
    });

    return () => {
      socket.off("exited");
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

    const userdata = {
      "id": user.id,
      "username": user.username,
      "avatar": user.avatar,
      "bet": 10,
    }

    if (room) {
      socket.emit("join_queue", { room, userdata });
    }
  }

  const onCancel = async () => {
    const userdata = {
      "id": user.id,
      "username": user.username,
      "avatar": user.avatar,
      "bet": 10,
    }

    if (room) {
      console.log("removing", userdata.id)
      socket.emit("leave_queue");
    }

    // remove room from state
    setRoom("");
  }

  return (
    <React.Fragment>
      <div className="flex items-center justify-center  h-screen">
        <div className="w-[400px] mx-auto">
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
              <Button onClick={onCancel}>Cancelar</Button>
            </form>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
