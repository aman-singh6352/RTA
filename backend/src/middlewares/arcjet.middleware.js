import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../lib/arcjet.js";

export const arjectProjection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.reason.isRateLimit()) {
            return res.status(429).json({message: "Too many requests!"})
          } else if (decision.reason.isBot()) {
            return res.status(403).json({message: "No bots allowed" });
          } else {
            return res.status(403).json({message: "Forbidden" });
          }
    } catch(err) {
        console.log('Error in :: arjectProjection', err);
    }
};
