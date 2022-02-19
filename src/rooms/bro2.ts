import GameOver from "./game-over";
import abstractBattleRoom from "./abstractBattleRoom";
import { Game } from "../game";

export default class Bro2 extends abstractBattleRoom {
  //private stage: "introduction" | "troll battle" | "troll defeat" = "introduction";
  private igenMessage : string = "";
  private nextEnemyAttack: "startWait" | "ciliepiska" | "sötvattenmagi" = "startWait";

  override nextRoom = GameOver;

  override generateIntroText({}: GameEnvironment){
    return "Efter att ha lyckats undfly Amöban Möbius fortsätter du din vandring och kommer snabbt fram till en ny bro. Den här gången är det en mycket smal bro i sen gotisk stil som löper över en ravin fylld med vassa pålar. Det finns ingen levande varelse så långt du kan se och ingen annan väg över."
  };

  makeSwimChoice(): Choice {
    const swimDamage: number = 5;
    return {
      text: "Försök simma över ravinen" + this.igenMessage + ".",
      action: () => {
        this.changeHP(-swimDamage);
        let text: string = "Du försöker simma över ravinen" + this.igenMessage + " men du kan inte simma på pålar" + this.igenMessage + ". Du misslyckas och tar " + swimDamage + " hp skada" + this.igenMessage + ".";
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
        return { text: "Så fort du sätter din fot på den gotiska stenen ser du hur något går mot dig från andra sidan bron. Det är en varelse iklädd svart heltäckande rustning men med tofflor istället för stövlar. Först tror du att det är en ofarlig orc men sen inser du till din stora fasa vad det egentligen är!\n\n" +

        "[Toffeldjuret Toffoleau]: HÅHÅ! Jag är Toffeldjuret Toffoleau, väktare över bro nummer 2, denna bro som du valt att begå. om du andra sidan vill nå måste du besegra mig, sådeså!\n\n" + 
        
        "Toffeldjuret Toffoleau iklädd svart rustning och tofflor står i din väg. Vad gör du?"};
      },
    },
    this.makeSwimChoice(),
    ];
  }

  override enemyAttacks({ character }: GameEnvironment) {
    const cilDamage: number = 2E-14;
    const waterDamage: number = 3E-14;
    let text: string = "";

    if (this.nextEnemyAttack == "startWait") {
      this.nextEnemyAttack = "ciliepiska";
    } else {
      if (this.nextEnemyAttack == "ciliepiska") {
        this.changeHP(-cilDamage);
        text = "Toffeldjuret Toffoleau använder ciliepiska och piskar dig med sina cilier. Du tar " + cilDamage + " hp skada.";
        this.nextEnemyAttack = "sötvattenmagi";
      } else if (this.nextEnemyAttack == "sötvattenmagi") {
        this.changeHP(-waterDamage * 0.01 * character.hp);
        text = "Toffeldjuret Toffoleau använder magi från sötvattensjöar, dess naturliga habitat. Du tar " + waterDamage + "% av din nuvarande hp som skada.";
        this.nextEnemyAttack = "ciliepiska";
      }
    }

    text += "\n\nToffeldjuret Toffoleau iklädd svart rustning och tofflor står fortfarande i din väg. Vad gör du? hp: " + character.hp;

    return text;
  }

  override generateBattleChoices({ character }: GameEnvironment) {
    return [
      {
        text: "Krossa honom med din tå.",
        action: () => {
          this.stage = "enemy defeat"

          return { text: "Toffoleaus rustning är så stor och tung att han inte hinner undvika din tå utan krossas skoningslöst.\n\n" + 
          
          "[Toffeldjuret Toffoleau]: OH NO! Jag blev krossad av din tå. Du besgrade mig, så vidare du får gå. Hejdå."};
        },
      },
      {
        text: "Förvirra honom genom att citera _______ numerisk-analys-föreläsningar.",
        action: () => {
          return { text: "Du börjar gå igenom ruskigt förvirrande innehåll från numalgen, men Toffoleau står emot.\n\n" + 
          
          "[Toffeldjuret Toffoleau]: HÅ! Jag kunde spå att numerisk analys du skulle tillgå. Jag har därför kollat på Kopior av föreläsningsanteckningar, håhå. Allt du säger kommer jag förstå!"};
        },
      },
      {
        text: "Förför honom genom att vädja till hans imponerande rustning och spartanska tofflor.",
        action: () => {
          return { text: "[Toffeldjuret Toffoleau]: No no no, Amöban Möbius kanske dina trick går på, men ditt smicker biter inte på Toffoleau!"};
        },
      },
      {
        text: "Gå över bron.",
        action: () => {
        return { text: "Du försöker gå rakt fram, men Toffeldjuret Toffoleau står i din väg och låter dig inte passera.\n\n" + 
        
        "[Toffeldjuret Toffoleau]: Din idiot! Om du förbi mig vill gå måste du försöka hårdare än så!"};
        },
      },
      {
        text: "Attackera med ditt vapen",
        action: () => {
          if (character.abilities.includes("fäktning")) {
            this.stage = "enemy defeat"

            return { text: "Tack vare dina episka fäktningsskills lyckas du träffa Toffoleau trots att han är pytteliten. \n\n" + 
            
            "[Toffeldjuret Toffoleau]: OH NO! Ditt vapen träffade mig prick på. Jag kan din attack inte emotstå. Du har mig besegrat, jag säger så! Till andra sidan, du får gå."};
          } else {
            return { text: "Du försöker träffa Toffeldjuret Toffoleau med ditt vapen, men trots rustningen är han för liten för att du ska träffa rätt. \n\n" + 
            
            "[Toffeldjuret Toffoleau]: Kom an då! Är du inte bättre än så? Du behöver vara skickligare om du mig ska klå."};
          }
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
      this.makeSwimChoice(),
    ];
  }

  override generateDefeatText({}: GameEnvironment) {
    return "Du besegrade Toffeldjuret Toffoleau!";
  }
}