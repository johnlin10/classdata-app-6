// AppContext.js
import React, { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // 網站
  const [globalLocation, setGlobalLocation] = useState()
  const [pageSelectTabs, setPageSelectTabs] = useState()

  const [globalError, setGlobalError] = useState("")
  const [globalErrorIcon, setGlobalErrorIcon] = useState()

  // 帳號驗證
  const [user, setUser] = useState(null)

  // 正在向誰聊天
  const [chatTo, setChatTo] = useState()
  const [chatAnimation, setChatAnimation] = useState(false)
  const [pageHeaderTitle, setPageHeaderTitle] = useState("")

  // 用戶公私鑰
  const [publicKey, setPublicKey] = useState()
  const [privateKey, setPrivateKey] = useState()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userInfo) => {
      setUser(userInfo)
    })
    return () => unsubscribe()
  }, [])

  // 打包狀態和狀態設置函數
  const value = {
    // 網站
    db,
    pageSelectTabs,
    setPageSelectTabs,
    globalLocation,
    setGlobalLocation,
    globalError,
    setGlobalError,
    globalErrorIcon,
    setGlobalErrorIcon,

    // 用戶
    user, // 用戶資料
    publicKey, // 公鑰
    setPublicKey,
    privateKey, // 私鑰
    setPrivateKey,

    // 聊天
    // 聊天室標題
    pageHeaderTitle,
    setPageHeaderTitle,
    // 正在向誰傳訊息，「誰」的資料
    chatTo,
    setChatTo,
    // 聊天室動畫狀態
    chatAnimation,
    setChatAnimation,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
