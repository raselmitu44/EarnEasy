import { User, UserRole, Task, TaskType, WithdrawalRequest, WithdrawalStatus, PaymentMethod, Transaction } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@earneasy.com',
    role: UserRole.ADMIN,
    balance: 0,
    pendingBalance: 0,
    avatar: 'https://picsum.photos/100/100',
    joinedAt: new Date().toISOString(),
    isBanned: false,
    tasksCompleted: 0
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'user@gmail.com',
    role: UserRole.USER,
    balance: 15.50,
    pendingBalance: 5.00,
    avatar: 'https://picsum.photos/101/101',
    joinedAt: new Date().toISOString(),
    isBanned: false,
    tasksCompleted: 12
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    role: UserRole.USER,
    balance: 2.00,
    pendingBalance: 0,
    avatar: 'https://picsum.photos/102/102',
    joinedAt: new Date().toISOString(),
    isBanned: true,
    tasksCompleted: 3
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Watch Product Review',
    description: 'Watch this 30 second video about the new TechGadget.',
    type: TaskType.VIDEO,
    reward: 0.50,
    durationSeconds: 15,
    isActive: true,
    thumbnail: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: 'task-2',
    title: 'Visit TechBlog',
    description: 'Visit our partner website and stay for 20 seconds.',
    type: TaskType.WEBSITE,
    reward: 0.20,
    durationSeconds: 10,
    url: 'https://raselmia.com',
    isActive: true,
    thumbnail: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: 'task-3',
    title: 'Premium Ad View',
    description: 'View this premium advertisement.',
    type: TaskType.ADS,
    reward: 0.15,
    durationSeconds: 5,
    isActive: true,
    thumbnail: 'https://picsum.photos/300/200?random=3'
  },
  {
    id: 'task-4',
    title: 'Live Stream Check',
    description: 'Join the live stream for 1 minute.',
    type: TaskType.STREAM,
    reward: 1.00,
    durationSeconds: 30,
    isActive: true,
    thumbnail: 'https://picsum.photos/300/200?random=4'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'w-1',
    userId: 'user-1',
    userName: 'John Doe',
    amount: 50.00,
    method: PaymentMethod.PAYPAL,
    accountDetails: 'john@paypal.com',
    status: WithdrawalStatus.PENDING,
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'w-2',
    userId: 'user-2',
    userName: 'Jane Smith',
    amount: 10.00,
    method: PaymentMethod.BKASH,
    accountDetails: '01700000000',
    status: WithdrawalStatus.APPROVED,
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    userId: 'user-1',
    amount: 0.50,
    type: 'CREDIT',
    description: 'Task Completed: Watch Product Review',
    date: new Date().toISOString()
  }
];