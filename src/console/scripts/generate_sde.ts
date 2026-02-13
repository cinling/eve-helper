/**
 * 是用脚本生成 ESI SDE 数据
 * 主要是将从官网下载的 SDE.yaml 数据转为 SDE.json
 * 数据下载地址：https://developers.eveonline.com/docs/services/sde/
 */

const yaml = require('js-yaml')
const fs = require('fs')
const { dirname } = require('path')

// 资源目录
const asssetsPath = dirname(__dirname) + "/assets"
const fsdPath = asssetsPath + "/sde/fsd"
// web公开资源目录（生成文件保存路径）
const publicAssetPath = dirname(dirname(dirname(__dirname))) + "/public/assets"

// 日志目录
const logPath = dirname(__dirname) + "/logs"
// 生成文件缓存
const genCacheFile = logPath + "/genCache.cache"

let genCache = readGenCache()


genGroups()
genMarketGroups()
genTypes()
genTypeMaterials()
genBlueprints()

console.log("----------------------------------------------------------------")
console.log("all generate done.")
writeGenCache(genCache)



/**
 * 生成蓝图数据
 */
function genBlueprints() {
  let filename = fsdPath + '/blueprints.yaml'
  let genfilename = publicAssetPath + '/blueprints.gen.json'

  if (isGen(filename, genfilename)) {
    console.log("blueprints generated already.")
    return // 已经生成过
  }

  let filecontent = fs.readFileSync(filename, 'utf8')
  let blueprints = yaml.load(filecontent)

  fs.writeFileSync(genfilename, JSON.stringify(blueprints))
  console.log("generate blueprints done.")

  setCache(filename)
}

/**
 * 生成化矿数据
 */
function genTypeMaterials() {
  let filename = fsdPath + '/typeMaterials.yaml'
  let genfilename = publicAssetPath + '/typeMaterials.gen.json'

  if (isGen(filename, genfilename)) {
    console.log("typeMaterials generated already.")
    return // 已经生成过
  }

  let filecontent = fs.readFileSync(filename, 'utf8')
  let typeMaterials = yaml.load(filecontent)

  fs.writeFileSync(genfilename, JSON.stringify(typeMaterials))
  console.log("generate typeMaterials done.")

  setCache(filename)
}

/**
 * 生成分组数据
 */
function genGroups() {
  let filename = fsdPath + '/groups.yaml'
  let genfilename = publicAssetPath + '/groups.gen.json'

  if (isGen(filename, genfilename)) {
    console.log("groups generated already.")
    return // 已经生成过
  }

  // 获取所有分组数据
  let filecontent = fs.readFileSync(filename, 'utf8')
  let groups = yaml.load(filecontent)

  // 只取数据的中文
  for (let i in groups) {
      let group = groups[i]
      group.groupID = Number(i)
      group.name = group.name.zh
  }

  fs.writeFileSync(genfilename, JSON.stringify(groups))
  console.log("generate groups done.")

  setCache(filename)
}

/**
 * 生成市场分组
 */
function genMarketGroups() {
  let filename = fsdPath + '/marketGroups.yaml'
  let genfilename = publicAssetPath + '/marketGroups.gen.json'

  if (isGen(filename, genfilename)) {
    console.log("marketGroups generated already.")
    return // 已经生成过
  }

  let filecontent = fs.readFileSync(filename, 'utf8')
  let marketGroups = yaml.load(filecontent)

  // 只取中文数据
  for (let i in marketGroups) {
    let marketGroup = marketGroups[i]
    marketGroup.marketGroupID = parseInt(i)

    if (marketGroup.hasOwnProperty('descriptionID')) {
      marketGroup.description = marketGroup.descriptionID.zh
      delete marketGroup.descriptionID
    }

    marketGroup.name = marketGroup.nameID.zh
    delete marketGroup.nameID
  }

  fs.writeFileSync(genfilename, JSON.stringify(marketGroups))
  console.log("generate marketGroups done.")

  setCache(filename)
}

/**
 * 生成物品数据
 */
function genTypes() {
  let filename1 = fsdPath + '/types-01.yaml'
  let filename2 = fsdPath + '/types-02.yaml'
  let genfilename = publicAssetPath + '/types.gen.json'

  if (isGen(filename1, genfilename) && isGen(filename2, genfilename)) {
    console.log("types generated already.")
    return // 已经生成过
  }

  let filecontent1 = fs.readFileSync(filename1, 'utf8')
  let filecontent2 = fs.readFileSync(filename2, 'utf8')
  let types_01 = yaml.load(filecontent1)
  let types_02 = yaml.load(filecontent2)
  let types = {
    ...types_01,
    ...types_02
  }

  let typeDict: {[typeId: number]: any} = {}

  // 只取中文数据
  for (let i in types) {
    let type = types[i]
    if (type.published == false) {
      continue // 未发布的物品排除在外
    }

    type.typeID = parseInt(i)
    if (type.hasOwnProperty("description")) {
      type.description = type.description.zh
    }

    type.name = type.name.zh
    typeDict[Number(i)] = type
  }

  fs.writeFileSync(genfilename, JSON.stringify(typeDict))
  console.log("generate types done.")

  // 设置生成缓存
  setCache(filename1)
  setCache(filename2)
}

/**
 * 获取生成的缓存数据（已生成过的不在生成）
 */
function readGenCache(): {[filename: string]: number} {
  if (!fs.existsSync(genCacheFile)) {
    return {}
  }
  return JSON.parse(fs.readFileSync(genCacheFile))
}

/**
 * 将缓存写入文件
 */
function writeGenCache(cache: {[filename: string]: number}) {
  fs.writeFileSync(genCacheFile, JSON.stringify(cache))
}

/**
 * 判断文件是否已生成
 * @param filename 需要读取的 yaml 文件
 * @param genfilename 需要生成的 json 文件
 * @returns
 */
function isGen(filename: string, genfilename: string): boolean {
  if (!fs.existsSync(genfilename)) {
    return false
  }
  if (genCache.hasOwnProperty(filename)) {
    let filemtime = fs.statSync(filename).mtimeMs
    return filemtime == genCache[filename]
  }
  return false
}

function setCache(filename: string) {
  let filemtime = fs.statSync(filename).mtimeMs
  genCache[filename] = filemtime
}
