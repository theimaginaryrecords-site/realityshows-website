
// Reality Shows — shared site JS. Firebase loads deferred; everything degrades gracefully.
(function(){
"use strict";
var FB = {"apiKey": "AIzaSyBp9rISkN2oqr8qEa2j9lX7eW4j8vQmZxY0", "authDomain": "tir-portal.firebaseapp.com", "projectId": "tir-portal", "storageBucket": "tir-portal.firebasestorage.app", "messagingSenderId": "941411383328", "appId": "1:941411383328:web:4b7b0aa63e2c7e44d82a445"};
var POLL_ID = "bb20-week4";
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

// ---------- fan poll ----------
var CONTESTANTS = [{"slug": "mary-kom", "name": "Mary Kom", "evicted": false}, {"slug": "aasif-khan", "name": "Aasif Khan", "evicted": false}, {"slug": "kanika-mann", "name": "Kanika Mann", "evicted": false}, {"slug": "scoutop", "name": "ScoutOP", "evicted": false}, {"slug": "amrapali-dubey", "name": "Amrapali Dubey", "evicted": false}, {"slug": "mahhi-vij", "name": "Mahhi Vij", "evicted": false}, {"slug": "yung-dsa", "name": "Yung DSA", "evicted": false}, {"slug": "qazi-touqeer", "name": "Qazi Touqeer", "evicted": false}, {"slug": "arishfa-khan", "name": "Arishfa Khan", "evicted": false}, {"slug": "rohed-khan", "name": "Rohed Khan", "evicted": true}, {"slug": "isha-rikhi", "name": "Isha Rikhi", "evicted": true}, {"slug": "gullu", "name": "Gullu", "evicted": false}, {"slug": "rhiti-tiwari", "name": "Rhiti Tiwari", "evicted": true}, {"slug": "uditi-singh", "name": "Uditi Singh", "evicted": false}, {"slug": "aman-gandhi", "name": "Aman Gandhi", "evicted": false}, {"slug": "love-gill", "name": "Love Gill", "evicted": false}];

function votedFor(){ try{ return localStorage.getItem('rs_voted_'+POLL_ID); }catch(e){ return null; } }
function setVoted(slug){ try{ localStorage.setItem('rs_voted_'+POLL_ID, slug); }catch(e){} }

function initPolls(){
  document.querySelectorAll('[data-poll]').forEach(buildPoll);
}
function buildPoll(root){
  var full = root.getAttribute('data-poll')==='full';
  var active = CONTESTANTS.filter(function(c){return !c.evicted;});
  var list = full ? active : active.slice(0,6);
  var voted = votedFor();
  var html='<h3>Who is your favourite?</h3><p class="poll-sub">Bigg Boss 20 &mdash; Week 4 unofficial fan poll. Tap to vote.</p><div class="poll-opts">';
  list.forEach(function(c){
    html+='<div class="opt'+(voted===c.slug?' voted':'')+'" data-slug="'+c.slug+'">'
      +'<div class="opt-top"><span class="opt-name">'+escapeHtml(c.name)+'</span><span class="opt-pct" data-pct>--%</span></div>'
      +'<div class="bar"><i data-bar></i></div>'
      +(!voted?'<button class="vote-btn" data-vote="'+c.slug+'">Vote</button>':'')
      +'</div>';
  });
  html+='</div><div class="poll-total" data-total>Loading votes&hellip;</div>'
    +(!full?'<div class="disclaimer"><strong>Unofficial fan poll.</strong> Not affiliated with or endorsed by JioStar, Colors, Endemol Shine India, or Bigg Boss. This poll has no bearing on official results.</div>':'');
  root.innerHTML=html;
  if(!voted){
    root.querySelectorAll('[data-vote]').forEach(function(btn){
      btn.addEventListener('click', function(){ castVote(btn.getAttribute('data-vote'), root); });
    });
  }
  refreshPoll(root);
  setInterval(function(){ refreshPoll(root); }, 20000);
}
function castVote(slug, root){
  if(votedFor()) return;
  setVoted(slug);
  try{
    var db=firebase.firestore();
    var totals=db.collection('rs_poll_totals').doc(POLL_ID);
    totals.set({[slug]:firebase.firestore.FieldValue.increment(1)}, {merge:true});
    db.collection('rs_poll_votes').add({pollId:POLL_ID, contestantId:slug, createdAt:firebase.firestore.FieldValue.serverTimestamp()});
  }catch(e){}
  // rebuild as voted state
  buildPoll(root);
}
function refreshPoll(root){
  var counts={}, total=0;
  function render(){
    var opts=root.querySelectorAll('.opt');
    opts.forEach(function(o){
      var slug=o.getAttribute('data-slug'), v=counts[slug]||0;
      var pct=total?Math.round(v/total*100):0;
      var pe=o.querySelector('[data-pct]'); if(pe) pe.textContent=pct+'%';
      var bar=o.querySelector('[data-bar]'); if(bar) bar.style.width=pct+'%';
    });
    var t=root.querySelector('[data-total]');
    if(t) t.textContent= total? (total.toLocaleString('en-IN')+' fan votes so far') : 'Be the first to vote!';
  }
  try{
    firebase.firestore().collection('rs_poll_totals').doc(POLL_ID).get().then(function(doc){
      if(doc.exists){ counts=doc.data()||{}; Object.keys(counts).forEach(function(k){ total+=counts[k]||0; }); }
      render();
    }).catch(render);
  }catch(e){ render(); }
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }

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
    +'<label>Category</label><select id="p-cat"><option>News</option><option>Eviction</option><option>Fights</option><option>Tasks</option><option>Rumours</option><option>Weekend Ka Vaar</option><option>TRP &amp; Records</option><option>Gossip</option><option>Controversy</option></select>'
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

