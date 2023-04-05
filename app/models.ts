export interface Income {
  id: string
  description: string
  amount: number
  createdAt: Date
}

export interface Expense {
  total: number
  color: string
  createdAt?: Date
  id: string
  title: string
  items: ExpenseItem[]
}

interface ExpenseItem {
  amount: number
  createdAt: Date
  id: string
}
