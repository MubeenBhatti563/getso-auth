export const features = [
  {
    icon: "keys",
    title: "JWT authentication",
    description:
      "Short-lived access tokens with automatic refresh rotation built in.",
  },
  {
    icon: "email",
    title: "Email verification",
    description:
      "Verify users on registration with secure time-limited tokens.",
  },
  {
    icon: "roleBased",
    title: "Role-based access",
    description:
      "Fine-grained RBAC with admin and customer roles out of the box.",
  },
  {
    icon: "tokenRotation",
    title: "Token rotation",
    description:
      "Refresh tokens are rotated on every use and hashed in the database.",
  },
  {
    icon: "rateLimiting",
    title: "Rate limiting",
    description:
      "Per-IP and per-account brute force protection backed by Redis.",
  },
  {
    icon: "resetPassword",
    title: "Password reset",
    description:
      "Secure forgot-password flow with 1-hour expiring reset links.",
  },
];
