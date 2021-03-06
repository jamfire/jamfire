// import libs
import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import { AvatarProps } from "./avatar.d"

// import components
import { FaUser } from "react-icons/fa"
import { ThemeContext } from "../../services/theme"

// import styles
import * as styles from "./avatar.module.scss"

export default ({ isLoggedIn, isLoading, profile = null }: AvatarProps) => {
  const { setToggleLogin, setToggleDashboard } = useContext(ThemeContext)

  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div
        className={styles.wrapper}
        role="region"
        aria-label={t("regions.dashboard")}
      >
        <div className={styles.avatar} id="avatar" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div
        className={styles.wrapper}
        role="region"
        aria-label={t("regions.dashboard")}
      >
        <div
          id="avatar"
          className={styles.avatar}
          onClick={() => setToggleLogin(true)}
        >
          <FaUser />
        </div>
      </div>
    )
  }

  const { photoURL, displayName } = profile || {}

  let avatarPhotoURL = ""
  let avatarDisplayName = ""

  if (photoURL) {
    avatarPhotoURL = photoURL
  }

  if (displayName) {
    avatarDisplayName = displayName
  }

  return (
    <div
      className={styles.wrapper}
      role="region"
      aria-label={t("regions.dashboard")}
      onClick={() => setToggleDashboard(true)}
    >
      <div className={styles.avatar}>
        {avatarPhotoURL && (
          <img
            role="img"
            aria-label={t("regions.avatarImage")}
            src={avatarPhotoURL}
            alt={avatarDisplayName}
            height="40"
            width="40"
          />
        )}
        {!avatarPhotoURL && <div>{avatarDisplayName.charAt(0)}</div>}
      </div>
    </div>
  )
}
