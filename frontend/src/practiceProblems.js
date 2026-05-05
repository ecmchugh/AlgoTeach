export const PRACTICE_PROMPTS = [
  // Hash Map
  {
    pattern: 'Hash Map',
    title: 'Two Sum',
    description:
      'Given an array of integers nums and a target, return the indices of two numbers that add up to the target. Each input has exactly one solution.',
    starter: 'def two_sum(nums, target):\n    pass\n',
  },
  {
    pattern: 'Hash Map',
    title: 'First Unique Character',
    description:
      'Given a string, return the first non-repeating character. If none exists, return None.',
    starter: 'def first_unique(s):\n    pass\n',
  },
  {
    pattern: 'Hash Map',
    title: 'Contains Duplicate',
    description:
      'Given an array of integers, return True if any value appears at least twice, False otherwise.',
    starter: 'def contains_duplicate(nums):\n    pass\n',
  },

  // Two Pointers
  {
    pattern: 'Two Pointers',
    title: 'Reverse String In Place',
    description:
      'Reverse a list of characters in place. Use O(1) extra space.',
    starter: 'def reverse_string(s):\n    pass\n',
  },
  {
    pattern: 'Two Pointers',
    title: 'Valid Palindrome',
    description:
      'Given a string, return True if it reads the same forward and backward, ignoring case and non-alphanumeric characters.',
    starter: 'def is_palindrome(s):\n    pass\n',
  },
  {
    pattern: 'Two Pointers',
    title: 'Two Sum (Sorted)',
    description:
      'Given a 1-indexed sorted array of integers, return the 1-based indices of two numbers that sum to a target.',
    starter: 'def two_sum_sorted(nums, target):\n    pass\n',
  },

  // Sliding Window
  {
    pattern: 'Sliding Window',
    title: 'Maximum Subarray Sum of Size K',
    description:
      'Given an array of integers and an integer k, return the maximum sum of any contiguous subarray of length k.',
    starter: 'def max_sum(arr, k):\n    pass\n',
  },
  {
    pattern: 'Sliding Window',
    title: 'Longest Substring with K Distinct Characters',
    description:
      'Given a string and an integer k, return the length of the longest substring containing at most k distinct characters.',
    starter: 'def longest_substring(s, k):\n    pass\n',
  },
  {
    pattern: 'Sliding Window',
    title: 'Smallest Subarray With Given Sum',
    description:
      'Given an array of positive integers and a target sum, return the length of the smallest contiguous subarray whose sum is >= target. Return 0 if none exists.',
    starter: 'def smallest_subarray(arr, target):\n    pass\n',
  },

  // Stack
  {
    pattern: 'Stack',
    title: 'Valid Parentheses',
    description:
      'Given a string of brackets ( ) [ ] { }, return True if every bracket is matched and properly nested.',
    starter: 'def is_valid(s):\n    pass\n',
  },
  {
    pattern: 'Stack',
    title: 'Evaluate Reverse Polish Notation',
    description:
      'Given a list of tokens in RPN form (integers and the operators + - * /), evaluate and return the result. Division truncates toward zero.',
    starter: 'def eval_rpn(tokens):\n    pass\n',
  },
  {
    pattern: 'Stack',
    title: 'Daily Temperatures',
    description:
      'Given an array of daily temperatures, return an array answer where answer[i] is how many days until a warmer temperature, or 0 if none exists.',
    starter: 'def daily_temperatures(temps):\n    pass\n',
  },

  // Binary Search
  {
    pattern: 'Binary Search',
    title: 'Search in Sorted Array',
    description:
      'Given a sorted array of integers and a target, return the index of the target, or -1 if not found.',
    starter: 'def search(nums, target):\n    pass\n',
  },
  {
    pattern: 'Binary Search',
    title: 'First Bad Version',
    description:
      'Given n versions and a function is_bad(k) that returns True for bad versions, find the first bad version. is_bad is provided as a parameter.',
    starter: 'def first_bad_version(n, is_bad):\n    pass\n',
  },
  {
    pattern: 'Binary Search',
    title: 'Integer Square Root',
    description:
      'Given a non-negative integer x, return the integer square root of x (truncated). Do not use built-in sqrt.',
    starter: 'def my_sqrt(x):\n    pass\n',
  },

  // Linked List
  {
    pattern: 'Linked List',
    title: 'Reverse Linked List',
    description:
      'Given the head of a singly linked list, reverse it and return the new head. Each node has .val and .next attributes.',
    starter: 'def reverse_list(head):\n    pass\n',
  },
  {
    pattern: 'Linked List',
    title: 'Detect Cycle',
    description:
      'Given the head of a linked list, return True if it contains a cycle. Use O(1) extra space.',
    starter: 'def has_cycle(head):\n    pass\n',
  },
  {
    pattern: 'Linked List',
    title: 'Middle of Linked List',
    description:
      'Given the head of a singly linked list, return the middle node. If the list has even length, return the second middle.',
    starter: 'def find_middle(head):\n    pass\n',
  },

  // Depth First Search
  {
    pattern: 'Depth First Search',
    title: 'Maximum Depth of Binary Tree',
    description:
      'Given the root of a binary tree, return its maximum depth. Each node has .val, .left, .right attributes.',
    starter: 'def max_depth(root):\n    pass\n',
  },
  {
    pattern: 'Depth First Search',
    title: 'Same Tree',
    description:
      'Given two binary trees, return True if they are structurally identical and have the same node values.',
    starter: 'def is_same_tree(p, q):\n    pass\n',
  },
  {
    pattern: 'Depth First Search',
    title: 'Number of Islands',
    description:
      "Given a 2D grid of '1' (land) and '0' (water), count the number of distinct islands. An island is land cells connected horizontally or vertically.",
    starter: 'def num_islands(grid):\n    pass\n',
  },

  // Breadth First Search
  {
    pattern: 'Breadth First Search',
    title: 'Binary Tree Level Order Traversal',
    description:
      'Given the root of a binary tree, return the level-order traversal as a list of lists (one list per level).',
    starter: 'def level_order(root):\n    pass\n',
  },
  {
    pattern: 'Breadth First Search',
    title: 'Shortest Path in Binary Grid',
    description:
      'Given an n x n grid of 0s and 1s, find the shortest path length from (0,0) to (n-1,n-1) through 0-cells only. 8-directional moves allowed. Return -1 if no path exists.',
    starter: 'def shortest_path(grid):\n    pass\n',
  },
  {
    pattern: 'Breadth First Search',
    title: 'Binary Tree Right Side View',
    description:
      'Given the root of a binary tree, return the values of nodes visible from the right side, ordered from top to bottom.',
    starter: 'def right_side_view(root):\n    pass\n',
  },

  // Heap
  {
    pattern: 'Heap',
    title: 'Kth Largest Element',
    description:
      'Given an integer array nums and integer k, return the kth largest element in the array.',
    starter: 'def find_kth_largest(nums, k):\n    pass\n',
  },
  {
    pattern: 'Heap',
    title: 'K Closest Points to Origin',
    description:
      'Given a list of (x, y) points and integer k, return the k points closest to the origin.',
    starter: 'def k_closest(points, k):\n    pass\n',
  },
  {
    pattern: 'Heap',
    title: 'Top K Frequent Elements',
    description:
      'Given an integer array and integer k, return the k most frequent elements.',
    starter: 'def top_k_frequent(nums, k):\n    pass\n',
  },

  // Backtracking
  {
    pattern: 'Backtracking',
    title: 'Subsets',
    description:
      'Given an array of distinct integers, return all possible subsets (the power set).',
    starter: 'def subsets(nums):\n    pass\n',
  },
  {
    pattern: 'Backtracking',
    title: 'Permutations',
    description:
      'Given an array of distinct integers, return all possible permutations.',
    starter: 'def permute(nums):\n    pass\n',
  },
  {
    pattern: 'Backtracking',
    title: 'Combination Sum',
    description:
      'Given an array of distinct positive integers and a target, return all unique combinations that sum to target. Each number can be used unlimited times.',
    starter: 'def combination_sum(candidates, target):\n    pass\n',
  },

  // Dynamic Programming
  {
    pattern: 'Dynamic Programming',
    title: 'Climbing Stairs',
    description:
      'Given n stairs, where you can climb 1 or 2 steps at a time, return the number of distinct ways to reach the top.',
    starter: 'def climb_stairs(n):\n    pass\n',
  },
  {
    pattern: 'Dynamic Programming',
    title: 'House Robber',
    description:
      'Given an array of non-negative integers representing money in each house, return the maximum amount you can rob without robbing two adjacent houses.',
    starter: 'def rob(nums):\n    pass\n',
  },
  {
    pattern: 'Dynamic Programming',
    title: 'Coin Change',
    description:
      'Given an array of coin denominations and an amount, return the fewest number of coins needed to make the amount, or -1 if impossible.',
    starter: 'def coin_change(coins, amount):\n    pass\n',
  },

  // Greedy
  {
    pattern: 'Greedy',
    title: 'Jump Game',
    description:
      'Given an array where each element represents the maximum jump length from that index, return True if you can reach the last index.',
    starter: 'def can_jump(nums):\n    pass\n',
  },
  {
    pattern: 'Greedy',
    title: 'Maximum Subarray',
    description:
      'Given an integer array, find the contiguous subarray with the largest sum and return that sum.',
    starter: 'def max_subarray(nums):\n    pass\n',
  },
  {
    pattern: 'Greedy',
    title: 'Gas Station',
    description:
      'Given gas[] and cost[] arrays where gas[i] is fuel at station i and cost[i] is fuel needed to drive to the next station, return the starting index to complete a full circuit, or -1 if impossible.',
    starter: 'def can_complete_circuit(gas, cost):\n    pass\n',
  },

  // Bit Manipulation
  {
    pattern: 'Bit Manipulation',
    title: 'Single Number',
    description:
      'Given a non-empty integer array where every element appears twice except for one, find the single one. Use O(1) extra space.',
    starter: 'def single_number(nums):\n    pass\n',
  },
  {
    pattern: 'Bit Manipulation',
    title: 'Number of 1 Bits',
    description:
      "Given an unsigned integer, return the number of '1' bits in its binary representation.",
    starter: 'def hamming_weight(n):\n    pass\n',
  },
  {
    pattern: 'Bit Manipulation',
    title: 'Missing Number',
    description:
      'Given an array of n distinct numbers from the range [0, n], return the one missing from the array.',
    starter: 'def missing_number(nums):\n    pass\n',
  },
]
