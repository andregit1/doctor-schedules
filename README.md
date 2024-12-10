## Overview

A RESTful API for doctor schedule management.

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v22.12.0)
- **PostgreSQL** (v14.15)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:andregit1/doctor-schedules.git
cd doctor-schedules
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file with the following content:

```
POSTGRES_DB=doctor_schedule
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
DB_HOST=127.0.0.1
PORT=3000
SERVER_URL=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_EXPIRED=30m
```

Replace the placeholder values with valid credentials.

### 4. Database Setup

Initialize Sequelize and set up the database:

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

### 5. Start the Server

Start the API in development mode:

```bash
npm run dev
```

### 6. Access API Documentation

Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to explore the API using Swagger UI.

---

### 7. Scenario Overview

#### Input Details:

- **Existing Schedule in DB**: `2024-12-16`, `08:00-12:00` for **Doctor ID 1**.
- **Payload Schedule**: `2024-12-01 to 2024-12-31`, `09:00-17:00` for **Doctor ID 1**.
- **Payload Example**:
  ```json
  {
  	"doctor_id": 1,
  	"day": "Monday",
  	"time_start": "09:00",
  	"time_finish": "17:00",
  	"quota": 10,
  	"status": true,
  	"dateRange": "2024-12-01 to 2024-12-31"
  }
  ```

#### Logic:

1. **Same Date & Time Overlap**: New schedules overlapping with existing ones for the same doctor on the same date will be skipped.
2. **No Overlap**: New schedules outside of existing schedules or for different doctors are allowed.
3. **Date Range Check**: The payload's date range (`2024-12-01` to `2024-12-31`) is filtered for valid schedules.

---

#### Decision Matrix

| **Date**   | **Doctor ID** | **Existing Schedule** | **Payload Schedule** | **Result**    | **Reason**                                                     |
| ---------- | ------------- | --------------------- | -------------------- | ------------- | -------------------------------------------------------------- |
| 2024-12-01 | 1             | N/A                   | 09:00-17:00          | **Valid**     | No existing schedule for Doctor ID 1.                          |
| 2024-12-02 | 1             | N/A                   | 09:00-17:00          | **Valid**     | No existing schedule for Doctor ID 1.                          |
| 2024-12-16 | 1             | 08:00-12:00           | 09:00-17:00          | **Not Valid** | Overlaps with existing schedule `08:00-12:00` for Doctor ID 1. |
| 2024-12-17 | 1             | N/A                   | 09:00-17:00          | **Valid**     | No existing schedule for Doctor ID 1.                          |
| 2024-12-31 | 1             | N/A                   | 09:00-17:00          | **Valid**     | No existing schedule for Doctor ID 1.                          |

---

#### Explanation:

1. **Valid Schedules**: Created if no overlap exists between the `time_start` and `time_finish` for the same doctor on the same date.
2. **Not Valid Schedules**: Skipped if any overlap exists with an existing schedule for the same doctor on the same date.

---

#### **Valid Schedule Criteria**

| Criteria                | Validation Logic                                                                     | Valid Example                                    | Invalid Example                                                  |
| ----------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| **Day Validation**      | Must match valid days in **English** or **Indonesian**. **Case insensitive**.        | `monday`, `senin`                                | `mondy`, `senon`                                                 |
| **Time Range**          | Must not overlap with existing schedules for the same doctor on the same date.       | `09:00-12:00` if no overlap                      | `09:00-10:00` if overlaps with `08:00-12:00` for the same doctor |
| **Date Range**          | Must fall within the specified payload date range (`start_date` to `end_date`).      | `2024-12-01` in range `2024-12-01 to 2024-12-31` | `2025-01-01` outside range                                       |
| **Doctor Availability** | The `doctor_id` must exist in the database (linked to an active doctor profile).     | `doctor_id = 1` if exists                        | `doctor_id = 999` if not found                                   |
| **Quota**               | The quota must be a positive integer.                                                | `10`                                             | `-5`, `abc`                                                      |
| **Day Consistency**     | The schedule date must match the expected day (e.g., `2024-12-01` must be a Sunday). | `sunday` for `2024-12-01`                        | `monday` for `2024-12-01`                                        |

---

#### **Validation Table**

| Record # | Date       | Day       | Time Start | Time End | Quota | Doctor ID | Valid?  | Reason                                                                             |
| -------- | ---------- | --------- | ---------- | -------- | ----- | --------- | ------- | ---------------------------------------------------------------------------------- |
| 1        | 2024-12-01 | Sunday    | 09:00      | 12:00    | 10    | 1         | **Yes** | Matches valid day, time range, date range, quota, and doctor availability.         |
| 2        | 2024-12-02 | Monday    | 10:00      | 11:00    | 15    | 1         | **Yes** | All criteria satisfied.                                                            |
| 3        | 2024-12-03 | Tuesday   | 08:00      | 09:00    | 20    | 999       | **No**  | Invalid `doctor_id`; doctor not found in the database.                             |
| 4        | 2024-12-16 | Monday    | 09:00      | 17:00    | 5     | 1         | **No**  | Overlaps with existing schedule (`08:00-12:00`) for Doctor ID 1.                   |
| 5        | 2025-01-01 | Wednesday | 09:00      | 12:00    | 10    | 1         | **No**  | Date outside the valid range (`2024-12-01 to 2024-12-31`).                         |
| 6        | 2024-12-01 | Monday    | 09:00      | 12:00    | 10    | 1         | **No**  | `day` is inconsistent with the actual date (`2024-12-01` is a Sunday, not Monday). |

---
