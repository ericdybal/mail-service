import config from '../config/config'
import * as inMemoryMessageStore from './inMemoryMessageStore'
import * as persistentMessageStore from './persistentMessageStore'

const getMessageStore = () => {
  const messageStore = config.get('messageStore')

  switch (messageStore) {
    case 'in-memory':
      return inMemoryMessageStore
    case 'persistent':
      return persistentMessageStore
    default:
      return inMemoryMessageStore
  }
}

export default getMessageStore