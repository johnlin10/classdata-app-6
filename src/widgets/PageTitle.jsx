// React
import React, { useEffect, useState, useContext } from "react"
import { AppContext } from "../AppContext"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
// css
import css from "./css/PageTitle.module.scss"
import ContentTabs from "./ContentTabs"

import { getPageName } from "../General/GeneralFunction"
import { useNavigate } from "react-router-dom"

export default function PageTitle() {
  const {
    pageHeaderTitle,
    setPageHeaderTitle,
    globalLocation,
    pageSelectTabs,
  } = useContext(AppContext)
  const [pageTitle, setPageTitle] = useState("")
  const [chatPhoto, setChatPhoto] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // 獲取當前頁面對應標題
    if (!globalLocation) return
    const title = getPageName(globalLocation.pathname)

    if (title === null) {
      setPageTitle(pageHeaderTitle)
    } else {
      setPageTitle(title)
    }
  }, [globalLocation, pageHeaderTitle])

  return (
    <>
      <li className={`${css.pageli}`}>
        <div className={`${css.block}`}>
          <button
            onClick={() => {
              setPageHeaderTitle("")
              setChatPhoto()
              navigate(-1)
            }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className={`${css.block} ${css.title}`}>
          {chatPhoto ? <img src={chatPhoto} alt={pageTitle}></img> : ""}
          <p>{pageTitle}</p>
        </div>
      </li>
      {pageSelectTabs && (
        <ContentTabs
          onTop={pageSelectTabs.onTop}
          options={pageSelectTabs.options}
          onChange={pageSelectTabs.onChange}
          selected={pageSelectTabs.selected}
        />
      )}
    </>
  )
}
