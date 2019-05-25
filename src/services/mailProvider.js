import config from '../config/config'
import * as mailGunProvider from './mailGunProvider'
import * as sendGridProvider from './sendGridProvider'

export const getPrimaryMailProvider = () => getProviderByType('primary')
export const getBackupMailProvider = () => getProviderByType('backup')

const getProviderByType = type => {
  const providerConfig = config._instance.mailProvider.find(item => {
    return item.type === type
  })
  const providerByName = getProviderByName(providerConfig.name)
  providerByName.init(providerConfig)

  return providerByName
}

const getProviderByName = (name) => {
  switch (name) {
    case 'mailGun':
      return mailGunProvider
    case 'sendGrid':
      return sendGridProvider
    default:
      return mailGunProvider
  }
}
