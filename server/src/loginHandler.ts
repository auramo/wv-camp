import express, { Express, NextFunction, Request, Response } from "express";

const noLoginRequiredPaths = [
  /^\/public\//,
  /^\/login.*/,
  /^\/img\//,
  /^\/css\//,
  /^\/auth\/google.*/,
  // TODO temporary:
  /^\/api\/hello/,
];

// https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
// maybe implement the util there:
/*
  function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }
*/

const errorResponse = (res: Response, err: any) => {
  console.error(err);
  res.status(500).json({ error: "Server error", err });
};

const loginCheck = (req: Request, res: Response, next: NextFunction) => {
  console.info("loginCheck, is there a user?", req.user);
  console.info(req.user);
  if (!req.user) {
    const acceptHeader = req.header("Accept");
    if (acceptHeader && acceptHeader.indexOf("application/json") !== -1) {
      res.status(401).json({ error: "Not logged in" });
    } else {
      const redirectSuffix = req.url === "/" ? "" : req.url;
      res.redirect("/login" + redirectSuffix);
    }
  } else {
    next();
  }
};

const loginPage = (req: Request, res: Response, next: NextFunction) =>
  express.static(`${__dirname}/login.html`)(req, res, next);

export const initLogin = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      noLoginRequiredPaths.some((allowedRegex) => req.path.match(allowedRegex))
    ) {
      next();
    } else {
      loginCheck(req, res, next);
    }
  });

  app.use("/login*", async (req, res, next) => {
    try {
      if (req.user) {
        res.redirect("/");
      } else {
        loginPage(req, res, next);
      }
    } catch (err) {
      errorResponse(res, err);
    }
  });

  app.get("/logout", (req, res) => {
    req.logOut((_) => res.redirect("/login"));
  });
};
