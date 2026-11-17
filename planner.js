
const PLANNER_KEY = "fahPostPlanner";

function getTasks() {
  return JSON.parse(
    localStorage.getItem(PLANNER_KEY) || "[]"
  );
}

function saveTasks(tasks) {
  localStorage.setItem(
    PLANNER_KEY,
    JSON.stringify(tasks)
  );
}

function addTask(task) {
  const tasks = getTasks();

  tasks.push({
    id: Date.now(),
    title: task.title,
    group: task.group,
    date: task.date,
    time: task.time,
    status: "planned",
    createdAt: new Date().toISOString()
  });

  saveTasks(tasks);
  return tasks;
}

function updateTask(id, updates) {
  const tasks = getTasks().map(task =>
    task.id === id
      ? { ...task, ...updates }
      : task
  );

  saveTasks(tasks);
  return tasks;
}

function deleteTask(id) {
  const tasks = getTasks().filter(
    task => task.id !== id
  );

  saveTasks(tasks);
  return tasks;
}

function escapePlannerHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderPlanner() {
  const list = document.getElementById("plannerList");
  if (!list) return;

  const tasks = getTasks();

  document.getElementById("plannerTotal").textContent =
    tasks.length;

  if (!tasks.length) {
    list.innerHTML = "<p>ยังไม่มีรายการงาน</p>";
    return;
  }

  list.innerHTML = tasks.map(task => {
    const title = escapePlannerHTML(task.title);
    const group = escapePlannerHTML(task.group);
    const date = escapePlannerHTML(task.date);
    const time = escapePlannerHTML(task.time);

    const statusText = {
      planned: "วางแผนแล้ว",
      done: "ดำเนินการแล้ว",
      cancelled: "ยกเลิก"
    }[task.status] || "ไม่ระบุ";

    return `
      <div class="planner-item">
        <b>${title}</b>
        <p>กลุ่ม: ${group}</p>
        <p>วันที่: ${date} เวลา ${time}</p>
        <p>สถานะ: ${statusText}</p>

        <div class="planner-actions">
          <button onclick="changeTaskStatus(${task.id})">
            เปลี่ยนสถานะ
          </button>

          <button onclick="editTask(${task.id})">
            แก้ไข
          </button>

          <button onclick="removeTask(${task.id})">
            ลบ
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function changeTaskStatus(id) {
  const task = getTasks().find(t => t.id === id);
  if (!task) return;

  const statuses = ["planned", "done", "cancelled"];
  const next = statuses[
    (statuses.indexOf(task.status) + 1) % statuses.length
  ];

  updateTask(id, { status: next });
  renderPlanner();
}

function editTask(id) {
  const task = getTasks().find(t => t.id === id);
  if (!task) return;

  const title = prompt("แก้ไขชื่องาน", task.title);
  if (!title || !title.trim()) return;

  updateTask(id, { title: title.trim() });
  renderPlanner();
}

function removeTask(id) {
  if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;

  deleteTask(id);
  renderPlanner();
}

document.addEventListener("DOMContentLoaded", renderPlanner);
