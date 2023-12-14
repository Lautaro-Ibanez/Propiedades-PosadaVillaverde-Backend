handlePolicies = (policies) => {
  return (req, res, next) => {
    if (policies[0] === "PUBLIC") {
      return next();
    }
    const user = req.user;
    if (policies[0] === "NO_AUTH" && user) {
      return res.status(401).send({ status: "error", error: "Unauthorized" });
    }

    if (policies[0] === "NO_AUTH" && !user) {
      return next();
    }

    if (!user) {
      return res.status(401).send({ status: "error", error: req.error });
    }

    if (!policies.includes(user.role.toUpperCase())) {
      return res.status(403).send({ status: "error", error: "Forbidden" });
    }

    next();
  };
};
