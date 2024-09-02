import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getBlogs } from "@/db/drizzle-queries/data/blogs-data";
import { CalendarIcon, ClockIcon, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogsList = async () => {
  const blogs = await getBlogs();

  return (
    <div className="grid aspect-video w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map(({ id, created_at, content }, index) => {
        const firstTitle =
          content?.content?.find((item) => item.type === "heading")
            ?.content?.[0]?.text ?? "No Title";
        const firstParagraph =
          content?.content?.find((item) => item.type === "paragraph")
            ?.content?.[0]?.text ?? "No Description";
        const firstImage =
          content?.content?.find((item) => item.type === "image")?.attrs?.src ??
          "/no-image.jpg";
        return (
          <Card className="max-w-sm overflow-hidden" key={id}>
            <div className="relative aspect-video">
              <Link href={`/products/content-management/${id}`}>
                <Image
                  src={firstImage}
                  alt="blog"
                  fill
                  className="h-full w-full object-cover"
                />
              </Link>
            </div>
            <CardHeader className="grid grid-cols-4 items-center justify-between">
              <h2 className="col-span-3 line-clamp-2 text-xl font-semibold">
                {firstTitle.length > 20
                  ? firstTitle.slice(0, 20) + "..."
                  : firstTitle}
              </h2>
              <Button variant="ghost">
                <Link href={`/products/content-management/edit-blog/${id}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-muted-foreground">
                {firstParagraph.length > 100
                  ? firstParagraph.slice(0, 100) + "..."
                  : firstParagraph}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <time dateTime={created_at.toISOString()}>
                  {new Date(created_at).toLocaleDateString()}
                </time>
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-1 h-4 w-4" />
                <span>{"5"} min read</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default BlogsList;
