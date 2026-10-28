const api='/api';
const $=selector=>document.querySelector(selector);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let refreshTimer=null;

function showLogin(){
  $('#app-shell').hidden=true;$('#login-screen').hidden=false;
}
function showApp(name){
  const displayName=(name||'Demo user').trim().slice(0,40)||'Demo user';
  $('#login-screen').hidden=true;$('#app-shell').hidden=false;
  $('#user-name').textContent=displayName;$('#welcome-name').textContent=displayName;$('#avatar').textContent=displayName[0].toUpperCase();
  load();if(!refreshTimer)refreshTimer=setInterval(load,3000);
}

$('#login-form').addEventListener('submit',event=>{
  event.preventDefault();const name=$('#demo-name').value.trim();
  if(!name)return;
  // Password is deliberately not read or transmitted: this is a presentation-only demo gate.
  sessionStorage.setItem('chaoslabDemoName',name);event.currentTarget.reset();showApp(name);
});
$('#logout').addEventListener('click',()=>{sessionStorage.removeItem('chaoslabDemoName');if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null;}showLogin();});

document.querySelectorAll('.side-nav .nav-link').forEach(link=>link.addEventListener('click',()=>{
  document.querySelectorAll('.side-nav .nav-link').forEach(item=>item.classList.remove('active'));link.classList.add('active');
}));

async function load(){
  try{
    const [dashboard,experiments]=await Promise.all([fetch(`${api}/dashboard`).then(r=>r.json()),fetch(`${api}/experiments`).then(r=>r.json())]);
    const active=experiments.filter(item=>item.status==='RUNNING');
    const status=$('#system-status');status.classList.toggle('is-running',active.length>0);
    status.querySelector('span:last-child').textContent=active.length?`${active.length} experiment${active.length===1?'':'s'} running — lab active`:'No experiments running — system nominal';
    $('#status-detail').textContent=active.length?active.map(item=>`${item.name} · ${item.scenario}`).join(' | '):'awaiting fault injection...';
    $('#clear-top').textContent=active.length?'Stop active tests':'All clear';
    $('#metric-total').textContent=dashboard.total;$('#metric-completed').textContent=dashboard.completed;$('#metric-running').textContent=dashboard.running;
    $('#metric-recovery').textContent=dashboard.completed?`${Math.round(dashboard.recoveryRate)}%`:'—';
    $('#rows').innerHTML=experiments.length?experiments.slice(0,20).map(item=>`<tr><td>${escapeHtml(item.name)}<div class="subtle">#${item.id}</div></td><td>${escapeHtml(item.scenario.replaceAll('_',' '))}</td><td><span class="state ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span></td><td>${escapeHtml(item.observation||'—')}</td><td>${item.status==='RUNNING'?`<button class="row-action" onclick="stopExperiment(${item.id})">Stop</button>`:`<button class="row-action" onclick="deleteExperiment(${item.id})">Delete</button>`}</td></tr>`).join(''):'<tr><td class="empty" colspan="5">No experiments yet. Activate a safe simulation above.</td></tr>';
  }catch(error){$('#status-detail').textContent='API unavailable — start the ChaosLab application.';$('#health-status').textContent='Unavailable';$('#health-status').style.color='#ff888d';}
  try{const response=await fetch(`${api}/health`);$('#health-status').textContent=response.ok?'Healthy · local app':'Health check failed';$('#health-status').style.color=response.ok?'#50d397':'#ff888d';}catch(error){/* API message is already shown above. */}
}

async function activate(name,scenario,durationSeconds,intensity){
  $('#notice').textContent=`Starting ${name}…`;
  try{
    const created=await fetch(`${api}/experiments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,description:'Safe application-local simulation. No real service or resource is affected.',scenario,durationSeconds,intensity})});
    if(!created.ok)throw new Error((await created.json()).error||'Could not create simulation');
    const experiment=await created.json();const started=await fetch(`${api}/experiments/${experiment.id}/start`,{method:'POST'});
    if(!started.ok)throw new Error((await started.json()).error||'Could not start simulation');
    $('#notice').textContent=`${name} is active. This action is simulated.`;await load();
  }catch(error){$('#notice').textContent=error.message;}
}
async function stopExperiment(id){const response=await fetch(`${api}/experiments/${id}/stop`,{method:'POST'});if(!response.ok)$('#notice').textContent=(await response.json()).error||'Could not stop experiment';await load();}
async function clearAll(){const all=await fetch(`${api}/experiments`).then(response=>response.json());const active=all.filter(item=>item.status==='RUNNING');await Promise.all(active.map(item=>fetch(`${api}/experiments/${item.id}/stop`,{method:'POST'})));$('#notice').textContent=active.length?'All active simulations stopped.':'Lab is already nominal.';await load();}
async function deleteExperiment(id){if(confirm('Delete this experiment record?')){await fetch(`${api}/experiments/${id}`,{method:'DELETE'});await load();}}
async function generateTraffic(){
  const button=$('#traffic-button'),total=300;button.disabled=true;let completed=0;$('#notice').textContent='Sending safe synthetic health checks to this local app…';
  try{for(let i=0;i<total;i++){const response=await fetch(`${api}/health`,{cache:'no-store'});if(!response.ok)throw new Error(`Health check returned ${response.status}`);completed++;button.textContent=`Traffic running · ${completed}/${total}`;if(i<total-1)await new Promise(resolve=>setTimeout(resolve,200));}$('#notice').textContent=`Traffic complete: ${completed} local health checks sent at about 5 requests per second.`;}
  catch(error){$('#notice').textContent=`Traffic stopped after ${completed} checks: ${error.message}`;}
  finally{button.disabled=false;button.textContent='Generate 60s @ 5 req/s';}
}

const currentName=sessionStorage.getItem('chaoslabDemoName');if(currentName)showApp(currentName);else showLogin();
