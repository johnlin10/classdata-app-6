/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { debounce } from "lodash"

import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
}
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth()
const storage = getStorage()

export function AllowUserAuth(allowedUsers, localAdres) {
  const [userPermit, setUserPermit] = useState(false)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const emailParts = user.email.split("@")
        const emailStart = emailParts[0]
        const emailDomain = emailParts[1]
        // console.log(allowedUsers.some(allowedUsers => emailStart.startsWith(allowedUsers)))
        // console.log(localAdres.includes(emailDomain))
        if (
          (emailStart ===
            (process.env.REACT_APP_ADMIN || process.env.REACT_APP_SYSEM) &&
            emailDomain === process.env.REACT_APP_ADMIN_ADRES) ||
          (allowedUsers.some((allowedUsers) =>
            emailStart.startsWith(allowedUsers)
          ) &&
            localAdres.includes(emailDomain))
        ) {
          setUserPermit(true)
        }
      } else {
        setUserPermit(false)
      }
    })
    return unsubscribe
  }, [allowedUsers, localAdres])

  return userPermit
}

/**
 * 驗證登入用戶帳號資訊是否符合傳入的 uid, email, email domain 任一項
 * @param {Array} uids
 * @param {Array} emails
 * @param {Array} emailDomains
 * @returns {boolean} - 驗證狀態， true 代表通過
 * @example
 *  const pubArticleUID = [
      process.env.REACT_APP_19_POST,
      process.env.REACT_APP_ADMIN_ACCOUNT,
    ]
    const pubArticleEmails = null
    const pubArticleEmailDomains = [process.env.REACT_APP_SCHOOL_EMAIL]
    // 驗證
    const pubArticle = isUserAuthorized(
      pubArticleUID,
      pubArticleEmails,
      pubArticleEmailDomains
    )
 */
export function isUserAuthorized(uids, emails, emailDomains) {
  const auth = getAuth()
  const user = auth.currentUser

  // 判斷是否符合開放條件
  if (user) {
    // 使用者已登入
    if (uids !== null) {
      for (const uid of uids) {
        if (uid && uid === user.uid) {
          // 符合 UID
          return true
        }
      }
    }

    if (emails !== null) {
      for (const email of emails) {
        if (email && email === user.email) {
          // 符合 Email
          return true
        }
      }
    }

    if (emailDomains !== null) {
      for (const emailDomain of emailDomains) {
        if (emailDomain && user.email.endsWith(emailDomain)) {
          // 符合 Email 後綴
          return true
        }
      }
    }
  }

  // 不符合開放條件
  return false
}

/**
 * 根據給定的路徑自動辨識並獲取 Firestore 中的 collection 或 document 内容
 * @param {string} path - collection 或 document 的路徑
 * @returns {Promise<Array|Object>} - 如果是 collection 返回文檔數組，如果是 document 返回内容對象
 */
export const getFirestoreData = async (path) => {
  // 切割路徑以確定是 document 還是 collection
  const pathSegments = path.split("/").filter(Boolean) // 過濾掉空字符串
  const isDocument = pathSegments.length % 2 !== 0 // 奇數段表示 document，偶數段表示 collection

  if (!isDocument) {
    // 嘗試作為 document 路徑獲取數據
    const docRef = doc(db, path)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // 如果是 document，返回其内容
      return docSnap.data()
    } else {
      // 如果 document 不存在，返回 null 或抛出錯誤
      console.error("Document does not exist at this path:", path)
      return null
    }
  } else {
    // 嘗試作為 collection 路徑獲取數據
    const colRef = collection(db, path)
    const querySnapshot = await getDocs(colRef)

    // 返回 collection 中所有 documents 的内容
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }
}

/**
 * 將內容存入或更新某個文檔中
 * @param {string} path - 文檔路徑
 * @param {Array} data - 欲存入的內容
 * @param {boolean} [overwrite] - 是否覆蓋
 * @example
 * // 覆蓋文檔的內容
 * await writeFirestoreDoc('my-doc', { name: 'John', age: 30 }, true);
 * // 更新文檔的部分內容
 * await writeFirestoreDoc('my-doc', { age: 31 }, false);
 */
export const writeFirestoreDoc = async (path, data, overwrite = false) => {
  const segments = path.split("/").filter((s) => s.length > 0) // 过滤空字符串
  const docRef = doc(db, ...segments) // 使用展开运算符构建文档引用

  try {
    const docSnapshot = await getDoc(docRef)
    if (overwrite || !docSnapshot.exists()) {
      // 如果设置为覆盖或文档不存在，则创建或覆盖文档
      await setDoc(docRef, data)
    } else {
      // 如果文档已存在且不覆盖，则更新文档
      await updateDoc(docRef, data)
    }
  } catch (error) {
    console.error("Error writing document: ", error)
    throw error // 抛出错误以便可以在调用函数时捕获
  }
}

/**
 * 從 Storage 路徑轉換為文件實際 URL
 * @param {string} path 文件在 Storage 的路徑
 * @returns
 */
export function getFileUrl(path) {
  const photoRef = ref(storage, path)
  const url = getDownloadURL(photoRef)
  return url
}
