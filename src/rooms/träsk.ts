import { stat } from "fs"
import { Room } from "../game"
import Ni from "./ni"
import Quebec from "./quebec"

type State = {
  visited: boolean
}

const Träsk: Room<State> = function () {
  if (!this.state) {
    this.state = {
      visited: false,
    }
  } else {
    this.state.visited = true
  }

  const state = this.state as State

  return {
    text: state.visited
      ? "Du befinner dig ute i träsket mellan Amazonas och Ensammare Berget."
      : "Du kommer efter en lång vandring ut i en träskmak. Nästan inga träd finns att se och den gråa marken är täkt av en blandning mellan lera och aska. Vätan tränger igenom dina skor och du börjar frysa om fötterna. Växtligheten övergår i allt högre grad till bruna buskar, de högsta inte högre än människohöjd. Åt öster ligger det Ensammare Berget, målet för din resa.",
    choices: [
      {
        text: "Gå åt öster mot det Ensammare Berget.",
        onChoose: () => ({ room: Quebec }),
      },
      {
        text: "Ta en scenisk omväg åt norr.",
        onChoose: () => ({ room: Ni }),
      },
    ],
  }
}

export default Träsk
