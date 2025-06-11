
function isInNoGoZone(x, y) {
  const msgBox = {
    xMin: window.innerWidth * 0.25,
    xMax: window.innerWidth * 0.75,
    yMin: window.innerHeight * 0.35,
    yMax: window.innerHeight * 0.6
  };
  const footerBox = {
    xMin: 0,
    xMax: window.innerWidth,
    yMin: window.innerHeight - 100,
    yMax: window.innerHeight
  };
  return (
    (x > msgBox.xMin && x < msgBox.xMax && y > msgBox.yMin && y < msgBox.yMax) ||
    (x > footerBox.xMin && x < footerBox.xMax && y > footerBox.yMin && y < footerBox.yMax)
  );
}



function shuffleArray(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

const canvas=document.getElementById('stars'),ctx=canvas.getContext('2d');
let egoboostMessages=[],humbleMessages=[],defaultMessages=[
  "Under this sky, I remembered you. Quiet. Distant. Still meaningful.",
  "Another constellation formed, but you remained the brightest star.",
  "Moonlight guides the night, yet I can’t shake thoughts of you.",
  "In the hush of space, I found echoes of our time together.",
  "Even distant stars seem closer when I think of you."
];
let activeMessages=defaultMessages.slice(),caughtStars=0,hasChosen=false,readyToClick=false,firstClick=true;
const optionsDiv=document.getElementById('options'),
      btnEgo=document.getElementById('btn-ego'),
      btnHumble=document.getElementById('btn-humble'),
      btnSurprise=document.getElementById('btn-surprise'),
      paragraph=document.getElementById('subtext');

function hideOptions(){optionsDiv.classList.add('fade-out');setTimeout(()=>{optionsDiv.style.display='none';},500);}

btnEgo.addEventListener('click',()=>{
// --- Discord Webhook: Ego Boost Clicked ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `💖 Ego Boost button clicked at ${new Date().toLocaleString()}`
  })
});

  if(egoboostMessages.length>0) activeMessages=shuffleArray(egoboostMessages.slice());
  else activeMessages=shuffleArray(defaultMessages.slice());
  hasChosen=true;hideOptions();
});
btnHumble.addEventListener('click',()=>{
// --- Discord Webhook: Humble Clicked ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `🪞 Humble button clicked at ${new Date().toLocaleString()}`
  })
});

  if(humbleMessages.length>0) activeMessages=shuffleArray(humbleMessages.slice());
  else activeMessages=shuffleArray(defaultMessages.slice());
  hasChosen=true;hideOptions();
});
btnSurprise.addEventListener('click',()=>{
// --- Discord Webhook: Surprise Clicked ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `🎲 Surprise button clicked at ${new Date().toLocaleString()}`
  })
});

  const combined=egoboostMessages.concat(humbleMessages);
  if(combined.length>0) activeMessages=shuffleArray(combined.slice());
  else activeMessages=shuffleArray(defaultMessages.slice());
  hasChosen=true;hideOptions();
});

async function loadTexts(){
  try {
    const r = await fetch('egoboost.txt');
    if (r.ok) {
      const raw = await r.text();
      egoboostMessages = raw.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    }
  } catch (e) {}
  try {
    const r2 = await fetch('humble.txt');
    if (r2.ok) {
      const raw2 = await r2.text();
      humbleMessages = raw2.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    }
  } catch (e) {}
  readyToClick = true;
}
loadTexts();

let stars=[],particles=[],glowTrails=[],sparkles=[],lastTime=performance.now();

let specialStar = {
  x: 100,
  ctrlX: 100,
  ctrlY: canvas.height / 2,
  y: canvas.height - 100,
  radius: 14,
  clickCount: 0,
  active: true,
  startX: 100,
  startY: canvas.height - 100,
  targetX: 100,
  targetY: canvas.height - 100,
  progress: 1

};


function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();

  // Randomize special star initial position
  specialStar.x = Math.random() * canvas.width;
  specialStar.y = Math.random() * canvas.height;
  specialStar.ctrlY = canvas.height / 2;
  specialStar.startX = specialStar.x;
  specialStar.startY = specialStar.y;
  specialStar.targetX = specialStar.x;
  specialStar.targetY = specialStar.y;
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();

function initStars(){
  stars=[];
  for(let i=0;i<150;i++)stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,radius:Math.random()*2+2,opacity:Math.random()*0.5+0.5,speed:Math.random()*0.005+0.002,direction:Math.random()>0.5?1:-1});
}

function animate(now){const delta=now-lastTime;lastTime=now;drawSky(delta);requestAnimationFrame(animate);}
requestAnimationFrame(animate);

function drawSky(delta){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const s of stars){
    s.opacity+=s.speed*s.direction;
    if(s.opacity>=1||s.opacity<=0.5) s.direction*=-1;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.radius,0,2*Math.PI);
    ctx.fillStyle=`rgba(255,255,255,${s.opacity})`;
    ctx.shadowColor=`rgba(136,204,255,${s.opacity})`;
    ctx.shadowBlur=2;
    ctx.fill();
  }
  updateParticles(delta);
  updateGlowTrails(delta);
  updateSparkles(delta);

  // Draw special star
  if (specialStar.progress < 1) {
    specialStar.progress += delta * 0.001; // slowed down slightly
    if (specialStar.progress > 1) specialStar.progress = 1;
    let t = specialStar.progress;
    t = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const x = (1 - t) * (1 - t) * specialStar.startX + 2 * (1 - t) * t * specialStar.ctrlX + t * t * specialStar.targetX;
    const y = (1 - t) * (1 - t) * specialStar.startY + 2 * (1 - t) * t * specialStar.ctrlY + t * t * specialStar.targetY;
    specialStar.x = x;
    specialStar.y = y;
    specialStar.x = x;
    specialStar.y = y;
    particles.push({ x: specialStar.x, y: specialStar.y, vx: 0, vy: 0, opacity: 1 });
  }
// Draw special star
  if (specialStar.active) {
    ctx.beginPath();
    ctx.arc(specialStar.x, specialStar.y, specialStar.radius, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(specialStar.x, specialStar.y, 0, specialStar.x, specialStar.y, specialStar.radius * 2);
    grad.addColorStop(0, '#ffccff'); // bright purple core
    grad.addColorStop(1, '#660099'); // dark purple outer
    ctx.fillStyle = grad;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 35;
    ctx.fill();
  }

}

function updateParticles(delta){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.opacity-=delta*(0.02/16.67);
    if(p.opacity<=0){particles.splice(i,1);continue;}
    ctx.beginPath();
    ctx.arc(p.x,p.y,2,0,2*Math.PI);
    ctx.fillStyle=p.hue!==undefined?`hsla(${p.hue},70%,50%,${p.opacity})`:`rgba(255,255,255,${p.opacity})`;
    ctx.fill();
  }
}

function updateGlowTrails(delta){
  for(let i=glowTrails.length-1;i>=0;i--){
    const t=glowTrails[i];
    if(!t.completed){
      t.progress+=delta*(0.72/1000);
      if(t.progress>=1){t.progress=1;t.completed=true;t.fadeStep=0;sparkles.push({x:t.endX,y:t.endY,opacity:1,lifetime:1});}
    } else {
      t.fadeStep+=delta*(1.8/1000);
      if(t.fadeStep>=1){glowTrails.splice(i,1);continue;}
    }
    const steps=20;
    for(let j=0;j<steps;j++){
      const prog=(j/steps)*(t.completed?1:t.progress);
      const {x,y}=getCurvePoint(t,prog);
      let op=j/steps;
      if(t.completed){
        const fadeProg=Math.max(0,(j/steps)-t.fadeStep);
        op=Math.max(0,fadeProg)*0.6;
      } else op*=0.6;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x,y,2,0,2*Math.PI);
      ctx.fillStyle=`hsla(${t.hue},70%,80%,${op})`;
      ctx.shadowColor='white';
      ctx.shadowBlur=8;
      ctx.fill();
      ctx.restore();
    }
    if(!t.completed){
      const {x,y}=getCurvePoint(t,t.progress);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x,y,3,0,2*Math.PI);
      ctx.fillStyle='hsla(270,80%,45%,1)';
      ctx.shadowColor='white';
      ctx.shadowBlur=12;
      ctx.fill();
      ctx.restore();
    }
  }
}

function getCurvePoint(t,p){
  const x=(1-p)*(1-p)*t.startX+2*(1-p)*p*t.cpX+p*p*t.endX;
  const y=(1-p)*(1-p)*t.startY+2*(1-p)*p*t.cpY+p*p*t.endY;
  return {x,y};
}

function updateSparkles(delta){
  for(let i=sparkles.length-1;i>=0;i--){
    const s=sparkles[i];
    s.opacity-=delta*(0.02/16.67);
    s.lifetime-=delta*(0.02/16.67);
    if(s.lifetime<=0){sparkles.splice(i,1);continue;}
    ctx.save();
    ctx.beginPath();
    ctx.arc(s.x,s.y,2+Math.sin(Date.now()/100)*1,0,2*Math.PI);
    ctx.fillStyle=`rgba(255,255,255,${s.opacity})`;
    ctx.shadowColor='white';
    ctx.shadowBlur=10;
    ctx.fill();
    ctx.restore();
  }
}

function createParticleBurst(x,y){
  const hues=[260,270,275,280,290];
  const hue=hues[Math.floor(Math.random()*hues.length)];
  for(let i=0;i<10;i++){
    particles.push({x,y,vx:Math.random()*2-1,vy:Math.random()*2-1,opacity:1,hue});
  }
}

function createGlowTrail(x,y,endX,endY){
  const offsetX=Math.random()*800-400, offsetY=Math.random()*800-400;
  const midX=(x+endX)/2+offsetX, midY=(y+endY)/2+offsetY;
  const hues=[260,270,275,280,290];
  const hue=hues[Math.floor(Math.random()*hues.length)];
  glowTrails.push({startX:x,startY:y,endX:endX,endY:endY,cpX:midX,cpY:midY,progress:0,completed:false,fadeStep:0,hue});
}


function triggerMassStarClick() {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.4;
  const h1 = document.querySelector('.message h1');
  const p = document.querySelector('.message p');
  let delay = 0;
  const starsCopy = [...stars];

  starsCopy.forEach((s, i) => {
    setTimeout(() => {
      createParticleBurst(s.x, s.y);
      createGlowTrail(s.x, s.y, cx, cy);

      const msgIndex = caughtStars;
      let msg = activeMessages[msgIndex] || "That's all I have for you. You're welcome. Refresh to see them again.";

      h1.style.opacity = '0';
      p.style.opacity = '0';

      setTimeout(() => {
        h1.textContent = msg;
        h1.style.opacity = '1';
        h1.classList.add('explode');
        setTimeout(() => h1.classList.remove('explode'), 1000);
      }, 300);

      caughtStars++;
      const index = stars.indexOf(s);
      if (index !== -1) stars.splice(index, 1);
    }, delay);
    delay += 50;
  });
}

canvas.addEventListener('click',e=>{
  if(!readyToClick||!hasChosen)return;
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left,my=e.clientY-rect.top;
  
  // Check special star click
  const dxSpec = specialStar.x - mx;
  const dySpec = specialStar.y - my;
  const distSpec = Math.hypot(dxSpec, dySpec);
  if (specialStar.active && distSpec < 25) {
    specialStar.clickCount++;

// --- Discord Webhook: Special Star Clicked ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `🌟 Special star clicked at ${new Date().toLocaleString()} (Click count: ${specialStar.clickCount + 1})`
  })
});

    if (specialStar.clickCount < 10) {
      specialStar.startX = specialStar.x;
      specialStar.startY = specialStar.y;
      do {
  specialStar.targetX = Math.random() * canvas.width;
  specialStar.targetY = Math.random() * canvas.height;
} while (isInNoGoZone(specialStar.targetX, specialStar.targetY));
      specialStar.ctrlX = (specialStar.startX + specialStar.targetX) / 2 + (Math.random() * 150 - 75);
      specialStar.ctrlY = (specialStar.startY + specialStar.targetY) / 2 - (150 + Math.random() * 100);
      specialStar.progress = 0;
    }
else {
  
// --- Discord Webhook: Special Event Triggered ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `🚨 Special event triggered at ${new Date().toLocaleString()}`
  })
});

specialStar.active = false;
      document.querySelectorAll('.message, footer, h1, p, button').forEach(el => {
        el.classList.add('fade-out');
      });
      triggerMassStarClick();

setTimeout(() => {
  const revealImg = document.createElement('img');
  revealImg.src = 'special_reveal.png';
  revealImg.style.position = 'fixed';
  revealImg.style.top = '40%';
  revealImg.style.left = '50%';
  revealImg.style.transform = 'translate(-50%, -50%)';
  revealImg.style.maxWidth = '60vw';
  revealImg.style.maxHeight = '60vh';
  revealImg.style.opacity = '0';
  revealImg.style.transition = 'opacity 1.5s ease';
  revealImg.style.zIndex = '5';
  revealImg.style.filter = 'drop-shadow(0 0 60px rgba(255, 255, 255, 0.8))';
  revealImg.style.animation = 'glowPulse 1s ease-out forwards';
  document.body.appendChild(revealImg);

  setTimeout(() => {
    revealImg.style.opacity = '1';
  }, 100);
}, 8000);
      const starCount = stars.length;
      const totalDelay = starCount * 20 + 800;
      setTimeout(() => {
        specialStar.active = false;setTimeout(() => {
  document.querySelectorAll('.message, .footer, .controls, h1, p, button').forEach(el => {
          el.classList.add('fade-out');
        });
}, totalDelay);
        
      }, totalDelay);
      setTimeout(() => {
        specialStar.active = false;
        
        setTimeout(() => {
          document.querySelectorAll('.message, .footer, .controls, h1, p, button').forEach(el => {
            el.classList.add('fade-out');
          });
          
        }, 100);
      }, stars.length * 120 + 600);
      setTimeout(() => { 
  document.querySelectorAll('.message, .footer, .controls, h1, p, button').forEach(el => {
    el.classList.add('fade-out');
  });

   }, 100);
    }
    return;
  }

  for(let i=0;i<stars.length;i++){
    const s=stars[i],dx=s.x-mx,dy=s.y-my,dist=Math.hypot(dx,dy);
    const hitRadius=navigator.maxTouchPoints>0?30:s.radius*2;
    if(dist<hitRadius){
      const cx=canvas.width/2, cy=canvas.height*0.4;
      createParticleBurst(s.x,s.y);

// --- Discord Webhook Notification ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `⭐ Star clicked at ${new Date().toLocaleString()}`
  })
});

      createGlowTrail(s.x,s.y,cx,cy);
      stars.splice(i,1);
      caughtStars++;
      const h1=document.querySelector('.message h1'),
            p=document.querySelector('.message p');
      // Original selection:
      // let msgIndex=Math.min(caughtStars-1,activeMessages.length-1);
      // let msg=activeMessages[msgIndex];
      // New selection with fallback:
      let msgIndex = caughtStars - 1;
      let msg;
      if (msgIndex < activeMessages.length) {
          msg = activeMessages[msgIndex];
      } else {
          msg = "That's all I have for you. You're welcome. Refresh if you want to see them again.";
      }
      if(firstClick){
        if(paragraph)paragraph.style.transition='opacity 0.5s ease',paragraph.style.opacity=0;
        firstClick=false;
      }
      h1.style.transition='opacity 0.5s ease';
      p.style.transition='opacity 0.5s ease';
      h1.style.opacity='0';
      p.style.opacity='0';
      setTimeout(()=>{
        h1.textContent=msg;
        h1.style.opacity='1';
        h1.classList.add('explode');
        setTimeout(()=>h1.classList.remove('explode'),1000);
      },1400);
      break;
    }
  }
});

canvas.addEventListener('touchstart',e=>{
  if(!readyToClick||!hasChosen)return;
  const t=e.touches[0];
  const rect=canvas.getBoundingClientRect();
  const mx=t.clientX-rect.left,my=t.clientY-rect.top;
  
  // Check special star click
  const dxSpec = specialStar.x - mx;
  const dySpec = specialStar.y - my;
  const distSpec = Math.hypot(dxSpec, dySpec);
  if (specialStar.active && distSpec < 25) {
    specialStar.clickCount++;

// --- Discord Webhook: Special Star Clicked ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `🌟 Special star clicked at ${new Date().toLocaleString()} (Click count: ${specialStar.clickCount + 1})`
  })
});

    if (specialStar.clickCount < 10) {
      specialStar.startX = specialStar.x;
      specialStar.startY = specialStar.y;
      do {
  specialStar.targetX = Math.random() * canvas.width;
  specialStar.targetY = Math.random() * canvas.height;
} while (isInNoGoZone(specialStar.targetX, specialStar.targetY));
      specialStar.ctrlX = (specialStar.startX + specialStar.targetX) / 2 + (Math.random() * 150 - 75);
      specialStar.ctrlY = (specialStar.startY + specialStar.targetY) / 2 - (150 + Math.random() * 100);
      specialStar.progress = 0;
    }
else {
  specialStar.active = false;
      specialStar.active = false;
      
      setTimeout(() => { 
  document.querySelectorAll('.message, .footer, .controls, h1, p, button').forEach(el => {
    el.classList.add('fade-out');
  });

   }, 100);
    }
    return;
  }

  for(let i=0;i<stars.length;i++){
    const s=stars[i],dx=s.x-mx,dy=s.y-my,dist=Math.hypot(dx,dy);
    const hitRadius=navigator.maxTouchPoints>0?30:s.radius*2;
    if(dist<hitRadius){
      const cx=canvas.width/2, cy=canvas.height*0.4;
      createParticleBurst(s.x,s.y);

// --- Discord Webhook Notification ---
fetch("https://discord.com/api/webhooks/1382442939883716680/3o2clMagUkYNQmcq0LfFqfGhsiNBWKXpu20oqECGhhfmrJyE_nQ8DYWq2dUcLGtLnQXB", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `⭐ Star clicked at ${new Date().toLocaleString()}`
  })
});

      createGlowTrail(s.x,s.y,cx,cy);
      stars.splice(i,1);
      caughtStars++;
      const h1=document.querySelector('.message h1'),
            p=document.querySelector('.message p');
      // Original selection:
      // let msgIndex=Math.min(caughtStars-1,activeMessages.length-1);
      // let msg=activeMessages[msgIndex];
      // New selection with fallback:
      let msgIndex = caughtStars - 1;
      let msg;
      if (msgIndex < activeMessages.length) {
          msg = activeMessages[msgIndex];
      } else {
          msg = "No more messages left.";
      }
      if(firstClick){
        if(paragraph)paragraph.style.transition='opacity 0.5s ease',paragraph.style.opacity=0;
        firstClick=false;
      }
      h1.style.transition='opacity 0.5s ease';
      p.style.transition='opacity 0.5s ease';
      h1.style.opacity='0';
      p.style.opacity='0';
      setTimeout(()=>{
        h1.textContent=msg;
        h1.style.opacity='1';
        h1.classList.add('explode');
        setTimeout(()=>h1.classList.remove('explode'),1000);
      },1400);
      break;
    }
  }
});
