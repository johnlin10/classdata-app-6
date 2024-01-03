import { useEffect, useState } from "react"
import css from "./css/PageCtrlModule.module.scss"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareUpRight } from "@fortawesome/free-solid-svg-icons"

export default function PageCtrlModule({ buttons }) {
  const hasbutton = buttons?.filter((button) => button.prmsn).length > 0
  const hasSingleButton = buttons?.length === 1

  // 組件動畫
  const [widgetTitleAni, setWidgetTitleAni] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setWidgetTitleAni(false)
    }, 100)
  }, [])

  return (
    <>
      {hasbutton && (
        <div
          className={`${css.view}${widgetTitleAni ? ` ${css.animation}` : ""}${
            hasSingleButton ? ` ${css.single}` : ""
          }`}>
          {buttons && (
            <div className={`${css.btnGroup}`}>
              {buttons?.map((item, index) => {
                return (
                  <>
                    {item.prmsn && (
                      <button
                        className={`${css[item.type]}${
                          item.actv ? ` ${css.actv}` : ""
                        }`}
                        onClick={item.click}
                        key={index}>
                        {item.icon[1]
                          ? item.actv
                            ? item.icon[0]
                            : item.icon[1]
                          : item.icon[0]}
                        <span>{item.content}</span>
                        {item.type === "link" && (
                          <FontAwesomeIcon
                            className={css.link}
                            icon={faSquareUpRight}
                          />
                        )}
                      </button>
                    )}
                  </>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
