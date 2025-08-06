# 🔥 PAIN POINT 2: The Fetch Fiasco - Unnecessary Network Calls

## Overview

This branch demonstrates how developers often create performance nightmares by making unnecessary network calls when working with React Server Components.

## What's Broken Here

Navigate to any post detail page (e.g., `/posts/1`) to see a component that makes 5+ API calls for data that could be fetched once on the server.

## Key Issues Demonstrated

### 1. **Client-Side Data Fetching Where Server Would Be Better**

```tsx
// ❌ This should be done on the server
useEffect(() => {
  fetch(`https://picsum.photos/id/${params.pid}/info`)
    .then((res) => res.json())
    .then(setPost);
}, [params.pid]);
```

### 2. **API Call Waterfalls**

```tsx
// ❌ Sequential API calls
const post = await fetch("/api/post");
const author = await fetch(`/api/author/${post.author}`); // Waits for post
const related = await fetch(`/api/related/${post.id}`); // Waits for author
```

### 3. **Over-fetching Data**

```tsx
// ❌ Fetching ALL posts when we only need one
const allPosts = await fetch("https://picsum.photos/list"); // 300+ posts
const post = allPosts.find((p) => p.id === targetId); // Using only 1
```

### 4. **Duplicate API Calls**

```tsx
// ❌ Multiple components fetching the same data
const PostComponent = () => {
  const [post, setPost] = useState(null);
  useEffect(() => fetch("/api/post").then(setPost), []);
  // ...
};

const AuthorComponent = () => {
  const [post, setPost] = useState(null);
  useEffect(() => fetch("/api/post").then(setPost), []); // Same call!
  // ...
};
```

### 5. **Unnecessary Client-Side Processing**

```tsx
// ❌ Complex filtering/sorting on the client
const relatedPosts = allPosts
  .filter((p) => p.author !== currentPost.author)
  .sort((a, b) => a.likes - b.likes)
  .slice(0, 3);
```

## Performance Impact

Open the browser console and navigate to a post page to see:

- **5+ API calls** instead of 1 optimized server fetch
- **Multiple loading states** for data that could be pre-rendered
- **Client-side processing** that could be done on the server
- **Redundant data requests** for the same information

## Visual Indicators

The page includes debug information showing:

- Number of API calls made
- Amount of data over-fetched
- Artificial loading delays
- Performance metrics

## To See the Problem

1. Run `npm run dev`
2. Navigate to `/posts/1` (or any post ID)
3. Open browser console to see API calls
4. Notice multiple loading spinners
5. Watch the performance impact unfold

## What Should Happen Instead

- **Single server-side fetch** during build/request time
- **Static generation** for post pages
- **Parallel data fetching** when multiple sources needed
- **Proper data composition** on the server
- **Pre-rendered content** without loading states

## Common Developer Questions

- "Why is my app so slow?"
- "Why do I need so many loading states?"
- "How do I share data between components?"
- "Should I use useEffect for data fetching?"
- "When should I use server vs client fetching?"

## The Root Cause

This happens because developers:

1. Apply traditional React patterns to RSCs
2. Don't leverage server-side data fetching
3. Fear server-side complexity
4. Over-engineer simple data requirements
5. Don't understand RSC capabilities

---

**Next Pain Point**: Client-Server Waterfalls
