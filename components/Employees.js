const EmployeesComponent = {
  data() {
    return {
      employees: [...employeesData],
      searchQuery: "",
      filterDepartment: "",
      selectedEmployee: null,
      showAddForm: false,
      newEmployee: {
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        employmentType: "Full-Time",
        startDate: "",
        salary: "",
        hoursPerWeek: 40,
        status: "Active",
        address: "",
        emergencyContact: "",
      },
    };
  },

  computed: {
    // Filtering employees based on search and department filter
    filteredEmployees() {
      return this.employees.filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          emp.position.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesDept =
          this.filterDepartment === "" ||
          emp.department === this.filterDepartment;
        return matchesSearch && matchesDept;
      });
    },

    // Gets unique departments for the filter dropdown
    departments() {
      return [...new Set(this.employees.map((e) => e.department))].sort();
    },
  },

  methods: {
    // detailed panel for one employee
    viewEmployee(emp) {
      this.selectedEmployee = { ...emp };
      this.showAddForm = false;
    },

    // Closes the detail panel
    closeDetail() {
      this.selectedEmployee = null;
    },

    // Adds a new employee
    addEmployee() {
      const errors = [];
      if (!this.newEmployee.name) errors.push("Name is required");
      if (!this.newEmployee.email) errors.push("Email is required");
      if (!this.newEmployee.department) errors.push("Department is required");
      if (!this.newEmployee.position) errors.push("Position is required");
      if (!this.newEmployee.salary) errors.push("Salary is required");
      if (!this.newEmployee.startDate) errors.push("Start date is required");

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const id = this.employees.length + 1;
      this.employees.push({
        ...this.newEmployee,
        id,
        salary: Number(this.newEmployee.salary),
      });
      this.newEmployee = {
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        employmentType: "Full-Time",
        startDate: "",
        salary: "",
        hoursPerWeek: 40,
        status: "Active",
        address: "",
        emergencyContact: "",
      };
      this.showAddForm = false;
      alert("Employee added successfully!");
    },

    // Format salary as ZAR currency
    formatSalary(amount) {
      return "R " + Number(amount).toLocaleString("en-ZA");
    },

    // Badge colour based on status
    statusBadge(status) {
      if (status === "Active") return "badge bg-success";
      if (status === "On Leave") return "badge bg-warning text-dark";
      return "badge bg-secondary";
    },

    // Calculate years of service
    yearsOfService(startDate) {
      const start = new Date(startDate);
      const now = new Date();
      const years = Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000));
      return years + (years === 1 ? " year" : " years");
    },
  },

  template: `
    <div>
      <!-- PAGE HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="mb-0">👥 Employees</h3>
          <small class="text-muted">{{ employees.length }} total employees</small>
        </div>
        <button class="btn btn-primary" @click="showAddForm = !showAddForm">
          + Add Employee
        </button>
      </div>

      <!-- ADD EMPLOYEE FORM -->
      <div v-if="showAddForm" class="card mb-4 border-primary">
        <div class="card-header bg-primary text-white fw-bold">
          New Employee
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Full Name *</label>
              <input v-model="newEmployee.name" type="text"
                class="form-control" placeholder="e.g. John Smith" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email *</label>
              <input v-model="newEmployee.email" type="email"
                class="form-control" placeholder="email@moderntech.co.za" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Phone</label>
              <input v-model="newEmployee.phone" type="text"
                class="form-control" placeholder="07X XXX XXXX" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Department *</label>
              <select v-model="newEmployee.department" class="form-select">
                <option value="">Select department</option>
                <option>Software Development</option>
                <option>Quality Assurance</option>
                <option>Human Resources</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Customer Support</option>
                <option>Finance</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Position *</label>
              <input v-model="newEmployee.position" type="text"
                class="form-control" placeholder="e.g. Senior Developer" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Employment Type</label>
              <select v-model="newEmployee.employmentType" class="form-select">
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Start Date *</label>
              <input v-model="newEmployee.startDate" type="date"
                class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Monthly Salary (R) *</label>
              <input v-model="newEmployee.salary" type="number"
                class="form-control" placeholder="e.g. 30000" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Address</label>
              <input v-model="newEmployee.address" type="text"
                class="form-control" placeholder="Street, City, Code" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Emergency Contact</label>
              <input v-model="newEmployee.emergencyContact" type="text"
                class="form-control" placeholder="Name — Number" />
            </div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button class="btn btn-success" @click="addEmployee">
              ✅ Save Employee
            </button>
            <button class="btn btn-outline-secondary"
              @click="showAddForm = false">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- SEARCH AND FILTER BAR -->
      <div class="row mb-3 g-2">
        <div class="col-md-6">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="🔍 Search by name, position or email..."
          />
        </div>
        <div class="col-md-4">
          <select v-model="filterDepartment" class="form-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept">{{ dept }}</option>
          </select>
        </div>
        <div class="col-md-2">
          <span class="form-control text-center bg-white text-muted">
            {{ filteredEmployees.length }} found
          </span>
        </div>
      </div>

      <!-- EMPLOYEE TABLE -->
      <div class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="emp in filteredEmployees" :key="emp.id">
                <td>{{ emp.id }}</td>
                <td class="fw-semibold">{{ emp.name }}</td>
                <td>{{ emp.department }}</td>
                <td>{{ emp.position }}</td>
                <td>{{ emp.employmentType }}</td>
                <td>{{ formatSalary(emp.salary) }}</td>
                <td>
                  <span :class="statusBadge(emp.status)">
                    {{ emp.status }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="viewEmployee(emp)">
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="8" class="text-center text-muted py-4">
                  No employees found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- EMPLOYEE DETAIL PANEL -->
      <div v-if="selectedEmployee" class="card mt-4 shadow border-0">
        <div class="card-header bg-dark text-white d-flex
          justify-content-between align-items-center">
          <span class="fw-bold">{{ selectedEmployee.name }}</span>
          <button class="btn btn-sm btn-outline-light"
            @click="closeDetail">✕ Close</button>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <p><strong>Email:</strong> {{ selectedEmployee.email }}</p>
              <p><strong>Phone:</strong> {{ selectedEmployee.phone }}</p>
              <p><strong>Address:</strong> {{ selectedEmployee.address }}</p>
              <p><strong>Emergency Contact:</strong>
                {{ selectedEmployee.emergencyContact }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Department:</strong>
                {{ selectedEmployee.department }}</p>
              <p><strong>Position:</strong> {{ selectedEmployee.position }}</p>
              <p><strong>Employment Type:</strong>
                {{ selectedEmployee.employmentType }}</p>
              <p><strong>Start Date:</strong> {{ selectedEmployee.startDate }}</p>
              <p><strong>Years of Service:</strong>
                {{ yearsOfService(selectedEmployee.startDate) }}</p>
              <p><strong>Monthly Salary:</strong>
                {{ formatSalary(selectedEmployee.salary) }}</p>
              <p><strong>Annual Salary:</strong>
                {{ formatSalary(selectedEmployee.salary * 12) }}</p>
              <p><strong>Status:</strong>
                <span :class="statusBadge(selectedEmployee.status)">
                  {{ selectedEmployee.status }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
};
