/*
  Program Name: homework3.js
  Author: Tameka Boston
  Date Created: 2026-11-12
  Date Last Edited: 2026-11-12
  Version: 1.0
  Description: JavaScript validation for patient registration
*/

// Display the current day and date in the header
const dateTarget = document.getElementById("today");

if (dateTarget) {
  const d = new Date();
  const n = d.getDate();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mons = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const suffix = (n % 10 === 1 && n !== 11) ? "st" :
                 (n % 10 === 2 && n !== 12) ? "nd" :
                 (n % 10 === 3 && n !== 13) ? "rd" : "th";

  dateTarget.textContent = days[d.getDay()] + ", " +
    mons[d.getMonth()] + " " + n + suffix + ", " + d.getFullYear();
}

// Access the patient registration form
const f = document.getElementById("patientForm");

if (f) {
  const names = [
    "fname", "mi", "lname", "dob", "ssn", "addr1", "addr2",
    "city", "state", "zip", "email", "phone", "symptoms",
    "gender", "medication", "cancer", "health", "salary",
    "userid", "pw1", "pw2"
  ];

  const submitButton = document.getElementById("submitButton");
  let approved = false;

  // Retrieve a form field by its name
  function field(name) {
    return f.elements.namedItem(name);
  }

  // Retrieve and trim a field's entered value
  function value(name) {
    return field(name).value.trim();
  }

  // Display or remove an error message
  function error(name, message) {
    document.getElementById("error-" + name).textContent = message;
    return message === "";
  }

  // Hide Submit whenever form information changes
  function invalidateApproval() {
    approved = false;
    submitButton.hidden = true;
  }

  // Validate individual fields against their requirements
  function check(name) {
    const v = value(name);
    let msg = "";

    switch (name) {
      case "fname":
      case "lname":
        if (!/^[A-Za-z'-]{1,30}$/.test(v))
          msg = "Required: 1 to 30 letters, apostrophes or dashes only.";
        break;

      case "mi":
        if (v && !/^[A-Za-z]$/.test(v))
          msg = "Use one letter only, or leave blank.";
        break;

      case "dob": {
        const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);

        if (!m) {
          msg = "Enter a date as MM/DD/YYYY.";
        } else {
          const month = Number(m[1]);
          const day = Number(m[2]);
          const year = Number(m[3]);
          const date = new Date(2000, month - 1, day);
          date.setFullYear(year);

          const now = new Date();
          const today = new Date(
            now.getFullYear(), now.getMonth(), now.getDate()
          );
          const oldest = new Date(
            today.getFullYear() - 120,
            today.getMonth(),
            today.getDate()
          );

          if (date.getFullYear() !== year ||
              date.getMonth() !== month - 1 ||
              date.getDate() !== day)
            msg = "That date does not exist.";
          else if (date > today)
            msg = "Date of birth cannot be in the future.";
          else if (date < oldest)
            msg = "Date of birth cannot be more than 120 years ago.";
        }
        break;
      }

      case "ssn":
        if (!/^\d{3}-\d{2}-\d{4}$/.test(v))
          msg = "Enter exactly 9 digits.";
        break;

      case "addr1":
      case "addr2":
        if ((name === "addr1" || v) &&
            (v.length < 2 || v.length > 30 ||
            !/^[A-Za-z0-9 .,'#/-]+$/.test(v)))
          msg = "Use 2 to 30 valid address characters.";
        break;

      case "city":
        if (!/^[A-Za-z .'-]{2,30}$/.test(v))
          msg = "Required: 2 to 30 city characters.";
        break;

      case "state":
        if (!v)
          msg = "Select a state or territory.";
        break;

      case "zip":
        if (!/^\d{5}$/.test(v))
          msg = "Enter exactly 5 digits.";
        break;

      case "email":
        if (!/^[^@\s]+@[^@\s.]+(?:\.[^@\s.]+)+$/.test(v))
          msg = "Enter an email as name@domain.tld.";
        break;

      case "phone":
        if (!/^\d{3}-\d{3}-\d{4}$/.test(v))
          msg = "Enter a phone number as 000-000-0000.";
        break;

      case "symptoms":
        if (v.includes('"'))
          msg = "Double quotes are not allowed.";
        break;

      case "gender":
      case "medication":
      case "cancer":
        if (!f.querySelector('input[name="' + name + '"]:checked'))
          msg = "Select an option.";
        break;

      case "health":
        if (!Number.isInteger(Number(v)) ||
            Number(v) < 1 || Number(v) > 10)
          msg = "Choose a value from 1 to 10.";
        break;

      case "salary":
        if (!Number.isInteger(Number(v)) ||
            Number(v) < 20000 || Number(v) > 200000 ||
            Number(v) % 1000 !== 0)
          msg = "Choose $20,000 to $200,000 in $1,000 steps.";
        break;

      case "userid":
        if (!/^[A-Za-z_][A-Za-z0-9_-]{4,19}$/.test(v))
          msg = "Use 5 to 20 letters, numbers, _ or -; do not start with a number.";
        break;

      case "pw1":
        if (v.length < 8 || v.length > 30 ||
            !/[A-Z]/.test(v) || !/[a-z]/.test(v) ||
            !/\d/.test(v))
          msg = "Use 8 to 30 characters with uppercase, lowercase and a digit.";
        else if (v.toLowerCase() === value("userid").toLowerCase())
          msg = "Password cannot equal your user ID.";
        else if ([value("fname"), value("lname")].some(
          x => x && v.toLowerCase().includes(x.toLowerCase())))
          msg = "Password cannot contain your name.";
        break;

      case "pw2":
        if (!v || v !== field("pw1").value)
          msg = "Passwords must match.";
        break;
    }

    return error(name, msg);
  }

  // Check every form field before enabling submission
  function checkAll() {
    let valid = true;

    names.forEach(name => {
      if (!check(name))
        valid = false;
    });

    return valid;
  }

  // Insert dashes automatically while the SSN is entered
  function formatSSN() {
    const digits = field("ssn").value.replace(/\D/g, "").slice(0, 9);

    field("ssn").value =
      digits.slice(0, 3) +
      (digits.length > 3 ? "-" + digits.slice(3, 5) : "") +
      (digits.length > 5 ? "-" + digits.slice(5) : "");
  }

  // Display the current value of each slider
  function updateRange(name, output) {
    document.getElementById(output).value =
      name === "health"
        ? field(name).value
        : "$" + Number(field(name).value).toLocaleString() + "/year";
  }

  // Validate fields as the user enters information
  f.addEventListener("input", e => {
    const target = e.target;
    if (!target.name) return;

    invalidateApproval();

    if (target.name === "ssn")
      formatSSN();

    if (target.name === "email" || target.name === "userid")
      target.value = target.value.toLowerCase();

    if (target.name === "health")
      updateRange("health", "out");

    if (target.name === "salary")
      updateRange("salary", "salaryout");

    if (names.includes(target.name))
      check(target.name);

    if (target.name === "userid")
      check("pw1");

    if (target.name === "pw1")
      check("pw2");
  });

  // Validate dropdowns, radio buttons and other selections
  f.addEventListener("change", e => {
    invalidateApproval();

    if (e.target.name && names.includes(e.target.name))
      check(e.target.name);
  });

  // Validate text fields when the user leaves them
  f.addEventListener("focusout", e => {
    if (e.target.name && names.includes(e.target.name))
      check(e.target.name);
  });

  // Display Submit only after every field passes validation
  document.getElementById("validateButton").addEventListener("click", () => {
    approved = checkAll();
    submitButton.hidden = !approved;
  });

  // Prevent submission if any validation errors remain
  f.addEventListener("submit", e => {
    if (!approved || !checkAll()) {
      e.preventDefault();
      invalidateApproval();
    }
  });

  // Clear validation messages and restore slider values
  f.addEventListener("reset", () => {
    invalidateApproval();
    document.getElementById("reviewbox").style.display = "none";

    names.forEach(name => error(name, ""));

    setTimeout(() => {
      updateRange("health", "out");
      updateRange("salary", "salaryout");
    }, 0);
  });

  // Add patient information to the review table
  function addRow(label, content) {
    const tr = document.createElement("tr");
    const a = document.createElement("td");
    const b = document.createElement("td");

    a.className = "label";
    a.textContent = label;
    b.textContent = content || "(none)";

    tr.append(a, b);
    document.getElementById("reviewtable").appendChild(tr);
  }

  // Display the entered information without exposing passwords or SSN
  document.getElementById("reviewButton").addEventListener("click", () => {
    const t = document.getElementById("reviewtable");
    t.textContent = "";

    const ssn = field("ssn").value.replace(/\D/g, "");
    const history = Array.from(
      f.querySelectorAll('input[name="history"]:checked')
    ).map(x => x.value).join(", ");

    [
      ["First Name", value("fname")],
      ["Middle Initial", value("mi")],
      ["Last Name", value("lname")],
      ["Date of Birth", value("dob")],
      ["Social Security", ssn ? "***-**-" + ssn.slice(-4) : ""],
      ["Address Line 1", value("addr1")],
      ["Address Line 2", value("addr2")],
      ["City", value("city")],
      ["State", value("state")],
      ["Zip Code", value("zip")],
      ["Email Address", value("email")],
      ["Phone Number", value("phone")],
      ["Symptoms Described", value("symptoms")],
      ["Symptoms Checked", history],
      ["Gender", value("gender")],
      ["Taking Medications", value("medication")],
      ["Family Cancer History", value("cancer")],
      ["Feeling (1 to 10)", value("health")],
      ["Desired Annual Salary",
        "$" + Number(value("salary")).toLocaleString() + "/year"],
      ["User ID", value("userid")],
      ["Password", "*".repeat(field("pw1").value.length)]
    ].forEach(pair => addRow(pair[0], pair[1]));

    document.getElementById("reviewbox").style.display = "block";
  });
}

// End of homework3.js
