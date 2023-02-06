import { Router, useRouter } from "next/router";

import React from "react";

const Post = () => {
    const router = useRouter();
    // fetch slug
    const { slug } = router.query;
    return <div>{slug}</div>;
};

export default Post;
