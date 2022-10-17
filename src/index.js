import { Context } from "./context.ts";
import { initDB } from "./db.ts";
import { initViewer, initList } from "./inits.ts";

(async () => {
  const context = new Context();
  const db = await initDB();

  initViewer(db, context);
  initList(db, context);
})();
