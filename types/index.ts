export interface UserType {
  id: number;
  code: string;
  role: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
  gender: string;
  provinceId: number | null;
  cityId: number | null;
  districtId: number | null;
  categoryId: number;
}

export interface LoanType {
  id: number;
  userId: number;
  masterLoanId: number;
  bankId: number;
  date_loan: string;
  nominal: number;
  duration: number;
  nominal_loan: number;
  remaining_payment: number;
  user: UserType; // Reference to the User interface
}

export interface DepositType {
  id: number;
  userId: number;
  masterDepositId: number;
  bankId: number;
  date_deposit: string;
  nominal: number;
}
