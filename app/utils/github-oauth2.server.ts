import type { StrategyVerifyCallback } from "remix-auth";
import type { OAuth2StrategyVerifyParams } from "remix-auth-oauth2";
import { type GitHubProfile, type GitHubExtraParams, GitHubStrategy, SocialsProvider } from "remix-auth-socials";

import { db } from "./db.server";
import type { SessionUser } from "./auth.server";

const verify: StrategyVerifyCallback<
	SessionUser,
	OAuth2StrategyVerifyParams<GitHubProfile, GitHubExtraParams>
> = async ({ profile }) => {
	let user = await db.user.findUnique({
		where: { id: profile.id },
		select: {
			id: true,
			fullName: true,
			email: true,
		},
	});
	if (!user) {
		if (!profile._json.email) {
			throw new Error("Email address not found. Make sure your profile has an email address available.");
		}

		try {
			user = await db.user.create({
				data: {
					id: profile.id,
					fullName: profile.displayName,
					email: profile._json.email.toLowerCase().trim(),
				},
				select: {
					id: true,
					fullName: true,
					email: true,
				},
			});
		} catch (error: any) {
			if (error.code === "P2002" && error.meta.target[0] === "email") {
				throw new Error(
					"An account with this email already exists. Do you need to reset your account's password?",
				);
			}

			throw error;
		}
	}

	return user;
};

if (!process.env.GITHUB_CLIENT_ID) {
	throw new Error("Please define environment variable GITHUB_CLIENT_ID");
}

if (!process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("Please define environment variable GITHUB_CLIENT_SECRET");
}

export const githubStrategy = new GitHubStrategy(
	{
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		scope: ["user:email"],
		callbackURL: `/sign-in/${SocialsProvider.GITHUB}/callback`,
	},
	verify,
);