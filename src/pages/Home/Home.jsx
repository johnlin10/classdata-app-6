import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import NoticeBoardEditor from "./NoticeBoardEditor/NoticeBoardEditor.jsx"
import Sheet from "../../widgets/Sheet/Sheet.jsx"
import { writeFirestoreDoc } from "../../firebase.js"
import { arrayUnion, Timestamp } from "firebase/firestore"

// style
import style from "./style.module.scss"

// Local DataBase
import { HomePostData } from "../../AppData/AppData.js"

// Widget
import WorldScenery from "../../tools/WorldScenery/worldScenery.jsx"
//// import GreetBanner from "../../tools/GreentingBanner/GreetingBanner.jsx"

// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { useContext } from "react"
import { AppContext } from "../../AppContext.js"

export default function Home() {
  return (
    <main className={`${style.view}`}>
      <Helmet>
        <title>班級資訊平台｜首頁</title>
        <meta name="description" content="學校、班級的最新資訊" />
        <meta property="og:title" content="班級資訊平台" />
        <meta property="og:description" content="學校、班級的最新資訊" />
      </Helmet>
      <div className={style.container}>
        <HeaderView />
        <PostView />
        <div id="webStatement">
          <p>
            版權所有 <FontAwesomeIcon icon="fa-regular fa-copyright" /> 2023
            Johnlin
          </p>
          <p>
            <a
              property="dct:title"
              rel="cc:attributionURL"
              href="https://classdata-app.web.app">
              classdata-app
            </a>{" "}
            由{" "}
            <a
              rel="cc:attributionURL dct:creator"
              property="cc:attributionName"
              href="https://johnlin.web.app/">
              Johnlin
            </a>{" "}
            授權許可{" "}
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
              target="_blank"
              rel="license noopener noreferrer"
              style={{ display: "inline-block" }}>
              <img
                style={{
                  height: "22px !important",
                  marginLeft: "3px",
                  verticalAlign: "text-bottom",
                }}
                alt=""
                src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
              />
              <img
                style={{
                  height: "22px !important",
                  marginLeft: "3px",
                  verticalAlign: "text-bottom",
                }}
                alt=""
                src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
              />
              <img
                style={{
                  height: "22px !important",
                  marginLeft: "3px",
                  verticalAlign: "text-bottom",
                }}
                alt=""
                src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
              />
              <img
                style={{
                  height: "22px !important",
                  marginLeft: "3px",
                  verticalAlign: "text-bottom",
                }}
                alt=""
                src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
              />
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

// Subview
// 首頁標題區塊
function HeaderView() {
  return (
    <div className={style.headerView}>
      <div className={style.title}>
        <h1>
          <FontAwesomeIcon
            icon="fa-solid fa-school"
            alt="班級資訊平台 icon"
            style={{ marginRight: "12px", marginBottom: "2px" }}
          />
          班級資訊平台
        </h1>
        <p>班級、學校的即時資訊</p>
      </div>
      <div className={style.sceneryAndGreetBanner}>
        <WorldScenery />
        {/* <GreetBanner /> */}
      </div>
    </div>
  )
}

// 平台公告區塊
function PostView() {
  const navigate = useNavigate()
  const { setGlobalError, setGlobalErrorIcon } = useContext(AppContext)
  // 編輯器 Sheet 開啟狀態
  const [showNoticeBoard, setShowNoticeBoard] = useState(false)

  // 文章內容暫存
  const [noticeTitle, setNoticeTitle] = useState("")
  const [noticeDescription, setNoticeDescription] = useState("")
  const [markdownContent, setMarkdownContent] = useState("")

  // 公告編輯器 Sheet 的擴充控制選項
  const noticeBoardSheetControls = [
    {
      title: "發布",
      accent: true, // 強調按鈕
      action: () => publishNotice(),
    },
  ]

  async function publishNotice() {
    if (!noticeTitle) {
      setGlobalError("請輸入文章標題")
      setGlobalErrorIcon(<FontAwesomeIcon icon="fa-solid fa-keyboard" />)
      return
    } else if (!noticeDescription) {
      setGlobalError("請輸入文章簡述")
      setGlobalErrorIcon(<FontAwesomeIcon icon="fa-solid fa-keyboard" />)
      return
    } else if (!markdownContent) {
      setGlobalError("請輸入文章內容")
      setGlobalErrorIcon(<FontAwesomeIcon icon="fa-solid fa-keyboard" />)
      return
    }
    const noticeData = {
      data: arrayUnion({
        title: noticeTitle,
        description: noticeDescription,
        content: markdownContent,
        timestamp: "",
      }),
    }

    console.table(noticeData)
    try {
      await writeFirestoreDoc("post/homeNotice", noticeData)
      setGlobalError("文章發布成功！")
      setGlobalErrorIcon(<FontAwesomeIcon icon="fa-solid fa-circle-check" />)
      setShowNoticeBoard(false)
      setNoticeTitle("")
      setNoticeDescription("")
      setMarkdownContent("")
    } catch (error) {
      console.error("Error publishing notice: ", error)
      setGlobalError("文章發布出了點問題")
      setGlobalErrorIcon(
        <FontAwesomeIcon icon="fa-solid fa-school-circle-xmark" />
      )
    }
  }

  return (
    <div id="home-view-content">
      <h1 className="homeTitle firstTitle">平台公告</h1>
      <button type="button" onClick={() => setShowNoticeBoard(true)}>
        發佈公告
      </button>
      <section className="home-block">
        {HomePostData.map((HomePostData, index) => (
          <div
            className={`home-post`}
            onClick={() =>
              navigate("/articles?article=" + HomePostData.postlink)
            }
            key={index}>
            {HomePostData.stylebackground && (
              <>
                <img
                  src={`${
                    HomePostData.stylebackground.includes("https://")
                      ? HomePostData.stylebackground
                      : `/images/homePage/${HomePostData.stylebackground}`
                  }`}
                  alt=""
                />
              </>
            )}
            <span>{HomePostData.postTime}</span>
            <h1>{HomePostData.postTitle}</h1>
            <p>{HomePostData.content}</p>
          </div>
        ))}
        {showNoticeBoard && (
          <Sheet
            title="公告編輯器"
            childenView={
              <NoticeBoardEditor
                noticeTitle={noticeTitle}
                setNoticeTitle={setNoticeTitle}
                noticeDescription={noticeDescription}
                setNoticeDescription={setNoticeDescription}
                markdownContent={markdownContent}
                setMarkdownContent={setMarkdownContent}
              />
            } // 文章編輯器（內包含 Markdown Editor）
            closeAction={() => setShowNoticeBoard(false)}
            controls={noticeBoardSheetControls}
          />
        )}
      </section>
    </div>
  )
}
