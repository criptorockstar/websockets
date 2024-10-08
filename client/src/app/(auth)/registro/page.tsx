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
import { useRouter } from "next/navigation"

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
  username: z.string().min(1, {
    message: "Se requiere un usuario",
  }),

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

export default function SignUp() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { setError, handleSubmit, formState } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch("http://localhost:3001/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        router.push("/iniciar-sesion")
        console.log("SignUp successful!");
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nombre de usuario" {...field} />
                  </FormControl>
                  <FormMessage error={formState.errors.username} />
                </FormItem>
              )}
            />
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
  )
}
