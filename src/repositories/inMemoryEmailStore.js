let queue = [];

export const push = async item => {
  queue.push(item);
  return Promise.resolve(item);
};

export const findByStatus = async status => {
  const matches = queue.filter(item => {
    return item.status === status;
  });
  return Promise.resolve(matches);
};

export const findById = async id => {
  const find = queue.find(item => {
    return item.id === id;
  });
  if (find) {
    return Promise.resolve(find);
  } else {
    return Promise.reject(new Error(`Email message with ID [${id}] not found`));
  }
};

export const updateById = async updated => {
  let found = queue.find(item => {
    return item.id === updated.id;
  });
  Object.assign(found, updated);
  Promise.resolve(found);
};

export const clearAll = async status => {
  if (status) {
    queue = queue.filter(item => {
      return item.status !== status;
    });
  } else {
    queue = [];
  }
};

export const count = async () => {
  return Promise.resolve(queue.length);
};
