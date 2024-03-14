/* eslint-disable no-unused-vars */
// React
import React, { useEffect, useState } from "react"
import {
  useLocation,
  useNavigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom"

// Style
import "./App.scss"
import css from "./App.module.scss"

// 狀態管理
import { AppContext } from "./AppContext.js"
import { useContext } from "react"

// Page Title/Description Control
import { Helmet } from "react-helmet"

// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Service Worker
import { serviceWorkerRegistration } from "./serviceWorkerRegistration"
import { getRegistration } from "./serviceWorkerRegistration"

// Pages
import Setting from "./pages/SettingView/Setting.jsx"
import Home from "./pages/Home/Home.jsx"
import Post from "./pages/Post"
import Service from "./pages/Service"
import Development from "./pages/Development"
import ExSch from "./pages/examSchedule"
import CourseSchedule from "./pages/CourseSchedule"
import EnglishAbbreviations from "./pages/englishAbbreviations"
import OOXXGame from "./pages/ooxx"
import ReportProblem from "./widgets/ReportProblem/reportProblem.jsx"
import Updater from "./pages/Updeter"
import Music from "./pages/music"
import ChatGroup from "./pages/ChatGroup"
import YouTubePlayer from "./pages/YouTubePlayer"
import DocLink from "./pages/DocLink"
import WebUpdate from "./pages/WebUpdate"
import Chats from "./pages/Chats"
import Chatroom from "./pages/Chatroom.jsx"
import User from "./pages/User"
import ClassRealTimeStatus from "./pages/ClassRealTimeStatus"
import Photo from "./pages/Photo"

// Tools
import Articles from "./pages/Article/Articles.jsx"
import PhotoPreview from "./tools/photoPreview"

// Local Database
import { WebVersion } from "./AppData/AppData"

// 自定義函式庫
import useUrlParams from "./js/UpdateUrlParams"

// Firebase
import { doc, onSnapshot } from "firebase/firestore"
import Upgrader from "./widgets/Upgrader/Upgrader.jsx"
import Header from "./widgets/Header/Header.jsx"

// 頁面架構組件
export default function App() {
  // 狀態與初始化
  const {
    user,
    db,
    pageSelectTabs,
    setPageSelectTabs,
    setGlobalLocation,
    globalError,
    setGlobalError,
    globalErrorIcon,
    setGlobalErrorIcon,
  } = useContext(AppContext)

  const [settingPage, setSettingPage] = useState(false)
  const [menuActive, setMenuActive] = useState(false)
  const [reportProblemActive, setReportProblemActive] = useState(false)

  const [courSchType, setCourSchType] = useState()
  const courSchTypeChange = (type) => {
    setCourSchType(type)
    localStorage.setItem("courSchType", type)
  }
  const [theme, setTheme] = useState() // 用於在 html 結構中增加 css 樣式名稱
  const [themeMode, setThemeMode] = useState(() => {
    const savedThemeMode = 0 // localStorage.getItem("themeMode")
    return savedThemeMode !== null ? parseInt(savedThemeMode) : 0 // 預設為「根據系統」
  })
  const [modeValue, setModeValue] = useState()
  const [themeInfo, setThemeInfo] = useState("Error")
  const pageName = [
    { path: "/", pageName: "首頁" },
    { path: "/post", pageName: "公告" },
    { path: "/service", pageName: "服務" },
    { path: "/chats", pageName: "聊天" },
    { path: "/chats/chatroom", pageName: "聊天室" },
    { path: "/chats/chat-group", pageName: "聊天室" },
    { path: "/webUpdate", pageName: "網站更新" },
    { path: "/service/courseSchedule", pageName: "課程表" },
    { path: "/service/examSchedule", pageName: "考程表" },
    { path: "/service/youtube-player", pageName: "YouTube 播放器" },
    { path: "/secretPage/music", pageName: "音樂" },
    { path: "/secretPage/classroomStatus", pageName: "班級即時狀態" },
    { path: "/photo", pageName: "相片" },
    { path: "/articles", pageName: "文章" },
  ]
  const [pageTabs, setPageTabs] = useState()
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [cancelUpdateBt, setCancelUpdateBtn] = useState(false)
  const [getPostData, setGetPostData] = useState(null)
  const [postCount, setPostCount] = useState()
  const [postNoti, setPostNoti] = useState(
    localStorage.getItem("postNoti")
      ? Number(localStorage.getItem("postNoti"))
      : 0
  )

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setGlobalLocation(location)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // 設定特定頁面的 Tab 選項
  useEffect(() => {
    if (location.pathname === "/service/courseSchedule") {
      setPageSelectTabs({
        isDark: theme === "dark",
        onTop: true,
        options: ["資訊科", "電子科", "電機科"],
        onChange: (value) => courSchTypeChange(value),
        selected: courSchType,
      })
    } else setPageSelectTabs()
  }, [location, courSchType, theme, setPageSelectTabs])

  /**
   * 將 location path 尋找資料庫對應的頁面名稱
   * @param {string} path - location path，用於從 pageName 中尋找對應頁面名稱
   * @returns {string} - 對應 location path 的頁面名稱
   */
  function checkPageName(path) {
    for (const item of pageName) {
      if (item.path === path) {
        return item.pageName
      }
    }
    return null
  }

  // Service Worker 自動檢查更新
  useEffect(() => {
    const intervalId = setInterval(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register(`/service-worker.js`)
          .then((registration) => {
            registration.update()
            // console.log(
            //   "ServiceWorker 註冊成功！ 管轄範圍：",
            //   registration.scope
            // )
            // 檢查是否有新版本可用
            if (registration.waiting) {
              setUpdateAvailable(true)
            }
            registration.addEventListener("updatefound", () => {
              const installingWorker = registration.installing
              if (installingWorker) {
                installingWorker.addEventListener("statechange", () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // 提示用戶更新
                    setUpdateAvailable(true)
                  }
                })
              }
            })
            // 當新版本可用時觸發
            serviceWorkerRegistration.register({
              onUpdate: () => {
                // 提示用戶更新
                setUpdateAvailable(true)
              },
            })
          })
          .catch((error) => {
            // console.log("ServiceWorker 註冊失敗：", error)
          })
      }
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  // 檢查到新版本後，用戶需手動更新新版本
  const handleUpdate = async () => {
    const registration = await getRegistration()
    if (registration && registration.waiting) {
      // 強制激活新版本
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      setUpdateAvailable(false)
      window.location.reload(true)
    }
  }

  // 公告通知角標
  useEffect(() => {
    const postNotiCount = localStorage.getItem("postNoti")
    if (postNotiCount) {
      setPostNoti(Number(postNotiCount))
    }
  }, [])
  useEffect(() => {
    const postDatabaseRef = doc(db, "post", "postData")
    const unsubscribe = onSnapshot(postDatabaseRef, (doc) => {
      const data = doc.data()
      const dataCount = Object.keys(data.data).length
      setGetPostData(data)
      setPostCount(dataCount)
      if (dataCount && postNoti > dataCount) {
        console.log(postNoti)
        setPostNoti(dataCount)
        localStorage.setItem("postNoti", dataCount)
      }
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 設備狀態

  // 特殊狀態

  // 頁面跳轉
  // const navigate = useNavigate()
  const navigateClick = (page) => {
    navigate(page)
    setMenuActive(false)
    setSettingPage(false)
  }

  // 頁面追蹤
  /**
   * 檢查當前路徑是否匹配指定的路徑之一
   * @param {Array} paths - 包含多個路徑的數組
   * @returns {boolean} - 如果當前路徑與任何一個指定路徑匹配，則返回 true，否則返回 false
   */
  function checkLocation(paths) {
    return paths.some((path) => location.pathname === path)
  }

  // 菜單欄切換狀態
  const menuBtnClick = () => {
    setMenuActive((prevActive) => !prevActive)
  }

  // 提示彈窗狀態
  const [TipsActive, setTipsActive] = useState(false)
  const Tips = () => {
    setTipsActive((prevActive) => !prevActive)
  }

  // 外觀模式切換
  // 監測系統外觀模式變化
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
  const htmlRef = document.querySelector("html")

  // 變更狀態，並且在檢測到系統狀態變化後執行
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
    if (themeMode === 1) {
      if (prefersDarkMode.matches) {
        setTheme("dark")
        htmlRef.classList.add("dark")
        setThemeInfo("Dark")
        setModeValue("根據系統")
      } else if (!prefersDarkMode.matches) {
        setTheme("")
        htmlRef.classList.remove("dark")
        setThemeInfo("Light")
        setModeValue("根據系統")
      }
    } else if (themeMode === 2) {
      setTheme("dark")
      htmlRef.classList.add("dark")
      setThemeInfo("Dark")
      setModeValue("深色模式")
    } else if (themeMode === 0) {
      setTheme("")
      htmlRef.classList.remove("dark")
      setModeValue("淺色模式")
    }
    prefersDarkMode.addEventListener("change", systemThemeChange)
    return () => {
      prefersDarkMode.removeEventListener("change", systemThemeChange)
    }
  }, [themeMode, prefersDarkMode])
  // 監測並使用 localStorage 儲存狀態
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode.toString())
  }, [themeMode])
  //「根據系統」選項，檢測系統主題並切換狀態
  const systemThemeChange = () => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
    if (themeMode === 1) {
      if (prefersDarkMode.matches) {
        setTheme("dark")
        htmlRef.classList.add("dark")
        setModeValue("根據系統")
      } else if (!prefersDarkMode.matches) {
        setTheme("")
        htmlRef.classList.remove("dark")
        setModeValue("根據系統")
      }
    }
  }
  // 外觀模式按鈕狀態切換輪迴
  const handleThemeChange = (event) => {
    if (checkLocation(["/service/youtube-player"])) {
      return
    }
    if (themeMode === 1) {
      htmlRef.classList.remove("dark")
      setThemeMode(0)
      setModeValue("淺色模式")
    } else if (themeMode === 2) {
      htmlRef.classList.remove("dark")
      setThemeMode(0)
      setModeValue("淺色模式")
    } else if (themeMode === 0) {
      setThemeMode(0)
      setModeValue("淺色模式")
    }

    // setGlobalError("深色模式暫時停用")
    // setGlobalErrorIcon(
    //   <FontAwesomeIcon icon="fa-solid fa-circle-half-stroke" />
    // )
  }

  const [specialTheme, setSpecialTheme] = useState(themeMode)
  useEffect(() => {
    if (checkLocation(["/service/youtube-player"])) {
      setThemeMode(2)
    } else {
      setThemeMode(specialTheme)
    }
  }, [location, themeMode])

  // 偵測是否在頁面頂部
  const [isTop, setIsTop] = useState(true)
  let lastIsTop = true
  // useEffect(() => {
  //   setTimeout(() => {
  //     const container = document.querySelector("main")
  //     const handleScroll = () => {
  //       const scrollTop = container.scrollTop
  //       const newIsTop = scrollTop <= 30 // 改為檢查是否距離頂部小於等於50px
  //       if (newIsTop !== lastIsTop && location.pathname === "/") {
  //         setIsTop(newIsTop)
  //         lastIsTop = newIsTop
  //       }
  //     }

  //     container.addEventListener("scroll", handleScroll)

  //     return () => {
  //       container.removeEventListener("scroll", handleScroll)
  //     }
  //   }, 0)
  // }, [location])

  // 版權標示
  // useEffect(() => {
  //   const cc = document.querySelector(".cc")
  //   if (location.pathname === "/" && !isTop) {
  //     if (cc) {
  //       cc.classList.add("open")
  //     }
  //   } else {
  //     cc.classList.remove("open")
  //   }
  // }, [isTop, location])

  useEffect(() => {
    setTimeout(() => {
      const container = document.querySelector(".view")
      if (container && location.pathname === "/") {
        setIsTop(true)
        const handleScroll = () => {
          const scrollTop = container.scrollTop
          const newIsTop = scrollTop <= 30 // 改為檢查是否距離頂部小於等於50px
          if (newIsTop !== lastIsTop) {
            setIsTop(newIsTop)
            lastIsTop = newIsTop
          }
        }

        container.addEventListener("scroll", handleScroll)

        return () => {
          container.removeEventListener("scroll", handleScroll)
        }
      } else if (!container) setIsTop(true)
      else setIsTop(false)
    }, 0)
  }, [location])

  // Url 參數
  const { urlParams, removeUrlParam, addUrlParams } = useUrlParams()

  // 首頁文章參數路由
  useEffect(() => {
    if (urlParams.post) {
      setReadArticle(urlParams.post)
      setPostActive(true)
    } else {
      setReadArticle("")
      setPostActive(false)
    }
  }, [urlParams])

  // 文章閱讀模式傳喚
  const [postActive, setPostActive] = useState(false)
  const [readArticle, setReadArticle] = useState("")
  /**
   * 打開文章並更新URL參數
   * @param {string} postLink - 要打開的文章的代號
   */
  function openPost(postLink) {
    setReadArticle(postLink)
    setPostActive(true)
    // 更新URL參數
    addUrlParams({ post: postLink })
  }

  // 文檔檢視傳喚
  const [docUrl, setDocUrl] = useState("")
  function openDoc(docLink) {
    navigateClick("/service/docLink")
    addUrlParams({ doc: docLink })
    setDocUrl(docLink)
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const docUrlValue = searchParams.get("docUrl")
    if (docUrlValue) {
      navigateClick("/service/docLink")
      setDocUrl(docUrlValue)
      console.log(docUrlValue)
    }
  }, [urlParams])

  // 影片url傳喚
  const [youtubeUrl, setYoutubeUrl] = useState("")
  // const [youtubeActive, setYoutubeActive] = useState(false)
  // const [readDoc, setReadDoc] = useState('')
  function openYoutubeUrl(url) {
    navigateClick("/service/youtube-player")
    // 更新URL參數
    const params = new URLSearchParams(window.location.search)
    params.set("youtubeUrl", url)
    const newUrl =
      window.location.pathname + window.location.hash + "?" + params.toString()
    window.history.pushState({ doc: url }, "", newUrl)
  }
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const youtubeUrlValue = params.get("youtubeUrl")
    setYoutubeUrl(youtubeUrlValue)
    // console.log(youtubeUrlValue)
  }, [youtubeUrl, location])

  // 全局提示彈窗
  useEffect(() => {
    if (globalError) {
      setTimeout(() => {
        setGlobalError("")
        setGlobalErrorIcon()
      }, 4000)
    }
  }, [globalError])

  // 圖片預覽器
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("")

  return (
    <>
      <Helmet>
        <title>班級資訊平台</title>
        <meta name="description" content="學校、班級的最新資訊" />
        <meta property="og:title" content="班級資訊平台" />
        <meta property="og:description" content="學校、班級的最新資訊" />
      </Helmet>

      <Header
        checkLocation={checkLocation}
        navigateClick={navigateClick}
        selectTabs={pageTabs}
      />

      <footer
        className={`${theme}${theme && settingPage ? " " : ""}${
          settingPage ? "settingOpen" : ""
        }`}
        style={{
          boxShadow:
            menuActive ||
            checkLocation(["/", "/chats/chat-group", "/chats/chatroom"])
              ? "0 -1px 1px 0px #f1f1f100"
              : "",
          bottom: checkLocation(["/chats/chat-group", "/chats/chatroom"])
            ? "-80px"
            : "",
          background:
            checkLocation(["/", "/chats/chat-group", "/chats/chatroom"]) &&
            !menuActive
              ? "#ffffff00"
              : "",
        }}>
        <div
          id="footer"
          className={`${
            checkLocation(["/", "/chats/chat-group"]) &&
            !menuActive &&
            "homePage"
          }`}>
          <ul id="footer-ul">
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick("/")]}>
              <div
                className={`li-view home ${
                  checkLocation(["/"]) ? "active" : ""
                }`}>
                {checkLocation(["/"]) ? (
                  <FontAwesomeIcon icon="fa-solid fa-house" className="icon" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-house" className="icon" />
                )}
                <span>首頁</span>
              </div>
            </li>
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick("/post")]}
              style={{ background: checkLocation(["/"]) ? "#ffffff00" : "" }}>
              <div
                className={`li-view folder ${
                  checkLocation(["/post"]) ? "active" : ""
                }`}>
                {checkLocation(["/post"]) ? (
                  <FontAwesomeIcon icon="fa-solid fa-bell" className="icon" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-bell" className="icon" />
                )}
                <span>公告</span>
              </div>
            </li>
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick("/service")]}
              style={{ background: checkLocation(["/"]) ? "#ffffff00" : "" }}>
              <div
                className={`li-view folder ${
                  checkLocation([
                    "/service",
                    "/service/courseSchedule",
                    "/service/examSchedule",
                    "/service/youtube-player",
                  ])
                    ? "active"
                    : ""
                }`}>
                {checkLocation(["/service"]) ? (
                  <FontAwesomeIcon icon="fa-solid fa-shapes" className="icon" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-shapes" className="icon" />
                )}
                <span>服務</span>
              </div>
            </li>
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick("/chats")]}
              style={{ background: checkLocation(["/"]) ? "#ffffff00" : "" }}>
              <div
                className={`li-view development ${
                  checkLocation(["/chats"]) ? "active" : ""
                }`}>
                {checkLocation(["/chats"]) ? (
                  <FontAwesomeIcon icon="fa-solid fa-comments" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-comments" />
                )}
                <span>訊息</span>
              </div>
            </li>
            <li
              id="footer-li"
              className="menuicon"
              onClick={menuBtnClick}
              style={{ background: checkLocation(["/"]) ? "#ffffff00" : "" }}>
              <div className={`li-view menuicon ${menuActive ? "active" : ""}`}>
                <FontAwesomeIcon icon="fa-solid fa-bars" />
              </div>
            </li>
          </ul>
        </div>
      </footer>

      <main>
        <Routes>
          {/* Setting */}
          <Route path="/settings" element={<Setting />} />
          <Route path="/articles" element={<Articles />} />
          {/* home */}
          <Route path="/" element={<Home navigateClick={navigateClick} />} />

          {/* post */}
          <Route
            path="/post"
            element={
              <Post
                theme={theme}
                settingPage={settingPage}
                setPostNoti={setPostNoti}
              />
            }></Route>

          {/* service */}
          <Route
            path="/service"
            element={
              <Service
                theme={theme}
                settingPage={settingPage}
                setDocUrl={setDocUrl}
                openDoc={openDoc}
                navigateClick={navigateClick}
              />
            }>
            <Route
              path="courseSchedule"
              element={
                <CourseSchedule
                  courSchType={courSchType}
                  setCourSchType={setCourSchType}
                  navigateClick={navigateClick}
                  TipsActive={TipsActive}
                  Tips={Tips}
                  theme={theme}
                  settingPage={settingPage}
                />
              }></Route>
            <Route
              path="examSchedule"
              element={
                <ExSch
                  theme={theme}
                  settingPage={settingPage}
                  navigateClick={navigateClick}
                />
              }></Route>
            <Route
              path="youtube-player"
              element={
                <YouTubePlayer
                  theme={theme}
                  setTheme={setTheme}
                  themeMode={themeMode}
                  navigateClick={navigateClick}
                  setThemeMode={setThemeMode}
                  setSpecialTheme={setSpecialTheme}
                  settingPage={settingPage}
                  setGlobalError={setGlobalError}
                  setGlobalErrorIcon={setGlobalErrorIcon}
                  youtubeUrl={youtubeUrl}
                  setYoutubeUrl={setYoutubeUrl}
                  openYoutubeUrl={openYoutubeUrl}
                />
              }></Route>
            <Route
              path="docLink"
              element={
                <DocLink
                  theme={theme}
                  settingPage={settingPage}
                  docUrl={docUrl}
                  navigateClick={navigateClick}></DocLink>
              }></Route>
          </Route>

          {/* chatGroup */}
          <Route
            path="/chats"
            element={
              <Chats
                theme={theme}
                navigateClick={navigateClick}
                checkLocation={checkLocation}
              />
            }>
            <Route
              path="chat-group"
              element={
                <ChatGroup
                  theme={theme}
                  settingPage={settingPage}
                  setPhotoPreviewUrl={setPhotoPreviewUrl}
                  navigateClick={navigateClick}
                  setGlobalError={setGlobalError}
                  setGlobalErrorIcon={setGlobalErrorIcon}
                />
              }></Route>
            <Route path="chatroom" element={<Chatroom />} />
          </Route>
          <Route
            path="/chat-group"
            element={
              <ChatGroup
                theme={theme}
                settingPage={settingPage}
                setPhotoPreviewUrl={setPhotoPreviewUrl}
                navigateClick={navigateClick}
                setGlobalError={setGlobalError}
                setGlobalErrorIcon={setGlobalErrorIcon}
              />
            }></Route>
          <Route
            path="/development"
            element={
              <Development
                theme={theme}
                themeInfo={themeInfo}
                settingPage={settingPage}
                readArticle={readArticle}
              />
            }></Route>

          {/* user */}
          <Route
            path="/user"
            element={<User theme={theme} settingPage={settingPage} />}></Route>

          <Route path="/photo" element={<Photo />}></Route>

          <Route
            path="/webUpdate"
            element={
              <WebUpdate
                navigateClick={navigateClick}
                theme={theme}
                settingPage={settingPage}
                handleUpdate={handleUpdate}
                updateAvailable={updateAvailable}
              />
            }></Route>
          <Route path="/secretPage" element={<Outlet />}>
            <Route
              path="updater"
              element={<Updater theme={theme} settingPage={settingPage} />}
            />
            <Route
              path="classroomStatus"
              element={
                <ClassRealTimeStatus theme={theme} settingPage={settingPage} />
              }
            />
            <Route
              path="classRealtimeStatus"
              element={
                <ClassRealTimeStatus theme={theme} settingPage={settingPage} />
              }
            />
            <Route
              path="ox"
              element={<OOXXGame theme={theme} settingPage={settingPage} />}
            />
            <Route
              path="english"
              element={
                <EnglishAbbreviations theme={theme} settingPage={settingPage} />
              }
            />
            <Route
              path="music"
              element={
                <Music theme={theme} settingPage={settingPage} />
              }></Route>
          </Route>
        </Routes>
      </main>

      <ReportProblem
        theme={theme}
        reportProblemActive={reportProblemActive}
        setReportProblemActive={setReportProblemActive}
      />

      {/* Other Pages */}
      {checkLocation(["/service/music"]) && (
        <Music theme={theme} settingPage={settingPage} />
      )}
      {updateAvailable && (
        <Upgrader
          isSkip={cancelUpdateBt}
          setSkip={setCancelUpdateBtn}
          handleUpdate={handleUpdate}
          navigateClick={navigateClick}
        />
      )}
      {/* {postActive && (
        <Articles
          theme={theme}
          openPost={openPost}
          readArticle={readArticle}
          postActive={postActive}
          setPostActive={setPostActive}
          setReadArticle={setReadArticle}
        />
      )} */}
      <PhotoPreview
        theme={theme}
        photoPreviewUrl={photoPreviewUrl}
        setPhotoPreviewUrl={setPhotoPreviewUrl}
      />
      {globalError && (
        <div id="globalError">
          {globalErrorIcon}
          <p>{globalError}</p>
        </div>
      )}
    </>
  )
}
