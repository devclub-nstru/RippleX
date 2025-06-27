# Ripplex

A lightweight, reactive state management library for React applications with built-in event bus and automatic async state handling.

## Installation

```bash
npm install ripplex-core
```

## Quick Start

```typescript
import { ripple, useRipple, emit, useRippleEffect } from "ripplex-core";

// Create reactive state
const counterStore = {
  count: ripple(0),
  loading: ripple(false),
  error: ripple(null),
};

function Counter() {
  const count = useRipple(counterStore.count);
  const loading = useRipple(counterStore.loading);

  // Handle async operations with auto loading/error states
  useRippleEffect(
    "increment:async",
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      counterStore.count.value += 1;
    },
    counterStore // Auto-handles loading and error
  );

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => emit("increment:async")}>
        {loading ? "Loading..." : "+1 Async"}
      </button>
      <button onClick={() => (counterStore.count.value -= 1)}>-1</button>
    </div>
  );
}
```

## Core Concepts

### Reactive State with ripple()

Create reactive state that automatically triggers React re-renders:

```typescript
const userStore = {
  name: ripple(""),
  isLoggedIn: ripple(false),
};
```

### React Integration with useRipple()

Subscribe to state changes in React components:

```typescript
function UserProfile() {
  const name = useRipple(userStore.name);
  const isLoggedIn = useRipple(userStore.isLoggedIn);

  return <div>{isLoggedIn ? `Hello ${name}` : "Please login"}</div>;
}
```

### Event-Driven Architecture

Decouple your application logic using events:

```typescript
import { emit, on } from "ripplex-core";

// Listen for events
on("user:login", (userData) => {
  userStore.name.value = userData.name;
  userStore.isLoggedIn.value = true;
});

// Emit events from anywhere
emit("user:login", { name: "John" });
```

### Automatic Async State Management

Handle loading and error states automatically:

```typescript
const todoStore = {
  todos: ripple([]),
  loading: ripple(false),
  error: ripple(null),
};

// Async operations with auto-managed loading/error states
useRippleEffect(
  "fetch:todos",
  async () => {
    const response = await fetch("/api/todos");
    const data = await response.json();
    todoStore.todos.value = data;
  },
  todoStore, // Automatically manages loading and error signals
);

// Trigger from UI
emit("fetch:todos");
```

## API Reference

### Core Functions

- `ripple(initialValue)` - Create a reactive signal
- `useRipple(signal)` - React hook to subscribe to a signal
- `emit(event, payload?)` - Emit an event
- `on(event, handler)` - Listen for events
- `useRippleEffect(event, asyncHandler, store?)` - Handle async events with auto state management

### Signal Properties

```typescript
const signal = ripple(0);

signal.value = 10; // Set value
const current = signal.value; // Get value
const peek = signal.peek(); // Get without subscribing
```

## Store Pattern

Organize related state in store objects:

```typescript
const appStore = {
  // Data
  user: ripple(null),
  todos: ripple([]),

  // UI State
  loading: ripple(false),
  error: ripple(null),

  // Computed values can be derived in components
  // or using external computed libraries
};

// Use throughout your app
function App() {
  const user = useRipple(appStore.user);
  const loading = useRipple(appStore.loading);

  useRippleEffect(
    "load:user",
    async (userId) => {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      appStore.user.value = userData;
    },
    appStore
  );

  return (
    <div>
      {loading ? "Loading..." : user?.name}
      <button onClick={() => emit("load:user", 123)}>Load User</button>
    </div>
  );
}
```

## TypeScript Support

Ripple provides full TypeScript support:

```typescript
interface User {
  id: number;
  name: string;
}

const userStore = {
  currentUser: ripple<User | null>(null),
  users: ripple<User[]>([]),
};
```

## Why Ripplex?

- **Simple**: Minimal API with maximum power
- **Reactive**: Automatic React integration with `useRipple`
- **Event-driven**: Decouple logic with built-in event system
- **Async-friendly**: Automatic loading and error state management
- **TypeScript**: Full type safety out of the box
- **Lightweight**: Small bundle size, zero dependencies
