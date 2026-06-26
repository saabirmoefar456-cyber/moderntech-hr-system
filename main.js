// Hardcoded users list
const validUsers = [
  { username: "admin", password: "admin123", role: "HR Admin" },
  { username: "manager", password: "manager123", role: "HR Manager" },
];

const app = Vue.createApp({
  data() {
    return {
      currentPage: "dashboard",
      isLoggedIn: false,
      currentUser: null,
      loginUsername: "",
      loginPassword: "",
      loginError: "",
    };
  },

  methods: {
    handleLogin() {
      const user = validUsers.find(
        (u) =>
          u.username === this.loginUsername &&
          u.password === this.loginPassword,
      );
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.loginError = "";
      } else {
        this.loginError = "Invalid username or password";
      }
    },

    handleLogout() {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.loginUsername = "";
      this.loginPassword = "";
      this.currentPage = "dashboard";
    },
  },
});

// Register all components
app.component("dashboard-component", DashboardComponent);
app.component("employees-component", EmployeesComponent);
app.component("payroll-component", PayrollComponent);
app.component("timeoff-component", TimeOffComponent);
app.component("attendance-component", AttendanceComponent);

app.mount("#app");
