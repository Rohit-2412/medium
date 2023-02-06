import Link from "next/link";
import React from "react";
import { urlFor } from "../sanity";
import { Post } from "../typing";

interface Props {
    post: Post;
}
const Post = ({ post }: Props) => {
    return (
        <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="border group cursor-pointer rounded-lg overflow-hidden">
                <img
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                    src={urlFor(post.mainImage).url()!}
                />

                <div className="flex justify-between p-5 bg-white">
                    <div>
                        <p className="text-lg font-bold">{post.title}</p>
                        <p className="text-xs">
                            {post.description} by {post.author.name}
                        </p>
                    </div>
                    <img
                        className="h-12 w-12 rounded-full"
                        src={urlFor(post.author.image).url()!}
                        alt="author's image"
                    />
                </div>
            </div>
        </Link>
    );
};

export default Post;
