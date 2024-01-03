// React
import React, { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
// css
import css from "./css/PageTitle.module.scss"
import ContentTabs from "./ContentTabs"
import { AppContext } from "../AppContext"

export default function PageTitle(props) {
  const location = useLocation()
  const { chatToWho, setChatToWho, pageHeaderTitle, setPageHeaderTitle } =
    useContext(AppContext)
  const [pageTitleAni, setPageTitleAni] = useState(true)
  const [pageTitle, setPageTitle] = useState("")
  const [chatPhoto, setChatPhoto] = useState("")
  useEffect(() => {
    setPageTitleAni(false)
  }, [])
  useEffect(() => {
    const title = props.checkPageName(props.location.pathname)
    if (title === null) {
      setPageTitle(pageHeaderTitle)
    } else {
      setPageTitle(title)
    }
    // if (chatToWho && location.pathname === "/chats/chatroom") {
    //   console.log(chatToWho[0].to)
    //   console.log(chatToWho[0].to.headSticker)
    //   setChatPhoto(chatToWho[0].to.headSticker)
    // }
  }, [location])
  return (
    <>
      <li className={`${css.pageli}${` ${props.isDark && css.dark}`}`}>
        <div className={`${css.block}`}>
          <button
            onClick={() => {
              setPageHeaderTitle("")
              setChatPhoto()
              window.history.back()
            }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className={`${css.block} ${css.title}`}>
          {chatPhoto ? <img src={chatPhoto} alt={pageTitle}></img> : ""}
          <p>{pageTitle}</p>
        </div>
      </li>
      {props.tabs && (
        <ContentTabs
          isDark={props.isDark}
          onTop={props.tabs.onTop}
          options={props.tabs.options}
          onChange={props.tabs.onChange}
          selected={props.tabs.selected}
        />
      )}
    </>
  )
}
