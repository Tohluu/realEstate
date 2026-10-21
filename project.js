'use strict';

// Concept inventory: all prices, locations, and property details are illustrative.
const properties = [
  {id:'courtyard',title:'The Courtyard House',location:'Lekki Phase 1',type:'House',intent:'buy',price:185000000,beds:4,baths:5,area:340,image:'images/courtyard-villa.jpg',alt:'A tropical courtyard villa with warm stone, a pool, and lush planting',tag:'THE EDITOR’S PICK',feature:'Garden living',description:'A private retreat with generous living spaces, a leafy courtyard, and room to slow down. Large windows bring the garden inside, while a considered layout keeps everyday life beautifully simple.',amenities:['Private garden','Dedicated study','Covered parking','En-suite bedrooms']},
  {id:'park',title:'The Parkside Residence',location:'Ikoyi',type:'Apartment',intent:'buy',price:295000000,beds:3,baths:4,area:220,image:'images/interior.jpg',alt:'A light-filled apartment with a cream sofa, warm wood, and a garden-facing balcony',tag:'FOR SALE',feature:'Room to unwind',description:'An open, light-filled apartment concept with a generous living area, a quiet work space, and a balcony for unhurried mornings. Thoughtful storage and a flexible dining space make room for everyday rituals.',amenities:['Private balcony','Lift access','Utility room','Dedicated parking']},
  {id:'terrace',title:'The Palm Terrace',location:'Victoria Island',type:'Terrace',intent:'rent',price:12000000,beds:3,baths:3,area:195,image:'images/palm-terrace.jpg',alt:'A contemporary tropical terrace with warm white walls and a palm-lined garden',tag:'TO RENT',feature:'A slower kind of Sunday',description:'A relaxed terrace concept that brings together comfortable interiors and a little outdoor breathing room. A separate dining area and adaptable third bedroom make this a space to grow into.',amenities:['Outdoor terrace','Fitted kitchen','Guest bathroom','Parking space']},
  {id:'garden',title:'The Garden House',location:'Ajah',type:'House',intent:'buy',price:125000000,beds:4,baths:4,area:285,image:'images/house2.jpg',alt:'A garden-front house with a white facade and warm interiors',tag:'FOR SALE',feature:'Made for family life',description:'Easy family living with generous bedrooms and a garden that makes weekends feel longer. This concept pairs practical everyday spaces with a warm, welcoming character.',amenities:['Family lounge','Private garden','Laundry room','Covered parking']},
  {id:'studio',title:'The Lightwell Apartment',location:'Lekki Phase 1',type:'Apartment',intent:'rent',price:6500000,beds:2,baths:2,area:110,image:'images/interior.jpg',alt:'A calm apartment living room with natural light and warm wood accents',tag:'TO RENT',feature:'Small rituals, big light',description:'A bright apartment concept for a simpler everyday. Two comfortable bedrooms, an open living space, and natural light create an easy base for work, rest, and everything in between.',amenities:['Open-plan living','Fitted wardrobes','Work nook','Parking space']},
  {id:'grove',title:'The Grove Villa',location:'Ikoyi',type:'House',intent:'buy',price:450000000,beds:5,baths:6,area:510,image:'images/courtyard-villa.jpg',alt:'An elegant private villa framed by lush trees',tag:'FOR SALE',feature:'Space for possibility',description:'An expansive villa concept with room for everyone to find their own rhythm. Multiple living areas, a private study, and a spacious outdoor area balance togetherness and quiet.',amenities:['Private pool','Study','Guest suite','Landscaped garden']}
];
const articles = {
  'first-home':{category:'THE FIRST CHAPTER · 4 MIN READ',title:'Your first home starts with the right questions.',body:'<p>The best place to begin is your everyday life. Before the floor plans and the wish lists, take a moment to think about what you want home to feel like.</p><h3>Start with a normal Tuesday.</h3><p>Walk through an ordinary day. Where do you work? How do you get there? Do you cook every evening, work from home, or need a quiet corner to unwind? The right space supports the life you actually live.</p><h3>Separate essentials from possibilities.</h3><p>Write two short lists: the things a home must have, and the things you would love. A practical commute or an extra bedroom might be essential. A particular finish might be something you can change later.</p><h3>Look beyond the headline price.</h3><p>Leave space in your budget for moving, furnishing, maintenance, and recurring costs. Our planner is a starting point for understanding a loan payment; ask a qualified professional for a complete picture of financing and purchase costs.</p><h3>Give yourself room to think.</h3><p>Save your favourites and compare them side by side. Return to your essentials, revisit your questions, and choose at a pace that feels comfortable.</p>'},
  neighbourhood:{category:'AROUND THE CORNER · 3 MIN READ',title:'Fall for the neighbourhood, not just the home.',body:'<p>A home does not end at the front door. The walk to your favourite shop, the sounds in the evening, and the journey to work all become part of living there.</p><h3>Visit at different times.</h3><p>A peaceful afternoon and a weekday morning can feel very different. If you can, explore during your usual commute, in the evening, and on a weekend.</p><h3>Try your everyday journeys.</h3><p>Test the route to the places you visit most. Notice the roads, transport options, walking conditions, and how the journey feels, rather than relying on distance alone.</p><h3>Look for your kind of local.</h3><p>Make a short list of what matters to you: a nearby park, a good grocer, places to meet friends, or simply a quiet street. Take a walk and see what you find.</p><h3>Ask, then verify.</h3><p>Talk to people who live in the area about their experience. For services and infrastructure that matter to you, check availability directly before making a commitment.</p>'},
  viewing:{category:'THE FINER DETAILS · 3 MIN READ',title:'The little things to notice at your next viewing.',body:'<p>A viewing is a chance to imagine your life in a space, and to look closely at how that space works. A few notes and photographs, with permission, can make it easier to compare later.</p><h3>Follow the light.</h3><p>Notice which rooms feel bright and where you might want to read, work, or spend the evening. Ask how the light changes throughout the day.</p><h3>Think about the practical spaces.</h3><p>Check storage, door clearances, parking, and the route from the entrance to the kitchen. Imagine bringing in groceries, doing laundry, and arranging your furniture.</p><h3>Listen and look closely.</h3><p>Take a quiet moment in each room. Look for visible signs of damp, damage, or repairs. Ask about water, power, maintenance, and any recurring service charges.</p><h3>Bring the right expertise.</h3><p>A viewing is a first impression, not a technical inspection. Before committing, arrange independent professional checks appropriate to the property, and verify any documents and claims with qualified advisers.</p>'}
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => '₦' + Math.round(value).toLocaleString('en-NG');
const icon = name => `<svg class="icon" aria-hidden="true"><use href="images/icons.svg#${name}"/></svg>`;
const validIds = new Set(properties.map(p => p.id));
let saved = new Set();
try { const data = JSON.parse(localStorage.getItem('haven-saved') || '[]'); if (Array.isArray(data)) saved = new Set(data.filter(id => validIds.has(id))); } catch { /* Browsing still works without local storage. */ }
const compared = new Set();
let filter = 'all', intent = 'buy', search = null, visibleCount = 3, toastTimer, currentDetail = null;

function toast(message) {
  const el = $('#toast'); if (!el) return;
  clearTimeout(toastTimer); el.textContent = message; el.classList.add('visible');
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
}
function updateSaved() {
  const count = $('#saved-count'); if (count) count.textContent = saved.size;
  $$('[data-save]').forEach(button => {
    const active = saved.has(button.dataset.save), p = properties.find(p => p.id === button.dataset.save);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', `${active ? 'Unsave' : 'Save'} ${p.title}`);
    if (button.classList.contains('detail-save')) button.innerHTML = `${icon('heart')} ${active ? 'Saved to your collection' : 'Save this home'}`;
  });
}
function toggleSave(id) {
  if (!validIds.has(id)) return;
  const removed = saved.has(id); removed ? saved.delete(id) : saved.add(id);
  let persisted = true; try { localStorage.setItem('haven-saved', JSON.stringify([...saved])); } catch { persisted = false; }
  if (filter === 'saved') renderProperties(); updateSaved();
  toast(removed ? 'Home removed from your saved collection.' : persisted ? 'A little possibility, saved for later.' : 'Saved for this visit. Browser storage is unavailable.');
}
function card(p) {
  return `<article class="property-card"><div class="card-photo"><button class="card-image-button" data-details="${p.id}" aria-label="Explore ${p.title}"><img src="${p.image}" alt="${p.alt}" width="600" height="450" loading="lazy"></button><span class="property-badge">${p.tag}</span><button class="save-button" data-save="${p.id}" aria-label="Save ${p.title}" aria-pressed="${saved.has(p.id)}">${icon('heart')}</button><span class="card-photo-label">${p.feature.toUpperCase()}</span></div><div class="card-copy"><div class="card-price-row"><p class="card-price">${money(p.price)}${p.intent === 'rent' ? '<small> / year</small>' : ''}</p><button class="card-arrow" data-details="${p.id}" aria-label="View ${p.title} details">↗</button></div><h3 class="card-title"><button data-details="${p.id}">${p.title}</button></h3><p class="card-location">${icon('pin')} ${p.location}, Lagos</p><div class="card-specs"><span>${icon('bed')} ${p.beds} beds</span><span>${icon('bath')} ${p.baths} baths</span><span>${icon('area')} ${p.area} m²</span></div><label class="compare-check"><input type="checkbox" data-compare="${p.id}" aria-label="Compare ${p.title}" ${compared.has(p.id) ? 'checked' : ''}> Add to compare</label></div></article>`;
}
function filteredProperties() {
  let result = properties.filter(p => filter === 'saved' ? saved.has(p.id) : filter === 'all' || p.intent === filter);
  if (search) result = result.filter(p => p.intent === search.intent && (search.location === 'all' || p.location === search.location) && (search.type === 'all' || p.type === search.type) && (search.budget === 'all' || p.price <= Number(search.budget)));
  const sort = $('#sort')?.value;
  // Keep annual rents and sale prices in separate groups when sorting mixed inventory.
  if (sort === 'price-asc' || sort === 'price-desc') result.sort((a,b) => a.intent.localeCompare(b.intent) || (sort === 'price-asc' ? a.price-b.price : b.price-a.price));
  else if (sort === 'beds') result.sort((a,b) => b.beds-a.beds);
  return result;
}
function renderProperties() {
  const grid = $('#property-grid'); if (!grid) return;
  const result = filteredProperties(); grid.innerHTML = result.slice(0,visibleCount).map(card).join('');
  $('#result-count').textContent = filter === 'saved' ? `${result.length} saved ${result.length === 1 ? 'home' : 'homes'}` : `${result.length} thoughtfully selected ${result.length === 1 ? 'home' : 'homes'}`;
  $('#empty-state').hidden = result.length > 0;
  $('#empty-copy').textContent = filter === 'saved' && !search ? 'Tap the heart on a home you love. Your collection will be right here.' : 'Try another neighbourhood or a wider budget to find your place.';
  $('#load-more').hidden = result.length <= visibleCount;
  $$('.filter-tab').forEach(b => { const active = b.dataset.filter === filter; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
  $('#active-filters').hidden = !search;
  if (search) $('#filter-description').textContent = [search.intent === 'buy' ? 'For sale' : 'To rent',search.location === 'all' ? 'All Lagos' : search.location,search.type === 'all' ? 'All types' : search.type,search.budget === 'all' ? 'Any price' : `Up to ${money(search.budget)}${search.intent === 'rent' ? ' / year' : ''}`].join(' · ');
  updateSaved();
}
const scrollBehavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
function showCollection() { $('#collection')?.scrollIntoView({behavior:scrollBehavior()}); }
function resetSearch() { filter = 'all'; search = null; visibleCount = 3; $('#search-form')?.reset(); setIntent('buy'); renderProperties(); }
function setIntent(value) {
  intent = value; $$('.search-tab').forEach(b => { const active = b.dataset.intent === value; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
  const budget = $('#budget'); if (!budget) return;
  budget.innerHTML = value === 'buy' ? '<option value="all">Any price</option><option value="150000000">Up to ₦150 million</option><option value="300000000">Up to ₦300 million</option><option value="500000000">Up to ₦500 million</option>' : '<option value="all">Any annual rent</option><option value="7000000">Up to ₦7 million / year</option><option value="12000000">Up to ₦12 million / year</option><option value="20000000">Up to ₦20 million / year</option>';
}
function openDialog(dialog) { if (!dialog.open) dialog.showModal(); dialog.scrollTop = 0; }
function openDetails(id) {
  const p = properties.find(p => p.id === id); if (!p) return; currentDetail = p;
  $('#detail-content').innerHTML = `<img class="detail-image" src="${p.image}" alt="${p.alt}" width="900" height="500"><div class="detail-copy"><p class="eyebrow">${p.intent === 'buy' ? 'A PLACE TO CALL YOUR OWN' : 'MAKE YOURSELF AT HOME'}</p><h2 id="detail-title">${p.title}</h2><p class="card-location">${icon('pin')} ${p.location}, Lagos</p><p class="detail-price">${money(p.price)}${p.intent === 'rent' ? '<small> / year</small>' : ''}</p><p class="detail-description">${p.description}</p><div class="detail-specs"><div><strong>${p.beds}</strong>Bedrooms</div><div><strong>${p.baths}</strong>Bathrooms</div><div><strong>${p.area} m²</strong>Floor area</div><div><strong>${p.type}</strong>Property type</div></div><div class="detail-amenities">${p.amenities.map(a=>`<span>${a}</span>`).join('')}</div><div class="detail-actions"><button class="button button-dark detail-save" data-save="${p.id}">${icon('heart')} Save this home</button>${p.intent === 'buy' ? '<button class="button button-outline" id="plan-property">Plan your budget ↗</button>' : '<button class="button button-outline" id="browse-rentals">Explore rentals ↗</button>'}</div><p class="detail-disclaimer">Illustrative property and concept imagery. This is a demo listing, not an offer for sale or rent. Details and prices are sample data.</p></div>`;
  updateSaved(); openDialog($('#detail-dialog'));
}
function updateCompare() {
  $('#compare-tray').hidden = compared.size === 0; $('#compare-count').textContent = `${compared.size} of 3 homes selected`;
  $('#open-compare').textContent = compared.size < 2 ? 'Add another home ↗' : 'Compare homes ↗';
  $$('[data-compare]').forEach(el => { el.checked = compared.has(el.dataset.compare); });
}
function openCompare() {
  if (compared.size < 2) { toast('Choose at least two homes to see them side by side.'); return; }
  const list = properties.filter(p => compared.has(p.id));
  const rows = [['Price',p=>`<strong>${money(p.price)}</strong>${p.intent === 'rent' ? ' / year' : ''}<span class="compare-type">${p.intent === 'rent' ? 'Annual rent' : 'Sale price'}</span>`],['Location',p=>p.location],['Type',p=>p.type],['Bedrooms',p=>p.beds],['Bathrooms',p=>p.baths],['Floor area',p=>`${p.area} m²`],['Features',p=>p.amenities.join(' · ')]];
  $('#compare-content').innerHTML = `<div class="compare-scroll" tabindex="0" role="region" aria-label="Property comparison table, scroll horizontally for more"><table class="compare-table"><thead><tr><th scope="col">Your shortlist</th>${list.map(p=>`<th scope="col"><img src="${p.image}" alt="${p.alt}" width="250" height="160"><strong>${p.title}</strong></th>`).join('')}</tr></thead><tbody>${rows.map(([label,get])=>`<tr><th scope="row">${label}</th>${list.map(p=>`<td>${get(p)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="detail-disclaimer">Illustrative listings. Annual rent and sale price are shown separately and should not be treated as equivalent costs.</p>`;
  openDialog($('#compare-dialog'));
}
function calculate() {
  const form = $('#calculator'); if (!form) return;
  const price = Number($('#home-price').value), deposit = Number($('#deposit').value), rate = Number($('#interest-rate').value), years = Number($('#loan-term').value);
  if (!form.checkValidity() || !Number.isFinite(price+rate) || price <= 0) { $('#monthly-payment').textContent = '—'; $('#loan-summary').textContent = 'Enter a home price from ₦1 million to ₦10 billion and an annual rate from 0% to 60%.'; return; }
  const principal = price*(1-deposit/100), monthlyRate = rate/1200, months = years*12;
  const payment = monthlyRate === 0 ? principal/months : principal*monthlyRate/(-Math.expm1(-months*Math.log1p(monthlyRate)));
  $('#deposit-label').textContent = `${deposit}% · ${money(price*deposit/100)}`;
  $('#monthly-payment').textContent = money(payment);
  $('#loan-summary').textContent = `${money(principal)} loan · ${years} years · ${rate}% annual interest`;
}

// Delegation keeps newly rendered cards interactive after searching or sorting.
document.addEventListener('click',event=>{
  const button = event.target.closest('button, a'); if (!button) return;
  if (button.matches('[data-save]')) toggleSave(button.dataset.save);
  if (button.matches('[data-details]')) openDetails(button.dataset.details);
  if (button.matches('[data-filter]')) { filter = button.dataset.filter; search = null; visibleCount = 3; renderProperties(); }
  if (button.matches('[data-show-saved]')) { filter = 'saved'; search = null; visibleCount = properties.length; renderProperties(); showCollection(); }
  if (button.matches('[data-intent]')) setIntent(button.dataset.intent);
  if (button.matches('[data-article]')) {
    const article = articles[button.dataset.article]; if (article) { $('#article-content').innerHTML = `<p class="eyebrow">${article.category}</p><h2 id="article-title">${article.title}</h2><div class="article-body">${article.body}</div><a class="text-link" href="#collection" id="article-explore">Explore the collection <span aria-hidden="true">↗</span></a>`; openDialog($('#article-dialog')); }
  }
  if (button.matches('.dialog-close')) button.closest('dialog').close();
  if (button.id === 'load-more') { visibleCount = properties.length; renderProperties(); }
  if (button.id === 'clear-filters' || button.id === 'reset-search') resetSearch();
  if (button.id === 'open-compare') openCompare();
  if (button.id === 'clear-compare') { compared.clear(); updateCompare(); }
  if (button.id === 'plan-property' && currentDetail) { $('#home-price').value = currentDetail.price; calculate(); $('#detail-dialog').close(); $('#planner').scrollIntoView({behavior:scrollBehavior()}); $('#home-price').focus({preventScroll:true}); }
  if (button.id === 'browse-rentals') { $('#detail-dialog').close(); filter = 'rent'; search = null; renderProperties(); showCollection(); }
  if (button.id === 'article-explore') $('#article-dialog').close();
});
document.addEventListener('change',event=>{
  if (!event.target.matches('[data-compare]')) return;
  const el = event.target, id = el.dataset.compare;
  if (el.checked) { if (compared.size === 3) { el.checked = false; toast('Compare up to three homes at a time.'); return; } compared.add(id); }
  else compared.delete(id); updateCompare();
});
$('#search-form')?.addEventListener('submit',event=>{ event.preventDefault(); search = {intent,location:$('#location').value,type:$('#property-type').value,budget:$('#budget').value}; filter = 'all'; visibleCount = properties.length; renderProperties(); showCollection(); });
$('#sort')?.addEventListener('change',renderProperties);
$('#calculator')?.addEventListener('input',calculate);
$('#calculator')?.addEventListener('change',calculate);
$('#calculator')?.addEventListener('submit',event=>event.preventDefault());
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{ if (event.target !== dialog) return; const b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close(); }));
const menuToggle = $('.menu-toggle');
function closeMenu() { menuToggle?.setAttribute('aria-expanded','false'); menuToggle?.setAttribute('aria-label','Open navigation'); $('#main-nav')?.classList.remove('open'); }
menuToggle?.addEventListener('click',()=>{ const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); $('#main-nav').classList.toggle('open',open); });
$$('.nav-link').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{ if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click',event=>{ if (!event.target.closest('.site-header')) closeMenu(); });
const slides = ['courtyard','park','terrace'];
$$('[data-slide]').forEach(button=>button.addEventListener('click',()=>{
  const i = Number(button.dataset.slide), p = properties.find(p=>p.id === slides[i]); if (!p) return;
  const img = $('#hero-image'); img.src = p.image; img.alt = p.alt;
  const feature = $('.hero-property'); feature.dataset.details = p.id; $('strong',feature).textContent = p.title;
  $('.hero-location',feature).innerHTML = `${icon('pin')} ${p.location}, Lagos`;
  $('.hero-image-number').textContent = `0${i+1} / 03`;
  $$('.photo-dot').forEach(b=>{ const active = b === button; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
}));
$$('[data-year]').forEach(el=>el.textContent = new Date().getFullYear());
$('#subscribe-form')?.addEventListener('submit',event=>{
  event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return;
  const message = $('#subscribe-message'); message.hidden = false; message.textContent = 'You’ve previewed the signup experience. This demo does not send or store your email. Connect an email service to activate property updates.'; form.reset();
});
renderProperties(); calculate(); updateSaved();
