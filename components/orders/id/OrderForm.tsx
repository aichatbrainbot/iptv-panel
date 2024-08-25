"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendCompletedEmail } from "@/db/service/email-service";
import { Subscriptions } from "@/types/tables.types";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  connections: z.array(
    z.object({
      m3uUrl: z.string().url({ message: "Please enter a valid URL." }),
    }),
  ),
});

export type ConnectionInfo = {
  playlistName: string;
  username: string;
  password: string;
  output: string;
  type: string;
  host: string;
  m3uUrl: string;
  epgUrl: string;
};

export default function Component({
  numberOfConnections = 1,
  order,
}: {
  numberOfConnections: number;
  order: Subscriptions;
}) {
  const router = useRouter();
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      connections: Array(numberOfConnections).fill({ m3uUrl: "" }),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "connections",
  });
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      sendCompletedEmail(
        connectionInfo,
        "ayoubbensalah2004@gmail.com",
        order.id,
        order.order_number!,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      router.push("/orders");
    },
  });

  const handleSendEmail = async () => {
    toast.promise(mutateAsync(), {
      loading: "Sending email...",
      success: "Email sent successfully!",
      error: "Failed to send email",
    });
  };

  function parseM3uUrl(url: string): ConnectionInfo {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    return {
      playlistName: "Any Name", // You might want to allow users to input this
      username: params.get("username") || "",
      password: params.get("password") || "",
      output: params.get("output") || "",
      type: params.get("type") || "",
      host: `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port || "80"}`,
      m3uUrl: url,
      epgUrl: `${parsedUrl.protocol}//${parsedUrl.hostname}/xmltv.php?username=${params.get("username")}&password=${params.get("password")}`,
    };
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedConnections = values.connections.map((conn) =>
      parseM3uUrl(conn.m3uUrl),
    );
    setConnectionInfo(parsedConnections);
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>IPTV Connection Configuration</CardTitle>
        <CardDescription>
          Enter your IPTV connection M3U URL(s) below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`connections.${index}.m3uUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection {index + 1} M3U URL:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="http://example.com/get.php?username=user&password=pass&output=ts&type=m3u_plus"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      {connectionInfo.map((info, index) => (
        <CardFooter key={index} className="flex-col items-start">
          <Card className="mt-4 w-full bg-gradient-to-br shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Connection {index + 1} Information
              </CardTitle>
              <CardDescription>
                Details for your IPTV connection
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="playlistName">Playlist Name</Label>
                <Input
                  id="playlistName"
                  value={info.playlistName}
                  readOnly
                  className="bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={info.username}
                  readOnly
                  className="bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={info.password}
                  readOnly
                  className="bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="host">Host/API/URL</Label>
                <Input
                  id="host"
                  value={info.host}
                  readOnly
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m3uLink">M3U LINK</Label>
                <Textarea
                  id="m3uLink"
                  value={info.m3uUrl}
                  readOnly
                  className="h-20 break-all bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="epgLink">EPG LINK</Label>
                <Textarea
                  id="epgLink"
                  value={info.epgUrl}
                  readOnly
                  className="h-20 break-all bg-transparent"
                />
              </div>
            </CardContent>
          </Card>
        </CardFooter>
      ))}
      {connectionInfo.length > 0 && (
        <CardFooter className="flex-col items-start">
          <div className="w-full space-y-4">
            <Button
              onClick={handleSendEmail}
              disabled={isPending}
              className="w-full"
            >
              Send Email
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
