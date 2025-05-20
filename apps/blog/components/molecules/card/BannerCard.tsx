import type { Post } from "@/app/actions/gateway";
import Link from "next/link";
import { SpanDate } from "../spans/span-date";
import { TagLists } from "../tags/tag-lists";

type Props = {
  post: Post;
};

const BannerCard = (props: Props) => {
  return (
    <div className="relative rounded-xl font-work mb-24">
      <img
        width="1216"
        height="600"
        alt="banner_image"
        src={props.post?.thumbnail || "https://placehold.it/1216x600"}
        className="rounded-xl border max-h-[600px] max-w-[1216px] object-cover"
      />
      <div className="absolute -bottom-16 left-4 md:left-14 rounded-xl md:px-5 md:py-6 bg-base-100 w-10/12 md:w-7/12 lg:w-6/12 border space-y-2 shadow-base-content/20">
        <TagLists tags={props.post.tags} />
        <h3>
          <Link
            href="/"
            className="text-base-content font-semibold text-xl md:text-2xl lg:text-4xl leading-5 md:leading-10  transition-all hover:duration-500"
          >
            {props?.post?.title}
          </Link>
        </h3>
        <div className="mt-6 flex items-center gap-5">
          <SpanDate date={props?.post?.createdAt} />
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
