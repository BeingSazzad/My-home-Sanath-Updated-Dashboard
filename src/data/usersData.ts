export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  savedProperties: number;
  searches: number;
  enquiries: number;
  joinDate: string;
  lastActive: string;
  status: UserStatus;
}

export const usersData: User[] = [
  { id: "1", initials: "JS", name: "John Smith",     email: "john.smith@email.com",   phone: "+44 7700 900 111", location: "London",     savedProperties: 12, searches: 3, enquiries: 5,  joinDate: "2024-01-15", lastActive: "2024-03-16", status: "active" },
  { id: "2", initials: "EJ", name: "Emily Johnson",  email: "emily.j@email.com",      phone: "+44 7700 900 222", location: "Manchester", savedProperties: 8,  searches: 2, enquiries: 3,  joinDate: "2024-02-20", lastActive: "2024-03-15", status: "active" },
  { id: "3", initials: "MD", name: "Michael Davis",  email: "michael.d@email.com",    phone: "+44 7700 900 333", location: "Birmingham", savedProperties: 25, searches: 7, enquiries: 12, joinDate: "2023-11-10", lastActive: "2024-03-14", status: "active" },
  { id: "4", initials: "SW", name: "Sarah Wilson",   email: "sarah.w@email.com",      phone: "+44 7700 900 444", location: "Edinburgh",  savedProperties: 5,  searches: 1, enquiries: 2,  joinDate: "2024-03-01", lastActive: "2024-03-16", status: "active" },
  { id: "5", initials: "DB", name: "David Brown",    email: "david.brown@email.com",  phone: "+44 7700 900 555", location: "Leeds",      savedProperties: 3,  searches: 0, enquiries: 1,  joinDate: "2023-09-15", lastActive: "2024-01-20", status: "inactive" },
  { id: "6", initials: "LA", name: "Lisa Anderson",  email: "lisa.a@email.com",       phone: "+44 7700 900 666", location: "Bristol",    savedProperties: 15, searches: 4, enquiries: 7,  joinDate: "2024-02-05", lastActive: "2024-03-15", status: "active" },
  { id: "7", initials: "RT", name: "Robert Taylor",  email: "robert.t@email.com",     phone: "+44 7700 900 777", location: "Liverpool",  savedProperties: 0,  searches: 0, enquiries: 0,  joinDate: "2023-12-10", lastActive: "2024-02-01", status: "suspended" },
  { id: "8", initials: "JW", name: "Jennifer White", email: "jennifer.w@email.com",   phone: "+44 7700 900 888", location: "Glasgow",    savedProperties: 18, searches: 5, enquiries: 9,  joinDate: "2024-01-25", lastActive: "2024-03-16", status: "active" },
];

export const statCards = [
  { label: "Total Users",       value: 8,  sub: "All registered users", color: "blue",   icon: "users" },
  { label: "Active Users",      value: 6,  sub: "Currently active",     color: "green",  icon: "check" },
  { label: "Total Enquiries",   value: 39, sub: "All time enquiries",   color: "purple", icon: "mail" },
  { label: "Saved Properties",  value: 86, sub: "Total saved",          color: "orange", icon: "eye" },
];