import { literals } from "@/literals";

export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code = (error as any)?.code as string | undefined;

  switch (code) {
    case "auth/email-already-in-use":
      return literals.firebaseErrors.emailAlreadyInUse;
    case "auth/invalid-email":
      return literals.firebaseErrors.invalidEmail;
    case "auth/user-not-found":
    case "auth/wrong-password":
      return literals.firebaseErrors.wrongPassword;
    case "auth/weak-password":
      return literals.firebaseErrors.weakPassword;
    default:
      return literals.firebaseErrors.default;
  }
}
