# Ziklus Extended Website

Unternehmenswebsite für das fiktive Maschinenbauunternehmen **Ziklus Extended**.

## Seiten

- `index.html`
- `produkte.html`
- `shop.html`
- `produkt.html`
- `warenkorb.html`
- `bezahlen.html`
- `erfolg.html`
- `service.html`
- `technologien.html`
- `karriere.html`
- `kontakt.html`
- `admin-shop.html`
- `admin-bestellungen.html`

## Online Shop

Der Shop läuft lokal als Frontend-Prototyp mit `localStorage`.

- Produkte: `shop-data.js`
- Warenkorb, Checkout-Demo und Admin-Logik: `shop.js`
- Shop Management: `admin-shop.html`
- Bestellmanagement: `admin-bestellungen.html`

Die Bezahlseite versucht im Live-Betrieb eine Netlify Function unter `/.netlify/functions/create-checkout-session` aufzurufen. Lokal wird stattdessen eine Demo-Bestellung gespeichert.

## Stripe Checkout

Für echte Kreditkartenzahlung müssen beim Hosting folgende Umgebungsvariablen gesetzt werden:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `URL` mit der finalen Domain, z. B. `https://ziklus.de`

Stripe Checkout muss serverseitig erzeugt werden, weil der geheime Stripe-Schlüssel nicht im Browser liegen darf.
Die Checkout-Funktion übergibt die Kunden-E-Mail als `receipt_email`; Stripe kann nach erfolgreicher Zahlung eine Zahlungsbestätigung senden, wenn Beleg-E-Mails im Stripe Dashboard aktiviert sind.
