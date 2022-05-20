export type Attribute = "förföra" | "lösa gåtor" | "tänka logiskt" | "fajtas" | "tunnla" | "vara uthållig" | "baguette" | "smyga" | "pinne" | "GPS" | "excalibur" | "räfs den legendariska krattan" | "gräs" | "silly walk" | "epic" | "snorkel" | "punch" | "stege från holt"

export type Character = "fysiker" | "matematiker" | "programmerare" | "rippad"

export type Player = {
  attributes: Attribute[]
  character: Character
  hp: number
  gold: number
  copper: number
}
