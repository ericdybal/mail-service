import { expect } from 'chai'
import {
  push, clearAll, findById, findByStatus, updateById, count
} from './InMemoryQueue'

describe('InMemoryQueue', () => {
  before(async () => {
    await clearAll()
  })

  it('testAll', async () => {
    await push({id: 1, status: 'PENDING', errorCount: 0})
    await push({id: 2, status: 'COMPLETED', errorCount: 0})

    expect(await count()).to.equal(2)
    expect(await findById(1)).to.have.property('id', 1)
    expect(await findByStatus('PENDING')).to.have.property('length', 1)

    await updateById({id: 1, status: 'FAILED'})
    expect(await findByStatus('FAILED')).to.have.property('length', 1)

    await clearAll()
    expect(await count()).to.equal(0)
  })
})