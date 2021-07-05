const ejs = require('ejs');
const express = require('express');

const Model = require('./model');

module.exports = class extends Model {
    constructor(schema, sql) {
        super(schema, sql);
    };

    getAll() {
        return ["/", async (_, res) => {
            console.log(`Get all ${this.schema.resourceName.plural}`)
            const resources  = await this.all();
            const html = await ejs.renderFile(`src/${this.schema.resourceName.singular}/views/index.ejs`, { resources });
            res.send(html);
        }];
    }

    get() {
       return ["/:id", async (req, res) => {
            const id = req.params.id;
            const resource = await this.find(id);
            if(resource === undefined) res.sendStatus(404);
            else res.send(resource);
        }];
    }

    post() {
        return ["/", async (req, res) => {
            try {
                const body = req.body
                const resource = this.new(body);
                res.send(await resource.save())
            } catch (e) {
                console.error(e);
                res.sendStatus(400);
            }
        }] ;
    }

    put() {
        return ["/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const resource = await this.find(id);
                if(resource === undefined) res.sendStatus(404);
                const update = await resource.update(req.body);
                res.send(update)
            } catch (e) {
                console.error(e);
                res.sendStatus(400);
            }
        }];
    }

    delete() {
        return ['/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const destroyed = await this.destroy(id);
                res.send(destroyed);
            } catch (e) {
                console.error(e);
                res.sendStatus(400);
            }
        }];
    }

    getRoutes() {
        const router  = express.Router();

        const [getAllPath, getAllFn] = this.getAll();
        router.get(getAllPath, getAllFn);

        const [getPath, getFn] = this.get();
        router.get(getPath, getFn);

        const [postPath, postFn] = this.post();
        router.post(postPath, postFn);

        const [putPath, putFn] = this.put();
        router.put(putPath, putFn);

        const [deletePath, deleteFn] = this.delete();
        router.delete(deletePath, deleteFn);

        return router;
    }
}