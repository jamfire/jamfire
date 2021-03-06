// import libs
import React, { useContext, useState, useEffect } from "react"
import { jamfireSet, jamfireGet } from "../../services"
import { checkIsClient } from "../../utils/check-is-client"
import { GeolocationProviderProps } from "./geolocation"
import firebase from "firebase/compat/app"

// import components
import { EventContext } from "../event"
import { GeolocationContext, initialState } from "./"
import { FirebaseContext } from "../"

export default ({
  children,
  pageContext,
  providerEnabled,
}: GeolocationProviderProps) => {
  // provider not enabled, return only the children
  if (!providerEnabled) {
    return <>{children}</>
  }

  const { geolocation, setGeolocation } = useContext(EventContext)

  // state
  const [geolocationEnabled, setGeolocationEnabled] = useState(
    initialState.geolocationEnabled
  )
  const [modal, toggleModal] = useState(initialState.modal)

  // is client
  const isClient = checkIsClient()

  // firestore && user information
  const { firestore, isLoading } = useContext(FirebaseContext)

  const geolocationSetting = `enableGeolocation-${pageContext.slug}`
  const geolocationSettingDocId = `geoId-${pageContext.slug}`

  useEffect(() => {
    const geoEnabled = jamfireGet(geolocationSetting)
    if (geoEnabled == null) {
      toggleModal(true)
    } else {
      setGeolocationEnabled(geoEnabled === "true" ? true : false)
    }
  }, [])

  useEffect(() => {
    const geolocationDocId = jamfireGet(geolocationSettingDocId)
    if (geolocationDocId) {
      return
    }

    if (isClient && !isLoading && geolocation === null && geolocationEnabled) {
      let url = "/api/gatsby-theme-jamfire-conference/lookup"

      fetch(url)
        .then(res => res.json())
        .then(response => {
          if (response.status !== "fail") {
            const geolocationData = {
              created_at: firebase.firestore.Timestamp.now(),
              slug: pageContext.slug,
              lat: response.lat,
              lon: response.lon,
              key: `${response.countryCode}_${response.region}_${response.city}`.toLocaleLowerCase(),
            }

            setGeolocation(geolocationData)

            firestore
              ?.collection("geolocation")
              .add(geolocationData)
              .then(docRef => {
                console.log("Document written with ID: ", docRef.id)
                jamfireSet(geolocationSettingDocId, docRef.id)
              })
              .catch(error => {
                console.log("Error adding document: ", error)
              })
          } else {
            setGeolocation(null)
          }
        })
        .catch(error => {
          console.log(error)
          setGeolocation(null)
        })
    }
  }, [geolocationEnabled])

  // enable geolocation
  const enableGeolocation: (enable: boolean) => void = enable => {
    console.log("geolocation enabled: ", enable)
    setGeolocationEnabled(enable)
    jamfireSet(geolocationSetting, enable ? "true" : "false")
    // remove the geolocationSettingDocId
    if (!enable) {
      setGeolocation(null)
      // delete the id from firebase
      const docId = jamfireGet(geolocationSettingDocId)
      if (docId) {
        firestore?.collection("geolocation").doc(docId).delete()
      }
      // remove the id from localstorage
      jamfireSet(geolocationSettingDocId, "")
    }
    toggleModal(false)
  }

  return (
    <GeolocationContext.Provider
      value={{
        geolocation,
        geolocationEnabled,
        modal,
        toggleModal,
        enableGeolocation,
      }}
    >
      {/* <GeolocationModal
        config={config}
        isActive={modal}
        setIsActive={toggleModal}
        enableGeolocation={enableGeolocation}
      /> */}
      {children}
    </GeolocationContext.Provider>
  )
}
