import { useContext, useEffect, useState, Suspense } from "react"
import { useLocation } from "react-router-dom"
import { AppContext } from "../AppContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import style from "./css/Chatroom.module.scss"
import { serverTimestamp } from "firebase/firestore"

import { db, getFirestoreData, writeFirestoreDoc } from "../firebase"
import {
  arrayUnion,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore"

export default function Chatroom() {
  const location = useLocation()
  const {
    chatTo,
    setChatTo,
    setChatToWho,
    chatAnimation,
    setChatAnimation,
    setPageHeaderTitle,
    user,
  } = useContext(AppContext)
  const [selfMessages, setSelfMessages] = useState()
  const [someoneMessages, setSomeoneMessages] = useState()
  const [mergedMessages, setMergedMessages] = useState([])
  const [messageInputText, setMessageInputText] = useState("")

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(chatAnimation)
  useEffect(() => {
    setTimeout(() => {
      setPageTitleAni(false)
    }, 10)
    setChatAnimation(false)
  }, [])

  useEffect(() => {
    try {
      const selfInfo = getFirestoreData(`chats/${chatTo[0].self.uid}`)
      console.log(selfInfo)
    } catch (error) {
      console.log("Error to get self info")
    }
  }, [])

  useEffect(() => {
    const getChatToWho_string = localStorage.getItem("chatToWho")
    if (chatTo) {
      localStorage.removeItem("chatToWho")
      const dataString = JSON.stringify(chatTo)
      localStorage.setItem("chatToWho", dataString)
      // setPageHeaderTitle(chatTo[0].to.name)
      setChatToWho(chatTo)
    } else if (!chatTo && getChatToWho_string) {
      const chatToWho = JSON.parse(getChatToWho_string)
      setChatTo(chatToWho)
      // setPageHeaderTitle(chatToWho[0].to.name)
      setChatToWho(chatToWho)
    }
  }, [chatTo, location])

  // useEffect(() => {
  //   getFirestoreData(`chats/${chatTo[0].self.uid}/messages`).then(
  //     (messages) => {
  //       // console.log(messages)
  //       if (!messages || Object.keys(messages).length === 0) {
  //         writeFirestoreDoc(
  //           `chats/${chatTo[0].self.uid}/messages/${chatTo[0].to.uid}`,
  //           {}
  //         )
  //       } else {
  //         const toSomeoneMessage = messages.find(
  //           (message) => message.id === chatTo[0].to.uid
  //         )

  //         setSelfMessages(toSomeoneMessage.messages)
  //       }
  //     }
  //   )
  // }, [chatTo])

  // useEffect(() => {
  //   getFirestoreData(`chats/${chatTo[0].to.uid}/messages`).then((messages) => {
  //     // console.log(messages)
  //     if (messages || Object.keys(messages).length > 0) {
  //       const toSomeoneMessage = messages.find(
  //         (message) => message.id === chatTo[0].self.uid
  //       )

  //       setSomeoneMessages(toSomeoneMessage.messages)
  //     }
  //   })
  // }, [chatTo])

  // 獲取 自身所有訊息的列表 並 提取 與對方的對話紀錄
  useEffect(() => {
    if (chatTo) {
      const q = query(collection(db, `chats/${chatTo[0].self.uid}/messages`))

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = []
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() })
        })

        const toSomeoneMessage = messages.find(
          (message) => message.id === chatTo[0].to.uid
        )

        if (toSomeoneMessage) {
          setSelfMessages(toSomeoneMessage.messages)
        } else {
          setSelfMessages([])
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [chatTo])

  // 獲取 對方所有訊息的列表 並 提取 與自身的對話紀錄
  useEffect(() => {
    if (chatTo) {
      const q = query(collection(db, `chats/${chatTo[0].to.uid}/messages`))

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = []
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() })
        })

        const toSelfMessage = messages.find(
          (message) => message.id === chatTo[0].self.uid
        )

        if (toSelfMessage) {
          setSomeoneMessages(toSelfMessage.messages)
        } else {
          setSomeoneMessages([])
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [chatTo])

  // 將所有對話紀錄合併 並 按時間順序排序
  useEffect(() => {
    if (selfMessages || someoneMessages) {
      if (
        selfMessages
          ? selfMessages.length > 0
          : false || someoneMessages
          ? someoneMessages.length > 0
          : false
      ) {
        // 合併兩個訊息列表
        const merged = [...selfMessages, ...someoneMessages]

        merged.sort((a, b) => {
          const diffSeconds = b.timestamp.seconds - a.timestamp.seconds
          if (diffSeconds === 0) {
            return b.timestamp.nanoseconds - a.timestamp.nanoseconds
          }
          return diffSeconds
        })

        // 更新狀態
        setMergedMessages(merged)
      } else {
        setMergedMessages([])
      }
    } else {
      setMergedMessages([])
    }
  }, [selfMessages, someoneMessages])

  // 發送訊息
  const sentMessageToSomeone = (message) => {
    if (!message || message.trim().length === 0) return
    else {
      writeFirestoreDoc(
        `chats/${chatTo[0].self.uid}/messages/${chatTo[0].to.uid}`,
        {
          messages: arrayUnion({
            uid: user.uid,
            message: message,
            timestamp: new Date(),
          }),
        }
      )
    }

    setMessageInputText("")
  }

  // 時間格式化顯示
  const setDate = (date) => {
    const options = {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
    let formattedDate = date.toLocaleDateString("zh-TW", options)
    return formattedDate
  }

  // 所有訊息加載後 滾動到最新訊息
  useEffect(() => {
    const last_message = document.querySelector("div.message_block")
    if (last_message) {
      last_message.scrollIntoView({ behavior: "smooth" })
    }
  }, [mergedMessages])

  // 發送按鈕動畫
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    if (animate) {
      const button = document.querySelector(`button.${style.animate}`)
      const handleAnimationEnd = () => setAnimate(false)
      button.addEventListener("animationend", handleAnimationEnd)
      return () =>
        button.removeEventListener("animationend", handleAnimationEnd)
    }
  }, [animate])

  return (
    <div
      className={`${style.chatroom}${pageTitleAni ? ` ${style.animate}` : ""}`}>
      {chatTo && (
        <div className={style.chat_header}>
          <div className={style.user_info}>
            <img src={chatTo[0].to.headSticker} alt="" />
            <p>{chatTo[0].to.name}</p>
          </div>
        </div>
      )}
      <div className={`${style.chat_view} chat_view`}>
        {chatTo &&
          mergedMessages.length > 0 &&
          mergedMessages?.map((items, index) => (
            <Suspense fallback={<div />} key={index}>
              <div
                key={index}
                className={`message_block ${style.message_block}${
                  items.uid === user.uid ? ` ${style.my}` : ` ${style.your}`
                }`}>
                <p>{items.message}</p>
                <span className={style.message_time}>
                  {setDate(new Date(items.timestamp.seconds * 1000))}
                </span>
              </div>
            </Suspense>
          ))}
      </div>
      <div className={style.message_inputs}>
        <div className={style.text_input}>
          <textarea
            placeholder="輸入訊息"
            value={messageInputText}
            onChange={(e) => setMessageInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                if (!e.target.value || e.target.value.trim().length === 0) {
                  return
                }
                e.preventDefault()
                sentMessageToSomeone(messageInputText)
                setAnimate(true)
              }
            }}
          />
        </div>
        <div className={style.send_message}>
          <button
            title="傳送訊息"
            onClick={() => sentMessageToSomeone(messageInputText)}
            onMouseDown={() => setAnimate(true)}
            className={animate ? style.animate : ""}>
            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
          </button>
        </div>
      </div>
    </div>
  )
}
