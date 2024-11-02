// Gestion des tâches
let tasks = JSON.parse(localStorage.getItem('task')) || [];
// Fonction pour afficher la fenêtre modale
function showOverlay() {
    document.getElementById("set-task-overlay").classList.remove("hidden");
}
// Fonction pour cacher la fenêtre modale
function hideOverlay() {
    document.getElementById("set-task-overlay").classList.add("hidden");
    document.getElementById("taskForm").reset();
}
// Fonction pour mettre à jour les statistiques des tâches
function updateStatistics() {
    document.getElementById("todo-count").textContent = tasks.filter(task => task.status === "To do").length;
    document.getElementById("doing-count").textContent = tasks.filter(task => task.status === "Doing").length;
    document.getElementById("done-count").textContent = tasks.filter(task => task.status === "Done").length;
}
// Afficher les tâches dans la liste organisée
function displayTasks() {
    const taskLists = {
        "To do": document.querySelector('[data-category="todo"] .tasks-list'),
        "Doing": document.querySelector('[data-category="doing"] .tasks-list'),
        "Done": document.querySelector('[data-category="done"] .tasks-list'),
    };
    // Vider les listes avant de les remplir à nouveau
    for (let list in taskLists) taskLists[list].innerHTML = "";

    // Pour chaque tâche, créer un élément de liste et l'ajouter à la bonne liste
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item p-4 border-b flex justify-between items-center";
        let priorityColor = "text-green-500";
        if (task.priority === "P1") priorityColor = "text-red-500";
        else if (task.priority === "P2") priorityColor = "text-orange-500";
        taskItem.innerHTML = `
            <div>
                <span class="font-semibold ${priorityColor}">${task.priority}</span> - ${task.name}
                <span class="text-gray-600 text-sm">(${task.dueDate})</span>
            </div>
            <div class="flex gap-2">
                <button class="text-red-400 hover:underline" onclick="editTask(${index})"><i class="ri-pencil-fill"></i></button>
                <button class="text-red-400 hover:underline" onclick="deleteTask(${index})"><i class="ri-delete-bin-fill"></i></button>
            </div>`;
        taskLists[task.status].appendChild(taskItem);
    });
    updateStatistics();
    localStorage.setItem('task', JSON.stringify(tasks));
}
// Fonction pour valider le formulaire avant d'ajouter une tâche
function validateForm(name, description, dueDate) {
  const namePattern = /^[A-Za-z\s]+$/;
  if (!name || !description || !dueDate) {
    alert("All fields are required.");
    return false;
  }
  if (!namePattern.test(name)) {
    alert("The name should contain only letters and spaces.");
    return false;
  }
  const today = new Date().toISOString().split("T")[0];
  if (dueDate < today) {
    alert("Due date cannot be in the past.");
    return false;
  }
  return true;
}
// Ajouter une nouvelle tâche
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date").value;
  const status = document.getElementById("status").value;
  const priority = document.getElementById("Priority").value;

  if (!validateForm(name, description, dueDate)) return;

  tasks.push({ name, description, dueDate, status, priority });
  localStorage.setItem('task', JSON.stringify(tasks));
  hideOverlay();
  displayTasks();
});
  // Fonction pour éditer une tâche
function editTask(index) {
  const task = tasks[index];
  showOverlay();
  document.getElementById("name").value = task.name;
  document.getElementById("description").value = task.description;
  document.getElementById("due-date").value = task.dueDate;
  document.getElementById("status").value = task.status;
  document.getElementById("Priority").value = task.priority;
  deleteTask(index);
}
// Fonction pour supprimer une tâche
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('task', JSON.stringify(tasks));
  displayTasks();
}

document.getElementById("add-task-cta").addEventListener("click", showOverlay);

displayTasks();