# LUCKY13 bot

Een bot om automatisch vragen te beantwoorden van de online quiz LUCKY13. 
Deze werkt door de kernwoorden uit vragen te halen, waarna er met deze doormiddel van Google's APIs bepaald wordt wat het beste antwoord is. 

# Nauwkeurigheid

De nauwkeurigheid verschilt natuurlijk per ronde, bij een ronde met veel vragen als: "Wat zijn 'escargots'?" zal deze bot veel vragen kunnen oplossen, maar wanneer er een afbeelding te zien is en er wordt gevraagd: "Wie is dit?", zal mijn bot hem zeer waarschijnlijk niet kunnen oplossen.

Vragen van het eerste type kan mijn bot 90% van de keren oplossen.

# Dependencies

De dependencies en Node.js modules van deze bot komen erg overeen met maxenxe's bot.

1. [tesseract-ocr](https://github.com/tesseract-ocr/tesseract) voor tekstherkenning.
2. [GraphicsMagick](http://www.graphicsmagick.org/)
(de Node.js modules staan in package.json :D)

# Gebruik

Nadat je tesseract en GraphicsMagick hebt geïnstalleerd, moet je eerst zorgen dat je alle Node.js modules hebt geïnstalleerd: <br>
    `npm install` <br>
Vervolgens moet je een bestand maken genaamd config.json, met de volgende content:
```
{
    "API_KEY" : "JOUW_API_SLEUTEL",
    "CX" : "JOUW_CUSTOM_SEARCH_ENGINE_ID"
}
```
* Om aan een API sleutel te komen, ga naar [deze link](https://console.cloud.google.com/apis/), zorg dat de Custom Search API is ingeschakeld.
* Om aan een CSE ID te komen, ga naar [deze link](https://cse.google.com/), zorg dat op het hele web zoeken aan staat.

LET WEL OP! De gratis API van Google staat maar maximaal 100 requests per dag toe, dit is genoeg voor 1 ronde LUCKY13 en 7 losse vragen, aangezien elke vraag 5 requests nodig kan hebben.

Verder heb je een programma nodig om je telefoon/tablet te mirroren:
* Android: [AirDroid](https://www.airdroid.com/)
* iOS: QuickTime Player (standaard geïnstalleerd op macOS)

Nu moet je in bot.js de coördinaten aanpassen zodat de vragen en antwoorden gelezen kunnen worden:
1. Download/Gebruik een programma om de coördinaten van je muis te bepalen.
2. Bepaal de coördinaten van de linkerbovenhoek van de vraag en noteer deze.
3. Bepaal de coördinaten van de rechteronderhoek van de vraag en noteer deze.
4. Vul nu de coördinaten in in het gm.crop statement, argumenten: .crop(ROx - LBx, ROy - LBy, LBx, LBy).
5. Doe hetzelfde voor de 2 antwoorden.

Nu kun je de bot opstarten met `npm start` of `node bot.js`.
Wanneer er een vraag in beeld komt, druk je op 's' en zal de bot de vraag voor jou proberen te beantwoorden.


# Legaliteitswaarschuwing

Indien je deze bot gebruikt om daadwerkelijk geld te winnen, ga je in tegen de gebruiksvoorwaarden van LUCKY13 en ben je illegaal bezig.

# Inspiratie

Deze bot was geïnspireerd door maxenxe's Node.js bot voor HQ Trivia.