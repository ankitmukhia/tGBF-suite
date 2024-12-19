import Link from 'next/link'
import { allPosts, Post } from 'contentlayer/generated'

const PostCard = (post: Post) => {
  return <div className="mb-8">
    <h2 className="text-xl">
      <Link
        href={post.url}
        className="text-blue-700 hover:text-blue-900"
        legacyBehavior>
        {post.title}
      </Link>
    </h2>
    <div className="text-sm">
      {post.description}
    </div>
  </div>
}

export default function Home() {
  const posts = allPosts.sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)));

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Next.js Example</h1>
      {posts.map((post) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
}
