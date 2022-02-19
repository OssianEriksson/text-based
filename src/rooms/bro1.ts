import Bro2 from "./bro2";

export default class Bro1 implements Room {
  private stage: "introduction" | "troll battle" | "troll defeat" = "introduction";
  private igenMessage : string = "";
  private inBattle: boolean = false;
  private enemyAttack: "startWait" | "fagocytos" | "cellgift" = "startWait";
  private giftCount: number = 0;
  private positionOnBridge: -1 | 0 | 1 = 0;

  getRoom({ setRoom, character, setCharacter }: GameEnvironment) {
    let text: string = "";
    let choices: Choice[] = [];
    let currentHP = character.hp;
    const swimDamage: number = 5;
    const fagDamage: number = 2E-14;
    const giftDamage: number = 1E-14;

    const swimChoice: Choice = {
      text: "Försök simma över ån" + this.igenMessage + ".",
      action: () => {
        currentHP -= swimDamage;
        setCharacter({...character, hp: currentHP});
        text = "Du försöker simma över ån" + this.igenMessage + " men strömmen är för stark" + this.igenMessage + ". Du misslyckas och tar " + swimDamage + " hp skada" + this.igenMessage + ".";
        this.igenMessage = " igen"
        return { text: text};
      },
    };

    if (this.stage == "introduction") {
      text = "Efter den långa vandringen genom skogen kommer du fram till en kort men bred bro i tidig antik stil med höga marmorkolonner och statyer föreställande lättklädda mikroorganismer. Bron går över en djup och bred å med en stark ström. Det finns ingen levande varelse så långt du kan se och ingen annan väg över.";
      
      choices = [
        {
          text: "Försök gå över bron.",
          action: () => {
            this.stage = "troll battle";
            this.inBattle = true;
            return { text: "Så fort du sätter din fot på den vita marmorn ser du hur något dyker upp från brons undersida och hoppar upp framför dig med ofattbart snabba parkouriga rörelser. Vid första anblick tror du att ett mesigt troll försöker blockera din väg, men när den mystiska varelsen stannat upp ser du till din förskräckelse att det är något mycket värre!\n\n" +

            "[Amöban Möbius]: Jag är Möbius Amöba, du dödade min bror, förbered dig på att dö!\n\n" + 
            
            "Amöban Möbius står i din väg. Vad gör du?"};
          },
        },
        swimChoice,
      ];
    } else if (this.stage == "troll battle") {
      if (this.inBattle) {
        if (this.enemyAttack == "startWait") {
          this.enemyAttack = "fagocytos";
        }
        else if (this.enemyAttack == "fagocytos") {
          currentHP -= fagDamage;
          setCharacter({...character, hp: currentHP});
          text = "Amöban Möbius använder fagocytos och fagocyterar en av dina döda hudceller. Du tar " + fagDamage + " hp skada.";
          this.enemyAttack = "cellgift";
        } else if (this.enemyAttack == "cellgift") {
          text = "Amöban Möbius använder cellgift. Du tar " + giftDamage + " hp skada under 3 rundor.";
          this.giftCount = 3;
          this.enemyAttack = "fagocytos";
        }

        if (this.giftCount > 0) {
          currentHP -= giftDamage;
          setCharacter({...character, hp: currentHP});
          this.giftCount--;
          text += "\n\nDu tar " + giftDamage + " hp skada på grund av cellgift. Du är förgiftad i " + this.giftCount + " rundor till.";
        }

        text += "\n\nAmöban Möbius står fortfarande i din väg. Vad gör du? hp: " + character.hp;
      }
      choices = [
        {
          text: "Trampa på honom.",
          action: () => {
            return { text: "Du försöker trampa på Möbius, men han är så liten att han försvinner in i marken under din sko.\n\n" + 
            
            "[Amöban Möbius]: Bra försök, men jag är för snabb och smidig för att träffas av dina attacker. Inse att du är utklassad!"};
          },
        },
        {
          text: "Förvirra honom genom att citera _______ termoföreläsningar.",
          action: () => {
            return { text: "Du börjar gå igenom ruskigt förvirrande innehåll från termon, men Möbius verkar helt opåverkad.\n\n" + 
            
            "[Amöban Möbius]: HA! Jag förutsåg att du skulle försöka förvirra mig med termoföreläsningar, därför har jag läst in hela förra årets kursinnehåll. Jag förstår allt vad du pratar om!"};
          },
        },
        {
          text: "Förför honom genom att vädja till hans ofattbara storhet och styrka.",
          action: () => {
            if (character.abilities.includes("förföring")) {
              this.stage = "troll defeat";

              return { text: "[Amöban Möbius]: Åh, jag vet inte, du är inte så dum du heller. Vet du vad, eftersom du är så stilig låter jag dig passera. Ta det försiktigt.\n\n" + 
              
              "Du känner en rysning genom kroppen när Amöban Möbius skickar en slängkyss åt ditt håll. Efter den svåra och lite obehagliga striden går du vidare genom skogen."};
            }
            else {
              return { text: "[Amöban Möbius]: Ah, jag hör att du inser vilken episk krigare jag är. I så fall borde du också inse att du är chanslös. Det är bara att ge upp!"};
            }
          },
        },
        {
          text: "Gå över bron.",
          action: () => {

            if (this.positionOnBridge != 0) {
              this.stage = "troll defeat";
              return { text: "Du lyckas gå förbi Möbius som blir skitförbannad.\n\n" + 
              
              "[Amöban Möbius]: Vänta! Kom tillbaka, din fegis! Jag är inte klar med dig! Kom och slåss som en riktigt eukaryot! Hör du mig? Kom hit du din bakterie!"}
            }
            else {
            return { text: "Du försöker gå rakt fram, men Amöban Möbius står i din väg och låter dig inte passera.\n\n" + 
            
            "[Amöban Möbius]: Din idiot! Om du vill ta dig förbi mig måste du försöka hårdare än så!"};
            }
          },
        },
        {
          text: "Attackera med ditt vapen",
          action: () => {

            return { text: "Du försöker träffa Amöban Möbius med ditt vapen, men han är så liten att du inte lyckas.\n\n" + 
            
            "[Amöban Möbius]: Dina attacker är lönlösa. Inget vapen kan träffa mig!"};
          },
        },
        {
          text: "Gå åt höger",
          action: () => {

            text = "";

            if (this.positionOnBridge == 1) {
              text += "Du befinner dig redan på brons högra sida.";
            }
            else {
              this.positionOnBridge++;
              text += "Du går åt höger.";
            }

            return { text: text + "\n\n[Amöban Möbius]: Jag förstår, du försöker undvika min attacker men det är lönlöst. Smaka på det här!"};
          },
        },
        {
          text: "Gå åt vänster",
          action: () => {

            text = "";

            if (this.positionOnBridge == -1) {
              text += "Du befinner dig redan på brons vänstra sida.";
            }
            else {
              this.positionOnBridge--;
              text += "Du går åt vänster.";
            }

            return { text: text + "\n\n[Amöban Möbius]: Jag förstår, du försöker undvika min attacker men det är lönlöst. Smaka på det här!"};
          },
        },
        {
          text: "Tunnla igenom honom.",
          action: () => {

            return { text: "Du försöker tunnla igenom Möbius, men han är för liten för att du ska kunna hitta honom!"};
          },
        },
        {
          text: "Insistera på att du inte dödade hans bror.",
          action: () => {

            return { text: "Du försöker förklara för Möbius att du inte dödat hans bror, men han tror dig inte!\n\n" + 
            
            "[Amöban Möbius]: HA! Försök inte, jag såg minsann hur du skoningslöst trampade ihjäl honom precis innan du klev upp på bron. Jag såg onskan i dina ögon när du illvilligt klämde livet ur honom!"};
          },
        },
        swimChoice,
      ];
    } else if (this.stage == "troll defeat") {
      text = "Du besegrade Amöban Möbius!";
      choices = [
        {
          text: "Gå vidare.",
          action: () => {
            setRoom(Bro2);
          },
        },
      ];
    }

    return {
      text,
      choices,
    }
  }
}
