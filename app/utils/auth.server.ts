import { Authenticator } from "remix-auth";
import type { User } from "@prisma/client";

import { sessionStorage } from "./session.server";
import { githubStrategy } from "./github-oauth2.server";

export type SessionUser = Omit<User, "hashedPassword" | "createdAt" | "updatedAt">;

export const authenticator = new Authenticator<SessionUser>(sessionStorage);

authenticator.use(githubStrategy);
