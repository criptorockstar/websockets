"use client";

import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store"
import { setUserState } from "@/store/slices/userSlice"

type FormMessageProps = {
  error?: FieldError;
};

const FormMessage: React.FC<FormMessageProps> = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-red-600 mt-0 text-sm">
      {error.message}
    </p>
  );
};

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Se requiere un correo",
    })
    .email({
      message: "El correo no es válido",
    }),

  password: z.string().min(1, {
    message: "Se requiere una contraseña",
  }),
});

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setError, handleSubmit, formState } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch("http://localhost:3001/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.errors) {
          result.errors.forEach((error: any) => {
            setError(error.path as keyof z.infer<typeof FormSchema>, {
              type: "manual",
              message: error.msg,
            });
          });
        }
      } else {
        const result = await response.json();

        const payload = {
          "username": result.username,
          "email": result.email,
        }
        dispatch(setUserState(payload));
        router.push("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <React.Fragment>
      <div className="flex items-center justify-center h-screen">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Correo electrónico" {...field} />
                  </FormControl>
                  <FormMessage error={formState.errors.email} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Contraseña" type="password" {...field} />
                  </FormControl>
                  <FormMessage error={formState.errors.password} />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </React.Fragment>
  );
}
