const $=id=>document.getElementById(id);
const menu=$('browserMenu'),shade=$('shade'),toast=$('toast');
let toastTimer,historyItems=[];
function notify(message){toast.textContent=message;toast.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.style.display='none',2400)}
function showMenu(){menu.classList.add('open');shade.classList.add('open')}
function hideMenu(){menu.classList.remove('open');shade.classList.remove('open')}
function showHome(){hideMenu();$('homeView').hidden=false;$('settingsView').hidden=true;window.scrollTo({top:0,behavior:'smooth'});$('homeNav').classList.add('active');$('settingsNav').classList.remove('active')}
function showSettings(){hideMenu();$('homeView').hidden=true;$('settingsView').hidden=false;window.scrollTo({top:0,behavior:'smooth'});$('settingsNav').classList.add('active');$('homeNav').classList.remove('active')}
function openAddress(value){let q=value.trim();if(!q)return;if(!/^https?:\/\//i.test(q)){if(q.includes('.')&&!q.includes(' '))q='https://'+q;else q='https://www.google.com/search?q='+encodeURIComponent(q)}try{const u=new URL(q);if(!['http:','https:'].includes(u.protocol))throw new Error();historyItems.unshift({title:u.hostname,url:u.href});renderHistory();notify('Abrindo '+u.hostname+'…');window.location.href=u.href}catch(e){notify('Endereço inválido')}}
function renderHistory(){const list=$('historyList');list.innerHTML='';if(!historyItems.length){list.innerHTML='<p class="empty-history">Sua leitura recente aparecerá aqui.</p>';return}historyItems.slice(0,8).forEach(item=>{const el=document.createElement('button');el.className='history-item';el.innerHTML='<div class="history-cover">✧</div><span></span>';el.querySelector('span').textContent=item.title;el.onclick=()=>openAddress(item.url);list.appendChild(el)})}
$('menuBtn').onclick=showMenu;$('menuNav').onclick=showMenu;shade.onclick=hideMenu;
$('homeBtn').onclick=$('homeNav').onclick=showHome;$('settingsNav').onclick=$('openSettings').onclick=showSettings;
$('backBtn').onclick=()=>history.back();$('forwardBtn').onclick=()=>history.forward();
$('addressForm').onsubmit=e=>{e.preventDefault();openAddress($('addressInput').value)};
$('searchForm').onsubmit=e=>{e.preventDefault();openAddress($('searchInput').value)};
$('seeHistory').onclick=()=>{hideMenu();notify(historyItems.length?historyItems.map(x=>x.title).join(' • '):'Seu histórico está vazio')};
$('historyMenu').onclick=()=>{hideMenu();$('seeHistory').click()};
$('newTab').onclick=()=>{hideMenu();$('addressInput').value='';$('searchInput').value='';showHome();notify('Nova aba')};
$('tabBtn').onclick=()=>notify('1 aba aberta');
document.querySelectorAll('.cover').forEach(card=>card.onclick=()=>{const title=card.dataset.title;historyItems.unshift({title,url:'https://mangaplus.shueisha.co.jp/'});renderHistory();notify(title+' adicionado ao histórico')});
$('autoTranslate').onchange=e=>{$('settingsAuto').checked=e.target.checked;notify(e.target.checked?'Tradução automática ativada':'Tradução automática desativada')};
$('settingsAuto').onchange=e=>$('autoTranslate').checked=e.target.checked;
$('menuAds').onchange=e=>$('settingsAds').checked=e.target.checked;
$('menuDesktop').onchange=e=>$('desktopMode').checked=e.target.checked;
$('settingsAds').onchange=e=>$('menuAds').checked=e.target.checked;
$('desktopMode').onchange=e=>$('menuDesktop').checked=e.target.checked;
document.querySelectorAll('.setting').forEach(button=>button.onclick=()=>{const type=button.dataset.setting;let value;if(type==='target')value=prompt('Idioma de destino:','Português (Brasil)');if(type==='engine')value=prompt('Mecanismo de tradução:','Google');if(type==='size')value=prompt('Tamanho da fonte (%):','100');if(type==='font')value=$('fontStyle').value==='Arial'?'Padrão':$('fontStyle').value;if(value){const ids={target:'targetValue',engine:'engineValue',size:'sizeValue',font:'fontValue'};$(ids[type]).textContent=type==='size'?(value.endsWith('%')?value:value+'%'):value;notify('Preferência atualizada')}});
document.querySelectorAll('[data-theme]').forEach(button=>button.onclick=()=>{const dark=button.dataset.theme==='dark';document.body.classList.toggle('dark',dark);document.querySelectorAll('[data-theme]').forEach(b=>{b.classList.toggle('selected',b===button);b.querySelector('span')?.remove()});if(!dark)button.insertAdjacentHTML('beforeend',' <span>✓</span>');else button.insertAdjacentHTML('beforeend',' <span>✓</span>');notify(dark?'Modo escuro ativado':'Modo claro ativado')});
$('appLanguage').onchange=e=>notify('Idioma selecionado: '+e.target.value);
$('fontStyle').onchange=e=>{document.body.style.fontFamily=e.target.value;notify('Fonte atualizada')};
$('addFont').onclick=()=>notify('Adição de fontes personalizadas será incluída na próxima etapa.');
$('signOut').onclick=()=>notify('O login Google ainda precisa ser conectado.');
$('earnPoints').onclick=()=>notify('Vídeo de recompensa ainda não configurado.');
$('premium').onclick=()=>notify('O plano Premium ainda precisa ser integrado.');
