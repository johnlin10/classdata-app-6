/* eslint-disable no-unused-vars */
// React
import React, { useEffect, useState, useRef, useContext } from "react"
import {
  useNavigate,
  Navigate,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom"
import { AppContext } from "../AppContext"
import { Helmet } from "react-helmet"
// CSS
import "../App.scss"
import css from "./css/Chats.module.scss"

// Widget
import PageTitle from "../widgets/PageTitle"

// Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore"
import { db, auth, getFirestoreData, writeFirestoreDoc } from "../firebase"

export default function Chats(props) {
  const location = useLocation()
  const {
    user,
    chatTo,
    setChatTo,
    chatAnimation,
    setChatAnimation,
    setPageHeaderTitle,
  } = useContext(AppContext)
  const [chatsList, setChatsList] = useState([])
  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const schoolUsers = [
    process.env.REACT_APP_SCHOOL_USER1,
    process.env.REACT_APP_SCHOOL_USER2,
    process.env.REACT_APP_SCHOOL_USER3,
  ]
  const adminUsers = [process.env.REACT_APP_ADMIN, process.env.REACT_APP_SYSEM]
  const otherUsers = [process.env.REACT_APP_CHAT_01]

  //
  const [schoolUserList, setSchoolUserList] = useState([])
  useEffect(() => {
    // 获取数据
    const chatGroupDataRef = collection(db, "user")
    const unsubscribe = onSnapshot(chatGroupDataRef, (querySnapshot) => {
      const users = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (
          (schoolUsers.some((user) => data.email.startsWith(user)) &&
            data.email.endsWith(process.env.REACT_APP_SCHOOL_EMAIL)) ||
          adminUsers.some((user) => data.email.startsWith(user)) ||
          otherUsers.some((user) => data.uid.startsWith(user))
        ) {
          users.push(data)
        }
      })
      setSchoolUserList(users)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // 获取数据
    const chatsRef = collection(db, "chats")
    const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        setChatsList(data)
      })
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      const selfChats = getFirestoreData(`chats/${user.uid}`)
      if (selfChats) {
        writeFirestoreDoc(`chats/${user.uid}`, {
          // name: user.displayName,
          uid: user.uid,
        })
      }
    }
  }, [chatsList])

  const chatToSomeone = (someoneData) => {
    let someone = {}
    getFirestoreData(`chats/${someoneData.uid}`)
      .then((data) => {
        if (!data || Object.keys(data).length === 0 || data === null) {
          writeFirestoreDoc(`chats/${someoneData.uid}`, {
            name: someoneData.name,
            uid: someoneData.uid,
            headSticker: someoneData.headSticker,
          })
          console.log("該用戶尚未創建檔案，現已為該用戶建立！")
        } else {
          if (location.pathname === "/chats") setChatAnimation(true)
          props.navigateClick("/chats")
          setChatTo([{ self: user, to: data }])
          props.navigateClick("/chats/chatroom")
          // setPageHeaderTitle(someoneData.name)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <>
      <Helmet>
        <title>班級資訊平台｜聊天</title>
        <meta name="description" content="提供學校內部交流的管道" />
        <meta property="og:title" content="班級資訊平台｜聊天" />
        <meta property="og:description" content="提供學校內部交流的管道" />
      </Helmet>
      <main
        className={`${css.main}${` ${props.theme}`}${
          props.theme && props.settingPage ? " " : ""
        }${props.settingPage ? "settingOpen" : ""}${
          props.checkLocation(["/chats/chat-group", "/chats/chatroom"])
            ? ` ${css.actv}`
            : ""
        }`}>
        <div className={`view${pageTitleAni ? " PTAni" : ""}`}>
          {user ? (
            <>
              <div className={css.chats_list}>
                <h3>群組</h3>
                <section>
                  <div
                    className={`${css.chatlist_block}${
                      props.checkLocation(["/chats/chat-group"])
                        ? ` ${css.actv}`
                        : ""
                    }`}
                    onClick={() => props.navigateClick("/chats/chat-group")}>
                    <div>
                      <p>公共討論區</p>
                    </div>
                  </div>
                </section>
                <h3>個人訊息</h3>
                <section>
                  {schoolUserList.map((list) => (
                    <div
                      className={`${css.chatlist_block}${
                        chatTo
                          ? list.uid === chatTo[0].to.uid &&
                            props.checkLocation(["/chats/chatroom"])
                            ? ` ${css.actv}`
                            : ""
                          : ""
                      }`}
                      onClick={() => chatToSomeone(list)}>
                      <img src={list.headSticker} alt="" />
                      <div>
                        <p>{list.name}</p>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
              <Outlet />
            </>
          ) : (
            <h3>尚未登入</h3>
          )}
        </div>
      </main>
    </>
  )
}
