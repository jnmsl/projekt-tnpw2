import { publicProcedure, router } from '../trpc';
import Post from '../models/post';
import { z } from 'zod';

const getPosts = publicProcedure.query(async () => {
  const posts = await Post.find().populate('user');
  return posts;
});

const createPosts = publicProcedure
  .input(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  )
  .mutation(async ({ input: { title, content }, ctx }) => {
    console.log('user: ' + ctx.user);
    // check if user is authenticated
    if (!ctx.user) throw new Error('Not authenticated');

    const newPost = new Post({ title, content, user: ctx.user._id });
    const savedPost = await newPost.save();
    return savedPost;
  });

const deletePost = publicProcedure
  .input(z.string())
  .mutation(async ({ input, ctx }) => {
    // Add the authorization check here
    if (!ctx.user) throw new Error('Not authenticated');

    const post = await Post.findById(input);
    if (!post) throw new Error('Post not found');

    if (String(post.user) !== String(ctx.user._id)) {
      throw new Error('You can only delete your own posts');
    }

    await post.deleteOne();
    return true;
  });

export const postsRouter = router({
  create: createPosts,
  delete: deletePost,
  get: getPosts,
});
