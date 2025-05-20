import { z } from "zod";
import { createServerAction } from "zsa";
import { listPostsContent, retrievePostContent } from "./gateway";

const POST = z.object({
  tags: z.array(z.string()),
  thumbnail: z.string(),
  title: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  content: z.string(),
});

const listPostsOutputSchema = z.array(POST);

export const listPosts = createServerAction()
  .output(listPostsOutputSchema)
  .handler(async () => {
    const posts = await listPostsContent();
    return posts;
  });

export const retrievePost = createServerAction()
  .input(z.object({ slug: z.string() }))
  .output(POST.nullish())
  .handler(async ({ input }) => {
    const post = await retrievePostContent(input.slug);
    return post;
  });
