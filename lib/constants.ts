export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "Leo의 블로그";
export const SITE_DESCRIPTION = "생각과 경험을 기록하는 공간. 개발, 디자인, 그리고 일상에 대한 이야기.";
