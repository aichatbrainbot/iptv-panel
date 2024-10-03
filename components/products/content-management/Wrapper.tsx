"use client";

import {
  EditorContent,
  EditorRoot,
  EditorInstance,
  JSONContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
} from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import {
  handleCommandNavigation,
  ImageResizer,
  TiptapImage,
} from "novel/extensions";
import { slashCommand, suggestionItems } from "./slash-comman";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./image-upload";
import { UploadImagesPlugin } from "novel/plugins";
import { cx } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { insertBlog, updateBlog } from "@/db/drizzle-queries/data/blogs-data";
import { useRouter } from "next/navigation";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner";
import {
  updateArticle,
  insertArticle,
} from "@/db/drizzle-queries/data/articles-data";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const document: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Title",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: `Write Something ...`,
        },
      ],
    },
  ],
};

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});
interface NovelEditorProps {
  initialContent?: JSONContent;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  id?: number;
  type: "blogs" | "articles";
}

const extensions = [
  ...defaultExtensions,
  slashCommand,
  tiptapImage,
  GlobalDragHandle.configure({
    dragHandleWidth: 20, // default

    // The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic
    // scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an
    // element to a position that is max. 99px away from the edge of the screen
    // You can set this to 0 to prevent auto scrolling caused by this extension
    scrollTreshold: 100, // default
  }),
  AutoJoiner.configure({
    elementsToJoin: ["bulletList", "orderedList"], // default
  }),
];

const TailwindEditor = ({
  initialContent = document,
  seoTitle,
  seoDescription,
  seoKeywords,
  id,
  type = "blogs",
}: NovelEditorProps) => {
  const router = useRouter();
  const [content, setContent] = useState<JSONContent>(initialContent);

  const [saveStatus, setSaveStatus] = useState("Saved");
  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      setContent(editor.getJSON());
      setSaveStatus("Saved");
    },
    500,
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (type === "blogs") {
        if (id) {
          await updateBlog(
            id,
            JSON.stringify(content),
            seoTitleState,
            seoDescriptionState,
            seoKeywordsState.split(",").map((keyword) => keyword.trim()),
          );
        } else {
          await insertBlog(
            JSON.stringify(content),
            seoTitleState,
            seoDescriptionState,
            seoKeywordsState.split(",").map((keyword) => keyword.trim()),
          );
        }
      } else {
        if (id) {
          await updateArticle(
            id,
            JSON.stringify(content),
            seoTitleState,
            seoDescriptionState,
            seoKeywordsState.split(",").map((keyword) => keyword.trim()),
          );
        } else {
          await insertArticle(
            JSON.stringify(content),
            seoTitleState,
            seoDescriptionState,
            seoKeywordsState.split(",").map((keyword) => keyword.trim()),
          );
        }
      }
    },
    onSuccess: () => {
      router.push(`/products/${type}`);
    },
  });

  const handleSave = async () => {
    toast.promise(mutateAsync(), {
      loading: "Saving...",
      success: "Saved",
      error: "Error",
    });
  };

  const [seoTitleState, setSeoTitleState] = useState(seoTitle);
  const [seoDescriptionState, setSeoDescriptionState] =
    useState(seoDescription);
  const [seoKeywordsState, setSeoKeywordsState] = useState(
    seoKeywords?.join(", ") || "",
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="seoTitle">SEO Title</label>
        <Input
          id="seoTitle"
          placeholder="SEO Title"
          value={seoTitleState}
          onChange={(e) => setSeoTitleState(e.target.value)}
        />
        <label htmlFor="seoDescription">SEO Description</label>
        <Textarea
          id="seoDescription"
          placeholder="SEO Description"
          value={seoDescriptionState}
          onChange={(e) => setSeoDescriptionState(e.target.value)}
        />
        <label htmlFor="seoKeywords">SEO Keywords (comma separated)</label>
        <Textarea
          id="seoKeywords"
          placeholder="SEO Keywords"
          value={seoKeywordsState}
          onChange={(e) => setSeoKeywordsState(e.target.value)}
        />
      </div>
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          extensions={extensions}
          initialContent={content}
          onCreate={({ editor }) => {
            debouncedUpdates(editor);
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
          className="relative min-h-[500px] w-full max-w-screen-lg bg-background sm:mb-3 sm:rounded-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command!(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent`}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
      <Button
        variant={"paid"}
        size={"lg"}
        disabled={isPending}
        onClick={handleSave}
      >
        {id ? "Update" : "Save"}
      </Button>
    </div>
  );
};
export default TailwindEditor;
