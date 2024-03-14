// React
import { useState } from "react"

// Widget
import ReportProblem from "../../widgets/ReportProblem/reportProblem"
import Sheet from "../../widgets/Sheet/Sheet"

// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// style
import style from "./style.module.scss"

// 設定頁面組件
export default function Setting({ navigateClick }) {
  const [showReportProblemView, setShowReportProblemView] = useState(false)
  const [secretKey, setSecretKey] = useState("")

  function secretPassage(event) {
    event.preventDefault()
    console.log(secretKey)
    navigateClick(`/secretPage/${secretKey}`)
  }
  function handleInputChange(event) {
    setSecretKey(event.target.value)
  }

  return (
    <>
      <div id="Setting" className={style.view}>
        <div className={style.header}>
          <h1>設定</h1>
        </div>
        <div className={style.secretPassage}>
          <form onSubmit={secretPassage}>
            <input
              type="text"
              pattern="[A-Za-z0-9]+"
              placeholder="秘密入口"
              value={secretKey}
              onChange={handleInputChange}
            />
            <br />
            <button type="submit" title="進入">
              <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
            </button>
          </form>
        </div>
        <div className={style.settingView}>
          <p>系統</p>
          <div className={style.setBlock}>
            <div className={style.setName}>
              <h3>主題模式</h3>
            </div>
            <div className={style.set}>
              <div className={style.themeMode} onClick={() => {}}>
                <div className={style.slider}>
                  <span>模式</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.settingView}>
          <div
            className={style.setBlock}
            onClick={() => setShowReportProblemView(true)}>
            <div className={style.setName}>
              <h3>建議與問題回報</h3>
            </div>
            <div className={style.set}>
              <div className={style.target}></div>
            </div>
          </div>
        </div>
      </div>
      {showReportProblemView && (
        <Sheet
          title="建議與問題回報"
          childenView={<ReportProblem />}
          closeAction={() => setShowReportProblemView(false)}
          viewHeight={50}
        />
      )}
    </>
  )
}
