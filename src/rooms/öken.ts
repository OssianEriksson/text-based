import { Room } from "../game"
import BroMöbius from "./bro-möbius"

const Öken: Room = function () {
  return {
    text:
      "På den östra sidan av lavafloden är marken inte längre våt. Istället traskar du fram över grusig mark och terrängen blir allt mer kuperad. Gråbruna bergsformationer reser sig kring dig på båda sidor.",
    choices: [
      {
        text: "Fortsätt åt öster mot det Ensammare Berget.",
        onChoose: () => ({
          room: BroMöbius,
        }),
      },
    ],
  }
}

export default Öken
