import { useEffect, useState } from "react"
import { getFileUrl } from "../firebase"

export default function Photo(props) {
  const [photoAlbums, setPhotoAlbums] = useState([])

  useEffect(() => {
    const updatedPhotoAlbums = []
    for (let i = 1; i < 191; i++) {
      getFileUrl(`images/dreamingOfFlying/DreamingOfFlying_${i}.avif`)
        .then((photoUrl) => {
          const photoInfo = { name: i, url: photoUrl }
          updatedPhotoAlbums.push(photoInfo)

          if (updatedPhotoAlbums.length === 189) {
            console.log(updatedPhotoAlbums)
            setPhotoAlbums([...photoAlbums, ...updatedPhotoAlbums])
          }
        })
        .catch((error) => {
          console.error(`获取照片链接时出错:`, error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main>
      {photoAlbums.map((item, index) => (
        <img src={item.url} alt={item.name} key={index} width="10%" />
      ))}
    </main>
  )
}
