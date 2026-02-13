import { firstValueFrom } from "rxjs"
import { TimeHelper } from "../app/statics/helpers/TimeHelper"
import { ObservableValue } from "../app/structs/ObservableValue"

describe('Just Test', () => {

  it('foo', async() => {
    expect('foo').toEqual('foo')
  })

  it('ObservableValue 2', async() => {
    let ov = new ObservableValue<number>()
    ov.setValue(1)
    ov.subscribe(v => {
      expect(v).toEqual(1)
    })

    let isTimeout = true
    ov.subscribe(v => {isTimeout = false})
    await firstValueFrom(TimeHelper.wait(100))
    expect(isTimeout).toBe(false)
  })
})