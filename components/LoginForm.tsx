"use client";
import { login } from "@/app/(authenticate)/login/action";
import useErrorHandler from "@/hooks/useErrorHandler";
import { loginSchema } from "@/types/zod-schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormError from "./FormError";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

interface Props {
  logged: boolean;
}

export default function LoginForm({ logged }: Props) {
  const { error, triggerError, clearError } = useErrorHandler();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (logged) {
      triggerError("You are already logged in. Logout and retry");
    }
  }, [logged, triggerError]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onError: (error) => {
      triggerError(error.message);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      clearError();
    },
  });

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email and password to access your account
        </p>
      </div>
      <div className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={logged}
                      placeholder="jhon@mail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter your Email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={logged}
                      placeholder="******"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your Password ( at least 6 characters ).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <Button className="w-full" type="submit" disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <Link
        href={`/register`}
        className="text-center text-lg underline underline-offset-2"
      >
        Don't have an account ? click to register
      </Link>
    </div>
  );
}
