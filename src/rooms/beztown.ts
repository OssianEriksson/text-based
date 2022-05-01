import { stat } from "fs";
import { Choice, Room } from "../game";
import Ni from "./ni";
import Quebec from "./quebec";

type State = {
  stage: "introduction" | "talk" | "quest";
  visited: boolean;
};

const Beztown: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      stage: "introduction",
      visited: false,
    };
  } else {
    this.state.visited = true;
  }

  const state = this.state as State;

  if (state.stage == "introduction") {
  }
};

export default Beztown;
