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

export type Character = "fysiker" | "matematiker" | "rippad" // | "programmerare"

export type Player = Serializable & {
  attributes: Attribute[]
  character: Character
  hp: number
  gold: number
  copper: number
}
