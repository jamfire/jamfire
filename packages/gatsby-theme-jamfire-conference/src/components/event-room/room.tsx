/**
 * Docs
 *
 * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe
 */

// import libs
import React, { useContext, useEffect, useState } from "react"
import { DateTime } from "luxon"
import { useMatch } from "@reach/router"
import { DEFAULT_LOCALE } from "../../utils/constants"
import { RoomProps } from "./room.d"

// import components
import { EventContext } from "../../services/event"
import Missing from "../missing"

// import styles
import * as styles from "./room.module.scss"

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default ({ config, event, locale, user }: RoomProps) => {
  const { slug, title, eventInformation, eventRooms } = event?.frontmatter || {}

  const { startTime } = eventInformation || {}

  if (!eventRooms) {
    return (
      <div className={styles.jitsiContainer}>
        <Missing />
      </div>
    )
  }

  const { setActiveRoom } = useContext(EventContext)

  const matchString =
    locale === DEFAULT_LOCALE
      ? `/event/${slug}/rooms/:room`
      : `/${locale}/event/${slug}/rooms/:room`

  const match = useMatch(matchString)

  const eventRoom = eventRooms.find(room => room?.slug === match?.room)

  // parse date
  const luxonDate = DateTime.fromISO(startTime?.datetime)

  const jitsiRoom = `${eventRoom?.slug}-${luxonDate.toFormat("yyyy LLL dd")}`

  const jitsiContainerId = "jitsi-container-id"

  const [jitsi, setJitsi] = useState({})

  const loadJitsiScript = () => {
    let resolveLoadJitsiScriptPromise = null

    const loadJitsiScriptPromise = new Promise(resolve => {
      resolveLoadJitsiScriptPromise = resolve
    })

    const script = document.createElement("script")
    script.src = `https://meet.jit.si/external_api.js`
    script.async = true
    script.onload = resolveLoadJitsiScriptPromise
    document.body.appendChild(script)

    return loadJitsiScriptPromise
  }

  const initilizeJitsi = async (cb?: any) => {
    if (!window.JitsiMeetExternalAPI) {
      await loadJitsiScript()
    }

    let options: any = {}

    options.parentNode = document.getElementById(jitsiContainerId)
    options.roomName = jitsiRoom

    options.configOverwrite = {
      disableDeepLinking: true,
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      enableNoisyMicDetection: false,
      enableClosePage: false,
      enableWelcomPage: false,
      enableLayerSuspension: true,
      resolution: 480,
      constraints: {
        video: {
          height: {
            ideal: 480,
            max: 480,
            min: 240,
          },
        },
      },
      disableH264: true,
      liveStreamingEnabled: false,
      videoQuality: {
        disabledCodec: "H264",
      },
      requireDisplayName: true,
      disableInviteFunctions: true,
      doNotStoreRoom: true,
      notice:
        "If your web conference becomes unstable, try disabling your video.",
      toolbarButtons: [
        "camera",
        "chat",
        "closedcaptions",
        "desktop",
        // 'download',
        // 'embedmeeting',
        "etherpad",
        "feedback",
        "filmstrip",
        // 'fullscreen',
        // 'hangup',
        "help",
        // 'invite',
        // 'livestreaming',
        "microphone",
        "mute-everyone",
        "mute-video-everyone",
        "participants-pane",
        "profile",
        "raisehand",
        "recording",
        // 'security',
        "select-background",
        "settings",
        // 'shareaudio',
        // 'sharedvideo',
        "shortcuts",
        "stats",
        "tileview",
        "toggle-camera",
        "videoquality",
        "__end",
      ],
      toolbarConfig: {
        alwaysVisible: false,
        initialTimeout: 5000,
        timeout: 3000,
      },
    }
    options.interfaceConfigOverwrite = {
      MOBILE_APP_PROMO: false,
      TILE_VIEW_MAX_COLUMNS: 5,
      CONNECTION_INDICATOR_DISABLED: true,
      DEFAULT_LOCAL_DISPLAY_NAME: "me",
      DISABLE_VIDEO_BACKGROUND: true,
      RECENT_LIST_ENABLED: false,
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      TOOLBAR_ALWAYS_VISIBLE: false,
      SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    }

    if (user) {
      options.userInfo = {
        email: user.email,
        displayName: user.displayName,
      }
    }

    const _jitsi = new window.JitsiMeetExternalAPI("meet.jit.si", options)

    setJitsi(_jitsi)
  }

  useEffect(() => {
    initilizeJitsi()

    setActiveRoom(true)

    // @ts-ignore
    return () => jitsi?.dispose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className={styles.jitsiContainer} id={jitsiContainerId} />
}
