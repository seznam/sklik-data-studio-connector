# Utilita pro načtení Sklik ID účtů

Tato samostatná Google Apps Script webová aplikace vypíše ID vlastního Sklik
účtu a všech účtů, k nimž má daný API token přístup. Používá aktuální Drak JSON
API v5, postup `client.loginByToken` → `client.get` → `client.logout` a token
nikam neukládá.

## Nasazení

1. Otevřete [script.new](https://script.new/) a založte nový projekt.
2. Vložte obsah `Code.gs` do souboru `Code.gs` a obsah `Index.html` do nového
   souboru HTML s názvem `Index`.
3. Klikněte **Deploy → New deployment**, zvolte typ **Web app**, nastavte
   spuštění jako váš účet a přístup pouze lidem, kterým důvěřujete.
4. Otevřete URL nasazení, zadejte Sklik API token a zkopírujte potřebné ID do
   nastavení konektoru.

Při změně zdrojového kódu vytvořte nové nasazení aplikace. Nezveřejňujte URL
webové aplikace s širokým přístupem, protože umožňuje komukoli zadat vlastní
token do aplikace běžící pod vaším Google účtem.
