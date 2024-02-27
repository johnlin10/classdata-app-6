// AppContext.js
import React, { createContext, useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestoreData } from "./firebase"
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

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // 帳號驗證
  const [user, setUser] = useState(null)
  const [adminPermit, setAdminPermit] = useState(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userInfo) => {
      setUser(userInfo)
    })
    return () => unsubscribe()
  }, [])

  // 正在向誰聊天
  const [chatTo, setChatTo] = useState()
  const [chatToWho, setChatToWho] = useState()
  const [chatAnimation, setChatAnimation] = useState(false)

  const [pageHeaderTitle, setPageHeaderTitle] = useState("")

  // 用戶公私鑰
  const [publicKey, setPublicKey] = useState()
  const [privateKey, setPrivateKey] = useState()

  // 打包狀態和狀態設置函數
  const value = {
    user,
    adminPermit,
    publicKey,
    setPublicKey,
    privateKey,
    setPrivateKey,
    pageHeaderTitle,
    setPageHeaderTitle,
    chatTo,
    setChatTo,
    chatToWho,
    setChatToWho,
    chatAnimation,
    setChatAnimation,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
