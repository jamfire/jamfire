// import libs
import React, { useContext, useState, useEffect } from "react"
import loadable from "@loadable/component"
import { useTranslation } from "react-i18next"
import { LayoutProps } from "./_props"
import "../../gatsby/fragments"

// import components
import { Context } from "../../services/theme"
import { StyledLayout } from "./_styles"
import GlobalStyles from "../global-styles"
import Seo from "../seo"
import Header from "../site-header"
import Navigation from "../site-navigation"
import Footer from "../site-footer"

// loadable components
const LoginModal = loadable(() => import("../user/login-modal"))
const Main = loadable(() => import("../site-main"))
const CookieNotice = loadable(() => import("../cookies/cookie-notice"))
const ManageCookies = loadable(() => import("../cookies/manage-cookies"))
const LocaleModal = loadable(() => import("../locale/locale-modal"))

export default ({
  children,
  title = null,
  config,
  cookies,
  event = null,
  headerLogo = null,
  favicon = null,
  useHeaderTitle = false,
  locale,
}: LayoutProps) => {
  const {
    navigation,
  } = useContext(Context)

  const { ready } = useTranslation()

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(ready)
  }, [ready])

  if (!loaded) {
    return <></>
  }
  
  return (
    <StyledLayout id="layout">
      <Seo activeTitle={title} activeFavicon={favicon} config={config} />
      <GlobalStyles config={config} />
      <Header
        config={config}
        headerLogo={headerLogo}
        title={useHeaderTitle ? title : null}
        locale={locale}
      />
      <Navigation navigation={navigation} config={config} />
      <Main>{children}</Main>
      <Footer config={config} event={event} />
      <LoginModal config={config} />
      <LocaleModal config={config} />
      <CookieNotice cookies={cookies} config={config} />
      <ManageCookies cookies={cookies} config={config} />
    </StyledLayout>
  )
}