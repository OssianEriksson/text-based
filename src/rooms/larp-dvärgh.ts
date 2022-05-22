import { Choice, Consequence, Room } from "../game"
import battleChoices, { AttacksBattleState, generatePlayerAttacks } from "../helpers/batteChoices"
import { createGameOverRoom } from "../helpers/gameOver"
import { Character } from "../player"
import { VetenskapspersonA, VetenskapspersonB } from "./vetenskapsperson"

type LarpDvärghBattleState = AttacksBattleState

const LarpDvärghBattle: Room<LarpDvärghBattleState> = function (args) {
  if (!this.state) {
    this.state = {
      opponentHp: 100,
      opponentName: "dvärghen",
    }
  }

  const state = this.state as LarpDvärghBattleState

  const onDefeat = () => ({
    text: "Du har tagit så mycket skada att du dör. Dvärghen har besegrat dig.",
    room: createGameOverRoom(),
  })

  return {
    text: "Dvärghen står ursinning framför dig, på väg att gå till anfall! Vad gör du?",
    choices: battleChoices(
      args,
      state,
      generatePlayerAttacks(args, state, VetenskapspersonB, [
        {
          onChoose: () => {
            args.player.hp -= 15
            return {
              text: "Dvärghen hugger dig med sin hacka. Du tar 15 hp skada.",
            }
          },
          onDefeat,
        },
      ])
    ),
  }
}

type State = {
  visited: boolean
}

const LarpDvärgh: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = { visited: false }
  }

  const state = this.state as State

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
  })

  const regretChoice: Choice = {
    text: "Förlåt för att jag varit jobbig, finns det något jag kan göra för er? Jag insåg inte vilken sida jag stödde.",
    onChoose: () => ({ room: regretRoom }),
  }

  const historyConsequence: Consequence = {
    text:
      "[Dvärgh]: Vi var en gång en del av ett stort land, som skulle rädda hela Lagomgård från magisk degeneration... men jag måste börja tidigare.\n\n" +
      "[Dvärgh]: En man som då kallades Zhou Enlai, en obildad soldat tillhörande det förskräkliga orkiska riket. Han tvingades nämligen avbryta sin utbildning för att gå med i armen under det första alviska kriget (EW1) eftersom hans stamm, en av de flera människostammar som förtrycktes under det förfärliga riket, var så nära gränsen till svartalfernas förfallande rike.\n\n" +
      "[Dvärgh]: Nåväl, han dödade många alver under kriget och visade sig vara den bästa generalen riket någonsin skådat, men han hade drömmar om något bättre. Du måste förstå att det reaktionära riket riskerade rejälkollaps redan riktigt tidigt under EW1 och riket hade inte ännu gått under tack vare Buruka... jag menar Enlai, han hade ju inte ännu bytt namn. Var var jag? Ja juste. Det var då, när han tillfälligt var i rikets huvudstad, NAMN, för att diskutera militärstrategi med de förfärliga fem, ledarna för riket, som han mötte en ork, den mest perfekta orken i vår historia, den enastående Khorloogiin Choibalsan. Hen, för Choibalsan tillhörde N-by:n, den störste men mest förtryckta av orkstammar, övertalade honom om vad som måste göras för att bli av med lidandet.\n\n" +
      '[Dvärgh]: Tillbaka på fronten höll Enlai tal för sina trupper om hur staten borde ha mångfall, förlita sig på Choibalsans idéer och gå ifrån magi och till en mer upplyst tid. Men då han fokuserade på detta tog alverna ner mark, framförallt amasonerna, och han han fick problem med de fruktansvärda fem och fick fly med sina trupper då de fem skulle avsätta honom. Han skrev till sin vän Choibalsan, men nu med ett hemligt namn som han strupper givit honom, Burukaveel, ty hans vilja var starkare än stål. Choibalsan använde kollapsen på den västra fronten som argument för att de fruktansvärda fem hade misslyckats och efter mycket om och men, efter att vissa andra tagit till våld för att kopiera den falska "demokratin" som alverna förespråkade, där endast de som bodde som högst i trädtopparna hade makt och där magi hedrades över allt annat, även intelekt, lyckades hen använda Burukaveel och hans armé för att ta makten. De krossade de falska revolutionärerna och flera av dem flydde till alverna.\n\n' +
      '[Dvärgh]: Inbördeskriget var långt och hårt, men tillslut vann vi och Burukaveel ledde sina trupper mot de invaderande alverna, han tog Beztown! Men när ett fredsavtal skrivits var Choibalsan redan död. Alverna ljuger när de säger att en ork dödade henom för att hen ville ha mer demokrati, nej vi vet alla att hen jobbade för Amasonerna, eller svartalverna, vem spelar ingen roll, för de anade inte vad som skulle ske. Burukaveel tvingades ta makten, alla andra som stod nära Choibalsan var för inkompetenta och några köpta av alver dessutom, han fick göar sig av med dem. Burukaveel var den bäste ledaren någonsin, Choibalsan kanske hade varit bättre om hen haft chansen att styra längre. Under Choibalsans begravning läser Burukaveel en dikt tillägnat henom och henoms liv. Inte mycket finns kvar av den, men vi vet nu från det vi funnit att Khorloogiin Choibalsan och var ett "falkst" namn, men vi har ingen aning om vad hens namn var vi födseln.\n\n' +
      "[Dvärgh]: Burukaveel, solen av de förenade follkgruppernas stammar för vetenskaplig utveckling (FFSV) ledde oss till storhet och arbetade outtröttligt från dess han fick makten vid 23 års ålder tills dess att han blev mördad av amasonerna.\n\n" +
      "[Dvärgh]: Den demokratin Burukaveel framförde var bättre än den alverna förutspråkade. Hen, jag menar han och hans allierade gav oss lagar och vi hade folkomröstning om allt, nästan alla deltog.\n\n" +
      "[Dvärgh]: Men 50 år senare i sltet av det andra alviska kriget (EW2) lyckades alverna förgöra vår stat, det härliga FFSV, genom list. En ung man som låtsades tillhöra oss smög in och dödade den store Burukaveel i sin sömn. han ångrade den senare och dog för några år sedan. Det är hemskt. När vår ledare dött lyckades alverna ta hela Amasonen och flera stammar togsöver av magikerälskande svin och unionen kollapsade. I dessa områden skyller man fortfarande på Burukaveel för all misär, trotts att magin regerat lika lång tid som han regerade.\n\n" +
      "[Dvärgh]: Enbart N-by höll kvar i vår anti-magiska ideologi, vi flydde hit till det ensammare berget. Många i vår stam hade forskat om dvärgarna och vi beslutade oss för att låtsas vara dvärgar. Men tillslut så insåg vi att vi var det på riktigt. Att vara en dvärgh är inte att avra enras, det är en kultur, vissa anser inte att vi ska ha yxor och hackor eller växa skägg. Dessa revisionärer vet inte vad de talar om. N-by är död, länge leve dvärgarna! Det var 60 år sedan FFSV:s fall, alla orker (kullturmässigt, inte etniskt) har gått över till magins sida, men om vi arbetar för ett mångkulturelt och icke-magskt samhälle så ska resten av världen bli till Khorloogiin-Burukaveelister! Länge leve FFSV!...\n\n" +
      "[Dvärgh]: Det värsta med FFSV:s fall är att de originella dvärgarna dödades av alverna, vi vet inte allt som vi borde veta om dem på grund av detta, de var också icke-binära, och troligtvis kortare, men det kanske var att de inte hade nog med mat... Vi kan inte deras språk och vet enbart lite av deras kultur, vilken vi nu använder själva. Vår historia är en sorglig en, men ändå bra, vi har fått smaka på storhet och kommer få det igen. Dock om du vill veta mer får du ta och läsa en bok.\n\n" +
      "Du säger att du förstår, att det dvärghen berättar är hemskt och att den där Burukaveel verkar ha vart riktigt bra. Du uttrycker att du borde ägna hela mitt liv för att försvarar honom mot all kritik, speciellt på nätet!\n\n" +
      "Dvärghen blir skiner upp när du sympatiserar med hen, och säger att det finns någonting du kan göra för att hjälpa.",
    room: regretRoom,
  }

  const visited = state.visited
  state.visited = true

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
                              // {
                              //   text: "Svara 'Ja jag är en magiker, men jag förstår inte varför det är dåligt?'",
                              //   onChoose: () => ({
                              //     room: () => ({
                              //       text: "[Dvärgh]: Magiker jobbar emot vetenskap och enbart vetenskap kan rädda världen från den mörka erans lidande.",
                              //       choices: [
                              //         {
                              //           text: "Svara 'Magi är bäst, hedning' och gå till attack!",
                              //           onChoose: () => ({ room: LarpDvärghBattle }),
                              //         },
                              //         {
                              //           text: "Svara 'Hmm, jag kan se att magi kan, i vissa personers händer jobba emot vetenskap, det vill jag förstås inte. Om det är så att jag varit på fel sida... Kan jag hjälpa er på något sätt, med vetenskap?'",
                              //           onChoose: () => ({ room: regretRoom }),
                              //         },
                              //       ],
                              //     }),
                              //   }),
                              // },
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
                    ? historyConsequence
                    : { room: LarpDvärghBattle },
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
  }
}

export default LarpDvärgh
