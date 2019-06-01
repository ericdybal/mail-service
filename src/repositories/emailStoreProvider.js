import config from '../config/config';
import * as inMemoryEmailStore from './inMemoryEmailStore';
import * as persistentEmailStore from './persistentEmailStore';

const getEmailStore = () => {
  const type = config.get('emailStore.type');

  switch (type) {
    case 'in-memory':
      return inMemoryEmailStore;
    case 'persistent':
      return persistentEmailStore;
    default:
      return inMemoryEmailStore;
  }
};

export default getEmailStore;
