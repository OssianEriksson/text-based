import GameOver from "./game-over";
import abstractBattleRoom from "./abstractBattleRoom";
import { Game } from "../game";
import { TypeParameter, TypePredicate, TypeVariable } from "typescript";

export default class Bro3 extends abstractBattleRoom {
  //private stage: "introduction" | "troll battle" | "troll defeat" = "introduction";
  private igenMessage : string = "";
  private nextEnemyAttack: "startWait" | "metanmoln" | "hypertermofil blast" = "startWait";
  private enemyConfused: boolean = false;
  private argumentPath: "before" | "ready" | "last" = "before";
  override nextRoom = GameOver;

  override generateIntroText({}: GameEnvironment){
    return "Duellen mot Toffoleau lämnar dig skakad när du fortsätter genom skogen. Efter ett tag ser du en god och en dålig nyhet. Den goda nyheten är att du ser skogens slut på andra sidan en flod, den dåliga är att floden består av lava. Över lavafloden går en lagom bred bro i art nouveau stil. Det finns återigen ingen levande varelse så långt du kan se och ingen annan väg över."
  };

  makeSwimChoice(): Choice {
    const swimDamage: number = 5;
    return {
      text: "Försök simma över lavafloden" + this.igenMessage + ".",
      action: () => {
        this.changeHP(-swimDamage);
        let text: string = "Du försöker simma över floden" + this.igenMessage + " men bränner dig på lavan" + this.igenMessage + ". Du misslyckas och tar " + swimDamage + " hp skada" + this.igenMessage + ".";
        this.igenMessage = " igen"
        return { text: text};
      },
    }
  };

  override generateIntroChoices({}: GameEnvironment) {
    return [{
      text: "Försök gå över bron.",
      action: () => {
        this.stage = "battle";
        return { text: "Så fort du sätter din fot på art nouveau stenen känner du en varm vindpust och med den flyger en ny fiende in som blockerar din väg! Men vad är det för något? Är det en fågel? Är det ett flygplan? Nej, det är något mycket värre\n\n" +

        "[Arkén Kalle]: HEHEHE! Jag är Kalle Arké, väktare av bro nummer 3, denna bro som du här kan se. Du måste besgra mig med, om till andra sidan dig vill bege.\n\n" + 
        
        "Arkén Kalle virvlar runt i luften och blockerar din väg. Vad gör du?"};
      },
    },
    this.makeSwimChoice(),
    ];
  }

  override enemyAttacks({ character }: GameEnvironment) {
    const metDamage: number = 2E-14;
    const termoDamage: number = 3E-14;
    let text: string = "";

    if (this.nextEnemyAttack == "startWait") {
      this.nextEnemyAttack = "metanmoln";
    } else {
      if (this.nextEnemyAttack == "metanmoln") {
        this.changeHP(-metDamage);
        text = "Arkén Kalle använder metanmoln och sprutar metan på dig. Du tar " + metDamage + " hp skada.";
        this.nextEnemyAttack = "hypertermofil blast";
      } else if (this.nextEnemyAttack == "hypertermofil blast") {
        this.changeHP(-termoDamage * 0.01 * character.hp);
        text = "Arkén Kalle framkallar varmluft från vulkaniska källor, dess naturliga habitat. Du tar " + termoDamage + "% av din nuvarande hp som skada.";
        this.nextEnemyAttack = "metanmoln";
      }

      if (this.argumentPath == "before") {
        this.argumentPath = "ready";
      }
    }

    text += "\n\nArkén Kalle virvlar fortfarande runt i din väg" + (this.enemyConfused ? [", märkbart förvirrad"] : [""]) + ". Vad gör du? hp: " + character.hp;

    return text;
  }

  override generateBattleChoices({ character, inventory }: GameEnvironment) {
    return [
      {
        text: "Smäll honom med dina händer.",
        action: () => {
          return { text: "Du försöker smälla till kalle, men han flyger iväg i luftflödet från din hand.\n\n" + 
          
          "[Arkén Kalle]: Det är ingen idé! Jag förutsåg att du skulle försöka smälla mig med dina händer. Du kommer aldrig besegra mig sådär!"};
        },
      },
      
      {
        text: "Förvirra honom genom att citera _______ linjär-algebra-föreläsning.",
        action: () => {
          if (character.abilities.includes("gåtor")) {
            this.enemyConfused = true;

            return { text: "Med dina kunskaper om gåtor börjar du rabbla upp fruktansvärt förvirrande och gåtfulla aspekter av linalgen vilket påverkar Kalle märkbart.\n\n" + 
            
            "[Arkén Kalle]: Vafalls! Hur kan du ha så djupgående kunskaper om linjär algebra? Det här kom inte på någon av tentorna jag övat på! Jag känner mig helt förvirrad..."};

          } else {
            return { text: "Du börjar rabbla upp förvirrande innehåll du minns från linalgen, men Kalle står emot.\n\n" + 
            
            "[Arkén Kalle]: HEHE, det är lönlöst. Jag förutsåg att du skulle försöka förvirra mig med linjär algebra, därför har jag övat på inte mindre än 15 gamla linalg-tentor! Det finns inget du kan göra som jag inte redan förutsett!"};
          }
        },
      },
      {
        text: "Förför honom genom att vädja till hans flödande dynamik och heta hypertermofili.",
        action: () => {
          return { text: "[Arkén Kalle]: Ah, du tänkte säkert att du kunde förföra mig med dina smickrande vetenskapliga begrepp, men det du inte vet är att jag förutsåg ditt drag och inte låter mig luras! Inse att jag kan alla dina drag!"};
        },
      },
      {
        text: "Gå över bron.",
        action: () => {
        return { text: "Du försöker gå rakt fram, men Arkén Kalle flyger i din väg och låter dig inte passera.\n\n" + 
        
        "[Arkén Kalle]: HA! Du tänkte visst att du kunde smita förbi mig, men det är precis vad jag räknade ut att du skulle göra. Oavsett hur du rör dig kommer jag flyga i din väg, jag är förberedd på allt du kan komma på!"};
        },
      },
      {
        text: "Attackera med ditt vapen",
        action: () => {
          return { text: "Du försöker träffa Kalle Arké med ditt vapen, men han flyger runt för snabbt för att du ska kunna träffa. \n\n" + 
          
          "[Arkén Kalle]: "};
        },
      },
      {
        text: "Gå åt höger",
        action: () => {

          return { text: "Bron är för smal för att du ska kunna gå åt sidan.\n\n" + 
          
          "[Toffeldjuret Toffoleau]: HÅ HÅ HÅ! Det där kommer inte gå. Om du förbi mig vill nå måste du emot min råa styrka bestå!"};
        },
      },
      {
        text: "Gå åt vänster",
        action: () => {

          return { text: "Bron är för smal för att du ska kunna gå åt sidan.\n\n" + 
          
          "[Toffeldjuret Toffoleau]: HÅ HÅ HÅ! Det där kommer inte gå. Om du förbi mig vill nå måste du emot min råa styrka bestå!"};
        },
      },
      {
        text: "Tunnla igenom honom.",
        action: () => {

          return { text: "Du försöker tunnla igenom Toffoleau, men han är för liten för att du ska kunna fokusera på honom!\n\n" + 
          
          "[Toffeldjuret Toffoleau]: SÅ, du försöker tunnla genom Toffoleau, men det kommer inte gå! I en ärlig duell, du måste mig slå, om du andra sidan vill nå."};
        },
      },
      ...(character.abilities.includes("logiskt tänkande") ? [{
          text: "[Logiskt tänkande]: Vänta lite, en Arké kan väl inte prata!?",
          action: () => {
            this.stage = "enemy defeat";

            return { text: "Du inser att en Arké inte kan prata, än mindre förnimmas på något väsentligt vis och absolut omöjligen blockera din väg! Du bestämmer dig för att ignorera Kalle och gå förbi."};
          },
        }] : []),
      this.makeSwimChoice(),
      ...(this.argumentPath == "ready" ? [{
        text: "Insistera på att han omöjligen kan ha förutsett ALLA dina drag.",
        action: () => {
          this.argumentPath = "last";

          return { text: "Du insisterar på att Kalle inte kan vara så förutseende som han påstår, men han avfärdar dina argument.\n\n" + 
          
          "[Arkén Kalle]: Var försiktigt, du är minsann inte den första som underskattar min förutseende förmåga. Jag lovar dig, jag kan förutse alla framtida drag i vår duell!"};
        },
      }] : []),
      ...(this.argumentPath == "last" ? [{
        text: "Om han kan förutse alla drag i duellen borde han också förutse att han kommer dö av ålder innan han hinner åsamka dig någon märkbar skada.",
        action: () => {
          this.stage = "enemy defeat";

          return { text: "[Arkén Kalle]: HAHAHAHAHA... *tänker efter*... fan också. Okej, okej, jag vet när jag har förlorat en duell i logik. Du vinner, stick iväg innan jag ändrar mig."};
        },
      }] : []),
    ];
  }

  override generateDefeatText({}: GameEnvironment) {
    return "Du besegrade Arkén Kalle!";
  }
}