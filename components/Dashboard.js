const DashboardComponent = {
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
      attendanceSummary: {
        present: 11,
        absent: 3,
        late: 2,
        total: 16,
      },
      currentTime: "",
    };
  },

  computed: {
    totalPayroll() {
      return this.employees.reduce((sum, e) => sum + Number(e.salary), 0);
    },
    departmentBreakdown() {
      const depts = {};
      this.employees.forEach((emp) => {
        if (!depts[emp.department]) {
          depts[emp.department] = { count: 0, totalSalary: 0 };
        }
        depts[emp.department].count++;
        depts[emp.department].totalSalary += Number(emp.salary);
      });
      return Object.entries(depts)
        .map(([name, data]) => ({
          name,
          count: data.count,
          totalSalary: data.totalSalary,
        }))
        .sort((a, b) => b.count - a.count);
    },
    pendingLeave() {
      return this.leaveRequests.filter((r) => r.status === "Pending");
    },
    activeEmployees() {
      return this.employees.filter((e) => e.status === "Active").length;
    },
    onLeaveEmployees() {
      return this.employees.filter((e) => e.status === "On Leave").length;
    },
    attendanceRate() {
      const present =
        this.attendanceSummary.present + this.attendanceSummary.late;
      return Math.round((present / this.attendanceSummary.total) * 100);
    },
    recentHires() {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return this.employees
        .filter((e) => new Date(e.startDate) >= twoYearsAgo)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 4);
    },
  },

  methods: {
    formatSalary(amount) {
      return "R " + Number(amount).toLocaleString("en-ZA");
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    formatToday() {
      return new Date().toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    statusBadge(status) {
      if (status === "Approved") return "badge bg-success";
      if (status === "Pending") return "badge bg-warning text-dark";
      if (status === "Denied") return "badge bg-danger";
      return "badge bg-secondary";
    },
    deptBarWidth(count) {
      const max = Math.max(...this.departmentBreakdown.map((d) => d.count));
      return Math.round((count / max) * 100) + "%";
    },
  },

  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },

  template: `
    <div>
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 class="mb-0">📊 Dashboard</h3>
          <small class="text-muted">{{ formatToday() }}</small>
        </div>
        <div class="text-end">
          <div class="fs-4 fw-bold text-primary">{{ currentTime }}</div>
          <small class="text-muted">Current Time</small>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card shadow-sm border-0 bg-primary text-white">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="small opacity-75">Total Employees</div>
                <div class="fs-2 fw-bold">{{ employees.length }}</div>
              </div>
              <div class="fs-1 opacity-50">👥</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm border-0 bg-success text-white">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="small opacity-75">Active Employees</div>
                <div class="fs-2 fw-bold">{{ activeEmployees }}</div>
              </div>
              <div class="fs-1 opacity-50">✅</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm border-0 bg-warning text-dark">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="small opacity-75">On Leave</div>
                <div class="fs-2 fw-bold">{{ onLeaveEmployees }}</div>
              </div>
              <div class="fs-1 opacity-50">🗓️</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm border-0 bg-dark text-white">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="small opacity-75">Monthly Payroll</div>
                <div class="fs-5 fw-bold">{{ formatSalary(totalPayroll) }}</div>
              </div>
              <div class="fs-1 opacity-50">💰</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-5">
          <div class="card shadow-sm h-100">
            <div class="card-header fw-bold bg-light">
              ✅ Today's Attendance
            </div>
            <div class="card-body">
              <div class="row g-2 mb-3">
                <div class="col-4 text-center">
                  <div class="fs-3 fw-bold text-success">
                    {{ attendanceSummary.present }}
                  </div>
                  <small class="text-muted">Present</small>
                </div>
                <div class="col-4 text-center">
                  <div class="fs-3 fw-bold text-danger">
                    {{ attendanceSummary.absent }}
                  </div>
                  <small class="text-muted">Absent</small>
                </div>
                <div class="col-4 text-center">
                  <div class="fs-3 fw-bold text-warning">
                    {{ attendanceSummary.late }}
                  </div>
                  <small class="text-muted">Late</small>
                </div>
              </div>
              <div class="mb-1 d-flex justify-content-between">
                <small>Attendance Rate</small>
                <small class="fw-bold">{{ attendanceRate }}%</small>
              </div>
              <div class="progress mb-3" style="height: 12px;">
                <div
                  class="progress-bar bg-success"
                  :style="'width:' + attendanceRate + '%'">
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="text-success">■ Present</small>
                <small>{{ attendanceSummary.present }} / {{ attendanceSummary.total }}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="text-danger">■ Absent</small>
                <small>{{ attendanceSummary.absent }} / {{ attendanceSummary.total }}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-warning">■ Late</small>
                <small>{{ attendanceSummary.late }} / {{ attendanceSummary.total }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-7">
          <div class="card shadow-sm h-100">
            <div class="card-header fw-bold bg-light d-flex justify-content-between">
              <span>⏳ Pending Leave Requests</span>
              <span class="badge bg-warning text-dark">
                {{ pendingLeave.length }}
              </span>
            </div>
            <div class="card-body p-0">
              <div v-if="pendingLeave.length === 0"
                class="text-center text-muted p-4">
                No pending requests
              </div>
              <ul class="list-group list-group-flush">
                <li
                  v-for="req in pendingLeave"
                  :key="req.id"
                  class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="fw-semibold">{{ req.employeeName }}</div>
                      <small class="text-muted">
                        {{ req.type }} · {{ req.days }} day(s) · {{ req.startDate }}
                      </small>
                    </div>
                    <span :class="statusBadge(req.status)">
                      {{ req.status }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header fw-bold bg-light">
              🏢 Employees by Department
            </div>
            <div class="card-body">
              <div
                v-for="dept in departmentBreakdown"
                :key="dept.name"
                class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <small class="fw-semibold">{{ dept.name }}</small>
                  <small class="text-muted">{{ dept.count }} employee(s)</small>
                </div>
                <div class="progress" style="height: 10px;">
                  <div
                    class="progress-bar bg-primary"
                    :style="'width:' + deptBarWidth(dept.count)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header fw-bold bg-light">
              🆕 Recent Hires
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-for="emp in recentHires"
                :key="emp.id"
                class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="fw-semibold">{{ emp.name }}</div>
                    <small class="text-muted">
                      {{ emp.position }} · {{ emp.department }}
                    </small>
                  </div>
                  <small class="text-muted">{{ emp.startDate }}</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0 bg-dark text-white">
        <div class="card-body">
          <div class="row text-center g-3">
            <div class="col-md-3">
              <div class="small opacity-75">Total Employees</div>
              <div class="fs-4 fw-bold">{{ employees.length }}</div>
            </div>
            <div class="col-md-3">
              <div class="small opacity-75">Monthly Gross Payroll</div>
              <div class="fs-5 fw-bold text-success">
                {{ formatSalary(totalPayroll) }}
              </div>
            </div>
            <div class="col-md-3">
              <div class="small opacity-75">Annual Gross Payroll</div>
              <div class="fs-5 fw-bold text-warning">
                {{ formatSalary(totalPayroll * 12) }}
              </div>
            </div>
            <div class="col-md-3">
              <div class="small opacity-75">Avg Monthly Salary</div>
              <div class="fs-5 fw-bold text-info">
                {{ formatSalary(Math.round(totalPayroll / employees.length)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
