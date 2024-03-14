import style from "./style.module.scss"

// Markdown
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import { useState } from "react"

export default function MarkdownView() {
  const [markdownContent, setMarkdownContent] = useState("")
  return (
    <div className={style.view}>
      <div className={style.container}>
        <ReactMarkdown
          remarkPlugins={[gfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}>
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}
