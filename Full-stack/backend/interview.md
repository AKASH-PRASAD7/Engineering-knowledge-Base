# Backend & System Design Interview Cheatsheet

## Backend 

### 1. Event Loop in NodeJS
The event loop in Node.js is a mechanism that allows it to handle asynchronous operations in a non-blocking manner. It is a continuous process that checks for pending tasks in the event queue and executes them.

```
   ┌───────────────────────────┐
┌─>│          Timers           │ <── setTimeout(), setInterval()
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │     Pending Callbacks     │ <── Deferred I/O callbacks (e.g. TCP errors)
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │       Idle, Prepare       │ <── Node.js internal execution
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │           Poll            │ <── Retrieve & execute I/O callbacks (FS, network)
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │           Check           │ <── setImmediate()
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │      Close Callbacks      │ <── socket.on('close', ...)
└────────────────┴─────────────┘
```

#### Event Loop Phases & Execution Order:
1.  **Timers:** Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
2.  **Pending Callbacks:** Executes system operation callbacks (e.g., TCP socket errors).
3.  **Idle, Prepare:** Used internally by Node.js.
4.  **Poll:** Retrieves new I/O events and executes their callbacks. If no callbacks are pending, it may block here waiting.
5.  **Check:** Executes `setImmediate()` callbacks.
6.  **Close Callbacks:** Executes teardown callbacks like `socket.on('close')`.

#### Microtask Queue (Highest Priority):
*   Consists of `process.nextTick()` and Promise callbacks (e.g., `.then()`, `.catch()`, `async/await`). 
*   **Execution rule:** The microtask queue is checked and drained **after the current operation completes** and **between every phase** of the event loop.
*   **Precedence:** `process.nextTick()` callbacks are executed **before** Promise callbacks.


#### Macrotasks queue (Timer Queue)
*   Consists of `setTimeout()` and `setInterval()` callbacks. 
*   **Execution rule:** The macrotask queue is checked and drained **after the current operation completes** and **between every phase** of the event loop.
*   **Precedence:** `setTimeout()` callbacks are executed **before** `setInterval()` callbacks.
* **setImmmediate is executed before timer queue** 
* 



```js
console.log('Script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

async function processAsync() {
    await Promise.resolve();
  console.log('Async function');
}
processAsync();

Promise.resolve()
  .then(() => {
    console.log('Promise');
  })
  .then(() => {
    process.nextTick(() => {
      console.log('NextTick after Promise');
    });
    console.log('Promise 2nd chain');
  });

process.nextTick(() => {
  console.log('NextTick');
});

console.log('Script end');

```
// Expected Output:
// Script start
// Script end
// NextTick
// Async function
// Promise
// Promise 2nd chain
// NextTick after Promise
// setTimeout
// setImmediate
---

### 2. Streams in NodeJS

**Streams** are abstractions that allow you to read or write data in a continuous flow, rather than loading the entire dataset into memory at once.

#### Type of Streams:
1. **Readable Streams**: Used to read data from a source.
2. **Writable Streams**: Used to write data to a destination.
3. **Duplex Streams**: Can both read and write data.
4. **Transform Streams**: Can read and write data, transforming it in the process.

#### Example:
```javascript
const fs = require('fs');

const readableStream = fs.createReadStream('large-file.txt');
const writableStream = fs.createWriteStream('large-file-copy.txt');

readableStream.pipe(writableStream);
```

---

### 3. Worker Threads

**Worker Threads** are used to run CPU-intensive tasks in parallel with the main thread. 

#### Example:
```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, {
    workerData: { number: 10 }
  });
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
} else {
  const { number } = workerData;
  const result = number * 2;
  parentPort.postMessage(result);
}
```

### 4. Dependency Injection

**Dependency Injection** is a design pattern that allows you to inject dependencies (objects that a class needs to function) into a class, rather than having the class create them itself.

#### Example:
```javascript
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getUser(id) {
    return this.userRepository.findById(id);
  }
}
```

### 5. Middleware

**Middleware** is software that acts as a bridge between different components of an application. In Express.js, middleware functions can access, modify, and end the request-response cycle.

#### Example:
```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
```



## 🗄️ Database (DB) & SQL Optimization

### 1. How to Optimize Slow Queries?
1.  **Analyze execution plan:** Use `EXPLAIN ANALYZE <query>` to identify slow parts (e.g., Table Scan vs. Index Scan).
2.  **Indexing:** Ensure columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` are indexed.
3.  **Select only required columns:** Avoid `SELECT *`. Retrieve only the columns you actually need.
4.  **Avoid N+1 queries:** Use eager loading (`JOIN`s) instead of looping queries in application code.
5.  **Database Connection Pooling:** Reuse connections to avoid the high overhead of establishing a new connection for every request.
6.  **Pagination:** Use keyset pagination (seek method) instead of large `OFFSET` values for large datasets.
7.  **Denormalization / Caching:** For read-heavy systems, cache query results in Redis or denormalize data to avoid complex joins.

---

### 2. Indexes: How do they work?
An index is a data structure (usually a **B-Tree**) that speeds up data retrieval at the cost of slower writes and extra storage.

```
                  [ Root Node: 50 ]
                     /          \
      [ Branch Node: 25 ]     [ Branch Node: 75 ]
         /          \            /          \
  [ Leaf: 10,20 ] [ Leaf: 30 ] [ Leaf: 60 ] [ Leaf: 80,90 ]
```

*   **B-Tree Indexes:** Store data in a balanced tree structure. Excellent for equality (`=`) and range queries (`>`, `<`).
*   **Hash Indexes:** Store key-value pairs. O(1) complexity, but only support equality checks (`=`), not range queries.
*   **Clustered Index:** Defines the physical order of data on the disk (e.g., Primary Key). Only **one** per table.
*   **Non-Clustered Index:** A separate structure containing pointers to the physical rows. Can have **multiple** per table.
*   **Write Penalty:** Every `INSERT`, `UPDATE`, or `DELETE` requires updating the index, which degrades write performance.

* **Types of Indexes in MongoDB** *
    * **Single Field Indexes**: The simplest form of index on a single field. 
    * **Compound Indexes**: Indexes on multiple fields.
    * **Multikey Indexes**: Indexes on array fields.
    * **Text Indexes**: Indexes on text fields.
    * **Geospatial Indexes**: Indexes on geospatial data.
    * **TTL Indexes**: Indexes that automatically expire after a certain time.
    * **Hashed Indexes**: Indexes that store the hash of the indexed field.


**Which column to index?** 
Columns used in 
`WHERE`, 
`JOIN`, 
`ORDER BY`, 
`GROUP BY` are good candidates.

---


```sql
SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
HAVING condition;
```


### 3. Having clause vs Where clause
**Where** is used to filter rows before aggregation.
**Having** is used to filter groups after aggregation.

### 4. Group by clause & Order by clause
**Group by** is used to group rows that have the same values in specified columns into a summary row.
**Order by** is used to sort the result set.

### 5. Aggregation Functions
**Aggregation functions** are used to perform calculations on a set of values and return a single value.

*   **COUNT()**: Returns the number of rows.
*   **SUM()**: Returns the sum of values.
*   **AVG()**: Returns the average of values.
*   **MIN()**: Returns the minimum value.
*   **MAX()**: Returns the maximum value.

***Aggregation Pipeline in MongoDB***
Aggregation Pipeline in MongoDB is a way to process and transform data in a collection.

The Aggregation Pipeline is a framework for data processing and aggregation. It takes documents as input and outputs transformed documents. It consists of a series of stages that process the documents in sequence.

**Syntax:**

```javascript

db.collection.aggregate([
   { $match: { <field>: <value> } },
   { $group: { _id: "<field>", <field2>: { <aggregation_operator>: "<field>" } } },
   { $sort: { <field>: <sort_order> } }
])
```



### 6. ACID Properties & Transaction Isolation Levels
*   **Atomicity:** All operations in a transaction succeed, or all fail (All-or-Nothing).
*   **Consistency:** Transactions bring the database from one valid state to another, maintaining constraints.
*   **Isolation:** Transactions running concurrently do not interfere with each other.
*   **Durability:** Once committed, transaction effects persist even in a system crash.


