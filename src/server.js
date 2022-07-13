import Koa from "koa";
import genWeb from "@srnd/codecup-genericwebsite";
import fs from 'fs';
import path from 'path';

const flag = process.env.FLAG || 'test';
const app = new Koa();
const port = process.env.PORT || 8080;
const tpl = genWeb.randomTemplate(flag);

app.use(ctx => {
	if (ctx.method == 'GET') {
		if (ctx.path !== "/" || ctx.query.file === undefined) {
			ctx.redirect('/?file=index');
		} else {
			ctx.url += ".html";
			const absPath = path.join(process.cwd(), "public", ctx.query.file);
			try {
				const text = fs.readFileSync(absPath, 'utf8');
				ctx.body = tpl(absPath, text);
			} catch (err) {
				if (err.code == 'ENOENT') {
					const absPathSafe = absPath.replace(/</g, '&lt;');
					ctx.status = 404;
					ctx.body = tpl(absPath, `<h2>404 ERROR:</h2><p><code>${absPathSafe}</code> Not Found.</p>`);
				} else {
					throw err;
				}
			}
		}
	} else {
		ctx.status = 405;
	}
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));
