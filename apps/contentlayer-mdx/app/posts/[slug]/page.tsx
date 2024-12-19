import { allPosts } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'

interface Props {
	params: Promise<{ slug: string }>
}

export default async function PostPage(props: Props) {
	const params = await props.params;
	const post = allPosts.find((post) => post.slug === params.slug)

	if(!post) notFound()

	const Content =  getMDXComponent(post.body.code)

	return (
		<article className="py-8 mx-auto max-w-xl">
			<div className="mb-8 text-center">
				<h1>{post.title}</h1>
			</div>
			<div> 
				<Content />	
			</div>
		</article>
	)
}
