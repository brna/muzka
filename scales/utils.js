export function setConsoleContainer(container) {
  // List of all console methods you want to override
  const methods = ["log", "warn", "error", "debug", "info"];

  // Store the original console methods if not already stored
  if (!console.originalMethods) {
    console.originalMethods = {};
    methods.forEach((method) => {
      console.originalMethods[method] = console[method];
    });
  }

  // If container is null, restore the original methods
  if (!container && console.originalMethods) {
    methods.forEach((method) => {
      console[method] = console.originalMethods[method];
    });
    return;
  }

  // Override the console methods
  methods.forEach((method) => {
    console[method] = function (...args) {
      // Convert arguments to a string
      const output = args
        .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
        .join(" ");

      // Log to the original console
      console.originalMethods[method].apply(console, args);

      // Create a new paragraph element
      const p = document.createElement("p");
      p.textContent = output;

      // Style the log message based on the method type
      switch (method) {
        case "warn":
          p.style.color = "orange";
          break;
        case "error":
          p.style.color = "red";
          break;
        case "debug":
          p.style.color = "blue";
          break;
        case "info":
          p.style.color = "green";
          break;
        default:
          p.style.color = "black";
      }

      // Append the log message to the specified container
      container.appendChild(p);
    };
  });
}

export function isLocalhost() {
  // Check if the hostname is 'localhost' or '127.0.0.1' or '::1' (IPv6 localhost)
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1"
  );
}

export function convertToRoman(num) {
  var roman = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  var str = "";

  for (var i of Object.keys(roman)) {
    var q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }

  return str;
}
