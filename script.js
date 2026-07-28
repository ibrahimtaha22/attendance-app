const employeesContainer = document.getElementById("employees");
const template = document.getElementById("employeeTemplate");

const EMPLOYEE_COUNT = 8;
const DAYS_COUNT = 31;

for (let i = 0; i < EMPLOYEE_COUNT; i++) {
  const clone = template.content.cloneNode(true);

  const daysContainer = clone.querySelector(".days");

  const presentCount = clone.querySelector(".presentCount");
  const absentCount = clone.querySelector(".absentCount");
  const vacationCount = clone.querySelector(".vacationCount");

  for (let day = 1; day <= DAYS_COUNT; day++) {
    const button = document.createElement("button");

    button.className = "day";
    button.dataset.state = "0";
    button.textContent = day;

    button.addEventListener("click", () => {
      changeState(button);
      updateSummary(
        daysContainer,
        presentCount,
        absentCount,
        vacationCount
      );

      saveData();
    });

    daysContainer.appendChild(button);
  }

  employeesContainer.appendChild(clone);
}

function changeState(button) {
  let state = Number(button.dataset.state);

  state = (state + 1) % 4;

  button.dataset.state = state;

  button.classList.remove("present", "absent", "vacation");

  const dayNumber =
    [...button.parentElement.children].indexOf(button) + 1;

  switch (state) {
    case 0:
      button.textContent = dayNumber;
      break;

    case 1:
      button.classList.add("present");
      button.textContent = "✅";
      break;

    case 2:
      button.classList.add("absent");
      button.textContent = "❌";
      break;

    case 3:
      button.classList.add("vacation");
      button.textContent = "🟡";
      break;
  }
}
function updateSummary(days, present, absent, vacation) {

  let p = 0;
  let a = 0;
  let v = 0;

  days.querySelectorAll(".day").forEach(btn => {

    switch (btn.dataset.state) {

      case "1":
        p++;
        break;

      case "2":
        a++;
        break;

      case "3":
        v++;
        break;

    }

  });

  present.textContent = p;
  absent.textContent = a;
  vacation.textContent = v;
}

function saveData() {

  const all = [];

  document.querySelectorAll(".employee").forEach(employee => {

    const employeeData = [];

    employee.querySelectorAll(".day").forEach(day => {
      employeeData.push(day.dataset.state);
    });

    all.push(employeeData);

  });

  localStorage.setItem(
    "attendance-data",
    JSON.stringify(all)
  );

}

function loadData() {

  const data = JSON.parse(
    localStorage.getItem("attendance-data")
  );

  if (!data) return;

  document.querySelectorAll(".employee").forEach((employee, i) => {

    const days = employee.querySelectorAll(".day");

    data[i]?.forEach((state, index) => {

      const btn = days[index];

      btn.dataset.state = state;

      btn.classList.remove("present", "absent", "vacation");

      if (state === "1") {
        btn.classList.add("present");
        btn.textContent = "✅";
      }

      if (state === "2") {
        btn.classList.add("absent");
        btn.textContent = "❌";
      }

      if (state === "3") {
        btn.classList.add("vacation");
        btn.textContent = "🟡";
      }

    });

    updateSummary(
      employee.querySelector(".days"),
      employee.querySelector(".presentCount"),
      employee.querySelector(".absentCount"),
      employee.querySelector(".vacationCount")
    );

  });

}

document
  .getElementById("clearBtn")
  .addEventListener("click", () => {

    if (!confirm("مسح جميع البيانات؟")) return;

    localStorage.clear();
    location.reload();

  });

loadData();