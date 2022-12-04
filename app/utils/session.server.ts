import { type Session, createCookieSessionStorage } from "@remix-run/node";

if (!process.env.SESSION_SECRET) {
	throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__session",
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secrets: [process.env.SESSION_SECRET],
		secure: process.env.NODE_ENV === "production",
	},
});

export function getSession(request: Request): Promise<Session> {
	return sessionStorage.getSession(request.headers.get("Cookie"));
}

export const { commitSession, destroySession } = sessionStorage;
