import { AppContext } from "../../AppContext"
import { useContext } from "react"
import style from "./style.module.scss"
import PageTitle from "../PageTitle"

// Local Database
import { WebVersion } from "../../AppData/AppData"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Header({ checkLocation, navigateClick }) {
  const { user } = useContext(AppContext)
  return (
    <header
      className={`${style.nav}${
        checkLocation(["/"]) ? ` ${style._atHome}` : ""
      }`}>
      <div id="header" className={`${style.container}`}>
        <ul className={style.header_ul}>
          {checkLocation([
            "/",
            "/post",
            "/service",
            "/chats",
            "/user",
            "/service/docLink",
            "/settings",
          ]) ? (
            <>
              <li className={style.header_li}>
                <div
                  className={`${style.block}${
                    checkLocation(["/"]) ? ` ${style.actv}` : ""
                  }`}>
                  <FontAwesomeIcon
                    icon="fa-solid fa-school"
                    className="icon"
                    onClick={() => navigateClick("/")}
                    alt="班級資訊平台icon"
                    title="[重新整理] 班級資訊平台icon"
                  />
                </div>
                <div className={style.block}>
                  <span
                    title={`當前版本：${WebVersion[0].version}`}
                    onClick={() => [navigateClick("/webUpdate")]}>
                    v{WebVersion[0].version}
                  </span>
                </div>
              </li>
              <li className={style.header_li}>
                <div
                  className={`${style.block}${
                    checkLocation(["/"]) ? ` ${style.actv}` : ""
                  }`}
                  onClick={() => navigateClick("/")}>
                  <p>首頁</p>
                </div>
                <div
                  className={`${style.block}${
                    checkLocation(["/post"]) ? ` ${style.actv}` : ""
                  }`}
                  onClick={() => navigateClick("/post")}>
                  <p>公告</p>
                  {/* {postCount && postCount - postNoti > 0 ? (
                      <span className={`postNoti`}>{postCount - postNoti}</span>
                    ) : (
                      ''
                    )} */}
                </div>
                <div
                  className={`${style.block}${
                    checkLocation(["/service", "/service/docLink"])
                      ? ` ${style.actv}`
                      : ""
                  }`}
                  onClick={() => navigateClick("/service")}>
                  <p>服務</p>
                </div>
                <div
                  className={`${style.block}${
                    checkLocation(["/chats"]) ? ` ${style.actv}` : ""
                  }`}
                  onClick={() => navigateClick("/chats")}>
                  <p>聊天</p>
                </div>
              </li>
              <li className={style.header_li}>
                <div
                  className={style.block}
                  onClick={() => navigateClick("/settings")}>
                  <FontAwesomeIcon icon="fa-solid fa-gear" />
                </div>
                <div
                  className={`${style.block}${` ${style.breach}`}${
                    checkLocation(["/user"]) ? ` ${style.actv}` : ""
                  }`}
                  onClick={() => navigateClick("/user")}>
                  <div className={style.user}>
                    {user ? (
                      <>
                        <img src={user.photoURL} alt="" />
                        <span>{user.displayName}</span>
                      </>
                    ) : (
                      <>
                        <img
                          src={`${process.env.PUBLIC_URL}/images/icons/user.png`}
                          alt="前往登入"></img>
                        <span>前往登入</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            </>
          ) : (
            <PageTitle />
          )}
        </ul>
      </div>
    </header>
  )
}
