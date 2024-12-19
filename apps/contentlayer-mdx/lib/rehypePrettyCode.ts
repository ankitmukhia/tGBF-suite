import { type Options } from 'rehype-pretty-code'

export const rehypePreetyCodeOptions: Partial<Options> = {
  theme: "one-dark-pro",
  tokensMap: {
    fn: "entity.name.function",
    objKey: "meta.object.key"
  },
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }]
    }
  }
}
