import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { rehypePreetyCodeOptions } from './lib/rehypePrettyCode'

/**
 * @definedocumentType Schema for particular document type, Model.
 * @computedFields Calculated on fly.
 * - Insted of writing urls and slug in every file, it generate the urls automatically.
 * ----- ex: If we have to defene url and slug manually.
 * title: Click me
 * date: 2024-11-21
 * url: /posts/change-me
 * slug: /posts/change-me
 * -----
 **/
const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The desctiption of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/posts/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName
        // hello-world.mdx => hello-world
        .replace(/\.mdx$/, ""),
    },
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [[remarkGfm]],
    rehypePlugins: [
      //@ts-ignore
      [rehypePrettyCode, rehypePreetyCodeOptions],
    ]
  }
})
