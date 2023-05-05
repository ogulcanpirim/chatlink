const DELAY = 0;

export async function delay(req, res, next) {
  await new Promise((resolve) => setTimeout(resolve, DELAY));
  next();
}
