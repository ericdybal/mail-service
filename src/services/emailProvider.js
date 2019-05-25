import config from '../config/config'
import * as mailGunEmailProvider from './mailGunEmailProvider'
import * as sendGridEmailProvider from './sendGridEmailProvider'

export const getPrimaryEmailProvider = () => getEmailProviderByType('primary')
export const getBackupEmailProvider = () => getEmailProviderByType('backup')

const getEmailProviderByType = type => {
  const providerConfig = config._instance.emailProvider.find(item => {
    return item.type === type
  })
  const providerByName = getEmailProviderByName(providerConfig.name)
  providerByName.init(providerConfig)

  return providerByName
}

const getEmailProviderByName = (name) => {
  switch (name) {
    case 'mailGun':
      return mailGunEmailProvider
    case 'sendGrid':
      return sendGridEmailProvider
    default:
      return mailGunEmailProvider
  }
}
