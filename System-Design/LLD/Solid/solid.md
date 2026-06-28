# SOLID

## S -> Single Responsibility Principle

- **Single Responsibility Principle states that a class should have only one reason to change.**
- **Single Class Should have only one responsibility.**

### ❌ Bad Example (Multiple Responsibilities)

```javascript
class OrderService {
  createOrder(order) {
    console.log("Order created");
  }

  calculateBill(order) {
    console.log("Calculating bill");
  }

  sendOrderConfirmation(order) {
    console.log("Sending confirmation email");
  }
}
```

**Problems:**

- If order creation logic changes → modify this class.
- If billing rules change → modify this class.
- If email sending changes → modify this class.

This class has **3 reasons to change**, so it violates SRP.

---

### ✅ Good Example (Single Responsibility)

```javascript
class OrderService {
  createOrder(order) {
    console.log("Order created");
  }
}

class BillingService {
  calculateBill(order) {
    console.log("Calculating bill");
  }
}

class EmailService {
  sendOrderConfirmation(order) {
    console.log("Sending confirmation email");
  }
}
```

Now:

- `OrderService` → manages orders only.
- `BillingService` → handles billing only.
- `EmailService` → handles emails only.

Each class has **one responsibility and one reason to change**.

## O -> Open/Closed Principle

- **Open/Closed Principle states that a class should be open for extension, but closed for modification.**

### ❌ Bad Example (Violates OCP)

```javascript
class DiscountCalculator {
  calculateDiscount(order) {
    if (order.type === "Electronics") {
      return order.amount * 0.1;
    } else if (order.type === "Books") {
      return order.amount * 0.2;
    } else if (order.type === "Clothing") {
      return order.amount * 0.05;
    }
    // New discount type → modify this class
  }
}
```

---

### ✅ Good Example (Follows OCP)

```javascript
abstract class DiscountStrategy {
  calculate(order) {
    throw new Error("Method 'calculate' must be implemented");
  }
}

class ElectronicsDiscount extends DiscountStrategy {
  calculate(order) {
    return order.amount * 0.1;
  }
}

class BooksDiscount extends DiscountStrategy {
  calculate(order) {
    return order.amount * 0.2;
  }
}

class ClothingDiscount extends DiscountStrategy {
  calculate(order) {
    return order.amount * 0.05;
  }
}

class DiscountCalculator {
  calculateDiscount(order, strategy) {
    return strategy.calculate(order);
  }
}
```

Now:

- To add a new discount → create a new class that extends `DiscountStrategy`.
- No need to modify `DiscountCalculator`.

The system is **open for extension** but **closed for modification**.

---

## L -> Liskov Substitution Principle

- **Liskov Substitution Principle states that a subclass should be substitutable for its superclass without breaking the application.**

### ❌ Bad Example (Violates LSP)

```javascript
class Bird {
  fly() {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins cannot fly");
  }
}

function makeBirdFly(bird) {
  bird.fly(); // Fails for Penguin
}
```

### ✅ Good Example (Follows LSP)

```javascript
class Bird {
  move() {
    console.log("Moving");
  }
}

class FlyingBird extends Bird {
  fly() {
    console.log("Flying");
  }
}

class SwimmingBird extends Bird {
  swim() {
    console.log("Swimming");
  }
}
```

## I -> Interface Segregation Principle

- **Interface Segregation Principle states that a class should not be forced to implement interfaces that it does not use.**

### ❌ Bad Example (Violates ISP)

```javascript
class Worker {
  work() {
    console.log("Working");
  }
  eat() {
    console.log("Eating");
  }
}

class Robot implements Worker {
  work() {
    console.log("Working");
  }
  eat() {
    throw new Error("Robot cannot eat"); // Robot doesn't need eat()
  }
}
```

### ✅ Good Example (Follows ISP)

```javascript
class Workable {
  work() {
    console.log("Working");
  }
}

class Eatable {
  eat() {
    console.log("Eating");
  }
}

class Human implements Workable, Eatable {}
class Robot implements Workable {}
```

## D -> Dependency Inversion Principle

- **Dependency Inversion Principle states that a class should depend on abstractions, not on concretions.**

### ❌ Bad Example (Violates DIP)

```javascript
class MySQLDatabase {
  save(data) {
    console.log("Saving to MySQL");
  }
}

class UserService {
  constructor() {
    this.db = new MySQLDatabase(); // Depends on concrete class
  }

  createUser(user) {
    this.db.save(user);
  }
}
```

### ✅ Good Example (Follows DIP)

```javascript
class UserService {
  constructor(database) {
    // Depends on abstraction
    this.db = database;
  }

  createUser(user) {
    this.db.save(user);
  }
}

const userService = new UserService(new MySQLDatabase());
```
