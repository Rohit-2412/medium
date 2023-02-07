import { Router, useRouter } from "next/router";
import { sanityClient, urlFor } from "../../sanity";

import Header from "../../components/Header";
import { Post } from "../../typing";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Head from "next/head";

interface CommentFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post;
}

const Post = ({ post }: Props) => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CommentFormInput>();

    const onSubmit: SubmitHandler<CommentFormInput> = async (data) => {
        setLoading(true);
        fetch("/api/comment", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then(() => {
                setSubmitted(true);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setSubmitted(false);
                setLoading(false);
            });
    };
    return (
        <main>
            <Head>
                <title>{post.title}</title>
            </Head>
            <Header />
            <img
                className="w-full h-40 object-cover"
                src={urlFor(post.mainImage).url()}
                alt={post.title}
            />

            <article className="mx-auto max-w-3xl p-5">
                <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-gray-500 mb-2">
                    {post.description}
                </h2>

                <div>
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={urlFor(post.author.image).url()}
                        alt="author image"
                    />
                    <p className="font-extralight text-sm">
                        Blog post by{" "}
                        <span className="text-green-600">
                            {post.author.name}
                        </span>{" "}
                        - Published at{" "}
                        {new Date(post._createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>

                <div className="mt-10">
                    <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        serializers={{
                            h1: (props: any) => (
                                <h1
                                    className="text-2xl font-bold my-5"
                                    {...props}
                                />
                            ),
                            h2: (props: any) => (
                                <h2
                                    className="text-xl font-bold my-5"
                                    {...props}
                                />
                            ),
                            li: ({ children }: any) => (
                                <li className="list-disc ml-4">{children}</li>
                            ),
                            link: ({ href, children }: any) => (
                                <a
                                    href={href}
                                    className="text-blue-500 hover:underline"
                                >
                                    {children}
                                </a>
                            ),
                        }}
                    />
                </div>
            </article>

            <hr className="max-w-lg border border-yellow-400 my-5  mx-auto" />
            {!submitted ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col p-5 my-10 max-w-2xl mx-auto"
                >
                    <h3 className="text-sm text-yellow-500">
                        Enjoyed this article?
                    </h3>
                    <h4 className="text-3xl font-bold">
                        Leave a comment below!
                    </h4>

                    <hr className="py-3 mt-2" />

                    <input
                        {...register("_id")}
                        type="hidden"
                        name="_id"
                        value={post._id}
                    />

                    <label className="block mb-5 ">
                        <span className="text-gray-700">Name</span>
                        <input
                            {...register("name", { required: true })}
                            className="shadow border rounded py-2 px-3 mt-1 block form-input w-full focus:ring ring-yellow-500 outline-none"
                            type="text"
                            placeholder="John Wick"
                        />
                    </label>

                    <label className="block mb-5 ">
                        <span className="text-gray-700">Email</span>
                        <input
                            {...register("email", { required: true })}
                            className="shadow border rounded py-2 px-3 mt-1 block form-input w-full focus:ring ring-yellow-500 outline-none"
                            type="email"
                            placeholder="abc@example.com"
                        />
                    </label>

                    <label className="block mb-5 ">
                        <span className="text-gray-700">Comment</span>
                        <textarea
                            {...register("comment", { required: true })}
                            className="shadow border rounded py-2 px-3 mt-1 block form-textarea w-full focus:ring ring-yellow-500 outline-none"
                            placeholder="Your comment"
                            rows={8}
                        />
                    </label>

                    {/* errors if validation is not fulfilled */}
                    <div>
                        {errors.name && (
                            <p className="text-red-500 mt-1">
                                Name is required
                            </p>
                        )}
                        {errors.email && (
                            <p className="text-red-500 mt-1">
                                Email is required
                            </p>
                        )}
                        {errors.comment && (
                            <p className="text-red-500 mt-1">
                                The comment field is required
                            </p>
                        )}
                    </div>

                    <input
                        className="hover:border-2 bg-yellow-400 hover:text-yellow-500 hover:bg-white hover:border-yellow-500 text-white font-bold py-2 px-4 rounded mt-5"
                        type="submit"
                        value={"Submit"}
                    />
                </form>
            ) : (
                <div className="flex flex-col p-10 my-10 bg-yellow-500 max-w-2xl mx-auto text-white">
                    <h3 className="text-3xl sm:text-2xl font-bold text-center">
                        Thank you for submitting your comment!
                    </h3>
                    <p className="text-center sm:text-base">
                        It will be published after approval.
                    </p>
                </div>
            )}

            {/* approved comments */}
            <div className="flex flex-col p-10 my-10 mx-auto max-w-2xl shadow shadow-yellow-500 space-y-2">
                <h3 className="text-4xl">Comments</h3>
                <hr className="pb-2" />

                {post.comments &&
                    post.comments.map((comment) => (
                        <div key={comment._id}>
                            <p>
                                <span className="text-yellow-500">
                                    {comment.name}:
                                </span>{" "}
                                {comment.comment}
                            </p>
                        </div>
                    ))}
            </div>
        </main>
    );
};

export default Post;

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
            _id,
            slug{
                current
            },
        }`;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current,
        },
    }));

    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        description,
        slug,
        mainImage,
        body,
        author->{
            name,
            image
        },
        'comments': *[
            _type == "comment" && 
            post._ref == ^._id && 
            approved == true
        ]
    }`;

    const post = await sanityClient.fetch(query, { slug: params?.slug });

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
        revalidate: 60,
    };
};
