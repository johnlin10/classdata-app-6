/**
 * 將 location path 尋找資料庫對應的頁面名稱
 * @param {string} path - location path，用於從 pageName 中尋找對應頁面名稱
 * @returns {string} - 對應 location path 的頁面名稱
 */
export function getPageName(path) {
  // 頁面名稱對照表
  const pageName = [
    { path: "/", pageName: "首頁" },
    { path: "/post", pageName: "公告" },
    { path: "/service", pageName: "服務" },
    { path: "/chats", pageName: "聊天" },
    { path: "/chats/chatroom", pageName: "聊天室" },
    { path: "/chats/chat-group", pageName: "聊天室" },
    { path: "/webUpdate", pageName: "網站更新" },
    { path: "/service/courseSchedule", pageName: "課程表" },
    { path: "/service/examSchedule", pageName: "考程表" },
    { path: "/service/youtube-player", pageName: "YouTube 播放器" },
    { path: "/secretPage/music", pageName: "音樂" },
    { path: "/secretPage/classroomStatus", pageName: "班級即時狀態" },
    { path: "/photo", pageName: "相片" },
    { path: "/articles", pageName: "文章" },
  ]
  for (const item of pageName) {
    if (item.path === path) {
      return item.pageName
    }
  }
  return null
}
