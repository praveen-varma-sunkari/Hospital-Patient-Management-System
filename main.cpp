/**
 * =====================================================================================
 * SYSTEM: Bheeshma Healthcare - Intelligent Queue & Emergency Triage Portal
 * ARCHITECTURE: Object-Oriented & Modular Design (Modern C++17/20)
 * AUTHOR: Full-Stack Software Architect & CS Professor
 * DESCRIPTION: Production-grade console application utilizing STL vectors, priority 
 *              queues, binary searching, and dynamic lambda sorting algorithms.
 * =====================================================================================
 */

#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <algorithm>
#include <iomanip>
#include <limits>
#include <chrono>
#include <ctime>
#include <sstream>
#include <optional>

// =====================================================================================
// MODULE 1: DOMAIN MODEL & DATA STRUCTURE DEFINITIONS
// =====================================================================================

/**
 * @enum TriageLevel
 * @brief Represents medical priority tier for patient admission.
 */
enum class TriageLevel {
    NORMAL = 1,      // Routine checkup / minor symptoms
    URGENT = 2,      // Significant condition needing prompt care
    EMERGENCY = 3    // Critical / Life-threatening emergency
};

/**
 * @struct Patient
 * @brief Domain entity encapsulating patient demographics, medical status, and metadata.
 */
struct Patient {
    int id;                       // Unique positive integer identifier
    std::string name;             // Full name
    int age;                      // Age in years
    std::string condition;        // Diagnosis / Medical reason
    TriageLevel triage;           // Triage priority level
    uint64_t arrivalSequence;    // Sequence counter for FIFO ordering within same triage level
    std::string registrationTime; // Formatted timestamp of entry
    bool isActive;                // Status flag (true = active/queued, false = cancelled/processed)

    /**
     * @brief Converts triage enum value to human-readable string.
     */
    std::string getTriageString() const {
        switch (triage) {
            case TriageLevel::EMERGENCY: return "EMERGENCY (P1)";
            case TriageLevel::URGENT:    return "URGENT    (P2)";
            case TriageLevel::NORMAL:    return "NORMAL    (P3)";
            default:                     return "UNKNOWN";
        }
    }

    /**
     * @brief Formats patient details into a multi-line textual summary.
     */
    void printDetailedCard() const {
        std::cout << "\n+-------------------------------------------------------------+\n";
        std::cout << "|              BHEESHMA HEALTHCARE PATIENT CARD               |\n";
        std::cout << "+-------------------------------------------------------------+\n";
        std::cout << "| Patient ID           : " << std::left << std::setw(36) << id << "|\n";
        std::cout << "| Full Name            : " << std::left << std::setw(36) << name << "|\n";
        std::cout << "| Age                  : " << std::left << std::setw(36) << age << "|\n";
        std::cout << "| Medical Condition    : " << std::left << std::setw(36) << condition << "|\n";
        std::cout << "| Triage Category      : " << std::left << std::setw(36) << getTriageString() << "|\n";
        std::cout << "| Registration Time    : " << std::left << std::setw(36) << registrationTime << "|\n";
        std::cout << "| Status               : " << std::left << std::setw(36) << (isActive ? "QUEUED / WAITING" : "SERVED / CANCELLED") << "|\n";
        std::cout << "+-------------------------------------------------------------+\n";
    }
};

/**
 * @struct PatientPriorityComparator
 * @brief Custom priority queue comparator enforcing Triage Severity + Arrival FIFO ordering.
 */
struct PatientPriorityComparator {
    bool operator()(const Patient& a, const Patient& b) const {
        if (a.triage != b.triage) {
            return static_cast<int>(a.triage) < static_cast<int>(b.triage);
        }
        return a.arrivalSequence > b.arrivalSequence;
    }
};

// =====================================================================================
// MODULE 2: DEFENSIVE INPUT VALIDATION UTILITY
// =====================================================================================

class InputValidator {
public:
    static int readInt(const std::string& prompt, int minVal = std::numeric_limits<int>::min(), int maxVal = std::numeric_limits<int>::max()) {
        int value;
        while (true) {
            std::cout << prompt;
            if (std::cin >> value) {
                if (value >= minVal && value <= maxVal) {
                    clearBuffer();
                    return value;
                }
                std::cout << " [!] Input out of bounds. Please enter a value between " << minVal << " and " << maxVal << ".\n";
            } else {
                std::cout << " [!] Invalid input type. Please enter a valid integer.\n";
                std::cin.clear();
                clearBuffer();
            }
        }
    }

    static std::string readString(const std::string& prompt, bool allowEmpty = false) {
        std::string line;
        while (true) {
            std::cout << prompt;
            std::getline(std::cin, line);
            
            size_t first = line.find_first_not_of(" \t\r\n");
            if (first == std::string::npos) {
                line = "";
            } else {
                size_t last = line.find_last_not_of(" \t\r\n");
                line = line.substr(first, (last - first + 1));
            }

            if (!line.empty() || allowEmpty) {
                return line;
            }
            std::cout << " [!] Field cannot be empty. Please enter valid text.\n";
        }
    }

    static void clearBuffer() {
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
};

// =====================================================================================
// MODULE 3: CORE BUSINESS LOGIC & DATA REGISTRY MANAGEMENT
// =====================================================================================

class HospitalRegistryManager {
private:
    std::vector<Patient> masterRegistry;
    std::priority_queue<Patient, std::vector<Patient>, PatientPriorityComparator> waitingQueue;
    uint64_t sequenceCounter;

    std::string getCurrentTimestamp() const {
        auto now = std::chrono::system_clock::now();
        std::time_t now_c = std::chrono::system_clock::to_time_t(now);
        struct tm parts;
#if defined(_WIN32) || defined(_WIN64)
        localtime_s(&parts, &now_c);
#else
        localtime_r(&now_c, &parts);
#endif
        std::ostringstream oss;
        oss << std::put_time(&parts, "%Y-%m-%d %H:%M:%S");
        return oss.str();
    }

    void ensureSortedByID() {
        std::sort(masterRegistry.begin(), masterRegistry.end(), [](const Patient& a, const Patient& b) {
            return a.id < b.id;
        });
    }

public:
    HospitalRegistryManager() : sequenceCounter(0) {}

    bool existsID(int id) const {
        return std::any_of(masterRegistry.begin(), masterRegistry.end(), [id](const Patient& p) {
            return p.id == id;
        });
    }

    bool registerPatient(int id, const std::string& name, int age, const std::string& condition, TriageLevel triage) {
        if (existsID(id)) {
            return false;
        }

        sequenceCounter++;
        Patient p{
            id,
            name,
            age,
            condition,
            triage,
            sequenceCounter,
            getCurrentTimestamp(),
            true
        };

        masterRegistry.push_back(p);
        waitingQueue.push(p);
        return true;
    }

    std::optional<Patient> processNextPatient() {
        while (!waitingQueue.empty()) {
            Patient topPatient = waitingQueue.top();
            waitingQueue.pop();

            auto it = std::find_if(masterRegistry.begin(), masterRegistry.end(), [topPatient](const Patient& p) {
                return p.id == topPatient.id;
            });

            if (it != masterRegistry.end() && it->isActive) {
                it->isActive = false;
                return *it;
            }
        }
        return std::nullopt;
    }

    std::optional<Patient> searchPatientBinarySearch(int id) {
        ensureSortedByID();

        int low = 0;
        int high = static_cast<int>(masterRegistry.size()) - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (masterRegistry[mid].id == id) {
                return masterRegistry[mid];
            }
            if (masterRegistry[mid].id < id) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return std::nullopt;
    }

    bool cancelAppointment(int id) {
        auto it = std::find_if(masterRegistry.begin(), masterRegistry.end(), [id](const Patient& p) {
            return p.id == id;
        });

        if (it == masterRegistry.end() || !it->isActive) {
            return false;
        }

        it->isActive = false;
        rebuildQueue();
        return true;
    }

    void rebuildQueue() {
        std::priority_queue<Patient, std::vector<Patient>, PatientPriorityComparator> newQueue;
        for (const auto& p : masterRegistry) {
            if (p.isActive) {
                newQueue.push(p);
            }
        }
        waitingQueue = newQueue;
    }

    std::vector<Patient> getWaitingQueueSnapshot() const {
        auto tempQueue = waitingQueue;
        std::vector<Patient> result;
        while (!tempQueue.empty()) {
            if (tempQueue.top().isActive) {
                result.push_back(tempQueue.top());
            }
            tempQueue.pop();
        }
        return result;
    }

    const std::vector<Patient>& getMasterRegistry() const {
        return masterRegistry;
    }

    std::vector<Patient> getSortedRecords(int criterion) const {
        std::vector<Patient> records = masterRegistry;

        switch (criterion) {
            case 1:
                std::sort(records.begin(), records.end(), [](const Patient& a, const Patient& b) {
                    return a.id < b.id;
                });
                break;
            case 2:
                std::sort(records.begin(), records.end(), [](const Patient& a, const Patient& b) {
                    return a.age > b.age;
                });
                break;
            case 3:
                std::sort(records.begin(), records.end(), [](const Patient& a, const Patient& b) {
                    if (a.triage != b.triage) {
                        return static_cast<int>(a.triage) > static_cast<int>(b.triage);
                    }
                    return a.arrivalSequence < b.arrivalSequence;
                });
                break;
            default:
                break;
        }
        return records;
    }

    struct AnalyticsSummary {
        size_t totalRegistered;
        size_t activeWaiting;
        size_t totalServedOrCancelled;
        size_t emergencyCount;
        size_t urgentCount;
        size_t normalCount;
        double averageAge;
    };

    AnalyticsSummary getAnalytics() const {
        AnalyticsSummary summary{0, 0, 0, 0, 0, 0, 0.0};
        summary.totalRegistered = masterRegistry.size();
        
        if (summary.totalRegistered == 0) return summary;

        long long sumAge = 0;

        for (const auto& p : masterRegistry) {
            sumAge += p.age;
            if (p.isActive) summary.activeWaiting++;
            else summary.totalServedOrCancelled++;

            if (p.triage == TriageLevel::EMERGENCY) summary.emergencyCount++;
            else if (p.triage == TriageLevel::URGENT) summary.urgentCount++;
            else if (p.triage == TriageLevel::NORMAL) summary.normalCount++;
        }

        summary.averageAge = static_cast<double>(sumAge) / summary.totalRegistered;
        return summary;
    }

    void seedSampleData() {
        registerPatient(101, "Eleanor Vance", 45, "Cardiac Arrhythmia", TriageLevel::EMERGENCY);
        registerPatient(102, "Arthur Pendelton", 68, "Acute Appendicitis", TriageLevel::EMERGENCY);
        registerPatient(103, "Sophia Martinez", 29, "High Fever & Dehydration", TriageLevel::NORMAL);
        registerPatient(104, "James Watson", 52, "Fractured Radius", TriageLevel::URGENT);
        registerPatient(105, "Clara Oswald", 34, "Mild Migraine", TriageLevel::NORMAL);
    }
};

// =====================================================================================
// MODULE 4: CONSOLE USER INTERFACE CONTROLLER
// =====================================================================================

class ConsoleUI {
private:
    HospitalRegistryManager manager;

    void renderHeader(const std::string& title) const {
        std::cout << "\n=================================================================\n";
        std::cout << "  " << title << "\n";
        std::cout << "=================================================================\n";
    }

    void renderTableDivider() const {
        std::cout << "+-------+----------------------+-----+----------------------+----------------+------------------+\n";
    }

    void renderTableHeader() const {
        renderTableDivider();
        std::cout << "| " << std::left << std::setw(5) << "ID"
                  << "| " << std::left << std::setw(20) << "Patient Name"
                  << "| " << std::left << std::setw(4) << "Age"
                  << "| " << std::left << std::setw(20) << "Condition"
                  << "| " << std::left << std::setw(14) << "Triage Priority"
                  << "| " << std::left << std::setw(16) << "Status" << "|\n";
        renderTableDivider();
    }

    void renderTableRow(const Patient& p) const {
        std::string statusStr = p.isActive ? "QUEUED" : "SERVED/CANCELLED";
        std::cout << "| " << std::left << std::setw(5) << p.id
                  << "| " << std::left << std::setw(20) << (p.name.length() > 20 ? p.name.substr(0, 17) + "..." : p.name)
                  << "| " << std::left << std::setw(4) << p.age
                  << "| " << std::left << std::setw(20) << (p.condition.length() > 20 ? p.condition.substr(0, 17) + "..." : p.condition)
                  << "| " << std::left << std::setw(14) << p.getTriageString()
                  << "| " << std::left << std::setw(16) << statusStr << "|\n";
    }

public:
    ConsoleUI() {
        manager.seedSampleData();
    }

    void run() {
        while (true) {
            showMainMenu();
            int choice = InputValidator::readInt(" Enter option [1-8]: ", 1, 8);

            switch (choice) {
                case 1: handleRegisterPatient(); break;
                case 2: handleProcessNextPatient(); break;
                case 3: handleDisplayDashboards(); break;
                case 4: handleSearchPatient(); break;
                case 5: handleCancelAppointment(); break;
                case 6: handleAnalyticsReport(); break;
                case 7: handlePrepopulateData(); break;
                case 8:
                    renderHeader("EXITING BHEESHMA HEALTHCARE SYSTEM");
                    std::cout << " [✓] State cleaned up safely. System shutdown complete.\n\n";
                    return;
            }
        }
    }

private:
    void showMainMenu() const {
        std::cout << "\n\n";
        std::cout << "=================================================================\n";
        std::cout << "                    BHEESHMA HEALTHCARE                          \n";
        std::cout << "          Intelligent Queue & Emergency Triage Portal            \n";
        std::cout << "=================================================================\n";
        std::cout << "  1. Register & Enqueue New Patient (Dynamic Triage)\n";
        std::cout << "  2. Process Next Patient (Call for Consultation)\n";
        std::cout << "  3. Display Dashboards (Master Database & Waiting Queue)\n";
        std::cout << "  4. Search Patient Record by ID (Binary Search O(log N))\n";
        std::cout << "  5. Cancel Appointment / Remove Record\n";
        std::cout << "  6. Analytics & Sorting Reports (ID, Age, Triage Severity)\n";
        std::cout << "  7. Seed Additional Demo Sample Data\n";
        std::cout << "  8. Exit System\n";
        std::cout << "=================================================================\n";
    }

    void handleRegisterPatient() {
        renderHeader("1. REGISTER & ENQUEUE PATIENT");

        int id;
        while (true) {
            id = InputValidator::readInt(" Enter Patient ID (Positive Integer): ", 1, 999999);
            if (manager.existsID(id)) {
                std::cout << " [!] Error: Patient ID #" << id << " already exists in system database. Duplicate IDs prohibited.\n";
            } else {
                break;
            }
        }

        std::string name = InputValidator::readString(" Enter Patient Full Name: ");
        int age = InputValidator::readInt(" Enter Patient Age (1-120): ", 1, 120);
        std::string condition = InputValidator::readString(" Enter Primary Medical Condition / Symptoms: ");

        std::cout << "\n Select Triage Severity Level:\n";
        std::cout << "  1. NORMAL    (Routine checkup / minor illness)\n";
        std::cout << "  2. URGENT    (Severe pain / persistent fever / trauma)\n";
        std::cout << "  3. EMERGENCY (Critical condition / life-threatening)\n";
        int triageChoice = InputValidator::readInt(" Enter Triage Tier [1-3]: ", 1, 3);
        TriageLevel triage = static_cast<TriageLevel>(triageChoice);

        if (manager.registerPatient(id, name, age, condition, triage)) {
            std::cout << "\n [✓] SUCCESS: Patient #" << id << " (" << name << ") registered and enqueued successfully!\n";
            std::cout << "     Assigned Triage: " << (triage == TriageLevel::EMERGENCY ? "EMERGENCY (Priority 1)" : (triage == TriageLevel::URGENT ? "URGENT (Priority 2)" : "NORMAL (Priority 3)")) << "\n";
        } else {
            std::cout << "\n [!] ERROR: Failed to register patient.\n";
        }
    }

    void handleProcessNextPatient() {
        renderHeader("2. PROCESS NEXT PATIENT FOR CONSULTATION");

        auto patientOpt = manager.processNextPatient();
        if (!patientOpt.has_value()) {
            std::cout << " [i] QUEUE EMPTY: There are no patients currently waiting in the queue.\n";
            return;
        }

        const Patient& p = patientOpt.value();
        std::cout << " [➔] CALLING NEXT PATIENT FOR CONSULTATION ROOM:\n";
        p.printDetailedCard();
        std::cout << " [✓] Patient #" << p.id << " marked as SERVED in master registry.\n";
    }

    void handleDisplayDashboards() {
        renderHeader("3. BHEESHMA HEALTHCARE SYSTEM DASHBOARDS");
        std::cout << " Select Dashboard View:\n";
        std::cout << "  1. Master Registry Dashboard (All Historical Records)\n";
        std::cout << "  2. Active Waiting Queue Dashboard (Priority Service Sequence)\n";
        int choice = InputValidator::readInt(" Enter option [1-2]: ", 1, 2);

        if (choice == 1) {
            renderHeader("MASTER REGISTRY DATABASE RECORDS");
            const auto& master = manager.getMasterRegistry();
            if (master.empty()) {
                std::cout << " [i] Master registry contains 0 records.\n";
                return;
            }
            renderTableHeader();
            for (const auto& p : master) {
                renderTableRow(p);
            }
            renderTableDivider();
            std::cout << " Total Master Records: " << master.size() << "\n";
        } else {
            renderHeader("ACTIVE WAITING QUEUE (PRIORITY SERVICE SEQUENCE)");
            auto queueList = manager.getWaitingQueueSnapshot();
            if (queueList.empty()) {
                std::cout << " [i] Waiting queue is currently empty.\n";
                return;
            }
            renderTableHeader();
            for (const auto& p : queueList) {
                renderTableRow(p);
            }
            renderTableDivider();
            std::cout << " Total Patients Waiting: " << queueList.size() << "\n";
        }
    }

    void handleSearchPatient() {
        renderHeader("4. ADVANCED PATIENT SEARCH (BINARY SEARCH O(log N))");
        int searchID = InputValidator::readInt(" Enter Patient ID to Search: ", 1, 999999);

        auto result = manager.searchPatientBinarySearch(searchID);
        if (result.has_value()) {
            std::cout << " [✓] Record Found!\n";
            result->printDetailedCard();
        } else {
            std::cout << " [!] RECORD NOT FOUND: Patient ID #" << searchID << " does not exist in the system.\n";
        }
    }

    void handleCancelAppointment() {
        renderHeader("5. CANCEL APPOINTMENT / REMOVE QUEUED PATIENT");
        int cancelID = InputValidator::readInt(" Enter Patient ID to Cancel: ", 1, 999999);

        if (manager.cancelAppointment(cancelID)) {
            std::cout << " [✓] SUCCESS: Appointment for Patient ID #" << cancelID << " cancelled and dequeued.\n";
        } else {
            std::cout << " [!] CANCEL FAILED: Patient ID #" << cancelID << " was not found or is already served/cancelled.\n";
        }
    }

    void handleAnalyticsReport() {
        renderHeader("6. ANALYTICS & CUSTOM SORTING REPORTS");
        std::cout << " Select Option:\n";
        std::cout << "  1. View Master Records Sorted by Patient ID (Ascending)\n";
        std::cout << "  2. View Master Records Sorted by Age (Senior Citizens First)\n";
        std::cout << "  3. View Master Records Sorted by Triage Severity (Emergency First)\n";
        std::cout << "  4. View High-Level System Analytics Summary\n";
        int choice = InputValidator::readInt(" Enter option [1-4]: ", 1, 4);

        if (choice >= 1 && choice <= 3) {
            auto records = manager.getSortedRecords(choice);
            if (records.empty()) {
                std::cout << " [i] Database is empty.\n";
                return;
            }
            std::cout << "\n SORTED PATIENT REPORT:\n";
            renderTableHeader();
            for (const auto& p : records) {
                renderTableRow(p);
            }
            renderTableDivider();
        } else {
            auto stats = manager.getAnalytics();
            std::cout << "\n+-------------------------------------------------------------+\n";
            std::cout << "|             BHEESHMA HEALTHCARE SYSTEM ANALYTICS            |\n";
            std::cout << "+-------------------------------------------------------------+\n";
            std::cout << "| Total Registered Patients : " << std::left << std::setw(32) << stats.totalRegistered << "|\n";
            std::cout << "| Active Patients Waiting   : " << std::left << std::setw(32) << stats.activeWaiting << "|\n";
            std::cout << "| Patients Served/Inactive  : " << std::left << std::setw(32) << stats.totalServedOrCancelled << "|\n";
            std::cout << "| Emergency Cases (P1)      : " << std::left << std::setw(32) << stats.emergencyCount << "|\n";
            std::cout << "| Urgent Cases (P2)         : " << std::left << std::setw(32) << stats.urgentCount << "|\n";
            std::cout << "| Normal Cases (P3)         : " << std::left << std::setw(32) << stats.normalCount << "|\n";
            std::cout << "| Average Patient Age       : " << std::left << std::setw(32) << std::fixed << std::setprecision(1) << stats.averageAge << "|\n";
            std::cout << "+-------------------------------------------------------------+\n";
        }
    }

    void handlePrepopulateData() {
        renderHeader("7. PRE-POPULATE DEMO SAMPLE DATA");
        manager.seedSampleData();
        std::cout << " [✓] Additional demo patients injected into system database.\n";
    }
};

// =====================================================================================
// MAIN ENTRY POINT
// =====================================================================================

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    ConsoleUI app;
    app.run();

    return 0;
}
