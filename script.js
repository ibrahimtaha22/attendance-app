const employeesContainer = document.getElementById("employees");
const template = document.getElementById("employeeTemplate");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const companyInput = document.getElementById("company");
const departmentInput = document.getElementById("department");
const monthInput = document.getElementById("month");

// 1. إضافة مصفوفة الأسماء الافتراضية الجديدة بناءً على الصورة
const defaultNames = [
  "بلال", 
  "جمال", 
  "سمير", 
  "محمد", 
  "جمال مسائي", 
  "سمير مسائي", 
  "محمد مسائي"
];

const EMPLOYEE_COUNT = 8;
const DAYS_COUNT = 31;

for (let i = 0; i < EMPLOYEE_COUNT; i++) {
  const clone = template.content.cloneNode(true);

  const daysContainer = clone.querySelector(".days");
  const presentCount = clone.querySelector(".presentCount");
  const absentCount = clone.querySelector(".absentCount");
  const vacationCount = clone.querySelector(".vacationCount");
  
  // جلب حقل الاسم
  const nameInput = clone.querySelector(".employee__name");

  // 2. تثبيت الأسماء في الخانات الأولى لو لم تكن موجودة في التخزين المسبق
  if (defaultNames[i]) {
    nameInput.value = defaultNames[i];
  }

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

  const dayNumber = [...button.parentElement.children].indexOf(button) + 1;

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
      case "1": p++; break;
      case "2": a++; break;
      case "3": v++; break;
    }
  });

  present.textContent = p;
  absent.textContent = a;
  vacation.textContent = v;
}

// 3. دالة الحفظ
function saveData() {
  const appData = {
    company: companyInput.value,
    department: departmentInput.value,
    month: monthInput.value,
    employees: []
  };

  document.querySelectorAll(".employee").forEach(employee => {
    const employeeName = employee.querySelector(".employee__name").value;
    const employeeStates = [];

    employee.querySelectorAll(".day").forEach(day => {
      employeeStates.push(day.dataset.state);
    });

    appData.employees.push({
      name: employeeName,
      states: employeeStates
    });
  });

  localStorage.setItem("attendance-data", JSON.stringify(appData));
  alert("تم حفظ البيانات بنجاح! 💾");
}

// 4. دالة التحميل 
function loadData() {
  const dataString = localStorage.getItem("attendance-data");
  if (!dataString) return;

  const appData = JSON.parse(dataString);

  if (appData.company) companyInput.value = appData.company;
  if (appData.department) departmentInput.value = appData.department;
  if (appData.month) monthInput.value = appData.month;

  document.querySelectorAll(".employee").forEach((employee, i) => {
    const empData = appData.employees[i];
    if (!empData) return;

    employee.querySelector(".employee__name").value = empData.name || "";

    const days = employee.querySelectorAll(".day");

    empData.states?.forEach((state, index) => {
      const btn = days[index];
      if (!btn) return;

      btn.dataset.state = state;
      btn.classList.remove("present", "absent", "vacation");
      const dayNumber = index + 1;

      switch (state) {
        case "1":
          btn.classList.add("present");
          btn.textContent = "✅";
          break;
        case "2":
          btn.classList.add("absent");
          btn.textContent = "❌";
          break;
        case "3":
          btn.classList.add("vacation");
          btn.textContent = "🟡";
          break;
        default:
          btn.textContent = dayNumber;
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

// ربط أزرار الحفظ والمسح
saveBtn.addEventListener("click", saveData);

clearBtn.addEventListener("click", () => {
  if (confirm("هل أنت متأكد من مسح جميع البيانات؟")) {
    localStorage.removeItem("attendance-data");
    location.reload();
  }
});

// تشغيل دالة التحميل عند فتح الصفحة
loadData();
