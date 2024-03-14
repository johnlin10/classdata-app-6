import React, { useEffect, useState } from "react"
import style from "./style.module.scss"
import worldScenery from "./data/worldScenery.json"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function WorldScenery() {
  const [randomScenery, setRandomScenery] = useState(null)

  const selectRandomScenery = () => {
    const lastSelectedDate = localStorage.getItem("lastSelectedDate")
    const currentDate = new Date().toISOString().substr(0, 10)

    if (lastSelectedDate !== currentDate) {
      const randomIndex = Math.floor(
        Math.random() * worldScenery[0].worldScenery.length
      )
      const selectedScenery = worldScenery[0].worldScenery[randomIndex] //
      setRandomScenery(selectedScenery)
      localStorage.setItem("lastSelectedDate", currentDate)
      localStorage.setItem(
        "lastSelectedScenery",
        JSON.stringify(selectedScenery)
      )
    } else {
      setRandomScenery(JSON.parse(localStorage.getItem("lastSelectedScenery")))
    }
  }

  useEffect(() => {
    const lastSelectedDate = localStorage.getItem("lastSelectedDate")
    const currentDate = new Date().toISOString().substr(0, 10)

    if (lastSelectedDate === currentDate) {
      const lastSelectedScenery = localStorage.getItem("lastSelectedScenery")
      if (lastSelectedScenery) {
        setRandomScenery(JSON.parse(lastSelectedScenery))
        return
      }
    }

    selectRandomScenery()
  }, [])

  return (
    <>
      {randomScenery && (
        <div
          className={style.view}
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/homePageBG/${randomScenery.info[0].photoURL})`,
          }}
          key={randomScenery}>
          <div className={style.container}>
            <div className={style.topContent}>
              <a
                href={randomScenery.info[0].locationURL}
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon="fa-solid fa-location-dot"
                  style={{ marginRight: "6px" }}
                />
                {randomScenery.location}
              </a>
            </div>
            <div className={style.bottomContent}>
              <h1>{randomScenery.scenery}</h1>
              <h5>{randomScenery.description}</h5>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WorldScenery
