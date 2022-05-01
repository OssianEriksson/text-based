import { Choice, Room } from "../game";
import battleChoices, { AttacksBattleState, generatePlayerAttacks } from "../helpers/batteChoices";
import { createGameOverRoom } from "../helpers/gameOver";
import { Character } from "../player";
import VetenskapspersonA from "./vetenskapsperson-a";
import VetenskapspersonB from "./vetenskapsperson-b";

type LarpDvärghBattleState = AttacksBattleState;

const LarpDvärghBattle: Room<LarpDvärghBattleState> = function (args) {
  if (!this.state) {
    this.state = {
      opponentHp: 100,
      opponentName: "dvärghen",
    };
  }

  const state = this.state as LarpDvärghBattleState;

  const onDefeat = () => ({
    text: "Du har tagit så mycket skada att du dör. Dvärghen har besegrat dig.",
    room: createGameOverRoom(),
  });

  return {
    text: "Dvärghen står ursinning framför dig, på väg att gå till anfall! Vad gör du?",
    choices: battleChoices(
      args,
      state,
      generatePlayerAttacks(args, state, VetenskapspersonB, [
        {
          onChoose: () => {
            args.player.hp -= 15;
            return {
              text: "Dvärghen hugger dig med sin hacka. Du tar 15 hp skada.",
            };
          },
          onDefeat,
        },
      ])
    ),
  };
};

type State = {
  visited: boolean;
};

const LarpDvärgh: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = { visited: false };
  }

  const state = this.state as State;

  const regretRoom: Room = () => ({
    text: "[Dvärgh]: En familjemdelem till mig, Slartibartfast, jobbar på ett stort vetensakpligt problem. Du kan prata med hen, det kan hjälpa oss dvärgar i kommande generationer!",
    choices: [
      {
        text: "Gå och prata med vetenskapspersonhen",
        onChoose: () => ({
          room: VetenskapspersonA,
        }),
      },
    ],
  });

  const regretChoice: Choice = {
    text: "Förlåt för att jag varit jobbig, finns det något jag kan göra för er? Jag insåg inte vilken sida jag stödde.",
    onChoose: () => ({ room: regretRoom }),
  };

  const historyConsequence = {
    text:
      "[Dvärgh]: Vi var en gång en del av ett stort land, som skulle rädda hela Lagomgård från magisk degeneration... men jag måste börja tidigare.\n\n" +
      "[Dvärgh]: En man som då kallades Zhou Enlai, en obildad soldat tillhörande det förskräkliga orkiska riket. Han tvingades nämligen avbryta sin utbildning för att gå med i armen under det första alviska kriget (EW1) eftersom hans stamm, enb av de flera människostammar som förtrycktes under det förfärliga riket, var så nära gränsen till svartalfernas förfallande rike.\n\n" +
      "[Dvärgh]: Nåväl han dödade många alver under kriget och visade sig...",
  };

  const visited = state.visited;
  state.visited = true;

  return {
    text: visited
      ? "En dvärgh vaktar en dörr i bergsväggen. Hur ska du ta dig förbi dvärghen?"
      : "Du vandrar raskt vidare genom det steniga landskapet och befinner dig snart vid foten av det Ensammare Berget. Runt dig reser sig skarpa bergsväggar. Du känner på dig att ingången till dvärgharnas laboratorier måste finnas här någonstans i närheten.\n\n" +
        "Du rundar ett hörn, och plötsligt får du syn på en dvärgh som står vid en bergsväg en bit bort. Du släpper dvärghens ansikte med blicken en sekund och noterar att dvärghen, som också har ett stort skägg, står iförd byggarbetskläder och lutar sig mot en stor hacka. Dvärghen står brevid en dörr i bergsväggen. På dörren är en stor varningssymbol ditmålad. Det måste vara labbet du letar efter! Men hur ska du ta dig förbi dvärghen?",
    choices: [
      {
        text: "Attackera dvärghen!",
        onChoose: () => ({
          text: "Du anfaller dvärghen som blockerar dörren.",
          room: () => ({
            text: "[Dvärgh]: Va?! Varför anfaller du mig?! Vem är du?!",
            choices: [
              {
                text: "Fortsätt attackera dvärghen!",
                onChoose: () => ({
                  room: LarpDvärghBattle,
                }),
              },
              {
                text: "Svara 'Jag är döden, och du är mitt offer.'",
                onChoose: () => ({
                  text: "[Dvärgh]: Jag har inte dig något gjort din magikerälskare. Eran tyrani har skadat orker i evigheter, nu kommer ni och anfaller oss också!",
                  room: () => ({
                    choices: [
                      {
                        text: "Attackera dvärghen!",
                        onChoose: () => ({
                          room: LarpDvärghBattle,
                        }),
                      },
                      {
                        text: "Svara 'Vad menar du med att vi har anfallit orker?'",
                        onChoose: () => ({
                          room: () => ({
                            text: "[Dvärgh]: Vi är dvärgar, men våra syskon i den stora öknen blir konstant anfallna av magikerälskare som dig.",
                            choices: [
                              {
                                text: "Svara 'Vadå syskon, sen när är orker släkt med dvärgar?'",
                                onChoose: () => ({
                                  room: () => ({
                                    text: "[Dvärgh]: Vi är orker rasmässigt, men vi är dvärgar kulturmässigt, allt har att göra med den store Burukaveel.",
                                    choices: [
                                      {
                                        text: "Svara 'Ni är orker? Eww...' och gå till attack!",
                                        onChoose: () => ({ room: LarpDvärghBattle }),
                                      },
                                      {
                                        text: "Be dvärghen berätta mer.",
                                        onChoose: () => historyConsequence,
                                      },
                                      regretChoice,
                                    ],
                                  }),
                                }),
                              },
                              {
                                text: "Svara 'Vadå magiker, jag är ingen magiker?'",
                                onChoose: () => ({
                                  room: () => ({
                                    text: "[Dvärgh, sarkastiskt]: Aha, förlåt för förolämpningen, min bästa person, men vad har du annars här att göra?",
                                    choices: [
                                      {
                                        text: "Ni skövlar skog från Amazonerna, och förstör världen, jag måste ta hand om er.",
                                        onChoose: () => ({
                                          room: () => ({
                                            text: "[Dvärgh]: Och det ger dig rätt att bara gå in hit och göra vad du än tänkt göra? Vi gör vad vi måste för att överleva utan magi och med vetenskap.",
                                            choices: [regretChoice],
                                          }),
                                        }),
                                      },
                                    ],
                                  }),
                                }),
                              },
                              {
                                text: "Svara 'Ja jag är en magiker, men jag förstår inte varför det är dåligt?'",
                                onChoose: () => ({
                                  room: () => ({
                                    text: "[Dvärgh]: Magiker jobbar emot vetenskap och enbart vetenskap kan rädda världen från den mörka erans lidande.",
                                    choices: [
                                      {
                                        text: "Svara 'Magi är bäst, hedning' och gå till attack!",
                                        onChoose: () => ({ room: LarpDvärghBattle }),
                                      },
                                      {
                                        text: "Svara 'Hmm, jag kan se att magi kan, i vissa personers händer jobba emot vetenskap, det vill jag förstås inte. Om det är så att jag varit på fel sida... Kan jag hjälpa er på något sätt, med vetenskap?'",
                                        onChoose: () => ({ room: regretRoom }),
                                      },
                                    ],
                                  }),
                                }),
                              },
                            ],
                          }),
                        }),
                      },
                    ],
                  }),
                }),
              },
              {
                text: `Svara 'Jag är ${player.character} och jag ska rädda Amazonerna!'`,
                onChoose: () =>
                  (["matematiker", "fysiker"] as Character[]).includes(player.character)
                    ? { room: LarpDvärghBattle }
                    : historyConsequence,
              },
            ],
          }),
        }),
      },
      {
        text: "Försök lura bort dvärghen med förföring.",
        onChoose: () =>
          player.attributes.includes("förföra") || player.attributes.includes("smyga")
            ? {
                text: 'Du roppar flörtigt åt dvärghen att hen ska komma och hjälpa dig med din Warhammer-karaktär och dvärghen svarar omdelbart på dina rop efter hjälp, du tror att det var eftersom du lade till att du inte lyckat måla din Warhammer karaktärer rätt. När hen springer iväg för att hjälpa "dig" går du lungt in genom dörren.',
                room: VetenskapspersonA,
              }
            : {
                text:
                  "Du roppar åt dvärghen att hen ska komma och hjälpa dig med en flörtig röst, men dvärghen inser omdelbart att du försöker lura hen.\n\n" +
                  "[Dvärgh]: Du kommer inte lura mig, kom fram hit och berätta varför du vill in genom denna dörren.\n\n" +
                  "Fan, tänker du. Dags att anfalla...",
                room: LarpDvärghBattle,
              },
      },
      {
        text: "Försök tunnla genom dörren.",
        onChoose: () =>
          player.attributes.includes("tunnla")
            ? {
                text: "Du lyckas tunnla genom dörren!",
                room: VetenskapspersonA,
              }
            : {
                text: "Din tunnling misslyckas, men dvärghen har fortfarande inte upptäckt dig.",
              },
      },
      {
        text: "Försök ta dvärghens hacka.",
        onChoose: () =>
          player.attributes.includes("smyga")
            ? {
                text:
                  "Du är inte tillräckligt bra på att smyga, så Dvärghen upptäcker dig och begär veta varför du vill ta hens hacka, hen verkar något obekväm med händelsen.\n\n" +
                  "Fan, tänker du. Nu får vi väl slåss...",
                room: LarpDvärghBattle,
              }
            : {
                text: "Du lyckades med dina smygförmågor sno hackan och du gör en tunnel med den och behöver inte bli upptäkt genom att använda dörren!",
                room: VetenskapspersonA,
              },
      },
    ],
  };
};

export default LarpDvärgh;
