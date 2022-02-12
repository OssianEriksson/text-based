type Class<T> = {
  new (): T;
  name: string;
};

type Ability = "tunnling" | "fäktning" | "logiskt tänkande" | "gåtor" | "ligvistik" |  "förföring" | "telepati" | "uthållighet";

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

  setRoom(room: Class<Room>): void;
};

type Choice1 = [string, () => void];
type Choice = {
  text: string;
  action: () => void;
}

type RoomInfo1 = {
  roomInfo?: string;
  choices: Choice1[];
  disableReturnChoice?: boolean;
};
type RoomInfo = {
  roomInfo?: string;
  choices: Choice[];
  disableReturnChoice?: boolean;
};

type Room1 = {
  getInfo(gameEnvironment: GameEnvironment): RoomInfo1;
};
type Room = {
  getInfo(gameEnvironment: GameEnvironment): RoomInfo;
};
