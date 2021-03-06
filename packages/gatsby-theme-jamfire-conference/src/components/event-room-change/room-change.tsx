// import libs
import React, { useContext } from "react"
import { navigate } from "gatsby"
import { useTranslation } from "react-i18next"
import { RoomChangeProps } from "./room-change.d"

// import components
import { EventContext } from "../../services/event"
import { ThemeContext } from "../../services/theme"
import { Modal, ModalButton } from "../modal"

export default ({ config }: RoomChangeProps) => {
  const { roomModal, toggleRoomModal, setActiveRoom } = useContext(EventContext)

  const { pagePath } = useContext(ThemeContext)

  const { t } = useTranslation()

  // modal is active
  return (
    <Modal
      id="room-change-modal"
      isActive={roomModal}
      title={t("event.rooms.title")}
      setIsActive={toggleRoomModal}
      config={config}
    >
      <>
        <p>{t("event.rooms.alert")}</p>
        <ModalButton
          className="confirm"
          label={t("buttons.yes")}
          onClick={() => {
            console.log("leave")
            toggleRoomModal(!roomModal)
            setActiveRoom(false)
            navigate(pagePath)
          }}
        />
        <ModalButton
          className="cancel"
          label={t("buttons.cancel")}
          onClick={() => {
            console.log("cancel")
            toggleRoomModal(!roomModal)
          }}
        />
      </>
    </Modal>
  )
}
