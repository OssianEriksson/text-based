import { Serializable } from "./util/types"

export type Attribute =
  | "förföra"
  | "lösa gåtor"
  | "tänka logiskt"
  | "fajtas"
  | "tunnla"
  | "vara uthållig"
  | "baguette"
  | "smyga"
  | "pinne"
  | "GPS"
  | "excalibur"
  | "räfs den legendariska krattan"
  | "gräs"
  | "silly walk"
  | "epic"
  | "snorkel"
  | "punch"
  | "stege från holt"
  | "stalinist"

export type Character = "fysiker" | "matematiker" | "rippad" // | "programmerare"

export type Player = Serializable & {
  attributes: Attribute[]
  character: Character
  maxHp: number
  hp: number
  gold: number
  copper: number
  healingPotions: number
}
