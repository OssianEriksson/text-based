import { Room } from "../game"
import battleChoices, { AttacksBattleState, generatePlayerAttacks } from "../helpers/batteChoices"
import { createGameOverRoom } from "../helpers/gameOver"
import ÅterTillSittningslokal from "./åter-till-sittningslokal"

type AbabouBattleState = AttacksBattleState & {
  stage: "introduction" | "battle"
}

const AbabouFajt: Room<AbabouBattleState> = function (args) {
  if (!this.state) {
    this.state = {
      opponentHp: 200,
      opponentName: "Ababou",
      stage: "introduction",
    }
  }

  const state = this.state as AbabouBattleState

  const introduction = state.stage == "introduction"
  state.stage = "battle"

  const onDefeat = () => ({
    text: "Du har tagit så mycket skada att du dör. Ababou har besegrat dig.",
    room: createGameOverRoom(),
  })

  return {
    text: introduction
      ? "Utanför berget hörs det donande ljudet av sammanbrakande sten och ett gigantiskt dammoln svävar i luften. Det är Ababou som har sprängt ett stort hål i dvärgharnas boning. Så fort han får syn på dig blixtrar hans ögon och hans mullrande röst anklagar dig för att ha gått emot hans vilja. Nu måste du slåss mot honom i en strid som kommer avgöra hela lagomgårds öde."
      : "En frustande Ababou står framför dig. Vad gör du?",
    choices: battleChoices(
      args,
      state,
      generatePlayerAttacks(
        args,
        state,
        () => ({
          text:
            "Plötsligt orkar Ababou inte attackera dig längre. Hans kropp fadar ut tills dess bara hans långa klädnad som sakta faller till marken finns kvar.\n\n" +
            "Ababaou är död, och du diskuterar med dvärgarna vad du skall göra. De försäkrar dig om att utan Häxmästaren Ababaou kan de skydda sig från Amazonerna länge nog att de kan få Amazonerna själva att industrialiseras ochöverge magin.\n\n" +
            "Du börjar nu bli trött och känner att saker verkar ordna sig här i lagomgård. Du börjar därför tänka på hur du ska kunna ta dig hem igen. Då kommer du ihåg inte-graalen som du fortfarande inte har använt. Som i varje välkonstruerat problem måste varje förutsättning användas, och med ett aldrig tidigare skådat drag av genialitet lyckas du formulera om integralen så den beskriver interdimensionell hemtransport av heroiska krigare.",
          choices: [
            {
              text: "Använd integralen för att resa hem.",
              onChoose: () => ({ room: ÅterTillSittningslokal }),
            },
          ],
        }),
        [
          {
            onChoose: () => {
              args.player.hp -= 25
              return {
                text: "Ababou lyckas räkna upp alla naturliga tal. Du tar 25 hp skada.",
              }
            },
            onDefeat,
          },
          {
            onChoose: () => {
              args.player.hp -= 15
              return {
                text: "Ababou skjuter blixtar från sin trollstav. Du tar 15 hp skada.",
              }
            },
            onDefeat,
          },
          {
            onChoose: () => {
              if (args.player.character == "rippad") {
                args.player.hp -= 5
                return {
                  text: "Ababou börjar rita förvirrande grafer med sin trollstav, men du bryr dig inte om sådant trams och tar bara 5 hp skada.",
                }
              }

              args.player.hp -= 5
              return {
                text: "Ababou börjar rita förvirrande grafer med sin trollstav vilket åsamkar dig 15 hp skada.",
              }
            },
            onDefeat,
          },
        ]
      )
    ),
  }
}

export default AbabouFajt
