// Privacy policy text (GDPR art. 13), both languages. Draft: the client must review it
// before launch. Keep it in sync with what the site actually does, and bump `updated`:
// - retention: `workers/cleanup` (today 90 days after creation, whatever the status);
// - processors: Cloudflare (hosting, D1, R2), Mailjet (owner email), Meta (WhatsApp),
//   Google (Maps, with consent). Add GA4 / the Instagram feed here when they go in.
// Strings are trusted, authored HTML (rendered with set:html); never put visitor input here.
import { site } from '../config/site';
import type { Lang } from './utils';

/** A paragraph, or a bullet list. */
export type Block = string | string[];

export interface Section {
  title: string;
  blocks: Block[];
}

export const updated = '2026-09-29';

const anspdcp = '<a href="https://www.dataprotection.ro" target="_blank" rel="noopener">www.dataprotection.ro</a>';

export function privacyPolicy(lang: Lang, links: { cookies: string }): { intro: string; sections: Section[] } {
  const { legal } = site;
  const email = `<a href="mailto:${site.email}">${site.email}</a>`;
  const phone = `<a href="tel:${site.phone.replace(/\s/g, '')}">${site.phone}</a>`;
  const cookies = (label: string) => `<a href="${links.cookies}">${label}</a>`;

  if (lang === 'ro') {
    return {
      intro: `Această politică explică ce date personale colectează cofetăria ${site.name} prin acest site, de ce, cât timp le păstrăm și ce drepturi ai, conform Regulamentului (UE) 2016/679 (GDPR).`,
      sections: [
        {
          title: '1. Cine suntem',
          blocks: [
            `Operatorul datelor este <strong>${legal.companyName}</strong>, CUI ${legal.cui}, nr. Reg. Com. ${legal.regCom}, cu sediul în ${legal.registeredOffice}.`,
            `Ne găsești la ${site.address}. Pentru orice întrebare despre datele tale ne scrii la ${email} sau ne suni la ${phone}.`,
          ],
        },
        {
          title: '2. Ce date colectăm',
          blocks: [
            [
              '<strong>Când trimiți o comandă</strong>: nume, prenume, număr de telefon, adresa de livrare (doar dacă alegi livrarea), produsele comandate cu variațiile alese, mesajul personalizat pentru tort și observațiile tale.',
              '<strong>Când ceri o ofertă</strong> pentru un tort personalizat sau de nuntă: aceleași date de contact, adresa, tipul tortului, data evenimentului (pentru tortul de nuntă), descrierea și, dacă o încarci, poza de inspirație. Te rugăm să nu încarci poze în care apar persoane care pot fi recunoscute.',
              '<strong>Când ne contactezi</strong> telefonic, pe WhatsApp sau prin email: datele pe care ni le transmiți în conversație.',
              `<strong>Date tehnice</strong>: furnizorul de hosting prelucrează adresa IP și date despre browser pentru a livra paginile și a proteja site-ul de atacuri. Nu le folosim pentru a te identifica. Ce stocăm în browserul tău este explicat în ${cookies('Politica de cookie-uri')}.`,
            ],
            'Nu cerem și nu colectăm date de plată: plata se face la livrare sau la ridicare, nu pe site.',
          ],
        },
        {
          title: '3. De ce le folosim și pe ce temei',
          blocks: [
            [
              '<strong>Pentru a-ți procesa comanda sau cererea de ofertă</strong>: te sunăm pentru confirmare, pregătim produsele, ți le livrăm sau ți le predăm. Temei: executarea contractului sau demersuri făcute la cererea ta înainte de încheierea lui (art. 6 alin. 1 lit. b GDPR).',
              '<strong>Pentru obligații legale</strong>, de exemplu emiterea și păstrarea documentelor fiscale. Temei: obligație legală (art. 6 alin. 1 lit. c GDPR).',
              '<strong>Pentru securitatea site-ului</strong> și blocarea mesajelor automate (spam). Temei: interesul nostru legitim de a avea un site sigur (art. 6 alin. 1 lit. f GDPR).',
              '<strong>Pentru conținut extern</strong> (harta Google Maps): doar cu acordul tău, pe care îl poți retrage oricând (art. 6 alin. 1 lit. a GDPR).',
            ],
            'Datele de contact sunt necesare pentru a-ți onora comanda: fără ele nu te putem contacta pentru confirmare și nici livra. Nu îți trimitem mesaje de marketing, nu îți vindem datele și nu luăm decizii automate sau creăm profiluri pe baza lor.',
          ],
        },
        {
          title: '4. Cui le transmitem',
          blocks: [
            'Datele tale sunt văzute doar de echipa cofetăriei. Pentru a funcționa, site-ul folosește câțiva furnizori care prelucrează datele în numele nostru, pe bază de contract:',
            [
              '<strong>Cloudflare, Inc.</strong> (SUA): găzduirea site-ului, baza de date cu comenzi și cereri și stocarea pozelor de inspirație.',
              '<strong>Mailjet SAS</strong> (Franța): trimiterea către noi a notificării prin email pentru fiecare comandă sau cerere nouă.',
              '<strong>Meta Platforms (WhatsApp)</strong>: notificarea pe WhatsApp către cofetărie la fiecare comandă sau cerere nouă și conversațiile pe care le începi tu cu noi pe WhatsApp.',
              '<strong>Google Ireland Limited</strong>: harta Google Maps de pe pagina de contact, doar dacă îți dai acordul.',
            ],
            'Dacă livrarea se face printr-un curier, îi transmitem doar numele, telefonul și adresa de livrare. Putem transmite date autorităților doar când legea ne obligă.',
          ],
        },
        {
          title: '5. Transferuri în afara UE',
          blocks: [
            'Unii furnizori (Cloudflare, Meta, Google) sunt companii din SUA sau fac parte din grupuri din SUA. Transferurile se fac pe baza deciziei de adecvare a Comisiei Europene pentru Cadrul UE-SUA privind protecția datelor (EU-U.S. Data Privacy Framework) sau a clauzelor contractuale standard aprobate de Comisie.',
          ],
        },
        {
          title: '6. Cât timp le păstrăm',
          blocks: [
            [
              '<strong>Comenzile și cererile de ofertă</strong>, inclusiv poza de inspirație, se șterg automat din baza noastră de date la 90 de zile după ce le trimiți. Notificările primite prin email și WhatsApp le ștergem în același termen.',
              '<strong>Documentele fiscale</strong> (de exemplu facturile) le păstrăm cât cere legislația financiar-contabilă.',
              '<strong>Conversațiile</strong> pe telefon, WhatsApp sau email le păstrăm doar cât e nevoie pentru comanda sau întrebarea ta.',
              `<strong>Datele din browserul tău</strong> (coșul și alegerea privind cookie-urile) rămân pe dispozitivul tău până le ștergi. Detalii în ${cookies('Politica de cookie-uri')}.`,
            ],
          ],
        },
        {
          title: '7. Drepturile tale',
          blocks: [
            'În legătură cu datele tale, ai dreptul:',
            [
              'să afli ce date avem despre tine și să primești o copie (dreptul de acces);',
              'să ceri corectarea datelor greșite (dreptul la rectificare);',
              'să ceri ștergerea datelor (dreptul la ștergere), cu excepția celor pe care legea ne obligă să le păstrăm;',
              'să ceri restricționarea prelucrării;',
              'să primești datele într-un format structurat sau să ceri transmiterea lor altui operator (dreptul la portabilitate);',
              'să te opui prelucrării bazate pe interesul nostru legitim;',
              'să îți retragi oricând acordul, fără să fie afectată prelucrarea făcută înainte.',
            ],
            `Pentru oricare dintre ele, scrie-ne la ${email} sau vino la cofetărie. Îți răspundem în cel mult o lună. Putem să îți cerem câteva detalii (de exemplu numărul de telefon folosit la comandă) ca să ne asigurăm că datele sunt ale tale.`,
            `Dacă ești nemulțumit, poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1, București, ${anspdcp}.`,
          ],
        },
        {
          title: '8. Securitatea datelor',
          blocks: [
            'Site-ul folosește doar conexiuni criptate (HTTPS). Accesul la comenzi și cereri îl au doar persoanele din cofetărie care se ocupă de ele, iar datele se șterg automat după termenul de mai sus.',
          ],
        },
        {
          title: '9. Minori',
          blocks: [
            'Comenzile și cererile de ofertă se trimit de persoane de cel puțin 16 ani. Dacă ai sub 16 ani, roagă un părinte să trimită comanda pentru tine.',
          ],
        },
        {
          title: '10. Modificări',
          blocks: [
            'Putem actualiza această politică atunci când se schimbă modul în care funcționează site-ul. Versiunea în vigoare este mereu cea de pe această pagină, cu data ultimei actualizări mai jos.',
          ],
        },
      ],
    };
  }

  return {
    intro: `This policy explains what personal data the ${site.name} cakery collects through this website, why, how long we keep it and what your rights are under Regulation (EU) 2016/679 (GDPR).`,
    sections: [
      {
        title: '1. Who we are',
        blocks: [
          `The data controller is <strong>${legal.companyName}</strong>, tax ID (CUI) ${legal.cui}, trade register no. ${legal.regCom}, registered office ${legal.registeredOffice}.`,
          `You’ll find us at ${site.address}. For any question about your data, email us at ${email} or call ${phone}.`,
        ],
      },
      {
        title: '2. What data we collect',
        blocks: [
          [
            '<strong>When you place an order</strong>: last name, first name, phone number, delivery address (only if you choose delivery), the products you order with the options you picked, the personalized cake message and your notes.',
            '<strong>When you request a quote</strong> for a custom or wedding cake: the same contact details, your address, the cake type, the event date (for wedding cakes), your description and, if you upload one, the inspiration photo. Please don’t upload photos showing people who can be recognized.',
            '<strong>When you contact us</strong> by phone, WhatsApp or email: the details you share in the conversation.',
            `<strong>Technical data</strong>: our hosting provider processes your IP address and browser details to deliver pages and protect the site from attacks. We don’t use them to identify you. What we store in your browser is explained in our ${cookies('Cookie policy')}.`,
          ],
          'We don’t ask for or collect payment details: you pay on delivery or pickup, not on the website.',
        ],
      },
      {
        title: '3. Why we use it and on what legal basis',
        blocks: [
          [
            '<strong>To process your order or quote request</strong>: we call you to confirm, prepare the products, and deliver or hand them over. Legal basis: performance of a contract, or steps taken at your request before entering into one (Art. 6(1)(b) GDPR).',
            '<strong>To meet legal obligations</strong>, such as issuing and keeping tax documents. Legal basis: legal obligation (Art. 6(1)(c) GDPR).',
            '<strong>To keep the site secure</strong> and block automated (spam) submissions. Legal basis: our legitimate interest in a secure website (Art. 6(1)(f) GDPR).',
            '<strong>For external content</strong> (the Google Maps map): only with your consent, which you can withdraw at any time (Art. 6(1)(a) GDPR).',
          ],
          'We need your contact details to fulfil your order: without them we can’t call you to confirm it or deliver it. We don’t send you marketing messages, sell your data, or make automated decisions or profiles based on it.',
        ],
      },
      {
        title: '4. Who we share it with',
        blocks: [
          'Only the cakery team sees your data. To run the website we use a few providers that process data on our behalf, under contract:',
          [
            '<strong>Cloudflare, Inc.</strong> (USA): website hosting, the database of orders and requests, and storage of inspiration photos.',
            '<strong>Mailjet SAS</strong> (France): sending us an email notification for each new order or request.',
            '<strong>Meta Platforms (WhatsApp)</strong>: the WhatsApp notification the cakery gets for each new order or request, and any WhatsApp conversation you start with us.',
            '<strong>Google Ireland Limited</strong>: the Google Maps map on the contact page, only if you consent.',
          ],
          'If a courier handles the delivery, we only share your name, phone number and delivery address with them. We only share data with public authorities when the law requires it.',
        ],
      },
      {
        title: '5. Transfers outside the EU',
        blocks: [
          'Some providers (Cloudflare, Meta, Google) are US companies or part of US groups. These transfers rely on the European Commission’s adequacy decision for the EU-U.S. Data Privacy Framework or on the standard contractual clauses approved by the Commission.',
        ],
      },
      {
        title: '6. How long we keep it',
        blocks: [
          [
            '<strong>Orders and quote requests</strong>, including the inspiration photo, are automatically deleted from our database 90 days after you send them. We delete the email and WhatsApp notifications within the same period.',
            '<strong>Tax documents</strong> (such as invoices) are kept for as long as accounting law requires.',
            '<strong>Conversations</strong> by phone, WhatsApp or email are kept only as long as your order or question needs.',
            `<strong>Data in your browser</strong> (your cart and cookie choice) stays on your device until you delete it. See our ${cookies('Cookie policy')}.`,
          ],
        ],
      },
      {
        title: '7. Your rights',
        blocks: [
          'Regarding your data, you have the right to:',
          [
            'find out what data we hold about you and get a copy (right of access);',
            'have inaccurate data corrected (right to rectification);',
            'have your data deleted (right to erasure), except what the law requires us to keep;',
            'ask us to restrict processing;',
            'receive your data in a structured format or have it sent to another controller (right to data portability);',
            'object to processing based on our legitimate interest;',
            'withdraw your consent at any time, without affecting processing done before.',
          ],
          `To use any of these rights, email us at ${email} or visit the shop. We’ll reply within one month. We may ask for a few details (such as the phone number used for the order) to make sure the data is yours.`,
          `If you’re not satisfied, you can complain to the Romanian data protection authority, ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal), B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1, Bucharest, ${anspdcp}.`,
        ],
      },
      {
        title: '8. Data security',
        blocks: [
          'The website only uses encrypted connections (HTTPS). Only the cakery staff who handle orders and requests can access them, and the data is deleted automatically after the period above.',
        ],
      },
      {
        title: '9. Children',
        blocks: [
          'Orders and quote requests must be sent by people aged 16 or over. If you’re under 16, please ask a parent to place the order for you.',
        ],
      },
      {
        title: '10. Changes',
        blocks: [
          'We may update this policy when the way the website works changes. The version in force is always the one on this page, with the date of the last update below.',
        ],
      },
    ],
  };
}
