Perinteisen react-sovelluksen komentojen lisäksi anna seuraava komento:
npm install @material-ui/core @material-ui/icons react-router-dom

Json-server pyörii portissa 3004, joten anna komento:
json-server db.json --watch --port 3004 --delay 3000

Hyllytietojen alla pystyy tarkastamaan kaikkien tuotteiden saldot ja hakemaan tarkemmin yhden tietyn tuotteen / hyllyn saldot. 
Hallitse tuotetietoja -sivulla voi lisätä/muokata/poistaa tuotetietoja. 