import { RandomHelper } from "./RandomHelper"



describe('RandomHelper', () => {
  it("randomInt", () => {
    let min = 0
    let max = 1
    for (let i = 0; i < 10000; i++) {
      let randomInt = RandomHelper.randomInt(min, max)
      expect(randomInt).toBeGreaterThanOrEqual(min)
      expect(randomInt).toBeLessThanOrEqual(max)
    }

    min = 1
    max = 2
    for (let i = 0; i < 10000; i++) {
      let randomInt = RandomHelper.randomInt(min, max)
      expect(randomInt).toBeGreaterThanOrEqual(min)
      expect(randomInt).toBeLessThanOrEqual(max)
    }
  })
})
