import Bro2 from "./bro2";

export default abstract class AbstractBattleRoom implements Room {
  protected stage: "introduction" | "battle" | "enemy defeat" = "introduction";
  //private inBattle: boolean = false;
  protected abstract generateIntroText(gameEnvironment: GameEnvironment): string;
  protected abstract generateIntroChoices(gameEnvironment: GameEnvironment): Choice[];
  protected abstract generateBattleChoices(gameEnvironment: GameEnvironment): Choice[];
  protected abstract generateDefeatText(gameEnvironment: GameEnvironment): string;
  protected abstract nextRoom: Class<Room>;

  private currentHP: number = 0;

  protected abstract enemyAttacks(gameEnvironment: GameEnvironment): string;

  getRoom(gameEnvironment : GameEnvironment) {
    let text: string = "";
    let preChoices: Choice[] = [];
    this.currentHP = gameEnvironment.character.hp;

    if (this.stage == "introduction") {
      text = this.generateIntroText(gameEnvironment);
      preChoices = this.generateIntroChoices(gameEnvironment);

    } else if (this.stage == "battle") {
      text = this.enemyAttacks(gameEnvironment);

      preChoices = this.generateBattleChoices(gameEnvironment);
    } else if (this.stage == "enemy defeat") {
      text = this.generateDefeatText(gameEnvironment);

      preChoices = [
        {
          text: "Gå vidare.",
          action: () => {
            gameEnvironment.setRoom(this.nextRoom);
          },
        },
      ];
    }

    let choices: Choice[] = preChoices.map(choice => ({
      text: choice.text,
      action: () => {
        const text = choice.action();
        gameEnvironment.setCharacter({...gameEnvironment.character, hp: this.currentHP});
        return text;
      }
    }));

    return {
      text,
      choices,
    }
  }

  protected changeHP(value: number): void {
    this.currentHP += value;
  }
}
