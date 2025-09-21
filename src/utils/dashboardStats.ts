// types.ts
export type Member = {
  email: string;
  status: string;
  userExists: boolean;
};

export type Expense = {
  amount: number;
  createdBy: string;
  sharedWith: string[]; // emails of people sharing the cost
};

export type Group = {
  id: string;
  name: string;
  members?: Member[]; // optional in case it's missing or malformed
  expenses?: Expense[]; // optional for flexibility
};

export type DashboardStats = {
  groupCount: number;
  totalSpent: number;
  amountOwed: number;
  amountOwedToYou: number; // Added this for better tracking
};

// Enhanced utility function with better error handling
export const calculateDashboardStats = (
  groups: Group[],
  userEmail: string
): DashboardStats => {
  // Input validation
  if (!groups || !Array.isArray(groups)) {
    console.warn('Groups is not an array:', groups);
    return { groupCount: 0, totalSpent: 0, amountOwed: 0, amountOwedToYou: 0 };
  }

  if (!userEmail || typeof userEmail !== 'string') {
    console.warn('Invalid user email:', userEmail);
    return { groupCount: 0, totalSpent: 0, amountOwed: 0, amountOwedToYou: 0 };
  }

  let groupCount = 0;
  let totalSpent = 0;
  let totalShare = 0; // What user should pay
  let amountOwedToYou = 0; // What others owe to user

  try {
    for (const group of groups) {
      // Validate group structure
      if (!group || typeof group !== 'object') {
        console.warn('Invalid group object:', group);
        continue;
      }

      // ✅ Count groups where user is a member
      const members = Array.isArray(group.members) ? group.members : [];
      const isMember = members.some(m => m?.email === userEmail);
      if (isMember) groupCount++;

      // 💸 Loop through expenses with better validation
      const expenses = Array.isArray(group.expenses) ? group.expenses : [];
      for (const expense of expenses) {
        // Validate expense structure
        if (!expense || typeof expense !== 'object') {
          console.warn('Invalid expense object:', expense);
          continue;
        }

        // Validate required fields
        if (
          typeof expense.amount !== 'number' || 
          expense.amount < 0 ||
          !expense.createdBy || 
          !Array.isArray(expense.sharedWith) ||
          expense.sharedWith.length === 0
        ) {
          console.warn('Invalid expense data:', expense);
          continue;
        }

        // Total spent by user
        if (expense.createdBy === userEmail) {
          totalSpent += expense.amount;
          
          // Calculate how much others owe to this user for this expense
          const share = expense.amount / expense.sharedWith.length;
          const othersShare = (expense.sharedWith.length - 1) * share;
          amountOwedToYou += othersShare;
        }

        // Calculate user's share of expenses
        if (expense.sharedWith.includes(userEmail)) {
          const share = expense.amount / expense.sharedWith.length;
          totalShare += share;
        }
      }
    }

    // Calculate net amount owed (what user owes minus what others owe to user)
    const netAmountOwed = Math.max(totalShare - totalSpent, 0);

    return {
      groupCount,
      totalSpent: Math.round(totalSpent * 100) / 100, // Round to 2 decimal places
      amountOwed: Math.round(netAmountOwed * 100) / 100,
      amountOwedToYou: Math.round(amountOwedToYou * 100) / 100
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return { groupCount: 0, totalSpent: 0, amountOwed: 0, amountOwedToYou: 0 };
  }
};

// Firebase service functions
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../app/firebase/config'; // Your Firebase config

export const fetchUserGroups = async (userEmail: string): Promise<Group[]> => {
  try {
    const groupsRef = collection(db, 'groups');
    // Assuming you have a way to filter groups by user membership
    // This query structure depends on your Firestore data model
    const q = query(groupsRef, where('members', 'array-contains', { email: userEmail }));
    
    const querySnapshot = await getDocs(q);
    const groups: Group[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      groups.push({
        id: doc.id,
        name: data.name || '',
        // members: data.members || [],
         members: Array.isArray(data.members) ? data.members : [], 
        expenses: data.expenses || []
      });
    });

    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw new Error('Failed to fetch groups');
  }
};

// Real-time listener for groups
export const subscribeToUserGroups = (
  userEmail: string,
  callback: (groups: Group[]) => void,
  onError: (error: Error) => void
) => {
  try {
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('members', 'array-contains', { email: userEmail }));

    return onSnapshot(q, (querySnapshot) => {
      const groups: Group[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        groups.push({
          id: doc.id,
          name: data.name || '',
          members: data.members || [],
          expenses: data.expenses || []
        });
      });

      callback(groups);
    }, onError);
  } catch (error) {
    console.error('Error setting up groups listener:', error);
    onError(error as Error);
    return () => {}; // Return empty unsubscribe function
  }
};