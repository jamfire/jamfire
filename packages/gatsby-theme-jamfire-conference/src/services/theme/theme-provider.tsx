// import libs
import React, { useState, useEffect } from "react"
import { jamfireSet, jamfireGet } from ".."
import { useCookies } from "react-cookie"
import { ProviderProps } from "./_props"

// import components
import { ThemeContext, initialState } from "./theme-context"

export default ({ children }: ProviderProps) => {

  // cookies
  const [ , setCookies, removeCookies] = useCookies(["cookies"])

  // state
  const [darkMode, setDarkMode] = useState(initialState.darkMode)
  const [toggle, setToggle] = useState(initialState.toggle)
  const [toggleLogin, setToggleLogin] = useState(initialState.toggleLogin)
  const [navigation, setNavigation] = useState(initialState.navigation)
  const [user, setUser] = useState(initialState.user)
  const [activeRoom, setActiveRoom] = useState(initialState.activeRoom)
  const [roomModal, toggleRoomModal] = useState(initialState.roomModal)
  const [chats, setChats] = useState(initialState.chats)
  const [pagePath, setPagePath] = useState(initialState.pagePath)
  const [toggleCookies, setToggleCookies] = useState(initialState.toggleCookies)
  const [enableAnalytics, setEnableAnalytics] = useState(
    initialState.enableAnalytics
  )
  const [toggleLocale, setToggleLocale] = useState(initialState.toggleLocale)
  const [localesEnabled] = useState(initialState.localesEnabled)

  // get initial dark mode
  useEffect(() => {
    const dm: string = jamfireGet("darkMode")

    if (dm === null && typeof window !== `undefined`) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return setDarkMode(true)
      } else {
        return setDarkMode(false)
      }
    }

    const isDarkMode: boolean = dm === "true"
    return setDarkMode(isDarkMode)
  }, [])

  // update local storage
  useEffect(() => {
    jamfireSet("darkMode", darkMode ? "true" : "false")
  }, [darkMode])

  // set analytics preference
  useEffect(() => {
    const analyticsEnabled = jamfireGet("analyticsEnabled")
    setEnableAnalytics(analyticsEnabled === "true" ? true : false)
  }, [])

  // enabled analytics cookies
  useEffect(() => {
    if (enableAnalytics) {
      setCookies("gatsby-gdpr-google-analytics", true, {
        path: "/",
      })
      setCookies("gatsby-gdpr-google-tagmanager", true, {
        path: "/",
      })
      setCookies("gatsby-gdpr-facebook-pixel", true, {
        path: "/",
      })
    } else {
      removeCookies("gatsby-gdpr-google-analytics")
      removeCookies("gatsby-gdpr-google-tagmanager")
      removeCookies("gatsby-gdpr-facebook-pixel")
    }
  }, [enableAnalytics])

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggle,
        setToggle,
        toggleLogin,
        setToggleLogin,
        navigation,
        setNavigation,
        user,
        setUser,
        activeRoom,
        setActiveRoom,
        roomModal,
        toggleRoomModal,
        chats,
        setChats,
        pagePath,
        setPagePath,
        toggleCookies,
        setToggleCookies,
        enableAnalytics,
        setEnableAnalytics,
        toggleLocale,
        setToggleLocale,
        localesEnabled
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}