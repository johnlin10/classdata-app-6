import { useState } from "react"
import style from "./style.module.scss"

import MarkdownEditor from "../../../widgets/MarkdownEditer/MarkdownEditor"
import { useEffect } from "react"

export default function NoticeBoardEditor({
  noticeTitle,
  setNoticeTitle,
  noticeDescription,
  setNoticeDescription,
  markdownContent,
  setMarkdownContent,
}) {
  return (
    <div className={style.view}>
      <div className={style.container}>
        {/* 標題及說明 輸入框 */}
        <div className={style.noticeTitle}>
          {/* 文章標題 */}
          <input
            className={style.title}
            type="text"
            placeholder="文章標題"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
          />
          {/* 文章簡述 */}
          <input
            className={style.description}
            type="text"
            placeholder="內容簡述"
            value={noticeDescription}
            onChange={(e) => setNoticeDescription(e.target.value)}
          />
        </div>
        {/* Markdown 編輯器 */}
        <div className={style.markdownEditor}>
          <MarkdownEditor
            markdown={markdownContent}
            setMarkdown={setMarkdownContent}
          />
        </div>
      </div>
    </div>
  )
}
