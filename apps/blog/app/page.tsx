import BannerCard from "@/components/molecules/card/BannerCard";
import PostCard from "@/components/molecules/card/PostCard";
import { listPosts } from "./actions";
import type { Post } from "./actions/gateway";



export default async function Home() {
  const [posts] = await listPosts();
  if (!posts) {
    return <>Loading...</>;
  }
  return (
    <main className="container mx-auto">
      <BannerCard post={posts?.[0]!} />

      <section className="my-20">
        <h3 className="text-base-content font-bold text-2xl mb-8 font-work leading-8">
          Mais recentes
        </h3>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts?.map((post: Post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
