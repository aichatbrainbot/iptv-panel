import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function EmailTemplate(props: { connectionInfo: any[] }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          .container { max-width: 600px; margin: 0 auto; font-family: sans-serif; }
          .image-container { text-align: center; margin-top: 20px; }
          .image-container img { max-width: 150px; height: auto; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <Card>
            <CardHeader>
              <CardTitle>IPTV Connection Information</CardTitle>
            </CardHeader>
            <CardContent>
              <h2>Order Completed</h2>

              {props.connectionInfo.map((info, index) => (
                <Card key={index} className="mt-4">
                  <CardHeader>
                    <CardTitle>Device {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Username
                          </TableCell>
                          <TableCell>{info.username}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Password
                          </TableCell>
                          <TableCell>{info.password}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Host/API/URL
                          </TableCell>
                          <TableCell>{info.host}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            M3U Link
                          </TableCell>
                          <TableCell>{info.m3uUrl}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            EPG Link
                          </TableCell>
                          <TableCell>{info.epgUrl}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}

              <div className="mt-4">
                <Button asChild className="mr-2">
                  <a href="https://ronotv.com">Visit Our Website</a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href={`https://wa.me/212777737974?text=Hello,%20I%20need%20help%20with%20my%20IPTV%20connection`}
                  >
                    Contact Us on WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <div className="image-container">
                <img
                  src="https://rwxfqslhsyxt7n8g.public.blob.vercel-storage.com/logo-Q1By9guLz4bJaOxdV95ul4dWPUgCRK.png"
                  alt="RonoTv Logo"
                />
              </div>
            </CardFooter>
          </Card>

          <div className="mt-4 text-center">
            © {new Date().getFullYear()} RonoTv. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  );
}
