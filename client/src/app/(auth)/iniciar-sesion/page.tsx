"use client";

import * as React from 'react';
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/google"
import FacebookButton from '@/components/facebook';
import Link from "next/link";
import Image from "next/image";
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
    <p className="text-red-600 mt-0 text-xs">
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
          id: result._id,
          username: result.username,
          email: result.email,
          isAdmin: result.isAdmin,
          player: result.player,  // Incluye toda la estructura de player
        };

        dispatch(setUserState(payload));
        router.push("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <React.Fragment>
      <div className="flex flex-col items-center">
        <Link href="/">
          <Image
            src="./logo.svg"
            width={301}
            height={76}
            alt="Logo"
            className="mt-2 w-[301px] h-[76px] xl:w-[500px] xl:h-[126px] xl:mt-8"
          />
        </Link>

        <div className="flex flex-col justify-center h-full mb-2 xl:mt-[-60px]">
          <div>
            <Image
              src="/carora.svg"
              width={230}
              height={230}
              alt=""
              className="w-[230px] h-[230px] xl:w-[350px] xl:h-[350px]"
            />
          </div>

          <div className="flex justify-center mt-4">

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Correo electrónico" autoComplete="off" {...field} />
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
                        <Input placeholder="Contraseña" type="password" password={true} className="mt-[-20px]" {...field} />
                      </FormControl>
                      <FormMessage error={formState.errors.password} />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button type="submit"
                    className="xl:w-[318px] bg-gradient-to-tr rounded-xl from-yellow-950 to-yellow-700 pl-6 pr-6 text-white shadow-lg"
                  >Ingresar</Button>
                </div>
              </form>
            </Form>

          </div>
          <div className="mt-4 flex flex-col justify-center text-white text-center">
            <div>
              <Link href="/recuperar-clave" className="text-white underline" >
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            <div className="mt-4 ml-[-11px]">¿No tienes una cuenta? <Link href="/registro" className="text-white underline">Regístrate</Link></div>
          </div>

          <div className="flex justify-center py-2">
            <div className="mx-2">
              <GoogleButton />
            </div>

            <div className="mx-2">
              <FacebookButton />
            </div>
          </div>

        </div>

      </div>
    </React.Fragment>
  );
}
