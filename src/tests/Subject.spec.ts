import { Subject } from "rxjs"

describe('Subject Test', () => {

  it('next', async() => {
    let subject = new Subject<number>()

    subject.subscribe(value => {
      expect(value).toBe(1)
    })
    subject.next(1)
  })
})