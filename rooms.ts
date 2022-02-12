export class Sittningslokal implements Room {
  private stage: "introduction" | "call to action" | "abilities" = "introduction";
  private denyCount: number = 0;
  private assignedAbilitiesCount: number = 0;

  getInfo({ setRoom, character, setCharacter }: GameEnvironment) {
    let roomInfo: string = "";
    let choices: Choice[] = [];
    if (this.stage == "introduction") {
      roomInfo =
        "Du befinner dig på en sittning med faddergruppen 256. Det är trevligt men lite tråkigt och du känner hur lusten för ett episkt äventyr bubblar inom dig (eller är det bara förrätten?)\n" +
        "  Plötsligt dyker en mystisk gubbe upp från tomma intet och börjar prata högt.\n\n" +
        "[Ababau den ändlige]: Mitt namn är Ababau den ändlige. Jag söker någon med ett heroiskt intellekt som kan rädda världen. Finns här någon sådan?";
      const choicesList: {
        [Property in CharacterClass]: { player: string; ababou: string };
      } = {
        matematiker: {
          player: "Jag har mäktiga matteskills, välj mig!",
          ababou: "Ett mattesnille, helt magnifikt!",
        },
        fysiker: {
          player: "Jag har fabulösa fyskförmågor, välj mig!",
          ababou: "En fysiker, exakt vad jag förväntade mig!",
        },
        programmerare: {
          player: "Jag är påfallande bra på att programera, välj mig!",
          ababou: "En programmerare, det är ju perfekt!",
        },
        rippad: {
          player: "Intellekt? Vem behöver det? Jag är super-ripped, välj mig!",
          ababou: "Jag kännder hur dina biceps utstrålar heroism, jag väljer dig!",
        },
      };
      choices = Object.entries(choicesList).map(
        ([characterClass, { player, ababou }]): Choice => ({
          text: player,
          action: () => {
            console.log(`[Ababau den ändlige]: ${ababou}`);
            setCharacter({ ...character, class: characterClass as CharacterClass });
            this.stage = "call to action";
          },
        })
      );
    } else if (this.stage == "call to action") {
      const denialStages = [
        {
          roomInfo:
            "[Ababau den ändlige]: Det heliga riket Blank svävar i stor och omedelbar fara och bara du kan rädda det. Om du gör detta kommer du prisas som episk hjälte till tidens ända och få ett oöverträffbart CV. Vad säger du, vill du Joina det hypersfäriska bordet och rädda världen?",
          player: "Mjäh, låter jobbigt. Nån annan får göra det.",
        },
        {
          roomInfo: "[Ababau den ändlige]: Va! Men bara du kan göra det! Utan dig kommer Blank att gå under!",
          player: "Njaa, det är nog inget för mig asså. Sorry.",
        },
        {
          roomInfo:
            "När sittningen är slut och du är på väg ut dyker Ababau den ändlige upp utanför dörren.\n\n" +
            "[Ababau den ändlige]: Är du verkligen säker på ditt val? Du kommer ha flera triljoner liv på ditt samvete om du tackar nej! Du måste göra det!",
          player: "Nej, jag har tenta snart, det är viktigare. Sluta tjata.",
        },
        {
          roomInfo:
            "När du väl kommit hem och precis öppnat dörren ser du Ababau den ändlige i din hall. Hur kom han in där?\n\n" +
            "[Ababau den ändlige]: Snälla, kan du inte rädda Blank? Snälla snälla jättesnälla? Med socker på?",
          player: "Nej, ett nej är ett nej. Försvinn härifrån!",
        },
        {
          roomInfo:
            "Efter att du kört iväg den irriterande trollkarlen känner du nöden kalla och försvinner in till in din peronliga porslinstron. Innan du hinner uträtta dina bihov ser du dock två stora lysande ögon stirra in genom badrumsfönstret.\n\n" +
            "[Ababau den ändlige]: Snäääääääääälla!",
          player: "Ring polisen och rapportera en skum filur stalkar dig.",
          action: () => {
            console.log(
              "Polisen kommer och arresterar Ababau den ändlige som ropar:\n\n" +
                "[Ababau den arresterade]: Inser du vad du har gjort! Nu kommer Blank gå under!"
            );
            setRoom(GameOver);
          },
        },
      ];

      if (this.denyCount <= denialStages.length) {
        const denialStage = denialStages[this.denyCount];
        roomInfo = denialStage.roomInfo;
        choices = [
          {
            text: "Episkt äventyr? Sign me up!",
            action: () => {
              console.log("[Ababau den ändlige]: Fantastiskt att du ställer upp!");
              this.stage = "abilities";
            },
          },
          {
            text: denialStage.player,
            action: () => {
              this.denyCount++;
              denialStage.action && denialStage.action();
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
        roomInfo = `[Ababau den ändlige]: Så, du säger att du är ${character.class}, då måste du vara duktig på ${assumption}?`;
        player = (option) => `Ja, och jag har också en del erfarenhet av ${option}!`;
      } else {
        roomInfo = `[Ababau den ändlige]: Jasså, du kan både ${character.abilities.join(
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
            console.log(
              `[Ababau den ändlige]: Du är då mer lärd än jag förväntade mig av en ${character.class}. Jag ser fram emot våra äventyr tillsammans.`
            );

            setRoom(GameOver);
          }

          this.assignedAbilitiesCount = nextAbilities.length;
        },
      }));
    }

    return {
      roomInfo,
      choices,
      disableReturnChoice: true,
    };
  }
}

export class GameOver implements Room {
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
