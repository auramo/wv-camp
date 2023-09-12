import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  VerifyFunctionWithRequest,
} from "passport-google-oauth2";
import { Express, Request, Response } from "express";
import userRepository from "./userRepository";
import { NextFunction } from "express-serve-static-core";

/*
This hack was needed to get rid of random failures:

https://stackoverflow.com/a/73016123

A quick way to fix this is to add a single line to node_modules/oauth/lib/oauth2.js near line 161 inside the error listener:

 request.on('error', function(e) {
     if (callbackCalled) { return }  // Add this line
     callbackCalled= true;
     callback(e);
   });
*/

const verify: VerifyFunctionWithRequest = async function (
  request,
  accessToken,
  refreshToken,
  profile: any,
  done
) {
  const userFetchCallback = (user: string | null) =>
    user
      ? done(null, user)
      : done(null, false, { message: "User not authorized" });
  try {
    const email = profile.emails[0].value.toLowerCase();
    const user = await userRepository.findUserByLogin(email);
    userFetchCallback(user);
  } catch (e) {
    console.log("Error occurred while authenticating", e);
    done(null, false, { message: "Error occurred: " + e });
  }
};

const authenticationFailed = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) console.error("Logout failed", err);
  });
  res.redirect("/login?failed=true");
};

const authenticationSuccessful = (
  req: Request,
  user: string,
  next: NextFunction,
  res: Response
) => {
  const redirectTo = req.session.desiredUrlAfterLogin
    ? req.session.desiredUrlAfterLogin
    : "/";
  console.info("Authentication successful", user);
  req.logIn(user, (err) => {
    if (err) {
      next(err);
    } else {
      res.redirect(redirectTo);
    }
  });
};

export function initAuth(app: Express): void {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL!,
        passReqToCallback: true,
      },
      verify
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user: any, done) {
    done(null, user);
  });

  app.get("/auth/googlelogin*", (req, res) => {
    req.session.desiredUrlAfterLogin = req.url.substr(
      "/auth/googlelogin".length
    );
    req.session.save();
    return passport.authenticate("google", { scope: ["email", "profile"] })(
      req,
      res
    );
  });

  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user) => {
      if (err) {
        next(err);
      } else if (!user) {
        authenticationFailed(req, res);
      } else {
        authenticationSuccessful(req, user, next, res);
      }
    })(req, res, next);
  });
}
