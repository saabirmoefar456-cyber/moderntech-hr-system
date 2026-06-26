const TimeOffComponent = {
  data() {
    return {
      employees: [...employeesData],

      // All leave requests stored here
      leaveRequests: [
        {
          id: 1,
          employeeId: 14,
          employeeName: "Chantal Rousseau",
          department: "Human Resources",
          type: "Annual Leave",
          startDate: "2026-06-10",
          endDate: "2026-06-20",
          days: 10,
          reason: "Family vacation",
          status: "Approved",
          submittedDate: "2026-06-01",
        },
        {
          id: 2,
          employeeId: 5,
          employeeName: "Kagiso Sithole",
          department: "Software Development",
          type: "Sick Leave",
          startDate: "2026-06-17",
          endDate: "2026-06-18",
          days: 2,
          reason: "Medical appointment",
          status: "Pending",
          submittedDate: "2026-06-16",
        },
        {
          id: 3,
          employeeId: 8,
          employeeName: "Nompumelelo Dlamini",
          department: "Finance",
          type: "Family Responsibility",
          startDate: "2026-06-19",
          endDate: "2026-06-19",
          days: 1,
          reason: "Child school event",
          status: "Pending",
          submittedDate: "2026-06-18",
        },
        {
          id: 4,
          employeeId: 3,
          employeeName: "Sipho Ndlovu",
          department: "Human Resources",
          type: "Annual Leave",
          startDate: "2026-07-01",
          endDate: "2026-07-05",
          days: 5,
          reason: "Personal travel",
          status: "Pending",
          submittedDate: "2026-06-15",
        },
        {
          id: 5,
          employeeId: 11,
          employeeName: "Dylan Petersen",
          department: "Marketing",
          type: "Sick Leave",
          startDate: "2026-06-05",
          endDate: "2026-06-06",
          days: 2,
          reason: "Flu",
          status: "Approved",
          submittedDate: "2026-06-05",
        },
      ],

      // New leave request form
      newRequest: {
        employeeId: "",
        type: "Annual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      },

      showForm: false,
      filterStatus: "",
      searchQuery: "",
    };
  },

  computed: {
    // Filter requests by status and search
    filteredRequests() {
      return this.leaveRequests.filter((req) => {
        const matchesStatus =
          this.filterStatus === "" || req.status === this.filterStatus;
        const matchesSearch =
          req.employeeName
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          req.type.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });
    },

    // Count requests by status for summary cards
    pendingCount() {
      return this.leaveRequests.filter((r) => r.status === "Pending").length;
    },
    approvedCount() {
      return this.leaveRequests.filter((r) => r.status === "Approved").length;
    },
    deniedCount() {
      return this.leaveRequests.filter((r) => r.status === "Denied").length;
    },
  },

  methods: {
    // Calculate number of days between two dates
    calculateDays(start, end) {
      if (!start || !end) return 0;
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = endDate - startDate;
      return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    },

    // Submit a new leave request
    submitRequest() {
      // Form validation
      const errors = [];
      if (!this.newRequest.employeeId) errors.push("Please select an employee");
      if (!this.newRequest.startDate) errors.push("Start date is required");
      if (!this.newRequest.endDate) errors.push("End date is required");
      if (!this.newRequest.reason) errors.push("Reason is required");
      if (
        this.newRequest.startDate &&
        this.newRequest.endDate &&
        this.newRequest.endDate < this.newRequest.startDate
      )
        errors.push("End date cannot be before start date");

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      // Find the selected employee
      const emp = this.employees.find(
        (e) => e.id === Number(this.newRequest.employeeId),
      );

      // Build the new request object
      const request = {
        id: this.leaveRequests.length + 1,
        employeeId: Number(this.newRequest.employeeId),
        employeeName: emp.name,
        department: emp.department,
        type: this.newRequest.type,
        startDate: this.newRequest.startDate,
        endDate: this.newRequest.endDate,
        days: this.calculateDays(
          this.newRequest.startDate,
          this.newRequest.endDate,
        ),
        reason: this.newRequest.reason,
        status: "Pending",
        submittedDate: new Date().toISOString().slice(0, 10),
      };

      this.leaveRequests.push(request);

      // Reset form
      this.newRequest = {
        employeeId: "",
        type: "Annual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      };
      this.showForm = false;
      alert("Leave request submitted successfully!");
    },

    // Approve a request
    approveRequest(request) {
      request.status = "Approved";

      // Update the employee status to On Leave
      // if leave is currently active
      const today = new Date().toISOString().slice(0, 10);
      if (request.startDate <= today && request.endDate >= today) {
        const emp = this.employees.find((e) => e.id === request.employeeId);
        if (emp) emp.status = "On Leave";
      }
    },

    // Deny a request
    denyRequest(request) {
      request.status = "Denied";
    },

    // Badge colour for status
    statusBadge(status) {
      if (status === "Approved") return "badge bg-success";
      if (status === "Pending") return "badge bg-warning text-dark";
      if (status === "Denied") return "badge bg-danger";
      return "badge bg-secondary";
    },

    // Badge colour for leave type
    typeBadge(type) {
      if (type === "Annual Leave") return "badge bg-primary";
      if (type === "Sick Leave") return "badge bg-info text-dark";
      if (type === "Family Responsibility") return "badge bg-secondary";
      return "badge bg-dark";
    },
  },

  template: `
    <div>
      <!-- PAGE HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="mb-0">🗓️ Time Off</h3>
          <small class="text-muted">
            Leave request management
          </small>
        </div>
        <button
          class="btn btn-primary"
          @click="showForm = !showForm">
          + New Request
        </button>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card text-white bg-warning shadow-sm">
            <div class="card-body d-flex
              justify-content-between align-items-center">
              <div>
                <div class="small">Pending</div>
                <div class="fs-3 fw-bold">{{ pendingCount }}</div>
              </div>
              <div class="fs-1 opacity-50">⏳</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-success shadow-sm">
            <div class="card-body d-flex
              justify-content-between align-items-center">
              <div>
                <div class="small">Approved</div>
                <div class="fs-3 fw-bold">{{ approvedCount }}</div>
              </div>
              <div class="fs-1 opacity-50">✅</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-danger shadow-sm">
            <div class="card-body d-flex
              justify-content-between align-items-center">
              <div>
                <div class="small">Denied</div>
                <div class="fs-3 fw-bold">{{ deniedCount }}</div>
              </div>
              <div class="fs-1 opacity-50">❌</div>
            </div>
          </div>
        </div>
      </div>

      <!-- NEW REQUEST FORM -->
      <div v-if="showForm" class="card mb-4 border-primary">
        <div class="card-header bg-primary text-white fw-bold">
          New Leave Request
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Employee *</label>
              <select
                v-model="newRequest.employeeId"
                class="form-select">
                <option value="">Select employee</option>
                <option
                  v-for="emp in employees"
                  :key="emp.id"
                  :value="emp.id">
                  {{ emp.name }} — {{ emp.department }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Leave Type *</label>
              <select
                v-model="newRequest.type"
                class="form-select">
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Family Responsibility</option>
                <option>Unpaid Leave</option>
                <option>Study Leave</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Start Date *</label>
              <input
                v-model="newRequest.startDate"
                type="date"
                class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">End Date *</label>
              <input
                v-model="newRequest.endDate"
                type="date"
                class="form-control" />
            </div>

            <!-- Live day counter -->
            <div class="col-12" v-if="newRequest.startDate
              && newRequest.endDate">
              <div class="alert alert-info mb-0">
                📅 Total days requested:
                <strong>
                  {{ calculateDays(
                    newRequest.startDate,
                    newRequest.endDate) }} day(s)
                </strong>
              </div>
            </div>

            <div class="col-12">
              <label class="form-label">Reason *</label>
              <textarea
                v-model="newRequest.reason"
                class="form-control"
                rows="3"
                placeholder="Briefly explain the reason for leave...">
              </textarea>
            </div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button
              class="btn btn-success"
              @click="submitRequest">
              ✅ Submit Request
            </button>
            <button
              class="btn btn-outline-secondary"
              @click="showForm = false">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- SEARCH AND FILTER -->
      <div class="row mb-3 g-2">
        <div class="col-md-6">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="🔍 Search by name or leave type..."
          />
        </div>
        <div class="col-md-4">
          <select v-model="filterStatus" class="form-select">
            <option value="">All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Denied</option>
          </select>
        </div>
        <div class="col-md-2">
          <span class="form-control text-center bg-white text-muted">
            {{ filteredRequests.length }} requests
          </span>
        </div>
      </div>

      <!-- REQUESTS TABLE -->
      <div class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="req in filteredRequests"
                :key="req.id">
                <td class="fw-semibold">{{ req.employeeName }}</td>
                <td>{{ req.department }}</td>
                <td>
                  <span :class="typeBadge(req.type)">
                    {{ req.type }}
                  </span>
                </td>
                <td>{{ req.startDate }}</td>
                <td>{{ req.endDate }}</td>
                <td class="text-center">{{ req.days }}</td>
                <td>
                  <small class="text-muted">{{ req.reason }}</small>
                </td>
                <td>
                  <span :class="statusBadge(req.status)">
                    {{ req.status }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <button
                      v-if="req.status === 'Pending'"
                      class="btn btn-sm btn-success"
                      @click="approveRequest(req)">
                      ✓
                    </button>
                    <button
                      v-if="req.status === 'Pending'"
                      class="btn btn-sm btn-danger"
                      @click="denyRequest(req)">
                      ✕
                    </button>
                    <span
                      v-if="req.status !== 'Pending'"
                      class="text-muted small">
                      —
                    </span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRequests.length === 0">
                <td colspan="9"
                  class="text-center text-muted py-4">
                  No leave requests found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
};
