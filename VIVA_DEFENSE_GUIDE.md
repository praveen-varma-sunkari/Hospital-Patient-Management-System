# Bheeshma Healthcare
## Intelligent Queue & Emergency Triage Portal (HPMS)
### Academic Viva & Demo Defense Guide

---

### 1. Data Structure Selection Rationale

| Data Structure | Component / Role | Time Complexity | Why Chosen over Alternatives? |
| :--- | :--- | :--- | :--- |
| **`std::vector<Patient>`** | Master Patient Registry | Insertion: $O(1)$ amortized<br>Random Access: $O(1)$ | Contiguous memory allocation ensures cache locality. Superior for iterating, generating reports, and performing sorting operations compared to linked lists. |
| **`std::priority_queue`** (Binary Max-Heap) | Dynamic Triage Waiting Queue | Top Access: $O(1)$<br>Enqueue/Dequeue: $O(\log N)$ | Automatically maintains priority order based on medical urgency. Guarantees that Emergency cases jump ahead of Normal cases instantly without $O(N)$ scanning. |
| **Custom Priority Comparator** | Multi-Tier Triage + FIFO Stability | Comparison: $O(1)$ | Combines `TriageLevel` severity with `arrivalSequence`. Guarantees strict FIFO (First-In, First-Out) fairness among patients sharing the exact same triage urgency level. |
| **Binary Search Algorithm** | Instant Record Search by ID | Search: $O(\log N)$ | Sorting the vector prior to lookup allows binary search ($O(\log N)$) instead of linear scanning ($O(N)$), crucial for large scale hospital registries. |
| **`std::sort` with Lambdas** | Multi-Criteria Reporting | Time: $O(N \log N)$<br>Space: $O(\log N)$ | Utilizes Introsort (hybrid of Quicksort, Heapsort, and Insertion Sort) provided by C++ STL. Custom lambda functions allow flexible sorting on demand (ID, Age, Severity). |

---

### 2. Time & Space Complexity Analysis

#### Time Complexity Summary
- **Patient Registration:** $O(\log N)$ to insert into priority queue + $O(1)$ amortized push to registry vector.
- **Process Next Patient (Dequeue):** $O(\log N)$ to pop top priority patient from max-heap.
- **Search by ID (Binary Search):** $O(N \log N)$ for initial sorting + $O(\log N)$ binary search execution.
- **Appointment Cancellation:** $O(N)$ to locate and flag record + $O(N)$ to rebuild priority queue.
- **Sorting Reports:** $O(N \log N)$ using `std::sort`.
- **Analytics Aggregation:** $O(N)$ single pass over master registry.

#### Space Complexity Summary
- **Overall Space Complexity:** $O(N)$, where $N$ is the total number of registered patients.
- Data overhead per patient record: $\approx 120 \text{ bytes}$ (fixed struct memory layout).

---

### 3. Step-by-Step Edge Case Demonstration Script for Evaluators

#### Demo Case 1: Dynamic Triage Priority Preemption (Emergency Jump)
1. Register Patient A (Normal Triage, ID: `1001`, Age: `25`).
2. Register Patient B (Urgent Triage, ID: `1002`, Age: `30`).
3. Register Patient C (Emergency Triage, ID: `1003`, Age: `60`).
4. Select **Option 2 (Process Next Patient)** or click **"Process Next Patient"** on React dashboard.
   * *Expected Result:* System calls **Patient C (Emergency)** first, despite Patient A and B registering earlier!
5. Select **Option 2** again -> Calls Patient B (Urgent).
6. Select **Option 2** again -> Calls Patient A (Normal).

#### Demo Case 2: Defensive Input & Stream Corruption Prevention
1. Select **Option 1 (Register Patient)**.
2. When prompted for Patient ID in C++ console, enter letters: `abc` or special symbols `@#$`.
   * *Expected Result:* System intercepts `std::cin.fail()`, outputs `[!] Invalid input type`, clears error flags, flushes input buffer, and re-prompts safely without entering an infinite loop.
3. Enter negative age `-25` or overflow value `999`.
   * *Expected Result:* Intercepted by range validation guard.

#### Demo Case 3: Duplicate ID Prevention
1. Attempt to register a patient with ID `101` (pre-seeded ID).
   * *Expected Result:* System rejects entry: `[!] Error: Patient ID #101 already exists in system database`.

#### Demo Case 4: Empty Queue Dequeue
1. Call **Option 2 (Process Next Patient)** until all patients are served.
2. Call **Option 2** one more time when 0 patients are queued.
   * *Expected Result:* Graceful intercept: `[i] QUEUE EMPTY: There are no patients currently waiting in the queue.` (No segment fault or memory exception).

---

### 4. Anticipated Academic Viva Questions & Model Answers

**Q1: Why did you use `std::priority_queue` instead of a simple `std::queue` or `std::list`?**
> *Answer:* A simple `std::queue` operates strictly on FIFO (First-In, First-Out), which fails in medical triage where life-threatening emergency cases must be prioritized over earlier routine appointments. Using a linked list would require an $O(N)$ linear scan for every insertion to find the correct priority position. A max-heap based `std::priority_queue` achieves $O(\log N)$ enqueuing and dequeuing while ensuring high-priority patients are served immediately.

**Q2: How do you prevent a patient who arrives later with Normal priority from starving, or ensure fairness among equal priority patients?**
> *Answer:* We enforced FIFO stability within identical priority tiers by embedding a monotonically increasing `arrivalSequence` counter in each `Patient` record. In our custom comparator `PatientPriorityComparator`, if `a.triage == b.triage`, the comparator compares `arrivalSequence`. The patient with the smaller sequence number (arrived earlier) is placed higher in priority queue service order.

**Q3: How does your search algorithm achieve $O(\log N)$ time complexity?**
> *Answer:* We implement Binary Search via `searchPatientBinarySearch()`. Prior to searching, the master registry `std::vector` is sorted by Patient ID using `std::sort()`. The binary search iteratively divides the search interval in half ($mid = low + (high - low)/2$), reducing candidate elements exponentially from $N$ to $\log_2 N$.

**Q4: How does your input validation handle buffer overflow and invalid input types?**
> *Answer:* We built an `InputValidator` abstraction class. We evaluate `std::cin.fail()`. If an incorrect type is entered (e.g., text into an integer field), we call `std::cin.clear()` to reset error bit flags, and `std::cin.ignore(numeric_limits<streamsize>::max(), '\n')` to discard all malformed characters up to the newline. This completely eliminates infinite prompt looping bugs.

---
