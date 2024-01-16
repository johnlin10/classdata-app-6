// React
import React, { useRef, useEffect, useState, useContext } from "react"
import { AppContext } from "../AppContext.js"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// Database
import { LeftTitle } from "../AppData/AppData.js"
// Firebase
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore"
// Widget
import PageTitle from "../widgets/PageTitle"
import Loader from "../widgets/Loader.jsx"
import EditBtn from "../widgets/editBtn"
import Editer from "../widgets/editer"
import PageCtrlModule from "../widgets/PageCtrlModule"
import ContentTabs from "../widgets/ContentTabs"
import { Helmet } from "react-helmet"
import style from "./css/CourseSchedule.module.scss"
import { isUserAuthorized } from "../firebase.js"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// 雲端資料庫
// 初始化
const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth()

function CourseSchedule(props) {
  const { user } = useContext(AppContext)
  const [themeColor, setThemeColor] = useState([
    "#5074eb",
    "#fffffff1",
    "#5074eb",
    "#fffffff1",
  ])
  // 編輯
  const [editView, setEditView] = useState(false)
  const editPrmsn = isUserAuthorized(
    [process.env.REACT_APP_ADMIN_ACCOUNT],
    null,
    [process.env.REACT_APP_SCHOOL_EMAIL]
  )

  const teacherOptions = ["徐玉雪", "周嘉慧", "陳語蘋", "王平杰", "林淑媄"]
  const professionalTeacher = [
    "成志樵",
    "葉憲民",
    "陳永富",
    "江明德",
    "施茗鈜",
    "黃釧泉",
    "黃日隆",
  ]

  const [courseScheduleDataInfoActive, setcourseScheduleDataInfoActive] =
    useState(false)
  const courseScheduleDataInfo = () => {
    setcourseScheduleDataInfoActive((prevActive) => !prevActive)
  }

  const [courSchData, setCourSchData] = useState()
  const [courSchDataBackup, setCourSchDataBackup] = useState()

  const resetCourSchData = [
    {
      type: "資訊科",
      data: [
        {
          Date: "星期一",
          Course: [
            {
              info_classroom: "323e",
              info_teacher: "徐玉雪",
              class: "英語文",
              continuity: "2",
            },
            {
              info_teacher: "王平杰",
              class: "體育",
              info_classroom: "",
              continuity: "",
            },
            {
              continuity: "",
              class: "生涯規劃",
              info_classroom: "551",
              info_teacher: "周嘉慧",
            },
            {
              class: "電子電路",
              continuity: "",
              info_teacher: "成志樵",
              info_classroom: "554",
            },
            {
              info_classroom: "223",
              info_teacher: "黃日隆",
              continuity: "2",
              class: "無人機應用實習",
            },
          ],
        },
        {
          Date: "星期二",
          Course: [
            {
              info_teacher: "葉憲民",
              class: "微電腦應用實習",
              continuity: "3",
              info_classroom: "485",
            },
            {
              info_teacher: "林淑媄",
              info_classroom: "485",
              continuity: "",
              class: "數學",
            },
            {
              class: "互動式網頁設計實習",
              info_teacher: "葉憲民",
              continuity: "3",
              info_classroom: "485",
            },
          ],
        },
        {
          Course: [
            {
              info_teacher: "葉憲民",
              continuity: "2",
              class: "數位電子",
              info_classroom: "485",
            },
            {
              continuity: "2",
              info_teacher: "成志樵",
              info_classroom: "485",
              class: "電子電路",
            },
            {
              class: "介面電路控制實習",
              info_teacher: "黃釧泉",
              info_classroom: "484",
              continuity: "3",
            },
          ],
          Date: "星期三",
        },
        {
          Course: [
            {
              continuity: "",
              class: "數位電子",
              info_teacher: "葉憲民",
              info_classroom: "554",
            },
            {
              info_classroom: "583",
              class: "專題實作",
              continuity: "3",
              info_teacher: "葉憲民",
            },
            {
              info_classroom: "551",
              class: "國語文",
              continuity: "3",
              info_teacher: "陳語蘋",
            },
          ],
          Date: "星期四",
        },
        {
          Date: "星期五",
          Course: [
            {
              continuity: "",
              class: "班週會",
              info_classroom: "",
              info_teacher: "葉憲民",
            },
            {
              info_teacher: "",
              class: "彈性課程",
              info_classroom: "",
              continuity: "",
            },
            {
              info_classroom: "",
              class: "綜合活動",
              info_teacher: "",
              continuity: "2",
            },
            {
              continuity: "",
              class: "體育",
              info_teacher: "王平杰",
              info_classroom: "",
            },
            {
              info_teacher: "林淑媄",
              continuity: "2",
              info_classroom: "",
              class: "數學",
            },
          ],
        },
      ],
    },
    {
      type: "電子科",
      data: [
        {
          Date: "星期一",
          Course: [
            {
              continuity: "2",
              class: "英語文",
              info_classroom: "323e",
              info_teacher: "徐玉雪",
            },
            {
              info_teacher: "王平杰",
              info_classroom: "",
              continuity: "",
              class: "體育",
            },
            {
              info_teacher: "周嘉慧",
              continuity: "",
              info_classroom: "551",
              class: "生涯規劃",
            },
            {
              info_classroom: "554",
              info_teacher: "成志樵",
              continuity: "",
              class: "電子電路",
            },
            {
              continuity: "2",
              info_teacher: "黃日隆",
              info_classroom: "223",
              class: "無人機應用實習",
            },
          ],
        },
        {
          Course: [
            {
              continuity: "3",
              info_classroom: "485",
              class: "微電腦應用實習",
              info_teacher: "葉憲民",
            },
            {
              info_classroom: "485",
              class: "數學",
              info_teacher: "林淑媄",
              continuity: "",
            },
            {
              class: "互動式網頁設計實習",
              info_teacher: "葉憲民",
              continuity: "3",
              info_classroom: "485",
            },
          ],
          Date: "星期二",
        },
        {
          Course: [
            {
              info_teacher: "葉憲民",
              info_classroom: "485",
              class: "數位電子",
              continuity: "2",
            },
            {
              info_classroom: "485",
              continuity: "2",
              class: "電子電路",
              info_teacher: "成志樵",
            },
            {
              info_teacher: "黃釧泉",
              info_classroom: "484",
              class: "介面電路控制實習",
              continuity: "3",
            },
          ],
          Date: "星期三",
        },
        {
          Course: [
            {
              info_teacher: "葉憲民",
              info_classroom: "554",
              continuity: "",
              class: "數位電子",
            },
            {
              continuity: "3",
              class: "專題實作",
              info_classroom: "583",
              info_teacher: "葉憲民",
            },
            {
              info_classroom: "551",
              class: "國語文",
              continuity: "3",
              info_teacher: "陳語蘋",
            },
          ],
          Date: "星期四",
        },
        {
          Course: [
            {
              class: "班週會",
              info_teacher: "葉憲民",
              continuity: "",
              info_classroom: "",
            },
            {
              continuity: "",
              info_classroom: "",
              info_teacher: "",
              class: "彈性課程",
            },
            {
              class: "綜合活動",
              info_classroom: "",
              continuity: "2",
              info_teacher: "",
            },
            {
              continuity: "",
              class: "體育",
              info_teacher: "王平杰",
              info_classroom: "",
            },
            {
              class: "數學",
              info_classroom: "",
              info_teacher: "林淑媄",
              continuity: "2",
            },
          ],
          Date: "星期五",
        },
      ],
    },
    {
      data: [
        {
          Date: "星期一",
          Course: [
            {
              class: "英語文",
              info_classroom: "323e",
              continuity: "2",
              info_teacher: "徐玉雪",
            },
            {
              continuity: "",
              info_classroom: "",
              class: "體育",
              info_teacher: "王平杰",
            },
            {
              info_classroom: "551",
              info_teacher: "周嘉慧",
              continuity: "",
              class: "生涯規劃",
            },
            {
              info_teacher: "成志樵",
              class: "電子電路",
              continuity: "",
              info_classroom: "554",
            },
            {
              info_teacher: "黃日隆",
              class: "無人機應用實習",
              info_classroom: "223",
              continuity: "2",
            },
          ],
        },
        {
          Date: "星期二",
          Course: [
            {
              continuity: "3",
              info_teacher: "陳永富",
              info_classroom: "484",
              class: "離岸風電與無人機應用實習",
            },
            {
              info_teacher: "林淑媄",
              info_classroom: "485",
              continuity: "",
              class: "數學",
            },
            {
              continuity: "",
              info_classroom: "384",
              class: "電力電子學",
              info_teacher: "成志樵",
            },
            {
              info_classroom: "384",
              continuity: "2",
              class: "變壓器檢修實習",
              info_teacher: "江明德",
            },
          ],
        },
        {
          Course: [
            {
              continuity: "",
              info_teacher: "成志樵",
              class: "電力電子學",
              info_classroom: "581",
            },
            {
              info_classroom: "581",
              continuity: "3",
              class: "電力電子應用實習",
              info_teacher: "施茗鈜",
            },
            {
              info_classroom: "384",
              class: "電工機械",
              continuity: "3",
              info_teacher: "江明德",
            },
          ],
          Date: "星期三",
        },
        {
          Date: "星期四",
          Course: [
            {
              class: "電力電子學",
              info_teacher: "成志樵",
              info_classroom: "551",
              continuity: "",
            },
            {
              continuity: "3",
              class: "專題實作",
              info_classroom: "583",
              info_teacher: "葉憲民",
            },
            {
              info_classroom: "551",
              continuity: "3",
              class: "國語文",
              info_teacher: "陳語蘋",
            },
          ],
        },
        {
          Date: "星期五",
          Course: [
            {
              class: "班週會",
              info_teacher: "葉憲民",
              continuity: "",
              info_classroom: "",
            },
            {
              class: "彈性課程",
              info_classroom: "",
              continuity: "",
              info_teacher: "",
            },
            {
              info_teacher: "",
              info_classroom: "",
              continuity: "2",
              class: "綜合活動",
            },
            {
              class: "體育",
              info_teacher: "王平杰",
              continuity: "",
              info_classroom: "",
            },
            {
              continuity: "2",
              info_teacher: "林淑媄",
              info_classroom: "",
              class: "數學",
            },
          ],
        },
      ],
      type: "電機科",
    },
  ]

  // 取得考程表內容，填充到輸入框
  const [getCourseSch, setGetCourseSch] = useState(false)
  const [editedActv, setEditedActv] = useState(false)
  useEffect(() => {
    if (!getCourseSch) {
      const courSchDocRef = doc(db, "courseSchedule", "courseSchedule")
      onSnapshot(courSchDocRef, (doc) => {
        const data = doc.data()
        setCourSchData(data.courSchData)
        setCourSchDataBackup(data.courSchData)
      })
      setGetCourseSch(true)
    }
  }, [getCourseSch])
  useEffect(() => {
    if (courSchData && courSchDataBackup) {
      if (courSchData === courSchDataBackup) {
        setEditedActv(false)
      } else {
        setEditedActv(true)
      }
    }
  }, [courSchData, courSchDataBackup, getCourseSch])

  // 更新課程表
  const updateCourSch = async (event) => {
    event.preventDefault()

    const courseSchDocRef = doc(db, "courseSchedule", "courseSchedule")
    const courSchDataObject = { courSchData: courSchData }
    await setDoc(courseSchDocRef, courSchDataObject, { merge: true })
  }

  const updateValue = (subjectIndex, dayIndex, courseIndex, field, value) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const courseData =
        newData[subjectIndex].data[dayIndex].Course[courseIndex]
      courseData[field] = value
      return newData
    })
  }

  const handleContinuityChange = (
    e,
    subjectIndex,
    dayIndex,
    courseIndex,
    value
  ) => {
    // const originCourse = e.target.querySelector(".originCourse input").value
    // 將 originCourse 值添加到 courseData 物件的 originCourse 屬性
    // courSchData.originCourse = originCourse

    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const courseData =
        newData[subjectIndex].data[dayIndex].Course[courseIndex]

      const currentContinuity = courseData.continuity || "" // 確保有值
      const continuityTags = currentContinuity.split(" ") // 將連續的標籤分開

      const index = continuityTags.indexOf(value)

      if (index !== -1) {
        // 如果標籤存在，則從 continuity 中刪除它
        continuityTags.splice(index, 1)
      } else {
        if (value === "2" || value === "3") {
          // 移除已有的 2 或 3，如果有的話
          const idx2 = continuityTags.indexOf("2")
          const idx3 = continuityTags.indexOf("3")
          if (idx2 !== -1) {
            continuityTags.splice(idx2, 1)
          }
          if (idx3 !== -1) {
            continuityTags.splice(idx3, 1)
          }
          // 將 2 或 3 添加到陣列最前面
          continuityTags.unshift(value)
        } else {
          // 否則將標籤添加到 continuity 中
          continuityTags.push(value)
        }
      }

      courseData.continuity = continuityTags.join(" ") // 更新 continuity

      return newData
    })
  }

  const resetCourSch = () => {
    setCourSchData(resetCourSchData)
  }

  const moveUp = (subjectIndex, dayIndex, courseIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      if (courseIndex === 0) return prevData // 如果課程已經在頂部，則不執行任何操作
      const courseData = dayData.Course.splice(courseIndex, 1)[0]
      dayData.Course.splice(courseIndex - 1, 0, courseData)
      return newData
    })
  }

  const moveDown = (subjectIndex, dayIndex, courseIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      if (courseIndex === dayData.Course.length - 1) return prevData // 如果課程已經在底部，則不執行任何操作
      const courseData = dayData.Course.splice(courseIndex, 1)[0]
      dayData.Course.splice(courseIndex + 1, 0, courseData)
      return newData
    })
  }
  const addCourse = (subjectIndex, dayIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      dayData.Course.push({
        // 在這裡添加新課程的初始值
        class: "",
        info_classroom: "",
        info_teacher: "",
        continuity: "",
      })
      return newData
    })
  }
  const deleteCourse = (subjectIndex, dayIndex, courseIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      dayData.Course.splice(courseIndex, 1)
      return newData
    })
  }

  const [courSchData1, setCourSchData1] = useState("")
  const [courSchData2, setCourSchData2] = useState("")
  const [courSchData3, setCourSchData3] = useState("")

  // const [courSchDisplay, setCourSchDisplay] = useState()
  const courSchTypeChange = (type) => {
    props.setCourSchType(type)
    localStorage.setItem("courSchType", type)
  }
  useEffect(() => {
    const storedValue = localStorage.getItem("courSchType")
    if (storedValue) {
      props.setCourSchType(storedValue)
    } else {
      localStorage.setItem("courSchType", "資訊科")
    }
  }, [props.courSchType, courSchData])

  const [expDays, setExpDays] = useState(false)
  useEffect(() => {
    if (courSchData1 && courSchData2 && courSchData3) {
      setTimeout(() => {
        let daysCount = document.querySelector("#TableDiv").childElementCount
        if (daysCount > 6) {
          setExpDays(true)
        } else setExpDays(false)
        console.log("test")
      }, 250)
    }
  }, [props.courSchType, courSchData])

  const tableDivRef = useRef()
  const [csViewWidth, setCsViewWidth] = useState("600")
  useEffect(() => {
    setTimeout(() => {
      if (tableDivRef.current) {
        const width = tableDivRef.current.scrollWidth
        setCsViewWidth(width + 24)
      }
    }, 150)
  }, [courSchData, props.courSchType, courseScheduleDataInfoActive])

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const closePage = () => {
    setPageTitleAni(true)
    setTimeout(() => {
      props.navigateClick("/service")
    }, 500)
  }
  return (
    <>
      <Helmet>
        <title>班級資訊平台｜課程表</title>
        <meta name="description" content="班級的即時課程表" />
        <meta property="og:title" content="班級資訊平台｜課程表" />
        <meta property="og:description" content="班級的即時課程表" />
      </Helmet>
      <main
        id="courseSchedule"
        className={`${props.theme}${props.settingPage ? " settingOpen" : ""}${
          pageTitleAni ? " PTAni" : ""
        }`}>
        <div className={`view tabs${pageTitleAni ? " PTAni" : ""}`}>
          {courSchData ? (
            <>
              {/* 合併 */}
              <section
                id="CSView"
                style={{
                  maxWidth: csViewWidth,
                }}>
                {/* <h1>{courSchDisplay ? courSchDisplay.type : ''}</h1> */}
                {/* <div className="leftMask"></div> */}
                <div id="TableDiv" ref={tableDivRef}>
                  <div className="Table_Rows">
                    <div className="Table_TopTitle">　</div>
                    {LeftTitle.map((LeftTitle, k) => (
                      <div
                        className={`Table_LeftTitle ${
                          courseScheduleDataInfoActive ? "open" : ""
                        }`}
                        key={k}>
                        {LeftTitle.LeftTitle}
                      </div>
                    ))}
                  </div>
                  {courSchData
                    .filter((subject) => subject.type === props.courSchType)
                    .map((subject) =>
                      subject.data.map((item) => (
                        <div
                          className={`Table_Rows ${
                            courseScheduleDataInfoActive ? "open" : ""
                          }`}
                          key={item.Date}>
                          <div className="Table_TopTitle">{item.Date}</div>
                          {item.Course.map((course, courseIndex) => (
                            <div
                              className={`Table_Data${
                                courseScheduleDataInfoActive ? " open" : ""
                              }${` ctnty${course.continuity}`}`}
                              key={`${course.class}${courseIndex}`}
                              title={
                                course.class.includes("段考")
                                  ? `查看 ${course.class} 考程表`
                                  : ""
                              }
                              onClick={
                                course.class.includes("段考")
                                  ? () => [
                                      props.navigateClick(
                                        "/service/examSchedule"
                                      ),
                                    ]
                                  : () => {}
                              }>
                              {course.class}
                              <span
                                className={`${
                                  courseScheduleDataInfoActive ? "open" : ""
                                }`}>
                                {course.info_classroom}
                              </span>
                              <span
                                className={`${
                                  courseScheduleDataInfoActive ? "open" : ""
                                }`}>
                                {course.info_teacher}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                </div>
                {/* <div className="rightMask"></div> */}
              </section>
            </>
          ) : (
            <Loader />
          )}
          <div
            id="Tips"
            style={{ display: props.TipsActive ? "flex" : "none" }}>
            <div>
              <span>課程表現已升級為雲端即時資訊！</span>
            </div>
            <div id="closeBtnView" onClick={props.Tips}>
              <div id="closeBtn">
                <div className="BtnLineL"></div>
                <div className="BtnLineR"></div>
              </div>
            </div>
          </div>
          {editPrmsn && false && (
            <EditBtn
              theme={props.theme}
              btnIcon={
                <FontAwesomeIcon
                  icon="fa-solid fa-pen"
                  style={{ marginRight: "6px" }}
                />
              }
              btnContent="編輯"
              btnClick={() => setEditView(!editView)}
              openActv={editView}
            />
          )}
          {editPrmsn && (
            <Editer
              title="課程表"
              content={
                <div className="editerView">
                  <div className="editTips">
                    <div className="tips">
                      <p>課程連續：2/3/AllDay</p>
                    </div>
                    <div className="tips">
                      <p>
                        調課：<span className="code"> classchange</span>
                      </p>
                    </div>
                    <div className="tips">
                      <p>
                        教室變動：<span className="code"> classroom</span>
                      </p>
                    </div>
                    <div className="tips">
                      <p>
                        假期：<span className="code"> Vacances</span>
                      </p>
                    </div>
                  </div>
                  {courSchData &&
                    courSchData.map((subject, subjectIndex) => (
                      <>
                        <h3>{subject.type}</h3>
                        <div key={subjectIndex}>
                          {subject.data.map((day, dayIndex) => (
                            <div key={dayIndex} className="daysView">
                              <h5>{day.Date}</h5>
                              <div>
                                {day.Course.map((course, courseIndex) => (
                                  <div
                                    // id={`${dayIndex}${courseIndex}`}
                                    className={`editInputView continuity${course.continuity}`}
                                    key={`${dayIndex}${courseIndex}`}>
                                    <div className="classCtrl">
                                      <button
                                        className="deleteBtn"
                                        title="刪除本節課"
                                        onClick={() =>
                                          deleteCourse(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex
                                          )
                                        }>
                                        <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
                                      </button>
                                      <div>
                                        <button
                                          title="向上移動一節"
                                          onClick={() =>
                                            moveUp(
                                              subjectIndex,
                                              dayIndex,
                                              courseIndex
                                            )
                                          }>
                                          <FontAwesomeIcon icon="fa-solid fa-angle-up" />
                                        </button>
                                        <button
                                          title="向下移動一節"
                                          onClick={() =>
                                            moveDown(
                                              subjectIndex,
                                              dayIndex,
                                              courseIndex
                                            )
                                          }>
                                          <FontAwesomeIcon icon="fa-solid fa-angle-down" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="editInput">
                                      <input
                                        type="text"
                                        value={course.class}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            "class",
                                            e.target.value
                                          )
                                        }
                                        placeholder="課程名稱"
                                      />
                                      <input
                                        type="text"
                                        value={course.info_classroom}
                                        className={style.classroomNum}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            "info_classroom",
                                            e.target.value
                                          )
                                        }
                                        placeholder="教室代號"
                                      />
                                      {/* <input
                                        type="text"
                                        value={course.info_teacher}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            "info_teacher",
                                            e.target.value
                                          )
                                        }
                                        placeholder="授課老師"
                                      /> */}
                                      <select
                                        value={course.info_teacher}
                                        className={style.selectTeacher}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            "info_teacher",
                                            e.target.value
                                          )
                                        }>
                                        <option value="">選擇授課老師</option>
                                        <optgroup label="一般科目教師">
                                          {teacherOptions.map(
                                            (teacher, index) => (
                                              <option
                                                key={index}
                                                value={teacher}>
                                                {teacher}
                                              </option>
                                            )
                                          )}
                                        </optgroup>
                                        <optgroup label="專業科目教師">
                                          {professionalTeacher.map(
                                            (teacher, index) => (
                                              <option
                                                key={index}
                                                value={teacher}>
                                                {teacher}
                                              </option>
                                            )
                                          )}
                                        </optgroup>
                                        <option value="">--</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={course.continuity}
                                        className={style.continuity}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            "continuity",
                                            e.target.value
                                          )
                                        }
                                        placeholder="參數"
                                        disabled="false"
                                      />
                                      <div className={style.checkBox}>
                                        {/* ...其他輸入欄位 */}
                                        <div>
                                          <label
                                            className={
                                              course.continuity.includes("2")
                                                ? style.actv
                                                : ""
                                            }>
                                            <input
                                              type="checkbox"
                                              value="2"
                                              checked={course.continuity.includes(
                                                "2"
                                              )}
                                              onChange={(e) =>
                                                handleContinuityChange(
                                                  e,
                                                  subjectIndex,
                                                  dayIndex,
                                                  courseIndex,
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <p>兩節</p>
                                          </label>
                                          <label
                                            className={
                                              course.continuity.includes("3")
                                                ? style.actv
                                                : ""
                                            }>
                                            <input
                                              type="checkbox"
                                              value="3"
                                              checked={course.continuity.includes(
                                                "3"
                                              )}
                                              onChange={(e) =>
                                                handleContinuityChange(
                                                  e,
                                                  subjectIndex,
                                                  dayIndex,
                                                  courseIndex,
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <p>三節</p>
                                          </label>
                                          <label
                                            className={`${style.classchagne}${
                                              course.continuity.includes(
                                                "classchange"
                                              )
                                                ? ` ${style.actv}`
                                                : ""
                                            }`}>
                                            <input
                                              type="checkbox"
                                              value="classchange"
                                              checked={course.continuity.includes(
                                                "classchange"
                                              )}
                                              onChange={(e) =>
                                                handleContinuityChange(
                                                  subjectIndex,
                                                  dayIndex,
                                                  courseIndex,
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <p>調課</p>
                                            <div className={style.originCourse}>
                                              <input
                                                type="text"
                                                placeholder="原課程"
                                              />
                                            </div>
                                          </label>
                                          <label
                                            className={
                                              course.continuity.includes(
                                                "Vacances"
                                              )
                                                ? style.actv
                                                : ""
                                            }>
                                            <input
                                              type="checkbox"
                                              value="Vacances"
                                              checked={course.continuity.includes(
                                                "Vacances"
                                              )}
                                              onChange={(e) =>
                                                handleContinuityChange(
                                                  subjectIndex,
                                                  dayIndex,
                                                  courseIndex,
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <p>放假</p>
                                          </label>
                                          {/* 加入其他標籤 */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button
                                className="addClassBtn"
                                onClick={() =>
                                  addCourse(subjectIndex, dayIndex)
                                }>
                                <FontAwesomeIcon icon="fa-solid fa-plus" />
                                新增課程
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ))}
                </div>
              }
              theme={props.theme}
              editView={editView}
              submitFunc={updateCourSch}
              btnContent="更新"
              btnColor="#16bb53a1"
              btnContentColor="#ffffffd5"
              resetBtn={
                <>
                  {editedActv && (
                    <button
                      className="resetSchData"
                      onClick={() => setGetCourseSch(false)}>
                      還原更改
                    </button>
                  )}
                  <button className="resetSchData" onClick={resetCourSch}>
                    週重置
                  </button>
                </>
              }
            />
          )}
        </div>
        <PageCtrlModule
          buttons={[
            {
              type: "button",
              prmsn: true,
              content: "詳細資訊",
              click: courseScheduleDataInfo,
              actv: courseScheduleDataInfoActive,
              icon: [
                <FontAwesomeIcon
                  icon="fa-solid fa-circle-xmark"
                  style={{ marginRight: "6px" }}
                />,
                <FontAwesomeIcon
                  icon="fa-solid fa-circle-info"
                  style={{ marginRight: "6px" }}
                />,
              ],
            },
            {
              type: "button",
              prmsn: editPrmsn,
              content: "編輯",
              click: () => setEditView(!editView),
              actv: editView,
              icon: [
                <FontAwesomeIcon
                  icon="fa-solid fa-xmark"
                  style={{ marginRight: "6px" }}
                />,
                <FontAwesomeIcon
                  icon="fa-solid fa-pen"
                  style={{ marginRight: "6px" }}
                />,
              ],
            },
          ]}
        />
      </main>
    </>
  )
}

export default CourseSchedule
