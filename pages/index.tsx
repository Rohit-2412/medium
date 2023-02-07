import { sanityClient, urlFor } from "../sanity";

import Banner from "../components/Banner";
import Head from "next/head";
import Header from "../components/Header";
import Link from "next/link";
import { Post } from "../typing";
import PostComponent from "../components/Post";

interface Props {
    posts: [Post];
}

export default function Home({ posts }: Props) {
    return (
        <div className="max-w-7xl mx-auto">
            <Head>
                <title>Medium - Where good ideas find you!</title>
                <link rel="icon" href="/logo.png" />
            </Head>

            <Header />

            <Banner />

            {/* Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
                {posts.map((post) => (
                    <PostComponent key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}

export const getServerSideProps = async () => {
    const query = `*[_type == 'post']{
        _id,
          title,
          slug,
          description,
          mainImage,
          author ->{
            name,
          image
          },
      }`;

    const posts = await sanityClient.fetch(query);

    return {
        props: {
            posts,
        },
    };
};
