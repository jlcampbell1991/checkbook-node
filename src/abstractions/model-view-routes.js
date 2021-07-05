const fs = require('fs');

const Routes = require('./routes');

function checkForAndMakeViews(schema) {
    const viewFileNames = ['', ...fs.readdirSync('src/abstractions/views')]
    const root = `src/${schema.resourceName.singular}/views/`;

    viewFileNames.forEach(fileName => {
        const openPath = `${root}${fileName}`;
        try {
            fs.openSync(openPath);
        } catch (_) {
            const path = `src/abstractions/views/${fileName}`
            const stat = fs.statSync(path);
            if(stat.isDirectory()) fs.mkdirSync(openPath);
            else {
                const data = fs.readFileSync(path);
                fs.writeFileSync(openPath, data);
            }
        }
    })

}

module.exports = class extends Routes {
    constructor(schema, sql) {
        schema.columns.push({
            name: "id",
            type: "text primary key",
        },
        {
            name: "created",
            type: "date"
        },
        {
            name: "updated",
            type: "date"
        });
        super(schema, sql);
        this.schema = schema;
        this.sql = sql;

        checkForAndMakeViews(schema);
    }
}