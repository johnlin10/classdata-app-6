import style from "./style.module.scss"

export default function MarkdownEditor({ markdown, setMarkdown }) {
  return (
    <div className={style.view}>
      <div className={style.container}>
        <input type="text" />
        <textarea
          name="markdown"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}></textarea>
      </div>
    </div>
  )
}
