import Sittningslokal from "./sittningslokal";

export default class GameOver implements Room {
  getRoom({ setRoom }: GameEnvironment) {
    return {
      text: "Spelet är slut!",
      choices: [
        {
          text: "Spela igen.",
          action: () => {
            setRoom(Sittningslokal);
            return { text: "--------------------" };
          },
        },
      ] as Choice[],
      returnChoice: null,
    };
  }
}
