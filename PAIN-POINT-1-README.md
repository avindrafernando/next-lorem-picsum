# 🔥 PAIN POINT 1: State Management Confusion

## Overview
This branch demonstrates the most common confusion developers face when working with React Server Components - mixing server and client state management.

## What's Broken Here
Navigate to `/posts` to see a page that attempts to use client-side state management patterns in a Server Component, which will fail.

## Key Issues Demonstrated

### 1. **useState/useEffect in Server Components**
```tsx
// ❌ This doesn't work in Server Components
const [searchTerm, setSearchTerm] = useState('');
const [favorites, setFavorites] = useState<number[]>([]);
```

### 2. **Event Handlers in Server Components**
```tsx
// ❌ Event handlers don't work in Server Components
const handleSearch = (event) => {
  setSearchTerm(event.target.value); // Error!
};
```

### 3. **Interactive Elements Without Client Boundary**
```tsx
// ❌ These require client-side JavaScript
<TextField onChange={handleSearch} />
<Switch onChange={(e) => setShowOnlyFavorites(e.target.checked)} />
<Button onClick={() => toggleFavorite(post.id)} />
```

### 4. **Mixing Server Data with Client State**
```tsx
// ❌ Trying to filter server data with client state
const filteredPosts = serverPosts.filter(post => 
  post.author.includes(searchTerm) // searchTerm is client state!
);
```

## Why This Confusion Happens

1. **Mental Model Shift**: Developers are used to everything running on the client
2. **Unclear Boundaries**: Not understanding where server execution ends and client begins
3. **Missing "use client"**: Not knowing when and where to add the directive
4. **Error Messages**: React's error messages can be confusing for RSC newcomers

## Common Developer Questions

- "Why can't I use useState here?"
- "Where do I put 'use client'?"
- "How do I handle user interactions?"
- "Why is my event handler not working?"
- "How do I share state between server and client?"

## To See the Errors

1. Run `npm run dev`
2. Navigate to `/posts`
3. Check browser console and terminal for errors
4. Notice that interactive elements don't work

## The Fix (Teaser)
The solution involves proper component boundaries and strategic use of the "use client" directive. This would be demonstrated in a separate "fixed" branch or example.

---

**Next Pain Point**: Fetch Fiasco - Unnecessary Network Calls