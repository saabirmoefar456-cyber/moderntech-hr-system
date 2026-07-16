const TimeOffComponent = {
  data() {
    return {
      employees: [...employeesData],
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
      searchQuery: "",
      filterStatus: "",
    };
  },

  computed: {
    filteredRequests() {
      return this.leaveRequests.filter((r) => {
        const matchesSearch = r.employeeName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchesStatus =
          this.filterStatus === "" || r.status === this.filterStatus;
        return matchesSearch && matchesStatus;
      });
    },
    pendingCount() {
      return this.leaveRequests.filter((r) => r.status === "Pending").length;
    },
    approvedCount() {
      return this.leaveRequests.filter((r) => r.status === "Approved").length;
    },
    deniedCount() {
      return this.leaveRequests.filter((r) => r.status === "Denied").length;
    },
    totalDaysApproved() {
      return this.leaveRequests
        .filter((r) => r.status === "Approved")
        .reduce((sum, r) => sum + r.days, 0);
    },
  },

  methods: {
    approveRequest(req) {
      req.status = "Approved";
    },
    denyRequest(req) {
      req.status = "Denied";
    },
    resetToPending(req) {
      req.status = "Pending";
    },
    statusBadge(status) {
      if (status === "Approved") return "badge bg-success";
      if (status === "Pending") return "badge bg-warning text-dark";
      if (status === "Denied") return "badge bg-danger";
      return "badge bg-secondary";
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  template: `
    <div>
      <!-- PAGE HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="mb-0">🗓️ Time Off</h3>
          <small class="text-muted">Leave requests and approvals</small>
        </div>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card text-white bg-warning shadow-sm">
            <div class="card-body">
              <div class="small">Pending</div>
              <div class="fs-4 fw-bold">{{ pendingCount }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-success shadow-sm">
            <div class="card-body">
              <div class="small">Approved</div>
              <div class="fs-4 fw-bold">{{ approvedCount }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-danger shadow-sm">
            <div class="card-body">
              <div class="small">Denied</div>
              <div class="fs-4 fw-bold">{{ deniedCount }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-dark shadow-sm">
            <div class="card-body">
              <div class="small">Total Days Approved</div>
              <div class="fs-4 fw-bold">{{ totalDaysApproved }}</div>
            </div>
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
            placeholder="🔍 Search by employee name..."
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
            {{ filteredRequests.length }} shown
          </span>
        </div>
      </div>

      <!-- LEAVE REQUESTS TABLE -->
      <div class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in filteredRequests" :key="req.id">
                <td class="fw-semibold">{{ req.employeeName }}</td>
                <td>{{ req.department }}</td>
                <td>{{ req.type }}</td>
                <td>
                  {{ formatDate(req.startDate) }} –
                  {{ formatDate(req.endDate) }}
                </td>
                <td>{{ req.days }}</td>
                <td>{{ req.reason }}</td>
                <td>
                  <span :class="statusBadge(req.status)">
                    {{ req.status }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1" v-if="req.status === 'Pending'">
                    <button
                      class="btn btn-sm btn-success"
                      @click="approveRequest(req)">
                      ✅ Approve
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="denyRequest(req)">
                      ❌ Deny
                    </button>
                  </div>
                  <button
                    v-else
                    class="btn btn-sm btn-outline-secondary"
                    @click="resetToPending(req)">
                    ↺ Reset
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRequests.length === 0">
                <td colspan="8" class="text-center text-muted py-4">
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
