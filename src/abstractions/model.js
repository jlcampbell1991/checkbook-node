const { v4: uuidv4 } = require('uuid');

const Copyable = require('./copyable');

module.exports = class extends Copyable {
    constructor(schema, sql) {
        super();
        this.schema = schema;
        this.sql = sql;
    }

    convertType(type, value) {
        if(value === undefined || value == null) return value;
        else if(type === "text")                 return value.toString();
        else if (type === "float")               return parseFloat(value);
        else if (type === "date")                return new Date(value);
        else                                     return value;
    }

    getModel(opts) {
        return this.schema.columns.reduce((obj, column) => {
            obj[column.name] = this.convertType(column.type, opts[column.name]);
            return obj;
        }, { 
            save: this.save, 
            update: this.update, 
            schema: this.schema, 
            sql: this.sql, 
            getModel: this.getModel, 
            convertType: this.convertType,
            copy: this.copy
        })
    }

    async save() {
        this.id = uuidv4();
        this.created = new Date();
        this.updated = new Date();
        const columns = this.schema.columns.map(column => column.name).join(",");
        const values = this.schema.columns.map(column => `'${this[column.name]}'`).join(",");
        const statement = `insert into ${this.schema.name} (${columns}) values (${values}) returning *`;
        const [res] = await this.sql.unsafe(statement);
        return this.getModel(res);
    }

    async update(opts) {
        opts.updated = new Date();
        const updated = this.copy(opts);
        const values = this.schema.columns.map(column => `${column.name} = '${updated[column.name]}'`).join(',')
        const statement = `update ${this.schema.name} set ${values} where id = '${updated.id}' returning *`;
        const [res] = await this.sql.unsafe(statement);
        return this.getModel(res);
    }

    new(opts) { 
        return this.getModel(opts); 
    }
    
    async find (id) {
        const statement = `select * from ${this.schema.name} where id = '${id}'`;
        const [options] = await this.sql.unsafe(statement);
        return this.getModel(options);
    };
    
    async all() {
        const statement = `select * from ${this.schema.name}`;
        const arrOpts = await this.sql.unsafe(statement);
        return arrOpts.map(opts => this.getModel(opts))
    };
    
    async destroy(id) {
        const statement = `delete from ${this.schema.name} where id = '${id}' returning *`;
        const [res] = await this.sql.unsafe(statement);
        return this.getModel(res);
    }

    async migrate() {
        try {
            const exstCols = await this.sql`select column_name, data_type from information_schema.columns where table_name = ${this.schema.name}`;
            if(!exstCols.length) await this.sql.unsafe(`create table if not exists ${this.schema.name}`);
            this.schema.columns.forEach(async column => {
                try {
                    const exst = exstCols.find(({ column_name }) => column_name === column.name);
                    if(!exst) await this.sql.unsafe(`alter table ${this.schema.name} add column if not exists ${column.name} ${column.type}`);
                    if(exst && exst.data_type !== column.type)
                        await this.sql.unsafe(`alter table ${this.schema.name} alter column ${column.name} type ${column.type}`);
                } catch (e) {
                    console.error(e);
                }
            })
    
            const exstConst = await this.sql`select constraint_name from information_schema.table_constraints where table_name = ${this.schema.name}`;
            this.schema.constraints.forEach(async constraint => {
                try {
                    const name = `${constraint.name}_${constraint.values.join("_")}`
                    if (!exstConst.some( ({constraint_name}) => constraint_name === name)) {
                        await this.sql.unsafe(`alter table ${this.schema.name} add constraint ${name} ${constraint.name}(${constraint.values.join(',')})`)
                    }
                } catch (e) {
                    console.error(e);
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
}