// ==========================
// OOPS Concepts
// Example: Bank Management System
// ==========================

// 1. Encapsulation
class BankAccount {
    // Private data (hidden from outside)
    private balance: number;

    constructor(
        public accountHolder: string,
        public accountNumber: number,
        balance: number
    ) {
        this.balance = balance;
    }

    // Public methods to access private data
    deposit(amount: number): void {
        this.balance += amount;
        console.log(`₹${amount} deposited.`);
    }

    withdraw(amount: number): void {
        if (amount > this.balance) {
            console.log("Insufficient Balance");
            return;
        }

        this.balance -= amount;
        console.log(`₹${amount} withdrawn.`);
    }

    getBalance(): number {
        return this.balance;
    }

    display(): void {
        console.log(`
Account Holder : ${this.accountHolder}
Account Number : ${this.accountNumber}
Balance        : ₹${this.balance}
        `);
    }
}

// 2. Inheritance
class SavingsAccount extends BankAccount {
    constructor(
        accountHolder: string,
        accountNumber: number,
        balance: number,
        public interestRate: number
    ) {
        super(accountHolder, accountNumber, balance);
    }

    // 3. Polymorphism (Method Overriding)
    display(): void {
        console.log(`
Savings Account
-----------------
Holder      : ${this.accountHolder}
Account No  : ${this.accountNumber}
Interest    : ${this.interestRate}%
Balance     : ₹${this.getBalance()}
        `);
    }

    calculateInterest(): void {
        const interest = (this.getBalance() * this.interestRate) / 100;
        console.log(`Interest Earned : ₹${interest}`);
    }
}

// Another Child Class
class CurrentAccount extends BankAccount {
    constructor(
        accountHolder: string,
        accountNumber: number,
        balance: number,
        public overdraftLimit: number
    ) {
        super(accountHolder, accountNumber, balance);
    }

    // Method Overriding
    display(): void {
        console.log(`
Current Account
----------------
Holder      : ${this.accountHolder}
Account No  : ${this.accountNumber}
Balance     : ₹${this.getBalance()}
Overdraft   : ₹${this.overdraftLimit}
        `);
    }
}

// 4. Abstraction
abstract class Employee {
    constructor(public name: string) {}

    // Abstract Method
    abstract work(): void;

    attendMeeting() {
        console.log(`${this.name} is attending meeting.`);
    }
}

class Manager extends Employee {
    work(): void {
        console.log(`${this.name} manages the bank.`);
    }
}

class Cashier extends Employee {
    work(): void {
        console.log(`${this.name} handles cash transactions.`);
    }
}

// ==========================
// Runtime Polymorphism
// ==========================

const accounts: BankAccount[] = [
    new SavingsAccount("Rahul", 101, 50000, 6),
    new CurrentAccount("Amit", 102, 80000, 20000),
];

for (const account of accounts) {
    account.display(); // Calls child class version
}

// ==========================
// Encapsulation Demo
// ==========================

const savings = new SavingsAccount("John", 103, 10000, 5);

savings.deposit(5000);
savings.withdraw(2000);

console.log("Current Balance:", savings.getBalance());

// savings.balance ❌ Error (private property)

// ==========================
// Abstraction Demo
// ==========================

const manager = new Manager("Alice");
manager.work();
manager.attendMeeting();

const cashier = new Cashier("Bob");
cashier.work();
cashier.attendMeeting();