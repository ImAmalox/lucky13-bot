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

Nadat je tesseract en GraphicsMagick hebt geïnstalleerd, moet je eerst zorgen dat je alle Node.js modules hebt geïnstalleerd. <br>
`npm install`
Vervolgens moet je een bestand maken genaamd config.json, met de volgende content:
```
{
    "API_KEY" : "JOUW_API_SLEUTEL",
    "CX" : "JOUW_CUSTOM_SEARCH_ENGINE_ID"
}
```
* Om aan een API sleutel te komen, ga naar [deze link](https://console.cloud.google.com/apis/), zorg dat de Custom Search API is ingeschakeld.
* Om aan een CSE ID te komen, ga naar [deze link](https://cse.google.com/), zorg dat op het hele web zoeken aan staat.


# Legaliteitswaarschuwing

Indien je deze bot gebruikt om daadwerkelijk geld te winnen, ga je in tegen de gebruiksvoorwaarden van LUCKY13 en ben je illegaal bezig.

# Inspiratie

Deze bot was geïnspireerd door maxenxe's Node.js bot voor HQ Trivia.