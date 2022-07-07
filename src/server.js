import Koa from "koa";
import genWeb from "@srnd/codecup-genericwebsite";
import fs from 'fs';
import path from 'path';

if (!('FLAG' in process.env)) {
	console.log("Error: Flag is not set.")
	process.exit(1);
}

const app = new Koa();
const port = process.env.PORT || 8080;
const tpl = genWeb.randomTemplate(process.env.FLAG);

app.use(ctx => {
	if (ctx.method == 'GET') {
		if (ctx.url == "/") {
			ctx.url += "index";
		}
		ctx.url += ".html";
		try {
			const text = fs.readFileSync(path.join(process.cwd(), "/public", ctx.path), 'utf8');
			ctx.body = tpl(ctx.path, text);
		} catch (err) {
			if (err.code == 'ENOENT') {
				ctx.status = 404;
			} else {
				throw err;
			}
		}
	} else {
		ctx.status = 405;
	}
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));
