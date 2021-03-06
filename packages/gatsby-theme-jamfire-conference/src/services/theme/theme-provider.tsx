// import libs
import React, { useState, useEffect } from "react"
import { jamfireSet, jamfireGet } from ".."
import { useCookies } from "react-cookie"
import { ProviderProps } from "./theme.d"
import { DateTime } from "luxon"

// import components
import { ThemeContext, initialState } from "./theme-context"

export default ({ children }: ProviderProps) => {
  // cookies
  const [, setCookies, removeCookies] = useCookies([
    "gatsby-gdpr-google-analytics",
    "gatsby-gdpr-google-tagmanager",
    "gatsby-gdpr-facebook-pixel",
  ])

  // state
  const [darkMode, setDarkMode] = useState(initialState.darkMode)
  const [toggle, setToggle] = useState(initialState.toggle)
  const [toggleLogin, setToggleLogin] = useState(initialState.toggleLogin)
  const [toggleDashboard, setToggleDashboard] = useState(
    initialState.toggleDashboard
  )
  const [navigation, setNavigation] = useState(initialState.navigation)
  const [user, setUser] = useState(initialState.user)
  const [pagePath, setPagePath] = useState(initialState.pagePath)
  const [toggleCookies, setToggleCookies] = useState(initialState.toggleCookies)
  const [enableAnalytics, setEnableAnalytics] = useState(
    initialState.enableAnalytics
  )
  const [toggleLocale, setToggleLocale] = useState(initialState.toggleLocale)
  const [localesEnabled] = useState(initialState.localesEnabled)

  // set dark mode
  useEffect(() => {
    const dm: string = jamfireGet("darkMode")
    const isDarkMode: boolean = dm === "true"
    return setDarkMode(isDarkMode)
  }, [])

  // update local storage
  useEffect(() => {
    const cookiesAccepted: string = jamfireGet("cookiesAccepted")
    const cookiesEnabled: boolean = cookiesAccepted === "true"

    if (cookiesEnabled) {
      jamfireSet("darkMode", darkMode ? "true" : "false")
    }
  }, [darkMode])

  // set analytics preference
  useEffect(() => {
    const analyticsEnabled = jamfireGet("analyticsEnabled")
    setEnableAnalytics(analyticsEnabled === "true" ? true : false)
  }, [])

  // enabled analytics cookies
  useEffect(() => {
    console.log("analytics: ", enableAnalytics)
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
        toggleDashboard,
        setToggleDashboard,
        navigation,
        setNavigation,
        user,
        setUser,
        pagePath,
        setPagePath,
        toggleCookies,
        setToggleCookies,
        enableAnalytics,
        setEnableAnalytics,
        toggleLocale,
        setToggleLocale,
        localesEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
