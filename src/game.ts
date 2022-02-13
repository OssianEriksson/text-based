import readlineSync from "readline-sync";

class Builder {
  private alreadyCreatedRooms: { [key: string]: Room } = {};

  build<R extends Room>(roomClass: Class<R>): R {
    if (roomClass.name in this.alreadyCreatedRooms) {
      return this.alreadyCreatedRooms[roomClass.name] as R;
    }

    const room: R = new roomClass();
    this.alreadyCreatedRooms[roomClass.name] = room;
    return room;
  }
}

export class Game {
  private builder: Builder;
  private room: Room;
  private character: Character;
  private inventory: Inventory;

  private visitedRooms: Room[];

  private initialRoom: Class<Room>;
  private gameOverRoom: Class<Room>;

  constructor(initialRoom: Class<Room>, gameOverRoom: Class<Room>) {
    this.initialRoom = initialRoom;
    this.gameOverRoom = gameOverRoom;

    this.builder = new Builder();
    this.room = this.builder.build(initialRoom);
    this.character = { class: "fysiker", abilities: [] };
    this.inventory = {};

    this.visitedRooms = [];
  }

  start() {
    const setRoomInstance = (room: Room) => {
      if (room != this.room) {
        this.visitedRooms.push(this.room);
        this.room = room;
      }
    };

    gameLoop: while (true) {
      const setRoom = (room: Class<Room>) => {
        if (room == this.gameOverRoom) {
          Object.assign(this, new Game(this.initialRoom, this.gameOverRoom));
        }
        setRoomInstance(this.builder.build(room));
      };

      const {
        roomInfo,
        choices,
        disableReturnChoice = false,
      } = this.room.getInfo({
        character: this.character,
        setCharacter: (character) => (this.character = character),

        inventory: this.inventory,
        setInventory: (inventory) => (this.inventory = inventory),

        setRoom,
      });

      if (!disableReturnChoice && this.visitedRooms.length > 0) {
        choices.push({
          text: "Gå tillbaks",
          action: () => {
            const lastRoom = this.visitedRooms.pop();
            lastRoom && setRoomInstance(lastRoom);
          },
        });
      }

      if (roomInfo) {
        console.log(`${roomInfo}\n`);
      }

      if (choices.length > 0) {
        choices.forEach((choice, i) => {
          console.log(`${i + 1}. ${choice.text}`);
        });

        let choiceIndex: number;
        let input: string | null = null;
        do {
          if (input !== null) {
            console.log(`${input} är inte ett tillgängligt val.`);
          }
          input = readlineSync.prompt();

          if (["exit", "avsluta"].includes(input.toLowerCase())) {
            break gameLoop;
          }

          choiceIndex = Number(input);
        } while (choiceIndex % 1 != 0 || choiceIndex < 1 || choiceIndex > choices.length);

        const choice = choices[choiceIndex - 1];
        console.log();
        choice.action();
      } else {
        setRoom(this.gameOverRoom);
      }
    }
  }
}
