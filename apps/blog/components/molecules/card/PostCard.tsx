import type { Post } from "@/app/actions/gateway";
import Link from "next/link";
import { SpanDate } from "../spans/span-date";
import { TagLists } from "../tags/tag-lists";

type Props = {
  post: Post;
};

const PostCard = (props: Props) => {
  return (
    <div className="card w-fit p-4 border border-base-content/10 rounded-xl font-work">
      <figure className="max-h-[240px] max-w-[360px]">
        <img
          src={props?.post?.thumbnail || "https://placehold.it/360x240"}
          alt="email"
          className="rounded-xl object-cover"
          width={360}
          height={240}
        />
      </figure>
      <div className="card-body flex flex-col py-6 px-2">
        <TagLists tags={props.post.tags} />
        <h3 className="flex-1">
          <Link
            href={`/${props?.post?.slug}`}
            className="text-base-content hover:text-primary transition-all duration-300 ease-in-out font-semibold text-lg md:text-xl lg:text-2xl mt-2"
          >
            {props?.post?.title}
          </Link>
        </h3>
        <SpanDate date={props?.post?.createdAt} />
      </div>
    </div>
  );
};

export default PostCard;
