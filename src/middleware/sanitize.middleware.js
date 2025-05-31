import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

function sanitizerMiddleware(req, res, next) {
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = purify.sanitize(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  ["body", "params", "query"].forEach((prop) => {
    if (req[prop]) {
      sanitizeObject(req[prop]);
    }
  });

  next();
}

export default sanitizerMiddleware;
