export type BrewMode = "hot" | "iced";

export type RatioOption = "1:10" | "1:12" | "1:13" | "1:14" | "1:15" | "1:16" | "1:17" | "custom";

export type Origin =
  | "Ethiopia" | "Kenya" | "Colombia" | "Brazil" | "Yemen"
  | "Guatemala" | "Costa Rica" | "Panama" | "Rwanda" | "Burundi"
  | "Indonesia" | "Mexico" | "Peru" | "Honduras" | "El Salvador"
  | "مزيج" | "";

export type AltitudeRange =
  | "Below 1000m" | "1000-1400m" | "1400-1700m" | "1700-2000m" | "2000m+"
  | "1400" | "1500-1800" | "1500-2200" | "1600" | "1700" | "1800-2200"
  | "1850-2200" | "1900-2500" | "2000" | "2100"
  | "";

export type ProcessingMethod = "Washed" | "Natural" | "Honey" | "Anaerobic" | "Wet-Hulled" | "";

export type RoastLevel = "Light" | "Medium-Light" | "Medium" | "Medium-Dark" | "Dark" | "";

export type FlavorNote =
  | "Floral" | "Fruity" | "Citrus" | "Berry" | "Chocolate"
  | "Nutty" | "Caramel" | "Spicy" | "Earthy" | "Tropical"
  | "Stone Fruit" | "Wine-like"
  | "Cherry" | "Grape" | "Jasmine" | "Honey" | "Strawberry"
  | "Apple" | "Hazelnut" | "Walnut" | "Raisin" | "Cacao"
  | "Molasses" | "Vanilla" | "Peach" | "Mango" | "Rose"
  | "Lavender" | "Brown Sugar" | "Toffee" | "Dark Chocolate"
  | "Milk Chocolate" | "Bergamot" | "Hibiscus" | "Tamarind" | "Date";

export type GrindSize = "Fine" | "Medium-Fine" | "Medium" | "Medium-Coarse" | "Coarse";

export interface BeanProfile {
  id?: string;
  origin: Origin;
  altitude: AltitudeRange;
  processing: ProcessingMethod;
  roast: RoastLevel;
  flavorNotes: FlavorNote[];
  name?: string;
  region?: string;
  variety?: string;
  body?: string;
}

export interface BrewRecommendation {
  ratio: string;
  ratioNumber: number;
  waterTemp: string;
  waterTempRange: [number, number];
  grindSize: GrindSize;
  bloomTime: number;
  flavorTip: string;
}

export interface BrewRecipeStep {
  step: number;
  label: string;
  amount: number;
  totalWater: number;
  timestamp: string;
  duration: number;
}

export interface BrewCalculation {
  coffee: number;
  water: number;
  ratio: number;
  brewMode: BrewMode;
  brewWater?: number;
  iceWater?: number;
  recipe: BrewRecipeStep[];
  bloomTime: number;
  totalBrewTime: string;
  recommendation?: BrewRecommendation;
}

export interface SavedBean extends BeanProfile {
  id: string;
  savedAt: number;
  region?: string;
  variety?: string;
  body?: string;
}

export interface AppSettings {
  preferredRatio: RatioOption;
  defaultBrewMode: BrewMode;
  language: "en" | "ar";
  defaultBeanProfile?: Partial<BeanProfile>;
}

export interface BeanLibraryEntry {
  id: string;
  name: string;
  origin: Origin;
  altitude: AltitudeRange;
  processing: ProcessingMethod;
  roast: RoastLevel;
  flavorNotes: FlavorNote[];
  description: string;
  typicalRatio: string;
  region?: string;
  variety?: string;
  body?: string;
}
