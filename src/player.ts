export type Attribute = "förföra" | "lösa gåtor" | "tänka logiskt" | "fajtas" | "tunnla" | "vara uthållig" | "baguette"

export type Character = "fysiker" | "matematiker" | "programmerare" | "rippad"

export type Player = {
  attributes: Attribute[]
  character: Character
  hp: number
  gold: number
}
