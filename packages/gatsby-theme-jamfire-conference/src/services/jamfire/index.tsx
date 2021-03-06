/**
 * Jamfire Conference settings
 *
 * Using localStorage for populating application state
 */
import { checkIsClient } from "../../utils/check-is-client"
import * as storage from "../../utils/storage"

// for window checking
const isClient: boolean = checkIsClient()

// private get jamfire settings
const getJamfireSettings = () => {
  if (isClient) {
    let settings: string | null =
      storage.local.getItem("jamfireSettings") || null
    let jamfireSettings = null
    if (settings === null) {
      jamfireSettings = {}
    } else {
      jamfireSettings = JSON.parse(settings)
    }
    return jamfireSettings
  }

  return {}
}

// set jamfire setting
export const jamfireSet = (name: string, value: string) => {
  if (isClient) {
    let settings = getJamfireSettings()

    let values = Object.assign({}, settings, {
      [name]: value,
    })

    return storage.local.setItem("jamfireSettings", JSON.stringify(values))
  }

  return null
}

// get jamfire settings
export const jamfireGet = (name: string) => {
  if (isClient) {
    let settings = getJamfireSettings()

    return settings[name] || null
  }

  return null
}
