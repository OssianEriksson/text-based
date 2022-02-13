import Sittningslokal from "./sittningslokal";

export default class GameOver implements Room {
  getInfo({ setRoom }: GameEnvironment) {
    return {
      roomInfo: "Spelet är slut!",
      choices: [
        {
          text: "Spela igen.",
          action: () => setRoom(Sittningslokal),
        },
      ] as Choice[],
      disableReturnChoice: true,
    };
  }
}
