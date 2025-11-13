export enum ROUTES {
  REGISTRATION = "/registration",
  LOGIN = "/login",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  VERIFY_EMAIL = "/verify-email",
  // user routes
  HOME = "/",
  CUSTOM_REQUEST = "/custom-request",
  FOLLOWING = "/following",
  CHATS = "/chats",
  SEARCH = "/search",
  PROFILE = "/profile",
  USER_PROFILE = "/profile/:id",
  PAYMENT_VERIFICATION = "/payment-verification",
  // creator routes
  CREATOR_POST = "/creator/post",
  CREATOR_HOME = "/creator/home",
  CREATOR_SUBSCRIPTIONS = "/creator/subscriptions",
  CREATOR_CHATS = "/creator/chats",
  CREATOR_SEARCH = "/creator/search",
  CREATOR_PROFILE = "/creator/profile",
  CREATOR_VERIFICATION = "/creator/verification",
  // admin routes
  ADMIN_HOME = "/admin/home",
}
