import Koa from "koa";
import genWeb from "@srnd/codecup-genericwebsite";
import fs from "fs";
import path from "path";

const flag = process.env.FLAG || "test";
const seed = process.env.SEED || flag;
const app = new Koa();
const port = process.env.PORT || 8080;
const tpl = genWeb.randomTemplate(seed);

app.use(ctx => {
	if (ctx.method == "GET") {
		if (ctx.path !== "/" || ctx.query.file === undefined || ctx.query.file === "") {
			ctx.redirect("/?file=index.html");
		} else {
			const absPath = path.join(process.cwd(), "public", ctx.query.file);
			try {
				const text = fs.readFileSync(absPath, "utf8");
				ctx.body = tpl(absPath, text);
			} catch (err) {
				const safeErr = err.toString().replace(/</g, '&lt;');
				switch (err.code) {
					case "ENOENT":
						ctx.status = 404;
						break;
					case "EISDIR": case "ENOTDIR":
						ctx.status = 400;
						break;
					default:
						ctx.status = 500;
						break;
				}
				ctx.body = tpl(absPath, `<h2>${ctx.status} ERROR:</h2><p>${safeErr}</p>`);
			}
		}
	} else {
		ctx.status = 405;
	}
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));
