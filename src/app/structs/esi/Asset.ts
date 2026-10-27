
/**
 * 资产项目数据
 */
export interface IEisAsset {
  is_blueprint_copy?: boolean
  is_singleton: boolean
  item_id: number
  location_flag: LocationFlag
  location_id: number
  location_type: LocationType
  quantity: number
  type_id: number
}

export type LocationFlag =
  'AssetSafety'
  | 'AutoFit'
  | 'BoosterBay'
  | 'CapsuleerDeliveries'
  | 'Cargo'
  | 'CorpDeliveries'
  | 'CorporationGoalDeliveries'
  | 'CorpseBay'
  | 'CorpSAG0'
  | 'CorpSAG1'
  | 'CorpSAG2'
  | 'CorpSAG3'
  | 'CorpSAG4'
  | 'CorpSAG5'
  | 'CorpSAG6'
  | 'CorpSAG7'
  | 'Deliveries'
  | 'DroneBay'
  | 'FighterBay'
  | 'FighterTube0'
  | 'FighterTube1'
  | 'FighterTube2'
  | 'FighterTube3'
  | 'FighterTube4'
  | 'FleetHangar'
  | 'FrigateEscapeBay'
  | 'Hangar'
  | 'HangarAll'
  | 'HiSlot0'
  | 'HiSlot1'
  | 'HiSlot2'
  | 'HiSlot3'
  | 'HiSlot4'
  | 'HiSlot5'
  | 'HiSlot6'
  | 'HiSlot7'
  | 'HiddenModifiers'
  | 'Implant'
  | 'InfrastructureHangar'
  | 'LoSlot0'
  | 'LoSlot1'
  | 'LoSlot2'
  | 'LoSlot3'
  | 'LoSlot4'
  | 'LoSlot5'
  | 'LoSlot6'
  | 'LoSlot7'
  | 'Locked'
  | 'MedSlot0'
  | 'MedSlot1'
  | 'MedSlot2'
  | 'MedSlot3'
  | 'MedSlot4'
  | 'MedSlot5'
  | 'MedSlot6'
  | 'MedSlot7'
  | 'MobileDepotHold'
  | 'MoonMaterialBay'
  | 'OfficeFolder'
  | 'QuafeBay'
  | 'RigSlot0'
  | 'RigSlot1'
  | 'RigSlot2'
  | 'RigSlot3'
  | 'RigSlot4'
  | 'RigSlot5'
  | 'RigSlot6'
  | 'RigSlot7'
  | 'ShipHangar'
  | 'Skill'
  | 'SpecializedAmmoHold'
  | 'SpecializedAsteroidHold'
  | 'SpecializedCommandCenterHold'
  | 'SpecializedFuelBay'
  | 'SpecializedGasHold'
  | 'SpecializedIceHold'
  | 'SpecializedIndustrialShipHold'
  | 'SpecializedLargeShipHold'
  | 'SpecializedMaterialBay'
  | 'SpecializedMediumShipHold'
  | 'SpecializedMineralHold'
  | 'SpecializedOreHold'
  | 'SpecializedPlanetaryCommoditiesHold'
  | 'SpecializedSalvageHold'
  | 'SpecializedShipHold'
  | 'SpecializedSmallShipHold'
  | 'StructureDeedBay'
  | 'SubSystemBay'
  | 'SubSystemSlot0'
  | 'SubSystemSlot1'
  | 'SubSystemSlot2'
  | 'SubSystemSlot3'
  | 'SubSystemSlot4'
  | 'SubSystemSlot5'
  | 'SubSystemSlot6'
  | 'SubSystemSlot7'
  | 'Unlocked'
  | 'Wardrobe'


export type LocationType =
  'station'
  | 'solar_system'
  | 'item'
  | 'other'


export class LocationTypeConstants {
  static readonly Station: LocationType = 'station';
  static readonly SolarSystem: LocationType = 'solar_system';
  static readonly Item: LocationType = 'item';
  static readonly Other: LocationType = 'other';
}

export class LocationFlagConstants {
  static readonly AssetSafety: LocationFlag = 'AssetSafety';
  static readonly AutoFit: LocationFlag = 'AutoFit';
  static readonly BoosterBay: LocationFlag = 'BoosterBay';
  static readonly CapsuleerDeliveries: LocationFlag = 'CapsuleerDeliveries';
  static readonly Cargo: LocationFlag = 'Cargo';
  /**
   * 军团快递
   */
  static readonly CorpDeliveries: LocationFlag = 'CorpDeliveries';
  static readonly CorpSAG0: LocationFlag = 'CorpSAG0';
  static readonly CorpSAG1: LocationFlag = 'CorpSAG1';
  static readonly CorpSAG2: LocationFlag = 'CorpSAG2';
  static readonly CorpSAG3: LocationFlag = 'CorpSAG3';
  static readonly CorpSAG4: LocationFlag = 'CorpSAG4';
  static readonly CorpSAG5: LocationFlag = 'CorpSAG5';
  static readonly CorpSAG6: LocationFlag = 'CorpSAG6';
  static readonly CorpSAG7: LocationFlag = 'CorpSAG7';
  static readonly CorporationGoalDeliveries: LocationFlag = 'CorporationGoalDeliveries';
  static readonly CorpseBay: LocationFlag = 'CorpseBay';
  static readonly Deliveries: LocationFlag = 'Deliveries';
  static readonly DroneBay: LocationFlag = 'DroneBay';
  static readonly FighterBay: LocationFlag = 'FighterBay';
  static readonly FighterTube0: LocationFlag = 'FighterTube0';
  static readonly FighterTube1: LocationFlag = 'FighterTube1';
  static readonly FighterTube2: LocationFlag = 'FighterTube2';
  static readonly FighterTube3: LocationFlag = 'FighterTube3';
  static readonly FighterTube4: LocationFlag = 'FighterTube4';
  static readonly FleetHangar: LocationFlag = 'FleetHangar';
  static readonly FrigateEscapeBay: LocationFlag = 'FrigateEscapeBay';
  static readonly Hangar: LocationFlag = 'Hangar';
  static readonly HangarAll: LocationFlag = 'HangarAll';
  static readonly HiSlot0: LocationFlag = 'HiSlot0';
  static readonly HiSlot1: LocationFlag = 'HiSlot1';
  static readonly HiSlot2: LocationFlag = 'HiSlot2';
  static readonly HiSlot3: LocationFlag = 'HiSlot3';
  static readonly HiSlot4: LocationFlag = 'HiSlot4';
  static readonly HiSlot5: LocationFlag = 'HiSlot5';
  static readonly HiSlot6: LocationFlag = 'HiSlot6';
  static readonly HiSlot7: LocationFlag = 'HiSlot7';
  static readonly HiddenModifiers: LocationFlag = 'HiddenModifiers';
  static readonly Implant: LocationFlag = 'Implant';
  static readonly InfrastructureHangar: LocationFlag = 'InfrastructureHangar';
  static readonly LoSlot0: LocationFlag = 'LoSlot0';
  static readonly LoSlot1: LocationFlag = 'LoSlot1';
  static readonly LoSlot2: LocationFlag = 'LoSlot2';
  static readonly LoSlot3: LocationFlag = 'LoSlot3';
  static readonly LoSlot4: LocationFlag = 'LoSlot4';
  static readonly LoSlot5: LocationFlag = 'LoSlot5';
  static readonly LoSlot6: LocationFlag = 'LoSlot6';
  static readonly LoSlot7: LocationFlag = 'LoSlot7';
  static readonly Locked: LocationFlag = 'Locked';
  static readonly MedSlot0: LocationFlag = 'MedSlot0';
  static readonly MedSlot1: LocationFlag = 'MedSlot1';
  static readonly MedSlot2: LocationFlag = 'MedSlot2';
  static readonly MedSlot3: LocationFlag = 'MedSlot3';
  static readonly MedSlot4: LocationFlag = 'MedSlot4';
  static readonly MedSlot5: LocationFlag = 'MedSlot5';
  static readonly MedSlot6: LocationFlag = 'MedSlot6';
  static readonly MedSlot7: LocationFlag = 'MedSlot7';
  static readonly MobileDepotHold: LocationFlag = 'MobileDepotHold';
  static readonly MoonMaterialBay: LocationFlag = 'MoonMaterialBay';
  static readonly OfficeFolder: LocationFlag = 'OfficeFolder';
  static readonly QuafeBay: LocationFlag = 'QuafeBay';
  static readonly RigSlot0: LocationFlag = 'RigSlot0';
  static readonly RigSlot1: LocationFlag = 'RigSlot1';
  static readonly RigSlot2: LocationFlag = 'RigSlot2';
  static readonly RigSlot3: LocationFlag = 'RigSlot3';
  static readonly RigSlot4: LocationFlag = 'RigSlot4';
  static readonly RigSlot5: LocationFlag = 'RigSlot5';
  static readonly RigSlot6: LocationFlag = 'RigSlot6';
  static readonly RigSlot7: LocationFlag = 'RigSlot7';
  static readonly ShipHangar: LocationFlag = 'ShipHangar';
  static readonly Skill: LocationFlag = 'Skill';
  static readonly SpecializedAmmoHold: LocationFlag = 'SpecializedAmmoHold';
  static readonly SpecializedAsteroidHold: LocationFlag = 'SpecializedAsteroidHold';
  static readonly SpecializedCommandCenterHold: LocationFlag = 'SpecializedCommandCenterHold';
  static readonly SpecializedFuelBay: LocationFlag = 'SpecializedFuelBay';
  static readonly SpecializedGasHold: LocationFlag = 'SpecializedGasHold';
  static readonly SpecializedIceHold: LocationFlag = 'SpecializedIceHold';
  static readonly SpecializedIndustrialShipHold: LocationFlag = 'SpecializedIndustrialShipHold';
  static readonly SpecializedLargeShipHold: LocationFlag = 'SpecializedLargeShipHold';
  static readonly SpecializedMaterialBay: LocationFlag = 'SpecializedMaterialBay';
  static readonly SpecializedMediumShipHold: LocationFlag = 'SpecializedMediumShipHold';
  static readonly SpecializedMineralHold: LocationFlag = 'SpecializedMineralHold';
  static readonly SpecializedOreHold: LocationFlag = 'SpecializedOreHold';
  static readonly SpecializedPlanetaryCommoditiesHold: LocationFlag = 'SpecializedPlanetaryCommoditiesHold';
  static readonly SpecializedSalvageHold: LocationFlag = 'SpecializedSalvageHold';
  static readonly SpecializedShipHold: LocationFlag = 'SpecializedShipHold';
  static readonly SpecializedSmallShipHold: LocationFlag = 'SpecializedSmallShipHold';
  static readonly StructureDeedBay: LocationFlag = 'StructureDeedBay';
  static readonly SubSystemBay: LocationFlag = 'SubSystemBay';
  static readonly SubSystemSlot0: LocationFlag = 'SubSystemSlot0';
  static readonly SubSystemSlot1: LocationFlag = 'SubSystemSlot1';
  static readonly SubSystemSlot2: LocationFlag = 'SubSystemSlot2';
  static readonly SubSystemSlot3: LocationFlag = 'SubSystemSlot3';
  static readonly SubSystemSlot4: LocationFlag = 'SubSystemSlot4';
  static readonly SubSystemSlot5: LocationFlag = 'SubSystemSlot5';
  static readonly SubSystemSlot6: LocationFlag = 'SubSystemSlot6';
  static readonly SubSystemSlot7: LocationFlag = 'SubSystemSlot7';
  static readonly Unlocked: LocationFlag = 'Unlocked';
  static readonly Wardrobe: LocationFlag = 'Wardrobe';
}