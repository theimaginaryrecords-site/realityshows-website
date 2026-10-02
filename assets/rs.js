
// Reality Shows — shared site JS. Firebase loads deferred; everything degrades gracefully.
(function(){
"use strict";
var FB = {"apiKey": "AIzaSyA68HChTsQowansK8ZUVPEk0_J4lpwC_jQ", "authDomain": "aabyd-khan.firebaseapp.com", "projectId": "aabyd-khan", "storageBucket": "aabyd-khan.firebasestorage.app", "messagingSenderId": "876898185487", "appId": "1:876898185487:web:a790f0d826ff9d67500e7a", "measurementId": "G-QWG3M85FKM"};
var ADMIN_CODE = "tir2026";
var CLOUDINARY = {"cloudName": "hzb5usfy", "uploadPreset": "rs_uploads"};

function onFbReady(cb){
  if(window.firebase && firebase.apps && firebase.apps.length){ cb(); return; }
  var t=0, iv=setInterval(function(){
    if(window.firebase && firebase.apps && firebase.apps.length){ clearInterval(iv); cb(); }
    else if(++t>100){ clearInterval(iv); }
  },100);
}
function initFb(){
  if(window.firebase && !(firebase.apps && firebase.apps.length)){
    try{ firebase.initializeApp(FB); }catch(e){}
  }
}

// ---------- mobile menu ----------
document.addEventListener('DOMContentLoaded', function(){
  var b=document.getElementById('burger'), m=document.getElementById('mobmenu');
  if(b&&m){ b.addEventListener('click', function(){ m.classList.toggle('open'); }); }
  initFb();
  onFbReady(function(){ initPolls(); initCountdown(); });
  // admin page boots itself
  if(document.getElementById('admin-root')){ onFbReady(initAdmin); }
  // dynamic latest posts on /news/
  if(document.getElementById('dyn-posts')){ onFbReady(loadDynPosts); }
});

// ---------- countdown to Weekend Ka Vaar (next Saturday 21:00 IST, sample logic) ----------
function initCountdown(){
  var dd0=document.getElementById('cd-d'); if(!dd0) return;
  function next(){ var n=new Date(); var d=new Date(n);
    d.setDate(n.getDate()+((6-n.getDay()+7)%7)); d.setHours(21,0,0,0);
    if(d<=n) d.setDate(d.getDate()+7); return d; }
  var target=next();
  function tick(){
    var diff=target-new Date(); if(diff<0){target=next();diff=target-new Date();}
    var s=Math.floor(diff/1000);
    var dd=Math.floor(s/86400), hh=Math.floor(s%86400/3600), mm=Math.floor(s%3600/60), ss=s%60;
    function set(id,v){var e=document.getElementById(id); if(e) e.textContent=String(v).padStart(2,'0');}
    set('cd-d',dd); set('cd-h',hh); set('cd-m',mm); set('cd-s',ss);
  }
  tick(); setInterval(tick,1000);
}

// ---------- fan polls (multi-poll registry) ----------
function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
var POLLS = {"bb-winner": {"doc": "bb20-week4", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Who Will Win Bigg Boss 20?", "weekly": false, "danger": false, "sub": "Season-long unofficial fan poll. One vote per device.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "mary-kom", "name": "Mary Kom"}, {"slug": "aasif-khan", "name": "Aasif Khan"}, {"slug": "kanika-mann", "name": "Kanika Mann"}, {"slug": "scoutop", "name": "ScoutOP"}, {"slug": "amrapali-dubey", "name": "Amrapali Dubey"}, {"slug": "mahhi-vij", "name": "Mahhi Vij"}, {"slug": "yung-dsa", "name": "Yung DSA"}, {"slug": "qazi-touqeer", "name": "Qazi Touqeer"}, {"slug": "arishfa-khan", "name": "Arishfa Khan"}, {"slug": "gullu", "name": "Gullu"}, {"slug": "uditi-singh", "name": "Uditi Singh"}, {"slug": "aman-gandhi", "name": "Aman Gandhi"}, {"slug": "love-gill", "name": "Love Gill"}]}, "bb-evict": {"doc": "bb20-evict", "votesColl": "rs_poll_evict_votes", "totalsColl": "rs_poll_evict_totals", "title": "Who Will Be Evicted This Weekend?", "weekly": true, "danger": true, "sub": "Weekly eviction prediction \u2014 vote for who you think will LEAVE. Resets every Monday.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results. Lowest-vote contestants are marked \"in danger\".", "options": [{"slug": "mary-kom", "name": "Mary Kom"}, {"slug": "aasif-khan", "name": "Aasif Khan"}, {"slug": "kanika-mann", "name": "Kanika Mann"}, {"slug": "scoutop", "name": "ScoutOP"}, {"slug": "amrapali-dubey", "name": "Amrapali Dubey"}, {"slug": "mahhi-vij", "name": "Mahhi Vij"}, {"slug": "yung-dsa", "name": "Yung DSA"}, {"slug": "qazi-touqeer", "name": "Qazi Touqeer"}, {"slug": "arishfa-khan", "name": "Arishfa Khan"}, {"slug": "gullu", "name": "Gullu"}, {"slug": "uditi-singh", "name": "Uditi Singh"}, {"slug": "aman-gandhi", "name": "Aman Gandhi"}, {"slug": "love-gill", "name": "Love Gill"}]}, "kkk15-winner": {"doc": "kkk15-winner", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Who Will Win Khatron Ke Khiladi 15?", "weekly": false, "danger": false, "sub": "Finale Oct 3-4! Poll open till the official telecast. Winner \"leaks\" online are unverified rumours.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "farrhana-bhatt", "name": "Farrhana Bhatt"}, {"slug": "avinash-mishra", "name": "Avinash Mishra"}, {"slug": "karan-wahi", "name": "Karan Wahi"}, {"slug": "rubina-dilaik", "name": "Rubina Dilaik"}, {"slug": "orry", "name": "Orry"}, {"slug": "rithvik-dhanjani", "name": "Rithvik Dhanjani"}, {"slug": "harsh-gujral", "name": "Harsh Gujral"}, {"slug": "shagun-sharma", "name": "Shagun Sharma"}, {"slug": "avika-gor", "name": "Avika Gor"}, {"slug": "ruhanika-dhawan", "name": "Ruhanika Dhawan"}]}, "rf2-winner": {"doc": "rf2-winner", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Who Will Win Rise and Fall Season 2?", "weekly": false, "danger": false, "sub": "Rulers vs Workers \u2014 back your winner. One vote per device.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "swara-bhasker", "name": "Swara Bhasker"}, {"slug": "shehzad-poonawalla", "name": "Shehzad Poonawalla"}, {"slug": "priyanka-chahar-choudhary", "name": "Priyanka Chahar Choudhary"}, {"slug": "karan-patel", "name": "Karan Patel"}, {"slug": "kajal-raghwani", "name": "Kajal Raghwani"}, {"slug": "tej-pratap-yadav", "name": "Tej Pratap Yadav"}, {"slug": "niharika-tiwari", "name": "Niharika Tiwari"}]}, "lockupp-next": {"doc": "lockupp-next", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Who Do You Want in the Next Lock Upp Season?", "weekly": false, "danger": false, "sub": "Dream-contestant poll \u2014 which kind of celebrity should enter the jail next?", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "bb-alumni", "name": "Bigg Boss Alumni"}, {"slug": "roadies-splitsvilla", "name": "Roadies / Splitsvilla Stars"}, {"slug": "tv-actors", "name": "TV Actors"}, {"slug": "influencers", "name": "Influencers & YouTubers"}, {"slug": "cricketers", "name": "Cricketers"}, {"slug": "comedians", "name": "Comedians"}]}, "roadies-factions": {"doc": "roadies-factions", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "OGs vs NewGs \u2014 Which Side Are You On?", "weekly": false, "danger": false, "sub": "Pick your camp before the October 16 premiere.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "ogs", "name": "Team OGs (Nikhil, Neha, Prince)"}, {"slug": "newgs", "name": "Team NewGs (Fukra, Bani, Baseer)"}]}, "latent-best": {"doc": "latent-best", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Best India's Got Latent S2 Moment So Far?", "weekly": false, "danger": false, "sub": "Vote for your favourite moment of the season.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "ep7-prateik", "name": "Ep 7 \u2014 Prateik's Amitabh mimicry (9.5)"}, {"slug": "bonus3-kalal", "name": "Bonus EP 3 \u2014 Deepak Kalal's emotional moment"}, {"slug": "bonus4-ayushmann", "name": "Bonus EP 4 \u2014 Ayushmann & Suhani episode"}, {"slug": "premiere", "name": "Premiere \u2014 Alia & Sharvari kick-off"}]}, "idol17-hype": {"doc": "idol17-hype", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "What Are You Most Excited For in Indian Idol 17?", "weekly": false, "danger": false, "sub": "The \"Legends Return\" season is coming \u2014 what has you hyped?", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "himesh", "name": "Himesh Reshammiya's return"}, {"slug": "legends-theme", "name": "The 'Legends Return' theme"}, {"slug": "auditions", "name": "The auditions"}, {"slug": "winner-journey", "name": "The winner's journey"}]}, "splitsvilla-best": {"doc": "splitsvilla-best", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Best Couple of Splitsvilla X6?", "weekly": false, "danger": false, "sub": "The season ended \u2014 crown your favourite jodi.", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "gullu-kaira", "name": "Gullu & Kaira Anu (winners)"}, {"slug": "yogesh-ruru", "name": "Yogesh Rawat & Ruru Thakur"}]}, "sharktank-fav": {"doc": "sharktank-fav", "votesColl": "rs_poll_votes", "totalsColl": "rs_poll_totals", "title": "Favourite New Shark of Season 5?", "weekly": false, "danger": false, "sub": "Six new sharks joined the tank \u2014 who impressed you most?", "disclaimer": "Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.", "options": [{"slug": "varun-alagh", "name": "Varun Alagh"}, {"slug": "mohit-yadav", "name": "Mohit Yadav"}, {"slug": "kanika-tekriwal", "name": "Kanika Tekriwal"}, {"slug": "shaily-mehrotra", "name": "Shaily Mehrotra"}, {"slug": "hardik-kothiya", "name": "Hardik Kothiya"}, {"slug": "pratham-mittal", "name": "Pratham Mittal"}]}};
var POLL_ALIAS = {mini:'bb-winner', full:'bb-winner'};

function isoWeekId(){
  var d=new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate()+3-((d.getDay()+6)%7));
  var w1=new Date(d.getFullYear(),0,4);
  var w=1+Math.round(((d.getTime()-w1.getTime())/86400000-3+((w1.getDay()+6)%7))/7);
  return d.getFullYear()+'-W'+(w<10?'0':'')+w;
}
function pollKey(raw){ return POLL_ALIAS[raw]||raw; }
function pollDoc(cfg){ return cfg.weekly ? (cfg.doc+'-'+isoWeekId()) : cfg.doc; }
function votedForDoc(doc){ try{ return localStorage.getItem('rs_voted_'+doc); }catch(e){ return null; } }
function setVotedDoc(doc,slug){ try{ localStorage.setItem('rs_voted_'+doc,slug); }catch(e){} }

function initPolls(){
  document.querySelectorAll('[data-poll]').forEach(buildPoll);
  loadDynPolls();
}
function buildPoll(root){
  var raw=root.getAttribute('data-poll');
  var key=pollKey(raw), cfg=POLLS[key];
  if(!cfg){ root.innerHTML='<p style="color:var(--muted)">Poll unavailable.</p>'; return; }
  renderPoll(root, key, cfg, raw==='mini');
}
// Renders any poll config (hardcoded registry or Firestore rs_poll_defs).
function renderPoll(root, key, cfg, mini){
  var doc=pollDoc(cfg);
  root.setAttribute('data-mini', mini?'1':'');
  var opts=(cfg.options||[]).slice();
  if(mini) opts=opts.slice(0,6);
  var voted=votedForDoc(doc);
  var html='<h3>'+escapeHtml(cfg.title)+'</h3><p class="poll-sub">'+escapeHtml(cfg.sub||'')+'</p><div class="poll-opts">';
  opts.forEach(function(o){
    html+='<div class="opt'+(voted===o.slug?' voted':'')+'" data-slug="'+o.slug+'">'
      +'<div class="opt-top"><span class="opt-name">'+escapeHtml(o.name)+'</span><span class="opt-pct" data-pct>--%</span></div>'
      +'<div class="bar"><i data-bar></i></div>'
      +(!voted?'<button class="vote-btn" data-vote="'+o.slug+'">Vote</button>':'')
      +'</div>';
  });
  html+='</div><div class="poll-total" data-total>Loading votes&hellip;</div>'
    +'<div class="disclaimer"><strong>Unofficial fan poll.</strong> '+escapeHtml(cfg.disclaimer||'Not affiliated with or endorsed by any broadcaster or production house. This poll has no bearing on official results.')+'</div>';
  root.innerHTML=html;
  if(!voted){
    root.querySelectorAll('[data-vote]').forEach(function(btn){
      btn.addEventListener('click', function(){ castVote(cfg, doc, btn.getAttribute('data-vote'), root); });
    });
  }
  refreshPoll(root, cfg, doc);
  // real-time: onSnapshot pushes updates instantly; no polling interval needed
}
// Admin-created polls (Firestore rs_poll_defs, active=true) render into [data-dyn-polls] slots.
function loadDynPolls(){
  var boxes=document.querySelectorAll('[data-dyn-polls]');
  if(!boxes.length) return;
  try{
    firebase.firestore().collection('rs_poll_defs').where('active','==',true).get().then(function(q){
      if(q.empty) return;
      var defs=[];
      q.forEach(function(d){ var c=d.data(); c._id=d.id; defs.push(c); });
      boxes.forEach(function(box){
        var f=box.getAttribute('data-show');
        var list=defs.filter(function(c){ var s=c.show||'all'; return !f || s==='all' || s===f; });
        if(!list.length) return;
        var h='<div class="sec-head"><h2>More <span>Fan Polls</span></h2></div>';
        box.innerHTML=h;
        list.forEach(function(cfg){
          var wrap=document.createElement('div');
          wrap.className='poll-card'; wrap.style.cssText='margin:0 auto 22px;max-width:720px';
          box.appendChild(wrap);
          renderPoll(wrap, 'dyn-'+cfg._id, cfg, false);
        });
      });
    }).catch(function(){});
  }catch(e){}
}
function castVote(cfg, doc, slug, root){
  if(votedForDoc(doc)) return;
  setVotedDoc(doc, slug);
  try{
    var db=firebase.firestore();
    var upd={}; upd[slug]=firebase.firestore.FieldValue.increment(1);
    db.collection(cfg.totalsColl).doc(doc).set(upd, {merge:true});
    var rec={pollId:doc, contestantId:slug, createdAt:firebase.firestore.FieldValue.serverTimestamp()};
    db.collection(cfg.votesColl).add(rec);
  }catch(e){}
  renderPoll(root, 're', cfg, root.getAttribute('data-mini')==='1');
}
function refreshPoll(root, cfg, doc){
  var counts={}, total=0;
  // drop any previous real-time listener on this poll slot (avoids duplicates)
  if(root._unsub){ try{ root._unsub(); }catch(e){} root._unsub=null; }
  function render(){
    var opts=root.querySelectorAll('.opt');
    var min=Infinity;
    if(cfg.danger){
      opts.forEach(function(o){ var v=counts[o.getAttribute('data-slug')]||0; if(v<min) min=v; });
    }
    opts.forEach(function(o){
      var slug=o.getAttribute('data-slug'), v=counts[slug]||0;
      var pct=total?Math.round(v/total*100):0;
      var pe=o.querySelector('[data-pct]'); if(pe) pe.textContent=pct+'%';
      var bar=o.querySelector('[data-bar]'); if(bar) bar.style.width=pct+'%';
      if(cfg.danger && total>0 && v===min){ o.classList.add('danger'); }
    });
    var t=root.querySelector('[data-total]');
    if(t) t.innerHTML= total
      ? ('<span class="live-dot"></span>LIVE &middot; <b>'+total.toLocaleString('en-IN')+'</b> fan votes')
      : 'Be the first to vote!';
  }
  try{
    // Real-time listener: every vote updates all viewers within ~1 second.
    root._unsub=firebase.firestore().collection(cfg.totalsColl).doc(doc).onSnapshot(function(d){
      counts={}; total=0;
      if(d.exists){ counts=d.data()||{}; Object.keys(counts).forEach(function(k){ total+=counts[k]||0; }); }
      render();
    }, function(){ render(); });
  }catch(e){ render(); }
}
// ---------- dynamic posts on /news/ (from Firestore rs_posts) ----------
function loadDynPosts(){
  var box=document.getElementById('dyn-posts'); if(!box) return;
  try{
    firebase.firestore().collection('rs_posts').where('published','==',true)
      .orderBy('createdAt','desc').limit(10).get().then(function(q){
      if(q.empty) return;
      var h='<div class="sec-head"><h2>Fresh <span>Updates</span></h2></div><div class="grid">';
      q.forEach(function(d){
        var p=d.data();
        var art = p.imageUrl
          ? '<div class="card-art" style="padding:0"><img src="'+escapeHtml(p.imageUrl)+'" alt="" style="width:100%;height:170px;object-fit:cover"/></div>'
          : '<div class="card-art">'+escapeHtml((p.title||'?').slice(0,2).toUpperCase())+'</div>';
        h+='<div class="card">'+art
          +'<div class="card-body"><span class="cat">'+escapeHtml(p.category||'News')+'</span>'
          +'<h3>'+escapeHtml(p.title||'')+'</h3><p>'+escapeHtml(p.excerpt||'')+'</p>'
          +'<div class="meta">Reality Shows desk</div></div></div>';
      });
      box.innerHTML=h+'</div>';
    }).catch(function(){});
  }catch(e){}
}

// ---------- admin CMS (full control panel) ----------
function initAdmin(){
  var root=document.getElementById('admin-root');
  if(sessionStorage.getItem('rs_admin')==='1'){ showPanel(root); return; }
  root.innerHTML='<div class="form-card"><h2 style="font-family:var(--font-d);text-transform:uppercase">Admin Login</h2>'
    +'<p style="color:var(--muted);font-size:.9rem;margin-top:8px">Enter the site passcode to manage the website.</p>'
    +'<label>Passcode</label><input type="password" id="adm-code" autocomplete="off"/>'
    +'<div style="margin-top:18px"><button class="btn btn-gold" id="adm-go">Unlock</button></div>'
    +'<p id="adm-err" style="color:#f87171;margin-top:10px;display:none">Wrong passcode.</p></div>';
  document.getElementById('adm-go').addEventListener('click', function(){
    if(document.getElementById('adm-code').value===ADMIN_CODE){
      sessionStorage.setItem('rs_admin','1'); showPanel(root);
    } else { document.getElementById('adm-err').style.display='block'; }
  });
}
function slugify(s){ return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/[\s_]+/g,'-').replace(/-+/g,'-').slice(0,80); }

var SHOW_OPTS = [
  ['bb20','Bigg Boss 20'],['khatron-ke-khiladi','Khatron Ke Khiladi 15'],
  ['rise-and-fall','Rise and Fall S2'],['lock-upp','Lock Upp'],['roadies','Roadies Rebirth'],
  ['indias-got-latent',"India's Got Latent"],['indian-idol','Indian Idol 17'],
  ['splitsvilla','Splitsvilla'],['shark-tank','Shark Tank India'],['other','Other']
];
var CAT_OPTS = ['News','Eviction','Controversy','Gossip','TRP & Records','Tasks','Rumours','Fights','Weekend Ka Vaar'];
function optsHtml(list, sel){ return list.map(function(o){ var v=o[0]||o, l=o[1]||o; return '<option value="'+v+'"'+(v===sel?' selected':'')+'>'+escapeHtml(l)+'</option>'; }).join(''); }
function showName(v){ var f=SHOW_OPTS.filter(function(o){return o[0]===v;}); return f.length?f[0][1]:(v||'—'); }

function showPanel(root){
  root.innerHTML='<div class="form-card" style="max-width:860px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-family:var(--font-d);text-transform:uppercase">Site Control</h2>'
    +'<button class="btn-sm" id="adm-lock">Lock</button></div>'
    +'<div class="tabs" style="margin-top:16px">'
    +'<button class="tab-btn active" data-tab="articles">Articles</button>'
    +'<button class="tab-btn" data-tab="polls">Polls</button>'
    +'<button class="tab-btn" data-tab="media">Media</button>'
    +'<button class="tab-btn" data-tab="info">Info</button>'
    +'</div><div id="tab-body"></div></div>';
  document.getElementById('adm-lock').addEventListener('click', function(){
    sessionStorage.removeItem('rs_admin'); initAdmin();
  });
  var tabs=root.querySelectorAll('.tab-btn');
  tabs.forEach(function(b){ b.addEventListener('click', function(){
    tabs.forEach(function(x){x.classList.remove('active');}); b.classList.add('active');
    renderTab(b.getAttribute('data-tab'));
  }); });
  renderTab('articles');
}
function renderTab(t){
  if(t==='articles') tabArticles();
  else if(t==='polls') tabPolls();
  else if(t==='media') tabMedia();
  else tabInfo();
}
function uploadToCloudinary(file, onProg){
  return new Promise(function(res, rej){
    if(!CLOUDINARY.cloudName || CLOUDINARY.cloudName.indexOf('REPLACE')===0){
      rej(new Error('Cloudinary not configured — set cloudName in build.py')); return;
    }
    var isVideo=/^video\//.test(file.type);
    var url='https://api.cloudinary.com/v1_1/'+CLOUDINARY.cloudName+'/'+(isVideo?'video':'image')+'/upload';
    var fd=new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY.uploadPreset);
    var xhr=new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress=function(e){ if(e.lengthComputable&&onProg) onProg(Math.round(e.loaded/e.total*100)); };
    xhr.onload=function(){
      try{
        var j=JSON.parse(xhr.responseText);
        if(xhr.status>=200&&xhr.status<300&&j.secure_url) res({url:j.secure_url, public_id:j.public_id||'', resource_type:j.resource_type||'image'});
        else rej(new Error((j&&j.error&&j.error.message)||('Upload failed ('+xhr.status+')')));
      }catch(e){ rej(new Error('Upload failed: bad response')); }
    };
    xhr.onerror=function(){ rej(new Error('Upload failed: network error')); };
    xhr.send(fd);
  });
}
function cloudinaryConfigured(){
  return CLOUDINARY.cloudName && CLOUDINARY.cloudName.indexOf('REPLACE')!==0;
}
function copyText(t, btn){
  function done(){ var o=btn.textContent; btn.textContent='Copied!'; setTimeout(function(){btn.textContent=o;},1500); }
  function fallback(){ var ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');done();}catch(e){} document.body.removeChild(ta); }
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done).catch(fallback); }
  else fallback();
}

// ================= ARTICLES =================
var editingArticle=null, articleImageUrl='';
function tabArticles(){
  var box=document.getElementById('tab-body');
  box.innerHTML='<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:6px" id="art-form-title">New Article</h3>'
    +'<label>Title</label><input type="text" id="a-title"/>'
    +'<label>Show</label><select id="a-show">'+optsHtml(SHOW_OPTS,'bb20')+'</select>'
    +'<label>Category</label><select id="a-cat">'+optsHtml(CAT_OPTS,'News')+'</select>'
    +'<label>Excerpt</label><input type="text" id="a-excerpt"/>'
    +'<label>Body (plain text, blank line = new paragraph)</label><textarea id="a-body"></textarea>'
    +'<label>Featured image</label><input type="file" id="a-file" accept="image/*"/>'
    +'<div class="prog" id="a-prog" style="display:none"><i></i></div>'
    +'<div id="a-preview"></div>'
    +'<label style="display:flex;align-items:center;gap:10px;margin-top:14px"><input type="checkbox" id="a-pub" checked style="width:auto"/> Published</label>'
    +'<div class="btn-row"><button class="btn btn-gold" id="a-save">Publish</button>'
    +'<button class="btn-sm" id="a-cancel" style="display:none">Cancel edit</button></div>'
    +'<p id="a-msg" style="margin-top:10px;color:var(--muted)"></p>'
    +'<hr style="border:none;border-top:1px solid var(--border);margin:26px 0"/>'
    +'<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:10px">All Articles</h3><div id="a-list"><p style="color:var(--muted)">Loading…</p></div>';
  document.getElementById('a-file').addEventListener('change', function(e){
    var f=e.target.files[0]; if(!f) return;
    var prog=document.getElementById('a-prog'); prog.style.display='block';
    var bar=prog.querySelector('i');
    uploadToCloudinary(f, function(p){ bar.style.width=p+'%'; }).then(function(r){
      articleImageUrl=r.url;
      document.getElementById('a-preview').innerHTML='<img class="img-preview" src="'+escapeHtml(r.url)+'" alt=""/>';
      document.getElementById('a-msg').textContent='Image uploaded to Cloudinary.';
    }).catch(function(err){ document.getElementById('a-msg').textContent='Upload failed: '+err.message; });
  });
  document.getElementById('a-save').addEventListener('click', saveArticle);
  document.getElementById('a-cancel').addEventListener('click', function(){ resetArticleForm(); });
  listArticles();
}
function bodyToHtml(t){ return t.trim().split(/\n\s*\n/).map(function(p){return '<p>'+escapeHtml(p).replace(/\n/g,'<br>')+'</p>';}).join('\n'); }
function htmlToBody(h){ return h.replace(/<br\s*\/?>/gi,'\n').replace(/<\/p>\s*<p>/gi,'\n\n').replace(/<\/?p[^>]*>/gi,'').replace(/<[^>]+>/g,'').trim(); }
function saveArticle(){
  var t=document.getElementById('a-title').value.trim();
  if(!t){ document.getElementById('a-msg').textContent='Title is required.'; return; }
  var doc={ title:t, slug:slugify(t), show:document.getElementById('a-show').value,
    category:document.getElementById('a-cat').value, excerpt:document.getElementById('a-excerpt').value.trim(),
    body:bodyToHtml(document.getElementById('a-body').value),
    imageUrl:articleImageUrl||'',
    published:document.getElementById('a-pub').checked,
    updatedAt:firebase.firestore.FieldValue.serverTimestamp() };
  var msg=document.getElementById('a-msg'); msg.textContent='Saving…';
  var coll=firebase.firestore().collection('rs_posts');
  var p;
  if(editingArticle){ p=coll.doc(editingArticle).update(doc); }
  else { doc.createdAt=firebase.firestore.FieldValue.serverTimestamp(); p=coll.add(doc); }
  p.then(function(){ msg.textContent=editingArticle?'Updated!':'Published — live under Fresh Updates on /news/.'; resetArticleForm(); listArticles(); })
   .catch(function(e){ msg.textContent='Error: '+e.message; });
}
function resetArticleForm(){
  editingArticle=null; articleImageUrl='';
  document.getElementById('a-title').value=''; document.getElementById('a-excerpt').value='';
  document.getElementById('a-body').value=''; document.getElementById('a-file').value='';
  document.getElementById('a-preview').innerHTML=''; document.getElementById('a-pub').checked=true;
  document.getElementById('art-form-title').textContent='New Article';
  document.getElementById('a-save').textContent='Publish';
  document.getElementById('a-cancel').style.display='none';
  document.getElementById('a-msg').textContent='';
}
function listArticles(){
  var box=document.getElementById('a-list'); if(!box) return;
  firebase.firestore().collection('rs_posts').orderBy('createdAt','desc').limit(50).get().then(function(q){
    if(q.empty){ box.innerHTML='<p style="color:var(--muted)">No articles yet.</p>'; return; }
    var h='';
    q.forEach(function(d){
      var p=d.data();
      var dt=p.createdAt&&p.createdAt.toDate?p.createdAt.toDate().toLocaleDateString('en-IN'):'—';
      h+='<div class="post-row"><div><b>'+escapeHtml(p.title||'(untitled)')+'</b>'
        +'<span class="badge '+(p.published?'on':'off')+'">'+(p.published?'Live':'Draft')+'</span>'
        +'<br><span style="color:var(--muted);font-size:.8rem">'+escapeHtml(p.category||'')+' · '+escapeHtml(showName(p.show))+' · '+dt+'</span></div>'
        +'<div class="btn-row" style="margin:0"><button class="btn-sm gold" data-edit="'+d.id+'">Edit</button>'
        +'<button class="btn-sm danger" data-delart="'+d.id+'">Delete</button></div></div>';
    });
    box.innerHTML=h;
    box.querySelectorAll('[data-delart]').forEach(function(b){
      b.addEventListener('click', function(){
        if(!confirm('Delete this article?')) return;
        firebase.firestore().collection('rs_posts').doc(b.getAttribute('data-delart')).delete().then(listArticles);
      });
    });
    box.querySelectorAll('[data-edit]').forEach(function(b){
      b.addEventListener('click', function(){ editArticle(b.getAttribute('data-edit')); });
    });
  }).catch(function(e){ box.innerHTML='<p style="color:#f87171">Could not load: '+escapeHtml(e.message)+'</p>'; });
}
function editArticle(id){
  firebase.firestore().collection('rs_posts').doc(id).get().then(function(d){
    if(!d.exists) return;
    var p=d.data(); editingArticle=id; articleImageUrl=p.imageUrl||'';
    document.getElementById('a-title').value=p.title||'';
    document.getElementById('a-show').value=p.show||'bb20';
    document.getElementById('a-cat').value=p.category||'News';
    document.getElementById('a-excerpt').value=p.excerpt||'';
    document.getElementById('a-body').value=htmlToBody(p.body||'');
    document.getElementById('a-pub').checked=!!p.published;
    document.getElementById('a-preview').innerHTML=articleImageUrl?'<img class="img-preview" src="'+escapeHtml(articleImageUrl)+'" alt=""/>':'';
    document.getElementById('art-form-title').textContent='Edit Article';
    document.getElementById('a-save').textContent='Update';
    document.getElementById('a-cancel').style.display='inline-block';
    window.scrollTo(0,0);
  });
}

// ================= POLLS =================
var editingPoll=null;
function tabPolls(){
  var box=document.getElementById('tab-body');
  box.innerHTML='<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:6px" id="pl-form-title">New Poll</h3>'
    +'<label>Question</label><input type="text" id="pl-title" placeholder="Who will win…?"/>'
    +'<label>Subtitle</label><input type="text" id="pl-sub" placeholder="One vote per device."/>'
    +'<label>Show</label><select id="pl-show">'+optsHtml(SHOW_OPTS,'bb20')+'<option value="all">All shows</option></select>'
    +'<label>Poll type</label><select id="pl-type"><option value="standard">Standard</option><option value="winner">Winner prediction</option><option value="weekly-eviction">Weekly eviction (resets Monday + danger highlight)</option></select>'
    +'<label>Options</label><div id="pl-opts"></div>'
    +'<button class="btn-sm gold" id="pl-addopt" type="button">+ Add option</button>'
    +'<label style="display:flex;align-items:center;gap:10px;margin-top:14px"><input type="checkbox" id="pl-active" checked style="width:auto"/> Active (visible on site)</label>'
    +'<div class="btn-row"><button class="btn btn-gold" id="pl-save">Create Poll</button>'
    +'<button class="btn-sm" id="pl-cancel" style="display:none">Cancel edit</button></div>'
    +'<p id="pl-msg" style="margin-top:10px;color:var(--muted)"></p>'
    +'<hr style="border:none;border-top:1px solid var(--border);margin:26px 0"/>'
    +'<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:10px">Custom Polls</h3><div id="pl-list"><p style="color:var(--muted)">Loading…</p></div>';
  addPollOpt(); addPollOpt();
  document.getElementById('pl-addopt').addEventListener('click', function(){ addPollOpt(); });
  document.getElementById('pl-save').addEventListener('click', savePoll);
  document.getElementById('pl-cancel').addEventListener('click', function(){ resetPollForm(); });
  listPolls();
}
function addPollOpt(val){
  var d=document.createElement('div'); d.className='opt-input';
  d.innerHTML='<input type="text" placeholder="Option name" value="'+escapeHtml(val||'')+'"/><button class="btn-sm danger" type="button">✕</button>';
  d.querySelector('button').addEventListener('click', function(){ d.remove(); });
  document.getElementById('pl-opts').appendChild(d);
}
function savePoll(){
  var title=document.getElementById('pl-title').value.trim();
  if(!title){ document.getElementById('pl-msg').textContent='Question is required.'; return; }
  var names=[].map.call(document.querySelectorAll('#pl-opts input'), function(i){return i.value.trim();}).filter(Boolean);
  if(names.length<2){ document.getElementById('pl-msg').textContent='Add at least 2 options.'; return; }
  var type=document.getElementById('pl-type').value;
  var options=names.map(function(n){ return {slug:slugify(n), name:n}; });
  var msg=document.getElementById('pl-msg'); msg.textContent='Saving…';
  var db=firebase.firestore();
  var id = editingPoll || db.collection('rs_poll_defs').doc().id;
  var doc={ title:title, sub:document.getElementById('pl-sub').value.trim(),
    show:document.getElementById('pl-show').value, pollType:type,
    weekly:(type==='weekly-eviction'), danger:(type==='weekly-eviction'),
    active:document.getElementById('pl-active').checked,
    options:options, doc:id, votesColl:'rs_votes_'+id, totalsColl:'rs_totals_'+id,
    updatedAt:firebase.firestore.FieldValue.serverTimestamp() };
  var p = editingPoll
    ? db.collection('rs_poll_defs').doc(id).update(doc)
    : (doc.createdAt=firebase.firestore.FieldValue.serverTimestamp(), db.collection('rs_poll_defs').doc(id).set(doc));
  p.then(function(){ msg.textContent=editingPoll?'Poll updated!':'Poll created — live on the site now.'; resetPollForm(); listPolls(); })
   .catch(function(e){ msg.textContent='Error: '+e.message; });
}
function resetPollForm(){
  editingPoll=null;
  document.getElementById('pl-title').value=''; document.getElementById('pl-sub').value='';
  document.getElementById('pl-opts').innerHTML=''; addPollOpt(); addPollOpt();
  document.getElementById('pl-active').checked=true;
  document.getElementById('pl-form-title').textContent='New Poll';
  document.getElementById('pl-save').textContent='Create Poll';
  document.getElementById('pl-cancel').style.display='none';
  document.getElementById('pl-msg').textContent='';
}
function listPolls(){
  var box=document.getElementById('pl-list'); if(!box) return;
  firebase.firestore().collection('rs_poll_defs').orderBy('createdAt','desc').limit(50).get().then(function(q){
    if(q.empty){ box.innerHTML='<p style="color:var(--muted)">No custom polls yet. The built-in polls (BB20, KKK, etc.) are always live.</p>'; return; }
    var h='';
    q.forEach(function(d){
      var p=d.data();
      h+='<div class="post-row"><div><b>'+escapeHtml(p.title||'(untitled)')+'</b>'
        +'<span class="badge '+(p.active?'on':'off')+'">'+(p.active?'Active':'Hidden')+'</span>'
        +'<br><span style="color:var(--muted);font-size:.8rem">'+escapeHtml(p.pollType||'standard')+' · '+escapeHtml(showName(p.show))+' · '+(p.options||[]).length+' options</span></div>'
        +'<div class="btn-row" style="margin:0"><button class="btn-sm gold" data-editpl="'+d.id+'">Edit</button>'
        +'<button class="btn-sm" data-togglepl="'+d.id+'">'+(p.active?'Hide':'Show')+'</button>'
        +'<button class="btn-sm danger" data-delpl="'+d.id+'">Delete</button></div></div>';
    });
    box.innerHTML=h;
    box.querySelectorAll('[data-delpl]').forEach(function(b){
      b.addEventListener('click', function(){
        if(!confirm('Delete this poll? Past votes stay in the database, but the poll disappears from the site.')) return;
        firebase.firestore().collection('rs_poll_defs').doc(b.getAttribute('data-delpl')).delete().then(listPolls);
      });
    });
    box.querySelectorAll('[data-togglepl]').forEach(function(b){
      b.addEventListener('click', function(){
        var ref=firebase.firestore().collection('rs_poll_defs').doc(b.getAttribute('data-togglepl'));
        ref.get().then(function(d){ return ref.update({active:!d.data().active}); }).then(listPolls);
      });
    });
    box.querySelectorAll('[data-editpl]').forEach(function(b){
      b.addEventListener('click', function(){ editPoll(b.getAttribute('data-editpl')); });
    });
  }).catch(function(e){ box.innerHTML='<p style="color:#f87171">Could not load: '+escapeHtml(e.message)+'</p>'; });
}
function editPoll(id){
  firebase.firestore().collection('rs_poll_defs').doc(id).get().then(function(d){
    if(!d.exists) return;
    var p=d.data(); editingPoll=id;
    document.getElementById('pl-title').value=p.title||'';
    document.getElementById('pl-sub').value=p.sub||'';
    document.getElementById('pl-show').value=p.show||'bb20';
    document.getElementById('pl-type').value=p.pollType||'standard';
    document.getElementById('pl-opts').innerHTML='';
    (p.options||[]).forEach(function(o){ addPollOpt(o.name); });
    document.getElementById('pl-active').checked=!!p.active;
    document.getElementById('pl-form-title').textContent='Edit Poll';
    document.getElementById('pl-save').textContent='Update Poll';
    document.getElementById('pl-cancel').style.display='inline-block';
    window.scrollTo(0,0);
  });
}

// ================= MEDIA (Cloudinary + rs_media index in Firestore) =================
function tabMedia(){
  var box=document.getElementById('tab-body');
  var warn = cloudinaryConfigured() ? ''
    : '<div class="note" style="border-color:#f59e0b;color:#fbbf24">Cloudinary is not configured yet — uploads are disabled. Set <b>cloudName</b> in build.py (CLOUDINARY_CONFIG) and rebuild.</div>';
  box.innerHTML='<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:6px">Upload Media</h3>'
    +'<p style="color:var(--muted);font-size:.9rem">Images and videos for articles. Hosted on Cloudinary; files are indexed in Firestore (<b>rs_media</b>).</p>'
    +warn
    +'<label>Choose file</label><input type="file" id="m-file" accept="image/*,video/*"/>'
    +'<div class="prog" id="m-prog" style="display:none"><i></i></div>'
    +'<p id="m-msg" style="margin-top:10px;color:var(--muted)"></p>'
    +'<hr style="border:none;border-top:1px solid var(--border);margin:26px 0"/>'
    +'<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:10px">Uploaded Files</h3><div id="m-grid" class="media-grid"><p style="color:var(--muted)">Loading…</p></div>';
  document.getElementById('m-file').addEventListener('change', function(e){
    var f=e.target.files[0]; if(!f) return;
    var prog=document.getElementById('m-prog'); prog.style.display='block';
    var bar=prog.querySelector('i');
    var msg=document.getElementById('m-msg');
    uploadToCloudinary(f, function(p){ bar.style.width=p+'%'; }).then(function(r){
      return firebase.firestore().collection('rs_media').add({
        url:r.url, public_id:r.public_id, resource_type:r.resource_type,
        name:f.name, createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
    }).then(function(){
      msg.textContent='Uploaded! Copy its URL below.';
      e.target.value=''; listMedia();
    }).catch(function(err){ msg.textContent='Upload failed: '+err.message; });
  });
  listMedia();
}
function listMedia(){
  var box=document.getElementById('m-grid'); if(!box) return;
  firebase.firestore().collection('rs_media').orderBy('createdAt','desc').limit(60).get().then(function(q){
    if(q.empty){ box.innerHTML='<p style="color:var(--muted)">No files yet.</p>'; return; }
    box.innerHTML='';
    q.forEach(function(d){
      var m=d.data()||{};
      var url=m.url||'', isVid=(m.resource_type==='video')||/\.(mp4|mov|webm)$/i.test(m.name||'');
      var card=document.createElement('div'); card.className='media-item';
      card.innerHTML='<div style="height:110px;display:flex;align-items:center;justify-content:center;background:#0e0e15;overflow:hidden">'
        +(isVid?'<span style="font-size:2rem">🎬</span>':'<img src="'+escapeHtml(url)+'" alt="" style="max-height:110px;max-width:100%"/>')
        +'</div>'
        +'<div class="mi-body"><div class="mi-name">'+escapeHtml(m.name||'(file)')+'</div>'
        +'<div class="btn-row" style="margin:0"><button class="btn-sm gold">Copy URL</button>'
        +'<button class="btn-sm danger">Delete</button></div></div>';
      box.appendChild(card);
      card.querySelector('.btn-sm.gold').addEventListener('click', function(){ copyText(url, this); });
      card.querySelector('.btn-sm.danger').addEventListener('click', function(){
        if(!confirm('Remove this file from the library? (The Cloudinary file itself must be deleted in the Cloudinary dashboard.)')) return;
        firebase.firestore().collection('rs_media').doc(d.id).delete().then(listMedia);
      });
    });
  }).catch(function(e){ box.innerHTML='<p style="color:#f87171">Could not list files: '+escapeHtml(e.message)+'</p>'; });
}

// ================= INFO =================
function tabInfo(){
  var box=document.getElementById('tab-body');
  box.innerHTML='<h3 style="font-family:var(--font-d);text-transform:uppercase;margin-bottom:10px">Project Info</h3>'
    +'<div class="facts">'
    +'<div class="fact-row"><b>Firebase project</b><span>aabyd-khan</span></div>'
    +'<div class="fact-row"><b>Region</b><span>asia-south1 (Mumbai)</span></div>'
    +'<div class="fact-row"><b>Articles</b><span>rs_posts</span></div>'
    +'<div class="fact-row"><b>Poll definitions</b><span>rs_poll_defs</span></div>'
    +'<div class="fact-row"><b>Vote records</b><span>rs_poll_votes · rs_poll_evict_votes · rs_votes_*</span></div>'
    +'<div class="fact-row"><b>Vote totals</b><span>rs_poll_totals · rs_poll_evict_totals · rs_totals_*</span></div>'
    +'<div class="fact-row"><b>Media</b><span>Cloudinary'+(cloudinaryConfigured()?' (configured)':' (not configured)')+'</span></div>'
    +'<div class="fact-row"><b>Media index</b><span>rs_media</span></div>'
    +'</div>'
    +'<div class="note">Admin writes are protected by the site passcode (client-side gate). Publish the Firestore rules from <b>firestore.rules</b> in the Firebase console for the intended access model, and never share the passcode.</div>'
    +'<div class="btn-row"><a class="btn btn-ghost" href="https://console.firebase.google.com/project/aabyd-khan/firestore" target="_blank" rel="noopener">Open Firebase Console</a></div>';
}
})();

