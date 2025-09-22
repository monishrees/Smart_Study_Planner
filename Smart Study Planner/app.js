// Basic study planner with localStorage
const STORAGE_KEY = 'study_planner_tasks';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const taskList = document.getElementById('taskList');
const form = document.getElementById('taskForm');
const titleEl = document.getElementById('title');
const notesEl = document.getElementById('notes');
const dateEl = document.getElementById('date');
const timeEl = document.getElementById('time');
const priorityEl = document.getElementById('priority');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const clearCompletedBtn = document.getElementById('clearCompleted');
const exportJSON = document.getElementById('exportJSON');
const importJSON = document.getElementById('importJSON');
const importFile = document.getElementById('importFile');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}

function uid() {
  return 't_' + Math.random().toString(36).slice(2,9);
}

function addTask(data) {
  tasks.push(Object.assign({id: uid(), done:false, createdAt: Date.now()}, data));
  save();
}

function updateTask(id, patch) {
  tasks = tasks.map(t => t.id === id ? {...t, ...patch} : t);
  save();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  save();
}

function calcProgress() {
  const total = tasks.length || 0;
  const done = tasks.filter(t=>t.done).length;
  const pct = total ? Math.round((done/total)*100) : 0;
  progressFill.style.width = pct + '%';
  progressText.textContent = `${done} / ${total} done (${pct}%)`;
}

function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + (timeStr ? 'T' + timeStr : ''));
  return d.toLocaleString();
}

function render() {
  taskList.innerHTML = '';
  // sort: upcoming first (by date), then high priority
  tasks.slice().sort((a,b)=>{
  const ad = a.date ? new Date(a.date + 'T' + (a.time||'00:00')) : null;
  const bd = b.date ? new Date(b.date + 'T' + (b.time||'00:00')) : null;
  if (ad && bd) return ad - bd;
  if (ad) return -1;
  if (bd) return 1;
  const priOrder = {high:1, medium:2, low:3};
  return priOrder[a.priority] - priOrder[b.priority] || a.createdAt - b.createdAt;
  }).forEach(t => {
    const li = document.createElement('li');
    li.className = 'task';
    if (t.done) li.classList.add('done');
    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.title + (t.done ? ' ✓' : '');
    const small = document.createElement('small');
    small.textContent = `${formatDateTime(t.date,t.time)} · ${t.notes||''}`;
    const badge = document.createElement('span');
    badge.className = 'badge ' + (t.priority||'medium');
    badge.textContent = (t.priority||'medium').toUpperCase();
    meta.appendChild(title);
    meta.appendChild(small);
    const actions = document.createElement('div');
    actions.className = 'actions';
    // toggle done
    const doneBtn = document.createElement('button');
    doneBtn.className = 'icon-btn';
    doneBtn.textContent = t.done ? 'Undo' : 'Done';
    doneBtn.onclick = ()=> updateTask(t.id, {done: !t.done});
    // edit (simple inline)
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = ()=>{
      titleEl.value = t.title;
      notesEl.value = t.notes;
      dateEl.value = t.date || '';
      timeEl.value = t.time || '';
      priorityEl.value = t.priority || 'medium';
      document.getElementById('saveBtn').textContent = 'Save';
      // set temporary id on form
      form.dataset.editing = t.id;
    };
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.textContent = 'Delete';
    delBtn.onclick = ()=> { if(confirm('Delete task?')) removeTask(t.id); };

    const topRow = document.createElement('div');
    topRow.style.display='flex';
    topRow.style.justifyContent='space-between';
    topRow.appendChild(badge);
    meta.insertBefore(topRow, title);

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(meta);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  calcProgress();
}

// form submit
form.addEventListener('submit', e=>{
  e.preventDefault();
  const payload = {
    title: titleEl.value.trim(),
    notes: notesEl.value.trim(),
    date: dateEl.value || null,
    time: timeEl.value || null,
    priority: priorityEl.value || 'medium'
  };
  if (!payload.title) return alert('Add a title');
  if (form.dataset.editing) {
    updateTask(form.dataset.editing, payload);
    delete form.dataset.editing;
    document.getElementById('saveBtn').textContent = 'Add Task';
  } else {
    addTask(payload);
  }
  form.reset();
});

// clear completed
clearCompletedBtn.addEventListener('click', ()=> {
  if(confirm('Remove all completed tasks?')) clearCompleted();
});

// export
exportJSON.addEventListener('click', ()=>{
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'study_planner_export.json';
  a.click();
  URL.revokeObjectURL(url);
});

// import
importJSON.addEventListener('click', ()=> importFile.click());
importFile.addEventListener('change', ev=>{
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
  try {
    const imported = JSON.parse(e.target.result);
    if (!Array.isArray(imported)) throw new Error('Invalid file');

    if (confirm('Replace existing tasks with imported ones?')) {
      tasks = imported.map(x=> ({...x, id: uid()}));
    } else {
      const fixed = imported.map(x=> ({...x, id: uid()}));
      tasks = tasks.concat(fixed);
    }
    save();
  } catch(err) {
    alert('Invalid JSON file');
  }
  };
  reader.readAsText(file);
  importFile.value = '';
});

// initial render
render();
