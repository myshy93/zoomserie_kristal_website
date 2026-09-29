export const languages = {
  ro: 'Română',
  en: 'English',
} as const;

export const defaultLang = 'ro';

const ro = {
  'site.description':
    'Cofetărie de cartier în Berceni: prăjituri, torturi, patiserie și torturi personalizate. Livrare gratuită peste 200 RON în sudul Bucureștiului.',

  'nav.home': 'Acasă',
  'nav.about': 'Despre',
  'nav.products': 'Produse',
  'nav.gallery': 'Galerie',
  'nav.contact': 'Contact',
  'nav.quote': 'Cere ofertă',

  'home.hero.title': 'Dulciuri făcute cu drag, ca acasă',
  'home.hero.subtitle':
    'Prăjituri, torturi și patiserie proaspătă pentru familia ta, în Berceni și în sudul Capitalei.',
  'home.hero.ctaProducts': 'Vezi produsele',
  'home.hero.ctaQuote': 'Tort personalizat',
  'home.categories.title': 'Ce găsești la noi',
  'home.delivery.title': 'Livrare gratuită peste {threshold} RON',
  'home.delivery.body':
    'Livrăm în Berceni, în sudul Bucureștiului și în localitățile din apropiere. Poți ridica și personal comanda din cofetărie.',
  'home.gallery.title': 'Din cofetăria noastră',
  'home.gallery.body': 'Urmărește-ne pe Instagram pentru noutăți și poze din laborator.',

  'about.title': 'Despre noi',
  'about.body':
    'Suntem o cofetărie de familie din Berceni. Facem prăjituri și torturi din ingrediente atent alese, pentru momentele mici și mari ale vecinilor noștri.',

  'products.title': 'Produse',
  'products.intro': 'Alege o categorie pentru a vedea produsele, prețurile și detaliile fiecăruia.',
  'products.viewCategory': 'Vezi produsele',
  'products.empty': 'Produsele din această categorie vor fi adăugate în curând.',

  'product.price': 'Preț',
  'product.ingredients': 'Ingrediente',
  'product.allergens': 'Alergeni',
  'product.allergensNone': 'Nu conține alergeni majori.',
  'product.weight': 'Gramaj',
  'product.nutrition': 'Valori energetice',
  'product.storage': 'Condiții de păstrare',
  'product.quoteOnly': 'Prețul se stabilește în funcție de model. Trimite-ne o cerere și revenim cu o ofertă.',
  'product.requestQuote': 'Cere ofertă',
  'product.photoSoon': 'Fotografie în curând',

  'unit.bucata': 'buc.',
  'unit.kg': 'kg',
  'unit.portie': 'porție',
  'unit.cutie': 'cutie',

  'nutrition.per': 'Valori medii per',
  'nutrition.energy': 'Energie',
  'nutrition.fat': 'Grăsimi',
  'nutrition.saturatedFat': 'din care acizi grași saturați',
  'nutrition.carbs': 'Glucide',
  'nutrition.sugars': 'din care zaharuri',
  'nutrition.protein': 'Proteine',
  'nutrition.salt': 'Sare',

  'allergen.gluten': 'Gluten',
  'allergen.crustaceans': 'Crustacee',
  'allergen.eggs': 'Ouă',
  'allergen.fish': 'Pește',
  'allergen.peanuts': 'Arahide',
  'allergen.soy': 'Soia',
  'allergen.milk': 'Lapte',
  'allergen.nuts': 'Fructe cu coajă lemnoasă',
  'allergen.celery': 'Țelină',
  'allergen.mustard': 'Muștar',
  'allergen.sesame': 'Susan',
  'allergen.sulphites': 'Sulfiți',
  'allergen.lupin': 'Lupin',
  'allergen.molluscs': 'Moluște',

  'order.title': 'Trimite comanda',
  'order.quantity': 'Cantitate',
  'order.message': 'Mesaj pe tort',
  'order.messagePlaceholder': 'ex. La mulți ani, Ana!',
  'order.fulfillment': 'Livrare sau ridicare',
  'order.delivery': 'Livrare la domiciliu',
  'order.pickup': 'Ridicare din cofetărie',
  'order.lastName': 'Nume',
  'order.firstName': 'Prenume',
  'order.phone': 'Telefon',
  'order.address': 'Adresă de livrare',
  'order.notes': 'Observații',
  'order.submit': 'Trimite comanda',
  'order.disclaimer':
    'Nu se face nicio plată online. Te sunăm noi pentru confirmare, iar plata se face la livrare sau la ridicare.',

  'cart.title': 'Coșul tău',
  'cart.nav': 'Coș',
  'cart.addTitle': 'Alege și adaugă în coș',
  'cart.unit': 'Se vinde la',
  'cart.add': 'Adaugă în coș',
  'cart.added': 'Produsul a fost adăugat în coș.',
  'cart.viewCart': 'Vezi coșul',
  'cart.lineTotal': 'Total',
  'cart.total': 'Total comandă',
  'cart.remove': 'Șterge',
  'cart.empty': 'Coșul tău este gol.',
  'cart.freeDeliveryProgress': 'Mai adaugă {amount} pentru livrare gratuită.',
  'cart.freeDeliveryReached': 'Ai livrare gratuită!',
  'cart.deliveryFeeNote': 'Sub {threshold} RON, taxa de livrare ți-o comunicăm la confirmarea comenzii.',
  'cart.sending': 'Se trimite...',
  'cart.error': 'Comanda nu a putut fi trimisă. Încearcă din nou sau scrie-ne pe WhatsApp.',
  'cart.successTitle': 'Comanda a fost trimisă!',
  'cart.successBody': 'Te sunăm sau îți scriem noi în curând pentru confirmare. Plata se face la livrare sau la ridicare.',

  'quote.title': 'Cere ofertă pentru un tort personalizat',
  'quote.intro':
    'Spune-ne ce îți dorești și trimite-ne o poză de inspirație. Revenim cu o ofertă în cel mai scurt timp.',
  'quote.kind': 'Tip tort',
  'quote.kind.personalizat': 'Tort personalizat',
  'quote.kind.nunta': 'Tort de nuntă',
  'quote.eventDate': 'Data evenimentului',
  'quote.description': 'Descrie tortul dorit',
  'quote.descriptionPlaceholder': 'Număr de persoane, arome preferate, culori, tematică...',
  'quote.photo': 'Poză de inspirație',
  'quote.submit': 'Trimite cererea',

  'gallery.title': 'Galerie',
  'gallery.body': 'Aici vor apărea cele mai noi postări de pe Instagram-ul nostru.',

  'contact.title': 'Contact',
  'contact.phone': 'Telefon',
  'contact.email': 'Email',
  'contact.address': 'Adresă',
  'contact.whatsapp': 'Scrie-ne pe WhatsApp',
  'contact.legal': 'Informații legale',

  'footer.rights': 'Toate drepturile rezervate.',
  'footer.anpc': 'ANPC – Soluționarea alternativă a litigiilor',

  'whatsapp.label': 'Scrie-ne pe WhatsApp',
  'whatsapp.prefill': 'Bună ziua! Aș dori câteva informații despre produsele voastre.',
};

export type UiKey = keyof typeof ro;

const en: Record<UiKey, string> = {
  'site.description':
    'Neighbourhood cake shop in Berceni: pastries, cakes and custom cakes. Free delivery over 200 RON in south Bucharest.',

  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.products': 'Products',
  'nav.gallery': 'Gallery',
  'nav.contact': 'Contact',
  'nav.quote': 'Request a quote',

  'home.hero.title': 'Homemade sweets, baked with love',
  'home.hero.subtitle':
    'Fresh pastries, cakes and baked goods for your family, in Berceni and south Bucharest.',
  'home.hero.ctaProducts': 'See our products',
  'home.hero.ctaQuote': 'Custom cake',
  'home.categories.title': 'What we make',
  'home.delivery.title': 'Free delivery over {threshold} RON',
  'home.delivery.body':
    'We deliver across Berceni, south Bucharest and nearby towns. You can also pick up your order from the shop.',
  'home.gallery.title': 'From our kitchen',
  'home.gallery.body': 'Follow us on Instagram for news and photos from our kitchen.',

  'about.title': 'About us',
  'about.body':
    'We are a family-run cake shop in Berceni. We bake pastries and cakes from carefully chosen ingredients, for our neighbours’ small and big moments.',

  'products.title': 'Products',
  'products.intro': 'Pick a category to see its products, prices and details.',
  'products.viewCategory': 'See products',
  'products.empty': 'Products in this category are coming soon.',

  'product.price': 'Price',
  'product.ingredients': 'Ingredients',
  'product.allergens': 'Allergens',
  'product.allergensNone': 'Contains no major allergens.',
  'product.weight': 'Weight',
  'product.nutrition': 'Nutrition facts',
  'product.storage': 'Storage',
  'product.quoteOnly': 'Pricing depends on the design. Send us a request and we’ll get back to you with a quote.',
  'product.requestQuote': 'Request a quote',
  'product.photoSoon': 'Photo coming soon',

  'unit.bucata': 'piece',
  'unit.kg': 'kg',
  'unit.portie': 'serving',
  'unit.cutie': 'box',

  'nutrition.per': 'Average values per',
  'nutrition.energy': 'Energy',
  'nutrition.fat': 'Fat',
  'nutrition.saturatedFat': 'of which saturates',
  'nutrition.carbs': 'Carbohydrate',
  'nutrition.sugars': 'of which sugars',
  'nutrition.protein': 'Protein',
  'nutrition.salt': 'Salt',

  'allergen.gluten': 'Gluten',
  'allergen.crustaceans': 'Crustaceans',
  'allergen.eggs': 'Eggs',
  'allergen.fish': 'Fish',
  'allergen.peanuts': 'Peanuts',
  'allergen.soy': 'Soy',
  'allergen.milk': 'Milk',
  'allergen.nuts': 'Tree nuts',
  'allergen.celery': 'Celery',
  'allergen.mustard': 'Mustard',
  'allergen.sesame': 'Sesame',
  'allergen.sulphites': 'Sulphites',
  'allergen.lupin': 'Lupin',
  'allergen.molluscs': 'Molluscs',

  'order.title': 'Place your order',
  'order.quantity': 'Quantity',
  'order.message': 'Message on the cake',
  'order.messagePlaceholder': 'e.g. Happy birthday, Ana!',
  'order.fulfillment': 'Delivery or pickup',
  'order.delivery': 'Home delivery',
  'order.pickup': 'Pickup from the shop',
  'order.lastName': 'Last name',
  'order.firstName': 'First name',
  'order.phone': 'Phone',
  'order.address': 'Delivery address',
  'order.notes': 'Notes',
  'order.submit': 'Send order',
  'order.disclaimer':
    'No online payment. We’ll call you to confirm, and you pay on delivery or at pickup.',

  'cart.title': 'Your cart',
  'cart.nav': 'Cart',
  'cart.addTitle': 'Choose and add to cart',
  'cart.unit': 'Sold by',
  'cart.add': 'Add to cart',
  'cart.added': 'Added to your cart.',
  'cart.viewCart': 'View cart',
  'cart.lineTotal': 'Total',
  'cart.total': 'Order total',
  'cart.remove': 'Remove',
  'cart.empty': 'Your cart is empty.',
  'cart.freeDeliveryProgress': 'Add {amount} more for free delivery.',
  'cart.freeDeliveryReached': 'You get free delivery!',
  'cart.deliveryFeeNote': 'Below {threshold} RON, we’ll tell you the delivery fee when we confirm your order.',
  'cart.sending': 'Sending...',
  'cart.error': 'We couldn’t send your order. Please try again or message us on WhatsApp.',
  'cart.successTitle': 'Order sent!',
  'cart.successBody': 'We’ll call or message you soon to confirm. You pay on delivery or at pickup.',

  'quote.title': 'Request a quote for a custom cake',
  'quote.intro':
    'Tell us what you have in mind and send us an inspiration photo. We’ll get back to you with a quote as soon as possible.',
  'quote.kind': 'Cake type',
  'quote.kind.personalizat': 'Custom cake',
  'quote.kind.nunta': 'Wedding cake',
  'quote.eventDate': 'Event date',
  'quote.description': 'Describe the cake',
  'quote.descriptionPlaceholder': 'Number of guests, favourite flavours, colours, theme...',
  'quote.photo': 'Inspiration photo',
  'quote.submit': 'Send request',

  'gallery.title': 'Gallery',
  'gallery.body': 'Our latest Instagram posts will appear here.',

  'contact.title': 'Contact',
  'contact.phone': 'Phone',
  'contact.email': 'Email',
  'contact.address': 'Address',
  'contact.whatsapp': 'Message us on WhatsApp',
  'contact.legal': 'Legal information',

  'footer.rights': 'All rights reserved.',
  'footer.anpc': 'ANPC – Alternative dispute resolution',

  'whatsapp.label': 'Message us on WhatsApp',
  'whatsapp.prefill': 'Hello! I’d like some information about your products.',
};

export const ui = { ro, en } as const;
