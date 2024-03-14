import style from "./style.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Upgrader({
  isSkip, // 是否暫時略過（以小圖示顯示在頁面上）
  setSkip, // 設定略過狀態
  handleUpdate, // 觸發立即更新網站
  navigateClick, // 頁面切換函數
}) {
  return (
    <div
      id="update"
      className={`${style.update}${isSkip ? ` ${style.small}` : ""}`}
      onClick={isSkip ? () => setSkip(false) : () => {}}>
      <UpdateTipsTitle />
      <UpdateControlsView
        navigateClick={navigateClick}
        setSkip={setSkip}
        handleUpdate={handleUpdate}
      />
    </div>
  )
}

// Subviews
// 更新提示標題
function UpdateTipsTitle() {
  return (
    <div className={style.updateContent}>
      <div>
        <FontAwesomeIcon icon="fa-solid fa-circle-up" />
      </div>
      <p>檢測到網站更新！</p>
    </div>
  )
}

// <view> 控制按鈕群組
function UpdateControlsView({ navigateClick, setSkip, handleUpdate }) {
  return (
    <div>
      <ViewUpdate navigateClick={navigateClick} />
      <UpdateLaterBtn setSkip={setSkip} />
      <UpdateBtn handleUpdate={handleUpdate} />
    </div>
  )
}

// <button> 查看更新內容
function ViewUpdate({ navigateClick }) {
  return (
    <button
      className={style.updateContentBtn}
      onClick={() => navigateClick("/webUpdate")}>
      <p>更新內容</p>
    </button>
  )
}

// <button> 稍後更新
function UpdateLaterBtn({ setSkip }) {
  return (
    <button className={style.cancelUpdateBtn} onClick={() => setSkip(true)}>
      <p>稍後</p>
    </button>
  )
}

// <button> 立即更新
function UpdateBtn({ handleUpdate }) {
  return (
    <button className={style.updateBtn} onClick={handleUpdate}>
      <p>立即更新</p>
    </button>
  )
}
