export interface AuthResult {
   success: boolean;
   error?: string;
}

export interface ApiResponse<T> {
   success: boolean;
   message?: string;
   error?: string;
   data?: T;
}

export interface User {
   id: string;
   firebaseUid: string;
   firstName: string;
   lastName: string;
   userNickName: string;
   userAvatar: string;
   userEmail: string;
   createdAt: string;
   provider: string;
   lastLoginAt: string;
}