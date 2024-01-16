// React
import React, { useEffect, useState, useContext } from "react"
import { AppContext } from "../AppContext"
import { Helmet } from "react-helmet"
// DataBase
import { examLeftTitle } from "../AppData/AppData"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// CSS
import "./css/examSchedule.scss"
// Firebase
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore"
import { isUserAuthorized, db } from "../firebase"
import { writeFirestoreDoc } from "../firebase"

// Widget
import Loader from "../widgets/Loader"
import PageCtrlModule from "../widgets/PageCtrlModule"
import EditBtn from "../widgets/editBtn"
import Editer from "../widgets/editer"

function ExSch(props) {
  const { user } = useContext(AppContext)
  const [themeColor, setThemeColor] = useState([
    "#825fea",
    "#fffffff1",
    "#825fea",
    "#fffffff1",
  ])
  const editPrmsn = isUserAuthorized(
    [process.env.REACT_APP_ADMIN_ACCOUNT],
    null,
    null
  )

  // 編輯
  const [editView, setEditView] = useState(false)

  // 雲端數據
  const [examSchData, setExamSchData] = useState()
  const [examSchDataDisplay, setExamSchDataDisplay] = useState()
  const [editExamSchData, setEditExamSchData] = useState()
  useEffect(() => {
    const examSchDocRef = doc(db, "schedule", "examSchedule")
    const unsubscribe = onSnapshot(examSchDocRef, (doc) => {
      const data = doc.data().data
      setExamSchData(data)
      if (!examSchDataDisplay && !editExamSchData) {
        setExamSchDataDisplay(data)
        setEditExamSchData(data)
      }
      console.log(data)
    })
    return () => unsubscribe()
  }, [])

  const updateValue = (dayIndex, typeIndex, dataIndex, field, value) => {
    const updatedData = [...examSchData]
    if (typeIndex === undefined) {
      updatedData[dayIndex][field] = value
    } else if (dataIndex === undefined) {
      updatedData[dayIndex].data[typeIndex][field] = value
    } else {
      updatedData[dayIndex].data[typeIndex].data[dataIndex][field] = value
    }
    setEditExamSchData(updatedData)
    setExamSchDataDisplay(updatedData)
  }
  const dayCount = ["零", "一", "二", "三", "四", "五", "六", "七"]
  const addDay = () => {
    const nextDayIndex = examSchData.length
    const nextDayDate = `第${dayCount[nextDayIndex + 1]}天`
    // 創建一個新的元素來表示下一天的考試安排
    const newDay = {
      date: nextDayDate,
      fullDate: "＊/＊",
      week: "＊",
      data: [
        {
          type: "資訊科",
          id: "1",
          data: [
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
          ],
        },
        {
          type: "電子科",
          id: "2",
          data: [
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
          ],
        },
        {
          type: "電機科",
          id: "3",
          data: [
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
            {
              exam: "",
              mode: "notEx",
            },
          ],
        },
      ],
    }

    // 更新狀態變數
    if (examSchData.length < 7) {
      setExamSchData([...examSchData, newDay])
    }
    console.log(examSchData.length)
  }
  const deleteDay = () => {
    const updatedData = [...examSchData]
    const deleteDayIndex = examSchData.length
    updatedData.splice(deleteDayIndex - 1, 1)
    if (examSchData.length > 3) {
      setExamSchData(updatedData)
    }
  }

  // 更新考程表
  const updateExamSch = async (event) => {
    event.preventDefault()

    const examSchDataObject = { data: editExamSchData }
    await writeFirestoreDoc("schedule/examSchedule", examSchDataObject, true)
  }

  // Date
  const currentDate = new Date()
  const todayDate = currentDate.getMonth() + 1 + "/" + currentDate.getDate()
  const [backToday, setBackToday] = useState(false)

  useEffect(() => {
    const theme = props.theme
    const scrollContainer = document.querySelector("#exSch .view")

    // 計算points數組
    const points = []
    document.querySelectorAll("#exSchView").forEach((el, index) => {
      points[index] = el.offsetLeft
    })

    // 計算背景大小
    const bgSize = `${points.length * 100}% 100%`
    scrollContainer.style.backgroundSize = bgSize

    if (theme === "") {
      // Light
      scrollContainer.style.backgroundImage =
        "linear-gradient(115deg, #9c84e2, #8f9edf, #8fceee)"
    } else if (theme === "dark") {
      // Dark
      scrollContainer.style.backgroundImage =
        "linear-gradient(115deg, #7b69b2, #707caf, #6895ac)"
    }

    // Triggered when rolling
    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollLeft
      let positionIndex = 0
      for (let i = 0; i < points.length; i++) {
        if (scrollPosition < points[i]) {
          positionIndex = i
          break
        }
      }
      const bgPosition = `${positionIndex * (100 / (points.length - 1))}%`
      scrollContainer.style.backgroundPosition = bgPosition
    }
    scrollContainer.addEventListener("scroll", handleScroll)

    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [props.theme, examSchData])

  useEffect(() => {
    if (examSchData && examSchData.length > 0) {
      const exSchRefs = document.querySelectorAll("#exSchView")
      setTimeout(() => {
        const index = examSchData.findIndex(
          (item) => item.fullDate === todayDate
        )
        if (index !== -1 && exSchRefs[index]) {
          exSchRefs[index].scrollIntoView({ behavior: "smooth" })
        }
      }, 250)
      setBackToday(false)
    }
  }, [examSchData, backToday, todayDate])

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  return (
    <>
      <Helmet>
        <title>班級資訊平台｜考程表</title>
        <meta name="description" content="班級的即時考程表" />
        <meta property="og:title" content="班級資訊平台｜考程表" />
        <meta property="og:description" content="班級的即時考程表" />
      </Helmet>
      <main
        id="exSch"
        className={`${props.theme}${props.settingPage ? " settingOpen" : ""}${
          pageTitleAni ? " PTAni" : ""
        }`}>
        <div id="todtyDate" onClick={() => setBackToday(true)}>
          <span title={`今天是 ${todayDate}`}>{todayDate}</span>
        </div>
        <div className={`view${pageTitleAni ? " PTAni" : ""}`}>
          {examSchDataDisplay && examSchDataDisplay.length > 0 ? (
            examSchDataDisplay.map((exSch, index) => (
              <section id="exSchView" key={index}>
                <span>
                  {exSch.fullDate} {exSch.week}
                </span>
                <div>
                  <h5>{exSch.date}</h5>
                  <div id="exTable">
                    <div className="exTableRows top">
                      <div className="exTableTopTitle">　</div>
                      {examLeftTitle.map((leftTitle, index) => (
                        <div className="exTableLeftTitle" key={index}>
                          {leftTitle.LeftTitle}
                        </div>
                      ))}
                    </div>
                    {exSch.data.map((data, index) => (
                      <div className="exTableRows" key={index}>
                        <div className="exTableTopTitle">{data.type}</div>
                        {data.data.map((exdata, index) => (
                          <div
                            className={`exTableData ${exdata.mode} ${exdata.continuity}`}>
                            <span key={index}>{exdata.exam}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))
          ) : (
            <Loader />
          )}
        </div>

        {/* 編輯器 */}
        {editPrmsn && (
          <Editer
            title="考程表"
            content={
              <div className="examEditView">
                <div className="examEditTips">
                  <p>空：Empty</p>
                  <p>無考試：notEx</p>
                  <p>橫向兩格合併：Double</p>
                  <p>橫向三格合併：Triple</p>
                </div>
                {examSchData?.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3>{day.date}</h3>
                    <input
                      className="fullDate"
                      type="text"
                      value={day.fullDate}
                      onChange={(e) =>
                        updateValue(
                          dayIndex,
                          undefined,
                          undefined,
                          "fullDate",
                          e.target.value
                        )
                      }
                    />
                    <input
                      className="week"
                      type="text"
                      value={day.week}
                      onChange={(e) =>
                        updateValue(
                          dayIndex,
                          undefined,
                          undefined,
                          "week",
                          e.target.value
                        )
                      }
                    />
                    <div className="editExamSchTable">
                      {day.data.map((type, typeIndex) => (
                        <React.Fragment key={typeIndex}>
                          <div className={`typeBlock`}>
                            <p>{type.type}</p>
                            {type.data.map((item, dataIndex) => (
                              <div
                                className={`editBlock ${item.continuity} ${item.mode}`}
                                key={dataIndex}>
                                <input
                                  className="exam"
                                  type="text"
                                  value={item.exam}
                                  onChange={(e) =>
                                    updateValue(
                                      dayIndex,
                                      typeIndex,
                                      dataIndex,
                                      "exam",
                                      e.target.value
                                    )
                                  }
                                  placeholder="考試科目"
                                />
                                {/* <input
                                  className="mode"
                                  type="text"
                                  value={item.mode}
                                  onChange={(e) =>
                                    updateValue(
                                      dayIndex,
                                      typeIndex,
                                      dataIndex,
                                      "mode",
                                      e.target.value
                                    )
                                  }
                                /> */}
                                <div className="courseParam">
                                  <select
                                    className={`continuity`}
                                    value={item.continuity}
                                    onChange={(e) =>
                                      updateValue(
                                        dayIndex,
                                        typeIndex,
                                        dataIndex,
                                        "continuity",
                                        e.target.value
                                      )
                                    }>
                                    <optgroup label="向右延展科別">
                                      <option value="">單科</option>
                                      <option value="Double">兩科</option>
                                      <option value="Triple">三科</option>
                                    </optgroup>
                                  </select>
                                  <select
                                    className="mode"
                                    value={item.mode}
                                    onChange={(e) =>
                                      updateValue(
                                        dayIndex,
                                        typeIndex,
                                        dataIndex,
                                        "mode",
                                        e.target.value
                                      )
                                    }>
                                    <optgroup label="考試時間？">
                                      <option value="">考試</option>
                                      <option value="notEx">非考試</option>
                                    </optgroup>
                                    <optgroup label="其他樣式">
                                      <option value="opcity">透明</option>
                                      <option value="Empty">隱藏</option>
                                    </optgroup>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="ctrlSchBtn">
                  <button className="deleteDay" onClick={() => deleteDay()}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-square-minus"
                      style={{ marginRight: "3px" }}
                    />
                    刪除一天
                  </button>
                  <button className="addDay" onClick={addDay}>
                    新增一天
                    <FontAwesomeIcon
                      icon="fa-solid fa-square-plus"
                      style={{ marginLeft: "3px" }}
                    />
                  </button>
                </div>
              </div>
            }
            theme={props.theme}
            editView={editView}
            submitFunc={updateExamSch}
            btnContent="更新"
            btnColor="#16bb53a1"
            btnContentColor="#ffffffd5"
          />
        )}
        <PageCtrlModule
          buttons={[
            {
              type: "link",
              prmsn: true,
              content: "資料來源",
              click: () =>
                window.open(
                  `https://firebasestorage.googleapis.com/v0/b/classdata-app.appspot.com/o/assets%2Ffiles%2F112-1期末考考試科目時間表-1.pdf?alt=media&token=453205fb-c3e6-4839-85bf-53745e6e2be8`,
                  "_blank"
                ),
              icon: [
                <FontAwesomeIcon
                  icon="fa-solid fa-file-pdf"
                  style={{ marginRight: "6px" }}
                />,
              ],
            },
            {
              type: "button",
              prmsn: editPrmsn,
              content: "編輯",
              actv: editView,
              click: () => setEditView(!editView),
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
    </>
  )
}

export default ExSch
