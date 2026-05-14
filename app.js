const stages = ["Seed", "Outline", "Script", "Shoot", "Edit", "Published"];

const loginAccount = {
  email: "shuhangao7@gmail.com",
  passwordSalt: "channelnode-openframe-studio",
  passwordHash: "14c92566bfccd84d0d7cbf2369b2c8428eadb49bb7a9859f75a3858b12813de9",
  name: "Shuhang Ao",
  channel: "Creator Workspace",
};

const state = {
  ideas: [],
  research: [],
  selectedIdeaId: null,
  activeView: "board",
  search: "",
  format: "all",
  user: null,
  accountProfile: {
    name: loginAccount.name,
    channel: loginAccount.channel,
    photo: "",
  },
};

const starterIdeas = [
  {
    id: crypto.randomUUID(),
    title: "I tried building a full channel workflow in one afternoon",
    format: "Longform",
    stage: "Outline",
    date: nextDate(3),
    hook: "Can one simple system replace scattered docs, tabs, and sticky notes?",
    notes: "Cold open with the messy desktop. Show before and after. Include a quick template giveaway.",
    tags: ["workflow", "creator-tools", "behind-scenes"],
    tasks: [
      { text: "Draft the outline", done: true },
      { text: "Record screen capture", done: false },
      { text: "Design thumbnail options", done: false },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "5 title formulas I reuse for tutorials",
    format: "Short",
    stage: "Seed",
    date: nextDate(6),
    hook: "A tiny swipe file for turning useful videos into clickable videos.",
    notes: "Use fast examples from old uploads. End with a comment prompt for title rewrites.",
    tags: ["titles", "shorts", "growth"],
    tasks: [
      { text: "Pick examples", done: false },
      { text: "Write punchy captions", done: false },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Live teardown: subscribers submit their thumbnails",
    format: "Livestream",
    stage: "Shoot",
    date: nextDate(10),
    hook: "Real-time fixes that make the click decision obvious.",
    notes: "Collect submissions in advance. Use three categories: clutter, contrast, curiosity.",
    tags: ["thumbnail", "livestream", "community"],
    tasks: [
      { text: "Post community callout", done: true },
      { text: "Prepare review board", done: true },
      { text: "Schedule stream", done: false },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "My lightweight script template for educational videos",
    format: "Longform",
    stage: "Script",
    date: nextDate(14),
    hook: "A repeatable script shape that keeps the viewer moving.",
    notes: "Sections: promise, context, steps, proof, recap. Show the template in use.",
    tags: ["scripts", "tutorial", "workflow"],
    tasks: [
      { text: "Write intro", done: true },
      { text: "Add proof examples", done: false },
      { text: "Record voiceover test", done: false },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Poll: what should I build next?",
    format: "Community",
    stage: "Edit",
    date: nextDate(1),
    hook: "Let the audience choose the next build while surfacing demand.",
    notes: "Options: YouTube dashboard, research tracker, thumbnail reviewer, sponsor CRM.",
    tags: ["community", "poll", "planning"],
    tasks: [
      { text: "Write poll options", done: true },
      { text: "Add follow-up comment", done: false },
    ],
  },
];

const starterResearch = [
  {
    id: crypto.randomUUID(),
    title: "Retention graph notes from last three uploads",
    url: "",
    notes: "Drop-offs happen when the intro repeats the title. Stronger demos in first 20 seconds.",
  },
  {
    id: crypto.randomUUID(),
    title: "Competitor pacing examples",
    url: "https://www.youtube.com/",
    notes: "Track intro length, first visual change, and the moment the payoff appears.",
  },
];

const els = {
  authGate: document.querySelector("#authGate"),
  appShell: document.querySelector("#appShell"),
  board: document.querySelector("#board"),
  search: document.querySelector("#searchInput"),
  format: document.querySelector("#formatFilter"),
  composer: document.querySelector("#composer"),
  ideaForm: document.querySelector("#ideaForm"),
  newIdea: document.querySelector("#newIdeaButton"),
  cancelIdea: document.querySelector("#cancelIdeaButton"),
  exportButton: document.querySelector("#exportButton"),
  channelName: document.querySelector("#channelName"),
  viewIcon: document.querySelector("#viewIcon"),
  viewTitle: document.querySelector("#viewTitle"),
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  ideasCount: document.querySelector("#ideasCount"),
  readyCount: document.querySelector("#readyCount"),
  taskCount: document.querySelector("#taskCount"),
  tagCloud: document.querySelector("#tagCloud"),
  inspector: document.querySelector("#inspector"),
  inspectorContent: document.querySelector("#inspectorContent"),
  closeInspector: document.querySelector("#closeInspectorButton"),
  canvas: document.querySelector("#ideaMap"),
  mapDetail: document.querySelector("#mapDetail"),
  calendar: document.querySelector("#calendarGrid"),
  researchForm: document.querySelector("#researchForm"),
  researchList: document.querySelector("#researchList"),
  authLoginForm: document.querySelector("#authLoginForm"),
  authError: document.querySelector("#authError"),
  loginButton: document.querySelector("#loginButton"),
  accountMenuWrap: document.querySelector("#accountMenuWrap"),
  accountButton: document.querySelector("#accountButton"),
  accountMenu: document.querySelector("#accountMenu"),
  accountAvatar: document.querySelector("#accountAvatar"),
  accountName: document.querySelector("#accountName"),
  accountEmail: document.querySelector("#accountEmail"),
  menuAvatar: document.querySelector("#menuAvatar"),
  menuName: document.querySelector("#menuName"),
  menuEmail: document.querySelector("#menuEmail"),
  menuChannel: document.querySelector("#menuChannel"),
  editProfile: document.querySelector("#editProfileButton"),
  signOut: document.querySelector("#signOutButton"),
  loginModal: document.querySelector("#loginModal"),
  loginForm: document.querySelector("#loginForm"),
  closeLogin: document.querySelector("#closeLoginButton"),
  cancelLogin: document.querySelector("#cancelLoginButton"),
  settingsForm: document.querySelector("#settingsForm"),
  settingsName: document.querySelector("#settingsName"),
  settingsEmail: document.querySelector("#settingsEmail"),
  settingsChannel: document.querySelector("#settingsChannel"),
  settingsAvatarPreview: document.querySelector("#settingsAvatarPreview"),
  photoInput: document.querySelector("#photoInput"),
  removePhoto: document.querySelector("#removePhotoButton"),
};

loadState();
bindEvents();
render();

function nextDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function loadState() {
  const saved = localStorage.getItem("channelNodeState");
  if (!saved) {
    state.ideas = starterIdeas;
    state.research = starterResearch;
    saveState();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.ideas = Array.isArray(parsed.ideas) ? parsed.ideas : starterIdeas;
    state.research = Array.isArray(parsed.research) ? parsed.research : starterResearch;
    state.accountProfile = {
      name: parsed.accountProfile?.name || parsed.user?.name || loginAccount.name,
      channel: parsed.accountProfile?.channel || parsed.user?.channel || loginAccount.channel,
      photo: parsed.accountProfile?.photo || parsed.user?.photo || "",
    };
    const parsedUser = parsed.user && typeof parsed.user === "object" ? parsed.user : null;
    state.user =
      parsedUser && parsedUser.email?.toLowerCase() === loginAccount.email.toLowerCase()
        ? { ...parsedUser, ...state.accountProfile, email: loginAccount.email, provider: "Email" }
        : null;
  } catch {
    state.ideas = starterIdeas;
    state.research = starterResearch;
    state.user = null;
  }
}

function saveState() {
  localStorage.setItem(
    "channelNodeState",
    JSON.stringify({
      ideas: state.ideas,
      research: state.research,
      user: state.user,
      accountProfile: state.accountProfile,
    }),
  );
}

function bindEvents() {
  els.newIdea.addEventListener("click", () => {
    els.composer.hidden = !els.composer.hidden;
    if (!els.composer.hidden) {
      els.ideaForm.elements.title.focus();
    }
  });

  els.cancelIdea.addEventListener("click", () => {
    els.ideaForm.reset();
    els.composer.hidden = true;
  });

  els.ideaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(els.ideaForm);
    const idea = {
      id: crypto.randomUUID(),
      title: form.get("title").trim(),
      format: form.get("format"),
      stage: form.get("stage"),
      date: form.get("date"),
      hook: form.get("hook").trim(),
      notes: form.get("notes").trim(),
      tags: splitList(form.get("tags")),
      tasks: splitList(form.get("tasks")).map((text) => ({ text, done: false })),
    };

    state.ideas.unshift(idea);
    state.selectedIdeaId = idea.id;
    saveState();
    els.ideaForm.reset();
    els.composer.hidden = true;
    render();
    openInspector(idea.id);
  });

  els.search.addEventListener("input", (event) => {
    state.search = event.target.value.toLowerCase();
    render();
  });

  els.format.addEventListener("change", (event) => {
    state.format = event.target.value;
    render();
  });

  els.navItems.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  els.closeInspector.addEventListener("click", () => {
    els.inspector.classList.remove("open");
  });

  els.exportButton.addEventListener("click", exportIdeas);

  els.loginButton.addEventListener("click", openLoginModal);

  els.authLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(els.authLoginForm);
    const email = form.get("email").trim().toLowerCase();
    const password = form.get("password");
    const allowed =
      email === loginAccount.email.toLowerCase() && (await verifyPassword(password));

    if (!allowed) {
      els.authError.hidden = false;
      els.authLoginForm.elements.password.value = "";
      els.authLoginForm.elements.password.focus();
      return;
    }

    state.user = {
      name: state.accountProfile.name,
      email: loginAccount.email,
      channel: state.accountProfile.channel,
      provider: "Email",
      photo: state.accountProfile.photo,
    };
    els.authError.hidden = true;
    els.authLoginForm.reset();
    saveState();
    render();
  });

  els.accountButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleAccountMenu();
  });

  els.editProfile.addEventListener("click", () => {
    closeAccountMenu();
    switchView("settings");
  });

  els.signOut.addEventListener("click", () => {
    state.user = null;
    saveState();
    closeAccountMenu();
    els.authLoginForm.reset();
    els.authError.hidden = true;
    renderAuth();
  });

  els.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(els.loginForm);
    const name = form.get("name").trim();
    const email = state.user ? loginAccount.email : form.get("email").trim();
    const channel = form.get("channel").trim() || "Creator Workspace";
    state.accountProfile = { ...state.accountProfile, name, channel };
    state.user = { ...state.user, name, email, channel, provider: "Email" };
    saveState();
    closeLoginModal();
    render();
  });

  els.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.user) return;
    const name = els.settingsName.value.trim() || loginAccount.name;
    const channel = els.settingsChannel.value.trim() || loginAccount.channel;
    state.accountProfile = { ...state.accountProfile, name, channel };
    state.user = { ...state.user, name, channel, photo: state.accountProfile.photo };
    saveState();
    render();
  });

  els.photoInput.addEventListener("change", () => {
    const file = els.photoInput.files?.[0];
    if (!file || !state.user) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      state.accountProfile = { ...state.accountProfile, photo: reader.result };
      state.user = { ...state.user, photo: reader.result };
      saveState();
      render();
    });
    reader.readAsDataURL(file);
  });

  els.removePhoto.addEventListener("click", () => {
    if (!state.user) return;
    state.accountProfile = { ...state.accountProfile, photo: "" };
    state.user = { ...state.user, photo: "" };
    els.photoInput.value = "";
    saveState();
    render();
  });

  els.closeLogin.addEventListener("click", closeLoginModal);
  els.cancelLogin.addEventListener("click", closeLoginModal);

  els.loginModal.addEventListener("click", (event) => {
    if (event.target === els.loginModal) {
      closeLoginModal();
    }
  });

  document.addEventListener("click", (event) => {
    if (!els.accountMenuWrap.contains(event.target)) {
      closeAccountMenu();
    }

    const opensInspector = event.target.closest?.(".idea-card, .calendar-chip, #openMapIdea");
    const clickedOutsideInspector = !els.inspector.contains(event.target);
    if (els.inspector.classList.contains("open") && clickedOutsideInspector && !opensInspector) {
      els.inspector.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAccountMenu();
    closeLoginModal();
    els.inspector.classList.remove("open");
  });

  els.canvas.addEventListener("click", (event) => {
    const rect = els.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = getMapNodes().find((node) => isPointInMapNode(x, y, node));
    if (hit) {
      state.selectedIdeaId = hit.idea.id;
      renderMapDetail(hit.idea);
      renderIdeaMap();
    }
  });

  els.canvas.addEventListener("mousemove", (event) => {
    const rect = els.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = getMapNodes().some((node) => isPointInMapNode(x, y, node));
    els.canvas.style.cursor = hit ? "pointer" : "default";
  });

  els.canvas.addEventListener("mouseleave", () => {
    els.canvas.style.cursor = "default";
  });

  window.addEventListener("resize", () => {
    if (state.activeView === "map") renderIdeaMap();
  });

  els.researchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(els.researchForm);
    state.research.unshift({
      id: crypto.randomUUID(),
      title: form.get("title").trim(),
      url: form.get("url").trim(),
      notes: form.get("notes").trim(),
    });
    saveState();
    els.researchForm.reset();
    renderResearch();
  });
}

async function verifyPassword(password) {
  if (!crypto.subtle) return false;
  const encoder = new TextEncoder();
  const data = encoder.encode(`${loginAccount.passwordSalt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("") === loginAccount.passwordHash;
}

function splitList(value) {
  return String(value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function switchView(view) {
  state.activeView = view;
  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  els.views.forEach((section) => section.classList.remove("active"));
  document.querySelector(`#${view}View`).classList.add("active");
  const viewMeta =
    {
      board: { title: "Board", icon: "▦" },
      map: { title: "Idea Map", icon: "⌁" },
      calendar: { title: "Calendar", icon: "◷" },
      research: { title: "Research", icon: "◎" },
      settings: { title: "Settings", icon: "⚙" },
    }[view] || { title: "Board", icon: "▦" };
  els.viewTitle.textContent = viewMeta.title;
  els.viewIcon.textContent = viewMeta.icon;

  if (view === "map") {
    renderIdeaMap();
  }
  if (view === "calendar") {
    renderCalendar();
  }
  if (view === "research") {
    renderResearch();
  }
  if (view === "settings") {
    renderSettings();
  }
}

function filteredIdeas() {
  return state.ideas.filter((idea) => {
    const text = [idea.title, idea.hook, idea.notes, idea.format, idea.stage, ...idea.tags]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !state.search || text.includes(state.search);
    const matchesFormat = state.format === "all" || idea.format === state.format;
    return matchesSearch && matchesFormat;
  });
}

function render() {
  renderAuth();
  renderBoard();
  renderStats();
  renderTagCloud();
  if (state.user) renderSettings();
  if (state.activeView === "map") renderIdeaMap();
  if (state.activeView === "calendar") renderCalendar();
  if (state.activeView === "research") renderResearch();
}

function renderAuth() {
  const user = state.user;
  const signedIn = Boolean(user);
  els.authGate.hidden = signedIn;
  els.appShell.hidden = !signedIn;
  els.loginButton.hidden = signedIn;
  els.accountMenuWrap.hidden = !signedIn;

  if (!signedIn) {
    els.channelName.textContent = "Creator Workspace";
    els.composer.hidden = true;
    els.inspector.classList.remove("open");
    closeAccountMenu();
    return;
  }

  els.channelName.textContent = user.channel || "Creator Workspace";
  setAvatar(els.accountAvatar, user);
  setAvatar(els.menuAvatar, user);
  els.accountName.textContent = user.name || "Creator";
  els.menuName.textContent = user.name || "Creator";
  els.accountEmail.textContent = user.email || `${user.provider || "Local"} workspace`;
  els.menuEmail.textContent = user.email || `${user.provider || "Local"} workspace`;
  els.menuChannel.textContent = user.channel || "Creator Workspace";
}

function renderSettings() {
  if (!state.user) return;
  els.settingsName.value = state.user.name || loginAccount.name;
  els.settingsEmail.value = loginAccount.email;
  els.settingsChannel.value = state.user.channel || loginAccount.channel;
  setAvatar(els.settingsAvatarPreview, state.user);
}

function openLoginModal() {
  const user = state.user || {};
  els.loginForm.elements.name.value = user.name || "";
  els.loginForm.elements.email.value = user.email || "";
  els.loginForm.elements.channel.value = user.channel || "";
  els.loginModal.hidden = false;
  els.loginForm.elements.name.focus();
}

function closeLoginModal() {
  els.loginModal.hidden = true;
}

function toggleAccountMenu() {
  const expanded = els.accountButton.getAttribute("aria-expanded") === "true";
  els.accountMenu.hidden = expanded;
  els.accountButton.setAttribute("aria-expanded", String(!expanded));
}

function closeAccountMenu() {
  els.accountMenu.hidden = true;
  els.accountButton.setAttribute("aria-expanded", "false");
}

function getInitials(name) {
  const parts = String(name || "Creator")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function setAvatar(element, user) {
  element.replaceChildren();
  if (user?.photo) {
    const image = document.createElement("img");
    image.src = user.photo;
    image.alt = "";
    element.append(image);
    return;
  }
  element.textContent = getInitials(user?.name);
}

function renderBoard() {
  const ideas = filteredIdeas();
  els.board.innerHTML = stages
    .map((stage) => {
      const stageIdeas = ideas.filter((idea) => idea.stage === stage);
      const cards = stageIdeas.map(renderCard).join("");
      return `
        <section class="column" data-stage="${stage}">
          <div class="column-header">
            <h3>${stage}</h3>
            <span class="column-count">${stageIdeas.length}</span>
          </div>
          <div class="card-stack">
            ${cards || `<p class="empty-column">No ${stage.toLowerCase()} ideas.</p>`}
          </div>
        </section>
      `;
    })
    .join("");

  els.board.querySelectorAll(".idea-card").forEach((card) => {
    card.addEventListener("click", () => openInspector(card.dataset.id));
    card.addEventListener("dragstart", (event) => {
      card.classList.add("dragging");
      event.dataTransfer.setData("text/plain", card.dataset.id);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  els.board.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", (event) => {
      event.preventDefault();
      column.classList.add("drag-over");
    });
    column.addEventListener("dragleave", () => column.classList.remove("drag-over"));
    column.addEventListener("drop", (event) => {
      event.preventDefault();
      column.classList.remove("drag-over");
      const id = event.dataTransfer.getData("text/plain");
      updateIdea(id, { stage: column.dataset.stage });
    });
  });
}

function renderCard(idea) {
  const done = idea.tasks.filter((task) => task.done).length;
  const total = idea.tasks.length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const score = getIdeaScore(idea);
  return `
    <article class="idea-card" draggable="true" data-id="${idea.id}">
      <div class="card-top">
        <span class="format-chip">${idea.format}</span>
        <span class="score">${score}%</span>
      </div>
      <h3>${escapeHtml(idea.title)}</h3>
      <p class="hook">${escapeHtml(idea.hook || "No hook yet.")}</p>
      <div class="card-meta">
        ${idea.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="task-progress" aria-label="Task progress">
        <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>
        <span>${done}/${total || 0} tasks${idea.date ? ` · ${formatShortDate(idea.date)}` : ""}</span>
      </div>
    </article>
  `;
}

function renderStats() {
  const openTasks = state.ideas.reduce(
    (total, idea) => total + idea.tasks.filter((task) => !task.done).length,
    0,
  );
  els.ideasCount.textContent = state.ideas.length;
  els.readyCount.textContent = state.ideas.filter((idea) =>
    ["Shoot", "Edit", "Published"].includes(idea.stage),
  ).length;
  els.taskCount.textContent = openTasks;
}

function renderTagCloud() {
  const counts = new Map();
  state.ideas.forEach((idea) => {
    idea.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  els.tagCloud.innerHTML = tags.length
    ? tags.map(([tag, count]) => `<span class="tag">${escapeHtml(tag)} · ${count}</span>`).join("")
    : `<span class="muted">No tags yet.</span>`;
}

function openInspector(id) {
  state.selectedIdeaId = id;
  const idea = state.ideas.find((item) => item.id === id);
  if (!idea) return;
  els.inspectorContent.innerHTML = renderInspector(idea);
  els.inspector.classList.add("open");
  bindInspector(idea);
}

function renderInspector(idea) {
  const tasks = idea.tasks.length
    ? idea.tasks
        .map(
          (task, index) => `
          <label class="task-row ${task.done ? "done" : ""}">
            <input type="checkbox" data-task-index="${index}" ${task.done ? "checked" : ""} />
            <span>${escapeHtml(task.text)}</span>
          </label>
        `,
        )
        .join("")
    : `<p class="muted">No tasks yet.</p>`;

  return `
    <p class="eyebrow">${idea.format}</p>
    <h2>${escapeHtml(idea.title)}</h2>
    <div class="inspector-block">
      <div class="field-row">
        <label>
          Stage
          <select id="detailStage">
            ${stages.map((stage) => `<option ${stage === idea.stage ? "selected" : ""}>${stage}</option>`).join("")}
          </select>
        </label>
        <label>
          Publish date
          <input id="detailDate" type="date" value="${idea.date || ""}" />
        </label>
      </div>
    </div>
    <div class="inspector-block">
      <h3>Hook</h3>
      <textarea id="detailHook">${escapeHtml(idea.hook || "")}</textarea>
    </div>
    <div class="inspector-block">
      <h3>Notes</h3>
      <textarea id="detailNotes">${escapeHtml(idea.notes || "")}</textarea>
    </div>
    <div class="inspector-block">
      <h3>Tags</h3>
      <input id="detailTags" value="${escapeHtml(idea.tags.join(", "))}" />
    </div>
    <div class="inspector-block">
      <h3>Tasks</h3>
      ${tasks}
      <input id="newTaskInput" placeholder="Add task" />
    </div>
    <div class="inspector-actions">
      <button class="primary-button" id="saveIdeaButton" type="button">Save changes</button>
      <button class="danger-button" id="deleteIdeaButton" type="button">Delete idea</button>
    </div>
  `;
}

function bindInspector(idea) {
  els.inspectorContent.querySelectorAll("[data-task-index]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const index = Number(checkbox.dataset.taskIndex);
      idea.tasks[index].done = checkbox.checked;
      saveState();
      render();
      openInspector(idea.id);
    });
  });

  els.inspectorContent.querySelector("#newTaskInput").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const value = event.currentTarget.value.trim();
    if (!value) return;
    idea.tasks.push({ text: value, done: false });
    saveState();
    render();
    openInspector(idea.id);
  });

  els.inspectorContent.querySelector("#saveIdeaButton").addEventListener("click", () => {
    updateIdea(idea.id, {
      stage: els.inspectorContent.querySelector("#detailStage").value,
      date: els.inspectorContent.querySelector("#detailDate").value,
      hook: els.inspectorContent.querySelector("#detailHook").value.trim(),
      notes: els.inspectorContent.querySelector("#detailNotes").value.trim(),
      tags: splitList(els.inspectorContent.querySelector("#detailTags").value),
    });
    openInspector(idea.id);
  });

  els.inspectorContent.querySelector("#deleteIdeaButton").addEventListener("click", () => {
    state.ideas = state.ideas.filter((item) => item.id !== idea.id);
    state.selectedIdeaId = null;
    saveState();
    els.inspector.classList.remove("open");
    render();
  });
}

function updateIdea(id, changes) {
  state.ideas = state.ideas.map((idea) => (idea.id === id ? { ...idea, ...changes } : idea));
  saveState();
  render();
}

function renderIdeaMap() {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const { width, height } = resizeMapCanvas(canvas, ctx);
  const nodes = getMapNodes();
  const geometry = getMapGeometry(width, height);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f6f3";
  ctx.fillRect(0, 0, width, height);

  stages.forEach((stage, index) => {
    const laneX = geometry.paddingX + index * geometry.laneWidth;
    const laneLeft = laneX + geometry.laneGap / 2;
    const laneWidth = geometry.laneWidth - geometry.laneGap;
    const laneCount = nodes.filter((node) => node.idea.stage === stage).length;

    traceRoundedRect(ctx, laneLeft, 16, laneWidth, height - 32, 14);
    ctx.fillStyle = index % 2 ? "#faf9f6" : "#fdfcf9";
    ctx.fill();
    ctx.strokeStyle = "#e7e4de";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#5d5a55";
    ctx.font = "700 10px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(stage === "Published" ? "PUBLISH" : stage.toUpperCase(), laneLeft + 12, 42);

    traceRoundedRect(ctx, laneLeft + laneWidth - 38, 28, 26, 24, 12);
    ctx.fillStyle = "#efede8";
    ctx.fill();
    ctx.fillStyle = "#4f4c47";
    ctx.textAlign = "center";
    ctx.font = "700 12px Inter, system-ui, sans-serif";
    ctx.fillText(String(laneCount), laneLeft + laneWidth - 25, 40);
  });

  if (!nodes.length) {
    drawMapEmptyState(ctx, width, height);
    renderMapPlaceholder(0);
    return;
  }

  nodes.forEach((node, index) => {
    nodes.slice(index + 1).forEach((other) => {
      const relationship = getIdeaRelationship(node.idea, other.idea);
      if (!relationship) return;
      drawMapConnection(ctx, node, other, relationship);
    });
  });

  nodes.forEach((node) => {
    drawMapNode(ctx, node);
  });

  const selectedNode = nodes.find((node) => node.idea.id === state.selectedIdeaId);
  if (selectedNode) {
    renderMapDetail(selectedNode.idea);
  } else {
    if (state.selectedIdeaId) state.selectedIdeaId = null;
    renderMapPlaceholder(nodes.length);
  }
}

function getMapNodes() {
  const ideas = filteredIdeas();
  const rect = els.canvas.getBoundingClientRect();
  const width = rect.width || 900;
  const height = rect.height || 560;
  const geometry = getMapGeometry(width, height);
  const groups = new Map(stages.map((stage) => [stage, []]));
  ideas.forEach((idea) => {
    const group = groups.get(idea.stage) || groups.get("Seed");
    group.push(idea);
  });

  return stages.flatMap((stage, stageIndex) => {
    const group = groups.get(stage) || [];
    const availableHeight = geometry.bottom - geometry.top;
    const nodeWidth = Math.min(154, Math.max(104, geometry.laneWidth - 22));
    const nodeHeight = Math.max(
      62,
      Math.min(78, (availableHeight - Math.max(0, group.length - 1) * 12) / Math.max(group.length, 1)),
    );
    const nodeTop = geometry.top + nodeHeight / 2;
    const spread = availableHeight - nodeHeight;

    return group.map((idea, ideaIndex) => ({
      idea,
      width: nodeWidth,
      height: nodeHeight,
      x: geometry.paddingX + stageIndex * geometry.laneWidth + geometry.laneWidth / 2,
      y: group.length === 1 ? nodeTop : nodeTop + (spread * ideaIndex) / (group.length - 1),
    }));
  });
}

function getMapGeometry(width, height) {
  const paddingX = Math.min(36, Math.max(24, width * 0.035));
  const laneGap = 10;
  const laneWidth = (width - paddingX * 2) / stages.length;
  const top = 96;
  const bottom = Math.max(top + 220, height - 44);
  return { paddingX, laneGap, laneWidth, top, bottom };
}

function resizeMapCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function renderMapDetail(idea) {
  const doneTasks = idea.tasks.filter((task) => task.done).length;
  const taskLabel = idea.tasks.length ? `${doneTasks}/${idea.tasks.length} done` : "No tasks";
  els.mapDetail.innerHTML = `
    <p class="eyebrow">${idea.stage} · ${idea.format}</p>
    <h3>${escapeHtml(idea.title)}</h3>
    <p>${escapeHtml(idea.hook || "No hook yet.")}</p>
    <div class="map-detail-list">
      <div>
        <span>Momentum</span>
        <strong>${getIdeaScore(idea)}%</strong>
      </div>
      <div>
        <span>Tasks</span>
        <strong>${taskLabel}</strong>
      </div>
      <div>
        <span>Publish</span>
        <strong>${idea.date ? formatShortDate(idea.date) : "Unscheduled"}</strong>
      </div>
    </div>
    <div class="card-meta">
      ${idea.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
    <button class="primary-button" type="button" id="openMapIdea">Open details</button>
  `;
  els.mapDetail.querySelector("#openMapIdea").addEventListener("click", () => openInspector(idea.id));
}

function renderMapPlaceholder(count) {
  els.mapDetail.innerHTML = `
    <p class="eyebrow">Selected idea</p>
    <h3>${count ? "Pick an idea" : "No ideas in view"}</h3>
    <p class="muted">${count ? `${count} ideas are visible on this map.` : "Try clearing the search or format filter."}</p>
  `;
}

function renderCalendar() {
  const today = new Date();
  const days = Array.from({ length: 21 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });

  els.calendar.innerHTML = days
    .map((day) => {
      const iso = day.toISOString().slice(0, 10);
      const ideas = filteredIdeas().filter((idea) => idea.date === iso);
      return `
        <section class="calendar-day">
          <h3>
            <span>${day.toLocaleDateString(undefined, { weekday: "short" })}</span>
            <span class="calendar-date">${day.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </h3>
          ${
            ideas.length
              ? ideas
                  .map(
                    (idea) => `
                    <button class="calendar-chip" data-id="${idea.id}" type="button">
                      ${escapeHtml(idea.title)}
                    </button>
                  `,
                  )
                  .join("")
              : `<p class="empty-state">Open slot.</p>`
          }
        </section>
      `;
    })
    .join("");

  els.calendar.querySelectorAll(".calendar-chip").forEach((button) => {
    button.addEventListener("click", () => openInspector(button.dataset.id));
  });
}

function renderResearch() {
  els.researchList.innerHTML = state.research.length
    ? state.research
        .map(
          (item) => `
        <article class="research-item">
          <h3>${escapeHtml(item.title)}</h3>
          ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.url)}</a>` : ""}
          <p>${escapeHtml(item.notes || "No notes yet.")}</p>
          <button class="ghost-button" data-research-id="${item.id}" type="button">Remove</button>
        </article>
      `,
        )
        .join("")
    : `<p class="empty-state">No sources yet.</p>`;

  els.researchList.querySelectorAll("[data-research-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.research = state.research.filter((item) => item.id !== button.dataset.researchId);
      saveState();
      renderResearch();
    });
  });
}

function getIdeaScore(idea) {
  let score = 35;
  if (idea.hook) score += 15;
  if (idea.notes && idea.notes.length > 30) score += 10;
  if (idea.date) score += 10;
  score += Math.min(20, idea.tasks.filter((task) => task.done).length * 8);
  score += Math.min(10, idea.tags.length * 2);
  return Math.min(score, 100);
}

function getStageColor(stage) {
  return {
    Seed: "#dedbd4",
    Outline: "#d2d0ca",
    Script: "#c4c2bc",
    Shoot: "#b7b5ae",
    Edit: "#aaa8a1",
    Published: "#96948d",
  }[stage];
}

function getIdeaRelationship(idea, other) {
  const sharedTags = idea.tags.filter((tag) => other.tags.includes(tag)).length;
  const sameFormat = idea.format === other.format ? 1 : 0;
  const sameDate = idea.date && idea.date === other.date ? 1 : 0;
  return sharedTags * 2 + sameFormat + sameDate;
}

function drawMapConnection(ctx, node, other, relationship) {
  const [from, to] = node.x <= other.x ? [node, other] : [other, node];
  const sameLane = Math.abs(from.x - to.x) < 4;
  ctx.save();
  ctx.strokeStyle = relationship > 2 ? "rgba(32, 32, 31, 0.18)" : "rgba(32, 32, 31, 0.09)";
  ctx.lineWidth = Math.min(3, 0.7 + relationship * 0.42);
  ctx.beginPath();

  if (sameLane) {
    const startX = from.x + from.width / 2;
    const endX = to.x + to.width / 2;
    const controlX = startX + 42;
    ctx.moveTo(startX, from.y);
    ctx.bezierCurveTo(controlX, from.y, controlX, to.y, endX, to.y);
  } else {
    const startX = from.x + from.width / 2;
    const endX = to.x - to.width / 2;
    const distance = Math.max(34, endX - startX);
    ctx.moveTo(startX, from.y);
    ctx.bezierCurveTo(startX + distance * 0.45, from.y, endX - distance * 0.45, to.y, endX, to.y);
  }

  ctx.stroke();
  ctx.restore();
}

function drawMapNode(ctx, node) {
  const selected = state.selectedIdeaId === node.idea.id;
  const left = node.x - node.width / 2;
  const top = node.y - node.height / 2;
  const textColor = selected ? "#ffffff" : "#20201f";
  const subTextColor = selected ? "rgba(255, 255, 255, 0.68)" : "#706d67";

  ctx.save();
  ctx.shadowColor = selected ? "rgba(18, 18, 17, 0.18)" : "rgba(18, 18, 17, 0.08)";
  ctx.shadowBlur = selected ? 18 : 10;
  ctx.shadowOffsetY = selected ? 8 : 4;
  traceRoundedRect(ctx, left, top, node.width, node.height, 12);
  ctx.fillStyle = selected ? "#20201f" : "#ffffff";
  ctx.fill();
  ctx.restore();

  traceRoundedRect(ctx, left, top, node.width, node.height, 12);
  ctx.strokeStyle = selected ? "#111110" : getStageColor(node.idea.stage);
  ctx.lineWidth = selected ? 2 : 1.5;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = subTextColor;
  ctx.font = "700 10px Inter, system-ui, sans-serif";
  ctx.fillText(fitCanvasText(ctx, node.idea.format.toUpperCase(), node.width - 24), left + 12, top + 10);

  ctx.fillStyle = textColor;
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  wrapCanvasText(ctx, node.idea.title, left + 12, top + 30, node.width - 24, 14, node.height < 70 ? 1 : 2);

  const progressWidth = node.width - 24;
  const progressY = top + node.height - 13;
  traceRoundedRect(ctx, left + 12, progressY, progressWidth, 4, 2);
  ctx.fillStyle = selected ? "rgba(255, 255, 255, 0.22)" : "#edeae4";
  ctx.fill();
  traceRoundedRect(ctx, left + 12, progressY, (progressWidth * getIdeaScore(node.idea)) / 100, 4, 2);
  ctx.fillStyle = selected ? "#ffffff" : "#20201f";
  ctx.fill();
  ctx.restore();
}

function drawMapEmptyState(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#6d6962";
  ctx.font = "700 16px Inter, system-ui, sans-serif";
  ctx.fillText("No ideas in this view", width / 2, height / 2 - 10);
  ctx.fillStyle = "#8a867f";
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText("Clear the search or change the format filter.", width / 2, height / 2 + 16);
  ctx.restore();
}

function isPointInMapNode(x, y, node) {
  return (
    x >= node.x - node.width / 2 &&
    x <= node.x + node.width / 2 &&
    y >= node.y - node.height / 2 &&
    y <= node.y + node.height / 2
  );
}

function traceRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = String(text || "").split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  lines.push(current);

  lines.slice(0, maxLines).forEach((line, index) => {
    const clipped = index === maxLines - 1 && lines.length > maxLines;
    const label = clipped ? fitCanvasText(ctx, `${line}...`, maxWidth) : fitCanvasText(ctx, line, maxWidth);
    ctx.fillText(label, x, y + index * lineHeight);
  });
}

function fitCanvasText(ctx, text, maxWidth) {
  const label = String(text || "");
  if (ctx.measureText(label).width <= maxWidth) return label;
  let clipped = label;
  while (clipped.length > 1 && ctx.measureText(`${clipped}...`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped.trim()}...`;
}

function exportIdeas() {
  const blob = new Blob([JSON.stringify({ ideas: state.ideas, research: state.research }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "channel-node-export.json";
  link.click();
  URL.revokeObjectURL(url);
}

function formatShortDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
