"use client";

import { EditorContent, EditorRoot, JSONContent } from "novel";
import React from "react";
import { defaultExtensions } from "../extensions";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBlog } from "@/db/drizzle-queries/data/blogs-data";
import { deleteArticle } from "@/db/drizzle-queries/data/articles-data";

interface BlogWrapperProps {
  id: number;
  content: JSONContent;
  type: "blogs" | "articles";
}

const BlogWrapper = ({ id, content, type }: BlogWrapperProps) => {
  const extensions = [...defaultExtensions];
  const { push } = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: type === "blogs" ? deleteBlog : deleteArticle,
  });

  const handleDelete = async () => {
    toast.promise(mutateAsync(id), {
      loading: "Deleting...",
      success: "Deleted",
      error: "Error",
    });
    push(`/products/${type}`);
  };

  return (
    <div className="relative flex w-full max-w-screen-lg flex-col items-center">
      {content && (
        <EditorRoot>
          <EditorContent
            immediatelyRender={false}
            initialContent={content}
            className="relative min-h-[500px] w-full max-w-screen-lg bg-background sm:mb-3 sm:rounded-lg"
            extensions={extensions}
            editorProps={{
              attributes: {
                class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            editable={false}
          />
        </EditorRoot>
      )}
      <div className="flex w-full items-center justify-between">
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            push(`/products/${type}`);
          }}
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Return to {type === "blogs" ? "Blogs" : "Articles"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete {type === "blogs" ? "Blog" : "Article"}
        </Button>
      </div>
    </div>
  );
};

export default BlogWrapper;
