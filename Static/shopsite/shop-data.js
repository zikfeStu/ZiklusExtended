const SHOP_PRODUCTS = [
  {
    id: "zx-montage-compact",
    name: "ZX Montage Compact",
    category: "Montageanlage",
    price: 48900,
    leadTime: "10-14 Wochen",
    teaser: "Kompakte Montageanlage fuer kleine und mittlere Serien mit integrierter Pruefstation.",
    description: "Die ZX Montage Compact ist fuer Unternehmen gedacht, die wiederkehrende Montageablaeufe sauber fuehren und dokumentieren moechten. Die Anlage kombiniert stabile Mechanik, klare Bedienfuehrung und vorbereitete Schnittstellen fuer spaetere Erweiterungen.",
    specs: ["Grundgestell aus Aluminiumprofil", "SPS-Steuerung mit HMI", "Pruefstation fuer Anwesenheit und Position", "CE-konforme Schutzumhausung"]
  },
  {
    id: "zx-handling-pro",
    name: "ZX Handling Pro",
    category: "Handlingmodul",
    price: 32700,
    leadTime: "8-12 Wochen",
    teaser: "Flexibles Handlingmodul zum Positionieren, Zufuehren und Umsetzen von Bauteilen.",
    description: "Das ZX Handling Pro Modul laesst sich in bestehende Linien integrieren und uebernimmt praezise Bewegungsaufgaben. Es eignet sich fuer Zufuehrung, Bauteiltransfer und einfache Pick-and-Place-Prozesse.",
    specs: ["Elektrische Linearachsen", "Sensorik fuer Lageerkennung", "Modulare Greiferaufnahme", "Vorbereitet fuer Linienintegration"]
  },
  {
    id: "zx-pruefstand-precision",
    name: "ZX Pruefstand Precision",
    category: "Prueftechnik",
    price: 56300,
    leadTime: "12-16 Wochen",
    teaser: "Pruefstand fuer Funktions- und Masskontrollen in produktionsnahen Umgebungen.",
    description: "Der ZX Pruefstand Precision verbindet robuste Mechanik mit reproduzierbarer Messtechnik. Pruefergebnisse koennen strukturiert erfasst und fuer Qualitaetsprozesse bereitgestellt werden.",
    specs: ["Mechanische Spannvorrichtung", "Messsensorik nach Kundenanforderung", "HMI mit Ergebnisanzeige", "Export vorbereiteter Pruefdaten"]
  }
];

const SHOP_STORAGE_KEYS = {
  cart: "ziklus_cart",
  products: "ziklus_products",
  orders: "ziklus_orders"
};
