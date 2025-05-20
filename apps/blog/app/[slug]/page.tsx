import { SpanDate } from "@/components/molecules/spans/span-date";
import { TagLists } from "@/components/molecules/tags/tag-lists";
import { retrievePost } from "../actions";

const SinglePost = async (props: { params: { slug: string } }) => {
  const [post] = await retrievePost(props?.params);

  if (!post) {
    return <>Loading...</>;
  }
  return (
    <div className="mx-auto px-5 pb-10 md:px-0 w-full container">
      <div className="py-5 space-y-4">
        <TagLists tags={post?.tags} />
        <h3 className="text-base-content font-semibold text-xl md:text-2xl lg:text-4xl leading-5 md:leading-10 ">
          {post?.title}
        </h3>
        <SpanDate date={post?.createdAt} />
      </div>
      <img
        width="800"
        height="462"
        alt="blog_image"
        className="rounded-xl shadow w-full h-screen container max-h-[462px] object-cover"
        src={post?.thumbnail || "https://placehold.it/800x462"}
      />

      <div className="w-full py-10">
        {post?.content && (
          <div
            style={{ all: "unset" }} dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
      </div>
    </div>
  );
};

export default SinglePost;
