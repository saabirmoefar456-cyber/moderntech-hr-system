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
          submittedDate: "2026-06-01"
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
          submittedDate: "2026-06-16"
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
          submittedDate: "2026-06-18"
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
          submittedDate: "2026-06-15"
        },
        {
          id: 5,
          employeeId: 11,
          employeeName: "Dylan Petersen",
          department: "Marketing",
          type: "Sick
