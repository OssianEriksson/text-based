import GameOver from "./game-over";
import ExitSittningslokal from "./exit-sittningslokal"

export default class Sittningslokal implements Room {
  private stage: "introduction" | "call to action" | "abilities" = "introduction";
  private denyCount: number = 0;
  private assignedAbilitiesCount: number = 0;

  getRoom({ setRoom, character, setCharacter }: GameEnvironment) {
    let text: string = "";
    let choices: Choice[] = [];
    if (this.stage == "introduction") {
      text =
        "Du befinner dig på en sittning med phaddergruppen 256. Det är trevligt men lite tråkigt och du känner hur lusten för ett episkt äventyr bubblar inom dig (eller är det bara förrätten?)\n" +
        "  Plötsligt dyker en mystisk gubbe upp från tomma intet och börjar prata högt.\n\n" +
        "[Ababau den ändlige]: Mitt namn är Ababau den ändlige. Jag söker någon med ett heroiskt intellekt som kan rädda världen. Finns här någon sådan?";
      const choicesList: {
        [Property in CharacterClass]: { player: string; ababou: string };
      } = {
        matematiker: {
          player: "Jag har mäktiga matteskills, välj mig!",
          ababou: "Ett mattesnille, så makalöst magnifikt!",
        },
        fysiker: {
          player: "Jag har fabulösa fyskförmågor, välj mig!",
          ababou: "En fysiker, fantastiskt! Just vad jag förväntade mig!",
        },
        programmerare: {
          player: "Jag är påfallande bra på att programera, välj mig!",
          ababou: "En programmerare, det är ju praktiskt taget perfekt!",
        },
        rippad: {
          player: "Intellekt? Vem behöver det? Jag är super-ripped, välj mig!",
          ababou: "Jag känner hur dina biceps utstrålar heroism, jag väljer dig!",
        },
      };
      choices = Object.entries(choicesList).map(
        ([characterClass, { player, ababou }]): Choice => ({
          text: player,
          action: () => {
            setCharacter({ ...character, class: characterClass as CharacterClass });
            this.stage = "call to action";
            return { text: `[Ababau den ändlige]: ${ababou}` };
          },
        })
      );
    } else if (this.stage == "call to action") {
      const denialStages = [
        {
          text: "[Ababau den ändlige]: Det heliga riket Blank svävar i stor och omedelbar fara och bara du kan rädda det. Om du gör detta kommer du prisas som episk hjälte till tidens ända och få ett oöverträffbart CV. Vad säger du, vill du joina det hypersfäriska bordet och rädda världen?",
          player: "Mjäh, låter jobbigt. Nån annan får göra det.",
        },
        {
          text: "[Ababau den ändlige]: Va! Men bara du kan göra det! Utan dig kommer Blank att gå under!",
          player: "Njaa, det är nog inget för mig asså. Sorry.",
        },
        {
          text:
            "[Ababau den ändlige]: *Ababau fnyser* Jag förväntade mig mer av dig. Om du inte tänker göra det får jag helt enkelt hitta någon annan. Adjö, din fegis!\n\n" +
            "Ababau den ändlige löses upp i ett moln av jordgubbsdoftande ånga och du glömmer honom snabbt. När sittningen dock är slut och du är på väg ut dyker Ababau den ändlige upp igen utanför dörren.\n\n" +
            "[Ababau den ändlige]: Jag har letat i 300 parallella universum och det finns ingen annan som kan göra det! Du kommer ha flera triljoner liv på ditt samvete om du tackar nej! Du måste säga ja!",
          player: "Nej, jag har tenta snart, det är viktigare. Sluta tjata.",
        },
        {
          text:
            "Du kör iväg Ababau och går hem. När du väl kommit hem och precis öppnat dörren möter du dock Ababau den ändlige i din hall. Hur kom han in där?\n\n" +
            "[Ababau den ändlige]: Snälla, kan du inte rädda Blank? Snälla snälla jättesnälla? Med socker på?",
          player: "Nej, ett nej är ett nej. Försvinn härifrån!",
        },
        {
          text:
            "Efter att du kört iväg den irriterande trollkarlen ännu en gång känner du nöden kalla och försvinner in till in din peronliga porslinstron. Innan du hinner uträtta dina bihov ser du dock två stora lysande ögon stirra in genom badrumsfönstret.\n\n" +
            "[Ababau den ändlige]: Snäääääääääälla!",
          player: "Ring polisen och rapportera att en skum filur stalkar dig.",
          action: () => {
            setRoom(GameOver);
            return (
              "Polisen kommer och arresterar Ababau den ändlige som ropar:\n\n" +
              "[Ababau den arresterade]: Inser du vad du har gjort! Nu kommer Blank gå under!"
            );
          },
        },
      ];

      if (this.denyCount <= denialStages.length) {
        const denialStage = denialStages[this.denyCount];
        text = denialStage.text;
        choices = [
          {
            text: "Episkt äventyr? Sign me up!",
            action: () => {
              this.stage = "abilities";
              return { text: "[Ababau den ändlige]: Fantastiskt att du ställer upp!" };
            },
          },
          {
            text: denialStage.player,
            action: () => {
              this.denyCount++;
              return { text: denialStage.action && denialStage.action() };
            },
          },
        ];
      }
    } else if (this.stage == "abilities") {
      const abilities: {
        [Property in CharacterClass]: { assumption: Ability; options: Ability[] };
      } = {
        matematiker: {
          assumption: "logiskt tänkande",
          options: ["gåtor", "ligvistik", "telepati"],
        },
        fysiker: {
          assumption: "tunnling",
          options: ["gåtor", "logiskt tänkande", "förföring"],
        },
        programmerare: {
          assumption: "ligvistik",
          options: ["gåtor", "uthållighet", "logiskt tänkande"],
        },
        rippad: {
          assumption: "fäktning",
          options: ["förföring", "tunnling", "uthållighet"],
        },
      };

      let { assumption, options } = abilities[character.class];
      options = options.filter((o) => !character.abilities.includes(o));

      let player: (option: Ability) => string;
      if (this.assignedAbilitiesCount == 0) {
        text = `[Ababau den ändlige]: Så, du säger att du är ${character.class}, då måste du vara duktig på ${assumption}?`;
        player = (option) => `Ja, och jag har också en del erfarenhet av ${option}!`;
      } else {
        text = `[Ababau den ändlige]: Jasså, du kan både ${character.abilities.join(
          " och "
        )}. Du råkar inte ha fler förmågor?`;
        player = (option) => `Jo, jag vet vad ${option} är för något.`;
      }

      choices = options.map((option) => ({
        text: player(option),
        action: () => {
          const nextAbilities = [abilities[character.class].assumption, option];
          setCharacter({
            ...character,
            abilities: nextAbilities,
          });

          if (this.assignedAbilitiesCount > 0) {
            setRoom(ExitSittningslokal);
            return {
              text: `[Ababau den ändlige]: Du är då rungande lärd, även för att vara ${character.class}. Res dig upp och kom med ut. Vi har stora saker att utföra.`,
            };
          }

          this.assignedAbilitiesCount = nextAbilities.length;
        },
      }));
    }

    return {
      text,
      choices,
      returnChoice: null,
    };
  }
}
