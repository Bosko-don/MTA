// Data Store
let posts = [
  {
    id: 1,
    author: "NEURAL_NODE_01",
    avatar: "◉",
    time: "2m ago",
    text: "Gengetone frequency detected in international airwaves. 254 signal strength maximum.",
    media: null,
    mediaType: null,
    reactions: {fire: 342, laugh: 89, dead: 45},
    userReaction: null,
    comments: [
      {author: "BazeKing", text: "Signal amplified 🔥🔥"},
      {author: "MtaaGirl", text: "Transmitting globally"}
    ]
  },
  {
    id: 2,
    author: "MEME_ARCHITECT",
    avatar: "◈",
    time: "15m ago",
    text: "KPLC: 'Scheduled maintenance protocol initiated'\n\nReality: 72-hour darkness event\n\nUser response: 💀",
    media: null,
    mediaType: null,
    reactions: {fire: 567, laugh: 892, dead: 234},
    userReaction: null,
    comments: [
      {author: "BlackoutSurvivor", text: "System failure acknowledged"}
    ]
  },
  {
    id: 3,
    author: "HOOD_ALGORITHM",
    avatar: "⚗",
    time: "1h ago",
    text: "Sunday optimization protocol:\n01. Sleep recursion until 1200hrs\n02. Ignore all incoming transmissions\n03. Pilau acquisition sequence\n04. Monday dread initialization",
    media: null,
    mediaType: null,
    reactions: {fire: 123, laugh: 445, dead: 67},
    userReaction: null,
    comments: []
  }
];

let currentUser = "YOU";
let currentMedia = null;
let currentMediaType = null;
let isLoading = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  render();
  initCursorGlow();
  startLiveCounter();
});

// Cursor Glow Effect
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

// Section Navigation
function show(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('active');
    if(b.dataset.section === section) b.classList.add('active');
  });
  
  if(section === 'home') render();
}

// Media Handlers
function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if(!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    currentMedia = e.target.result;
    currentMediaType = 'image';
    showMediaPreview('imagePreview', currentMedia);
    toast("Image uploaded to neural buffer");
  };
  reader.readAsDataURL(file);
}

function handleVideoSelect(event) {
  const file = event.target.files[0];
  if(!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    currentMedia = e.target.result;
    currentMediaType = 'video';
    showMediaPreview('videoPreview', currentMedia);
    toast("Video uploaded to neural buffer");
  };
  reader.readAsDataURL(file);
}

function showMediaPreview(id, src) {
  document.querySelectorAll('.media-preview').forEach(el => {
    el.classList.remove('active');
    el.src = '';
  });
  const preview = document.getElementById(id);
  preview.src = src;
  preview.parentElement.classList.add('active');
}

function clearMedia() {
  currentMedia = null;
  currentMediaType = null;
  document.querySelectorAll('.media-preview').forEach(el => {
    el.src = '';
    el.parentElement.classList.remove('active');
  });
  document.querySelectorAll('input[type="file"]').forEach(el => el.value = '');
}

// Render Posts
function render() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  
  posts.forEach((post, index) => {
    const card = createCard(post, index);
    feed.appendChild(card);
  });
}

function createCard(post, index) {
  const div = document.createElement('div');
  div.className = 'card';
  div.style.animationDelay = (index * 0.1) + 's';
  
  const mediaHTML = post.media ? 
    post.mediaType === 'image' ? 
      `<img src="${post.media}" class="post-media" alt="Media">` :
      `<video src="${post.media}" class="post-media" controls></video>` :
    '';
  
  div.innerHTML = `
    <div class="card-header">
      <div class="card-author">
        <div class="avatar"><span>${post.avatar}</span></div>
        <div class="author-info">
          <h4>${post.author}</h4>
          <div class="timestamp">${post.time}</div>
        </div>
      </div>
    </div>
    <div class="card-content">${formatText(post.text)}</div>
    ${mediaHTML}
    <div class="reaction-cluster">
      <button class="reaction-btn ${post.userReaction === 'fire' ? 'active' : ''}" 
              data-type="fire" onclick="react(${index}, 'fire')">
        ◉ ${formatNumber(post.reactions.fire)}
      </button>
      <button class="reaction-btn ${post.userReaction === 'laugh' ? 'active' : ''}" 
              data-type="laugh" onclick="react(${index}, 'laugh')">
        ◈ ${formatNumber(post.reactions.laugh)}
      </button>
      <button class="reaction-btn ${post.userReaction === 'dead' ? 'active' : ''}" 
              data-type="dead" onclick="react(${index}, 'dead')">
        ◊ ${formatNumber(post.reactions.dead)}
      </button>
    </div>
    <div class="action-bar">
      <button class="action-btn" onclick="share('${escapeText(post.text)}')">
        ⊕ SHARE
      </button>
      <button class="action-btn" onclick="copyPost('${escapeText(post.text)}')">
        ⊙ COPY
      </button>
    </div>
    <div class="comment-section">
      <div class="comment-input-wrap">
        <input type="text" class="neural-input" id="comment-${index}" 
               placeholder="Initialize response..." onkeypress="if(event.key==='Enter')comment(${index})">
        <button class="action-btn" onclick="comment(${index})">TRANSMIT</button>
      </div>
      ${post.comments.map(c => `
        <div class="comment">
          <div class="comment-author">${c.author}</div>
          <div>${c.text}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  return div;
}

function formatText(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/#(\w+)/g, '<span style="color: var(--neon-cyan); cursor: pointer;" onclick="toast(\'Searching vector: $1\')">#$1</span>');
}

function escapeText(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function formatNumber(num) {
  return num >= 1000 ? (num/1000).toFixed(1) + 'k' : num;
}

// Actions
function react(index, type) {
  const post = posts[index];
  if(post.userReaction === type) {
    post.reactions[type]--;
    post.userReaction = null;
  } else {
    if(post.userReaction) post.reactions[post.userReaction]--;
    post.reactions[type]++;
    post.userReaction = type;
  }
  render();
}

function comment(index) {
  const input = document.getElementById(`comment-${index}`);
  if(!input.value.trim()) return;
  
  posts[index].comments.push({
    author: currentUser,
    text: input.value.trim()
  });
  input.value = '';
  render();
  toast("Response transmitted");
}

function share(text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n\nvia MTAA v2.0")}`, '_blank');
  toast("Opening transmission channel...");
}

function copyPost(text) {
  navigator.clipboard.writeText(text).then(() => toast("Data copied to buffer"));
}

function addPost() {
  const input = document.getElementById('newPost');
  const text = input.value.trim();
  
  if(!text && !currentMedia) {
    toast("Error: No data to transmit");
    return;
  }
  
  posts.unshift({
    id: Date.now(),
    author: currentUser,
    avatar: "◉",
    time: "Just now",
    text: text || (currentMediaType === 'video' ? "Video transmission" : "Image transmission"),
    media: currentMedia,
    mediaType: currentMediaType,
    reactions: {fire: 0, laugh: 0, dead: 0},
    userReaction: null,
    comments: []
  });
  
  input.value = '';
  clearMedia();
  show('home');
  render();
  toast("Transmission complete");
}

function addTrending(tag) {
  const input = document.getElementById('newPost');
  input.value += (input.value ? ' ' : '') + '#' + tag + ' ';
  input.focus();
}

function addPoll() {
  const input = document.getElementById('newPost');
  input.value += '\n\n[ POLL PROTOCOL ]\n01. Option Alpha\n02. Option Beta\n03. Option Gamma\n\nSelect preference: _';
  input.focus();
  toast("Poll template loaded");
}

function openVault(item) {
  const messages = {
    kplc: "⚡ KPLC Archive: Electrical failure humor database",
    nitakutext: "📡 Communication protocols: Ghosting analytics",
    gengetone: "♪ Audio archives: 254 frequency dominance",
    mzinga: "⚗ Liquid distribution: Weekend mathematics"
  };
  toast(messages[item] || "Accessing archive...");
}

// Utilities
function toast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function startLiveCounter() {
  let count = 47293;
  setInterval(() => {
    count += Math.floor(Math.random() * 10) - 3;
    document.getElementById('live-count').textContent = count.toLocaleString();
  }, 2000);
}

// Infinite Scroll
window.addEventListener('scroll', () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    if(!isLoading && document.getElementById('home').classList.contains('active')) {
      loadMore();
    }
  }
});

function loadMore() {
  isLoading = true;
  document.getElementById('loading').classList.add('active');
  
  setTimeout(() => {
    const samples = [
      "Neural network activity detected in sector 7",
      "Optimizing weekend parameters...",
      "Incoming transmission from unknown node",
      "System integrity: 100%",
      "New data packets available for review"
    ];
    
    posts.push({
      id: Date.now(),
      author: "NODE_" + Math.floor(Math.random() * 9999),
      avatar: ["◉","◈","◊","○","●"][Math.floor(Math.random()*5)],
      time: Math.floor(Math.random()*5+1) + "h ago",
      text: samples[Math.floor(Math.random() * samples.length)],
      media: null,
      mediaType: null,
      reactions: {
        fire: Math.floor(Math.random()*100),
        laugh: Math.floor(Math.random()*50),
        dead: Math.floor(Math.random()*20)
      },
      userReaction: null,
      comments: []
    });
    
    render();
    isLoading = false;
    document.getElementById('loading').classList.remove('active');
  }, 1500);
}