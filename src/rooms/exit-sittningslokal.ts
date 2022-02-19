import Bro1 from "./bro1";

export default class ExitSittningslokal implements Room {
  private visited: boolean = false;

  getRoom({ character, setRoom, setCharacter }: GameEnvironment) {
    const selectPreparationMethod = (
      text: string = `Du hasar dig upp från sittningsbordet medans du ursäktar dina bordsgrannar, helt i onödan eftersom de i sin ivriga disukssion knappt märkt av Ababou den ändliges märkliga uppdykande. Ababou som redan hunnit ut ur sittningslokalen väntar på dig utanför dörröppningen. Som den ${character.class} du är tänker du pragmatiskt att om man nu ska ge sig ut på ett uppdrag för att rädda ett helt rike kan det vara bra att förbereda sig först på något vis.`
    ) => {
      return {
        text,
        choices: [
          {
            text: "Se efter vad som finns kvar att dricka.",
            action: () => setRoom(lookForDrinks),
          },
          {
            text: "Leta efter möjliga vapen i rummet",
            action: () => {
              setRoom(Bro1);
              /* TODO */
            },
          },
          {
            text: "Fråga någon vid bordet om de har något de vill byta mot resten av din sittningmat.",
            action: () => {
              /* */
            },
          },
        ],
        returnChoice: null,
      };
    };

    const returnToSelectPreparationMethod = selectPreparationMethod(
      `Du ser att Ababou väntar allt mer otåligt i sittningslokalens dörröppning, men du känner dig ännu inte helt redo att följa honom ut i en helt okänd värld. Du funderar på vad du bör göra med dina sista minuter innan dina äventyr ska ta sin början.`
    );

    const lookForDrinks: InlineRoom = {
      text: "Du låter blicken svepa över borden. Din undersökning resulterar i fyndet av flera potentiellt drickbara substanser.",
      choices: [
        {
          text: "Svep en flaska tabasko.",
          action: () => {
            const drinkTabasko = () => {
              setRoom(returnToSelectPreparationMethod);

              return {
                text: "Du korkar upp tabaskoflaskan och häller upp innehållet i ett glas. Ababou den ändlige tittar bekymrat på dig från dörröppningen, men säger ingenting. Du tar en klunk och försöker ta en andra men det går inte och du inser att du begått ett stort misstag. Hostande tar du dig själv om bröstet och kollapsar på golvet. Du uppfattar att Ababou håller på att läma sin post vid dörrkarmen för att komma in och hämta dig, men du reser dig stapplande och gestikulerar åt honom att stanna där han står.",
              };
            };

            if (character.class === "rippad") {
              setRoom(returnToSelectPreparationMethod);
              return {
                text: "För en så rippad individ som du är en flaska tabasko ingen match. Tvärt om känner du dig mer styrkt än förut.",
              };
            } else if (character.abilities.includes("logiskt tänkande")) {
              setRoom({
                text: "Eftersom du är logiskt tänkande funderar du en extra gång över om tabasko verkligen är nyttigt för dig.",
                choices: [
                  {
                    text: "Drick tabaskon.",
                    action: drinkTabasko,
                  },
                ],
                returnChoice: { text: "Avstå från tabaskon." },
              });
            } else {
              return drinkTabasko();
            }
          },
        },
        {
          text: "Drick en Trocadero.",
          action: () => {
            setRoom(returnToSelectPreparationMethod);

            return {
              text: 'Drickan får dig att känna dig helt sockrig och god inombords. Tänderna nästan klibbar mot varandra på helt rätt sätt. "Trocadero sitter alltid fint" ropar du över rummet till Ababou som nickar instämmande.',
            };
          },
        },
        {
          text: "Drick en Trocadero Zero.",
          action: () => {
            setRoom(returnToSelectPreparationMethod);

            return {
              text: "Den magra utvattnade blaskan ålar sig ned i strupen på dig och lämnar dig torr och sträv i halsen. Om detta är Trocadero, tänker du, hur magra upplevelser får man då inte av Coca-Cola och andra mineralvatten?",
            };
          },
        },
      ],
      returnChoice: { text: "Avbryt vad du håller på med." },
    };

    if (this.visited) {
      return returnToSelectPreparationMethod;
    } else {
      this.visited = true;
      return selectPreparationMethod();
    }
  }
}
