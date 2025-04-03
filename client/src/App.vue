<script>
export default {
  name: "App",
};
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
/* Import Bootstrap CSS */
@import "bootstrap/dist/css/bootstrap.min.css";
@import "bootstrap-icons/font/bootstrap-icons.css";

/* Global styles */
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary-color: #64748b;
  --background-color: #f8fafc;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --transition-speed: 0.3s;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background-color: var(--background-color);
  min-height: 100vh;
  color: #1a1a1a;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* Button styles */
.btn {
  transition: all var(--transition-speed) ease;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

/* Form styles */
.form-control {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  transition: all var(--transition-speed) ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Card styles */
.card {
  border: none;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  transition: transform var(--transition-speed) ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
  border-radius: 1rem 1rem 0 0;
}

.card-body {
  padding: 1.5rem;
}

/* Navigation styles */
.navbar {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.nav-link {
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all var(--transition-speed) ease;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: var(--primary-color);
}

.nav-link.active {
  background-color: var(--primary-color);
  color: white;
}

/* Table styles */
.table {
  border-radius: 0.5rem;
  overflow: hidden;
}

.table thead th {
  background-color: #f8fafc;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

/* Badge styles */
.badge {
  font-weight: 500;
  padding: 0.5em 1em;
  border-radius: 9999px;
}

/* Modal styles */
.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
}

.modal-header {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .table {
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.5rem 1rem;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
