
// Reality Shows — shared site JS. Firebase loads deferred; everything degrades gracefully.
(function(){
"use strict";
var FB = {"apiKey": "AIzaSyBp9rISkN2oqr8qEa2j9lX7eW4j8vQmZxY0", "authDomain": "tir-portal.firebaseapp.com", "projectId": "tir-portal", "storageBucket": "tir-portal.firebasestorage.app", "messagingSenderId": "941411383328", "appId": "1:941411383328:web:4b7b0aa63e2c7e44d82a445"};
var ADMIN_CODE = "tir2026";

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
  var el=document.getElementById('ev-countdown'); if(!el) return;
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
}
function buildPoll(root){
  var raw=root.getAttribute('data-poll');
  var key=pollKey(raw), cfg=POLLS[key];
  if(!cfg){ root.innerHTML='<p style="color:var(--muted)">Poll unavailable.</p>'; return; }
  var doc=pollDoc(cfg);
  var opts=cfg.options.slice();
  if(raw==='mini') opts=opts.slice(0,6);
  var voted=votedForDoc(doc);
  var html='<h3>'+escapeHtml(cfg.title)+'</h3><p class="poll-sub">'+cfg.sub+'</p><div class="poll-opts">';
  opts.forEach(function(o){
    html+='<div class="opt'+(voted===o.slug?' voted':'')+'" data-slug="'+o.slug+'">'
      +'<div class="opt-top"><span class="opt-name">'+escapeHtml(o.name)+'</span><span class="opt-pct" data-pct>--%</span></div>'
      +'<div class="bar"><i data-bar></i></div>'
      +(!voted?'<button class="vote-btn" data-vote="'+o.slug+'">Vote</button>':'')
      +'</div>';
  });
  html+='</div><div class="poll-total" data-total>Loading votes&hellip;</div>'
    +'<div class="disclaimer"><strong>Unofficial fan poll.</strong> '+escapeHtml(cfg.disclaimer)+'</div>';
  root.innerHTML=html;
  if(!voted){
    root.querySelectorAll('[data-vote]').forEach(function(btn){
      btn.addEventListener('click', function(){ castVote(key, doc, btn.getAttribute('data-vote'), root); });
    });
  }
  refreshPoll(root, key, doc, cfg);
  setInterval(function(){ refreshPoll(root, key, doc, cfg); }, 20000);
}
function castVote(key, doc, slug, root){
  var cfg=POLLS[key];
  if(votedForDoc(doc)) return;
  setVotedDoc(doc, slug);
  try{
    var db=firebase.firestore();
    var upd={}; upd[slug]=firebase.firestore.FieldValue.increment(1);
    db.collection(cfg.totalsColl).doc(doc).set(upd, {merge:true});
    var rec={pollId:doc, contestantId:slug, createdAt:firebase.firestore.FieldValue.serverTimestamp()};
    db.collection(cfg.votesColl).add(rec);
  }catch(e){}
  buildPoll(root);
}
function refreshPoll(root, key, doc, cfg){
  var counts={}, total=0;
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
    if(t) t.textContent= total? (total.toLocaleString('en-IN')+' fan votes so far') : 'Be the first to vote!';
  }
  try{
    firebase.firestore().collection(cfg.totalsColl).doc(doc).get().then(function(d){
      if(d.exists){ counts=d.data()||{}; Object.keys(counts).forEach(function(k){ total+=counts[k]||0; }); }
      render();
    }).catch(render);
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
        h+='<div class="card"><div class="card-art">'+escapeHtml((p.title||'?').slice(0,2).toUpperCase())+'</div>'
          +'<div class="card-body"><span class="cat">'+escapeHtml(p.category||'News')+'</span>'
          +'<h3>'+escapeHtml(p.title||'')+'</h3><p>'+escapeHtml(p.excerpt||'')+'</p>'
          +'<div class="meta">Reality Shows desk</div></div></div>';
      });
      box.innerHTML=h+'</div>';
    }).catch(function(){});
  }catch(e){}
}

// ---------- admin CMS ----------
function initAdmin(){
  var root=document.getElementById('admin-root');
  if(sessionStorage.getItem('rs_admin')==='1'){ showPanel(root); return; }
  root.innerHTML='<div class="form-card"><h2 style="font-family:var(--font-d);text-transform:uppercase">Admin Login</h2>'
    +'<p style="color:var(--muted);font-size:.9rem;margin-top:8px">Enter the site passcode to publish news.</p>'
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
function showPanel(root){
  root.innerHTML='<div class="form-card"><h2 style="font-family:var(--font-d);text-transform:uppercase">Publish News</h2>'
    +'<label>Title</label><input type="text" id="p-title"/>'
    +'<label>Category</label><select id="p-cat"><option>News</option><option>Eviction</option><option>Fights</option><option>Tasks</option><option>Rumours</option><option>Weekend Ka Vaar</option><option>TRP &amp; Records</option><option>Gossip</option><option>Controversy</option><option>KKK15</option><option>Rise &amp; Fall</option><option>Lock Upp</option><option>Roadies</option><option>Latent</option><option>Indian Idol</option><option>Splitsvilla</option><option>Shark Tank</option></select>'
    +'<label>Excerpt</label><input type="text" id="p-excerpt"/>'
    +'<label>Body (plain text, blank line = new paragraph)</label><textarea id="p-body"></textarea>'
    +'<div style="margin-top:18px"><button class="btn btn-gold" id="p-pub">Publish</button></div>'
    +'<p id="p-msg" style="margin-top:10px;color:var(--muted)"></p></div>'
    +'<div class="form-card" style="margin-top:24px"><h2 style="font-family:var(--font-d);text-transform:uppercase">Published Posts</h2><div id="p-list"><p style="color:var(--muted)">Loading&hellip;</p></div></div>';
  document.getElementById('p-pub').addEventListener('click', function(){
    var t=document.getElementById('p-title').value.trim();
    if(!t){ document.getElementById('p-msg').textContent='Title is required.'; return; }
    var body=document.getElementById('p-body').value.trim().split(/\n\s*\n/).map(function(p){return '<p>'+escapeHtml(p).replace(/\n/g,'<br>')+'</p>';}).join('\n');
    var doc={ title:t, slug:slugify(t), category:document.getElementById('p-cat').value,
      excerpt:document.getElementById('p-excerpt').value.trim(), body:body,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(), published:true };
    document.getElementById('p-msg').textContent='Publishing…';
    firebase.firestore().collection('rs_posts').add(doc).then(function(){
      document.getElementById('p-msg').textContent='Published! It will appear under Fresh Updates on /news/.';
      document.getElementById('p-title').value='';document.getElementById('p-excerpt').value='';document.getElementById('p-body').value='';
      listPosts();
    }).catch(function(e){ document.getElementById('p-msg').textContent='Error: '+e.message; });
  });
  listPosts();
}
function listPosts(){
  var box=document.getElementById('p-list'); if(!box) return;
  firebase.firestore().collection('rs_posts').orderBy('createdAt','desc').limit(30).get().then(function(q){
    if(q.empty){ box.innerHTML='<p style="color:var(--muted)">No posts yet.</p>'; return; }
    var h='';
    q.forEach(function(d){
      var p=d.data();
      h+='<div class="post-row"><div><b>'+escapeHtml(p.title||'(untitled)')+'</b><br><span style="color:var(--muted);font-size:.8rem">'+escapeHtml(p.category||'')+'</span></div>'
        +'<button data-del="'+d.id+'">Delete</button></div>';
    });
    box.innerHTML=h;
    box.querySelectorAll('[data-del]').forEach(function(b){
      b.addEventListener('click', function(){
        if(!confirm('Delete this post?')) return;
        firebase.firestore().collection('rs_posts').doc(b.getAttribute('data-del')).delete().then(listPosts);
      });
    });
  }).catch(function(e){ box.innerHTML='<p style="color:#f87171">Could not load posts: '+escapeHtml(e.message)+'</p>'; });
}
})();

