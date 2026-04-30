PROBLEMS = [
    {
        "id": "two-sum",
        "title": "Two Sum",
        "prompt": "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution.",
        "pattern": "Hash Map",
        "choices": [
            "Sliding Window",
            "Hash Map",
            "Binary Search",
            "Dynamic Programming"
        ],
        "explanation": "A hash map allows you to store previously seen numbers and check in constant time whether the complement exists.",
        "clues": [
            "Need fast lookup of previously seen values",
            "Searching for complements",
            "Optimal solution is O(n)"
        ],
        "complexity": "O(n)"
    },

    {
        "id": "best-time-stock",
        "title": "Best Time to Buy and Sell Stock",
        "prompt": "You are given an array prices where prices[i] is the price of a stock on day i. Find the maximum profit you can achieve by buying once and selling once.",
        "pattern": "Sliding Window",
        "choices": [
            "Depth First Search",
            "Sliding Window",
            "Heap",
            "Graph Traversal"
        ],
        "explanation": "Track the minimum price seen so far while scanning through the array and compute profit windows dynamically.",
        "clues": [
            "Single pass solution",
            "Track minimum and maximum relationship",
            "Two positions moving through array"
        ],
        "complexity": "O(n)"
    },

    {
        "id": "binary-search",
        "title": "Binary Search",
        "prompt": "Given a sorted array of integers nums and a target value, return the index of the target if it exists, otherwise return -1.",
        "pattern": "Binary Search",
        "choices": [
            "Greedy",
            "Two Pointers",
            "Binary Search",
            "Breadth First Search"
        ],
        "explanation": "Since the array is sorted, repeatedly dividing the search space in half gives an efficient logarithmic-time solution.",
        "clues": [
            "Input is sorted",
            "Eliminate half the search space",
            "Looking for logarithmic runtime"
        ],
        "complexity": "O(log n)"
    },

    {
        "id": "maximum-depth-binary-tree",
        "title": "Maximum Depth of Binary Tree",
        "prompt": "Given the root of a binary tree, return its maximum depth.",
        "pattern": "Depth First Search",
        "choices": [
            "Sliding Window",
            "Depth First Search",
            "Prefix Sum",
            "Union Find"
        ],
        "explanation": "DFS recursively explores each branch to compute the longest path from root to leaf.",
        "clues": [
            "Tree traversal problem",
            "Recursive structure",
            "Need to explore all branches"
        ],
        "complexity": "O(n)"
    },

    {
        "id": "climbing-stairs",
        "title": "Climbing Stairs",
        "prompt": "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb either 1 or 2 steps. Return the number of distinct ways to climb to the top.",
        "pattern": "Dynamic Programming",
        "choices": [
            "Dynamic Programming",
            "Binary Search",
            "Greedy",
            "Stack"
        ],
        "explanation": "The number of ways to reach step n depends on the solutions to smaller subproblems: n-1 and n-2.",
        "clues": [
            "Repeated subproblems",
            "Build solution from previous states",
            "Fibonacci-like recurrence"
        ],
        "complexity": "O(n)"
    }
]