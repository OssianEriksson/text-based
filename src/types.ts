type Class<T> = {
  new (): T;
  name: string;
};

type Ability =
  | "tunnling"
  | "fäktning"
  | "logiskt tänkande"
  | "gåtor"
  | "ligvistik"
  | "förföring"
  | "telepati"
  | "uthållighet";

type CharacterClass = "fysiker" | "matematiker" | "programmerare" | "rippad";

type Character = {
  class: CharacterClass;
  abilities: Ability[];
};

type Inventory = {};

type GameEnvironment = {
  character: Character;
  setCharacter(character: Character): void;

  inventory: Inventory;
  setInventory(inventory: Inventory): void;

  setRoom(room: Class<Room> | InlineRoom): void;
};

type Choice = {
  text: string;
  action: () => { text?: string } | void;
};

type InlineRoom = {
  text?: string;
  choices: Choice[];
  returnChoice?: {text: string} | null;
};

type Room = {
  getRoom(gameEnvironment: GameEnvironment): InlineRoom;
};