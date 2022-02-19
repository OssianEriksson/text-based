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
  hp: number;
};

type Inventory = {};

type GameEnvironment = {
  character: Character;
  setCharacter(character: Character): void;

  inventory: Inventory;
  setInventory(inventory: Inventory): void;

  setRoom(room: Class<Room>): void;
};

type Choice = {
  text: string;
  action: () => { text?: string } | void;
};

type RoomInfo = {
  text?: string;
  choices: Choice[];
  disableReturnChoice?: boolean;
};

type Room = {
  getInfo(gameEnvironment: GameEnvironment): RoomInfo;
};
