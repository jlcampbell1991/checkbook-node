const ModelViewRoutes = require('../abstractions/model-view-routes');

module.exports = (sql) => new ModelViewRoutes({
    resourceName: {
        singular: "transaction",
        plural: "transactions"
    },
    name: "checkbook_transactions",
    columns: [
        {
            name: "memo",
            type: "text"
        },
        {
            name: "amount",
            type: "text"
        },
        {
            name: "account_id",
            type: "text"
        },
        {
            name: "date",
            type: "date"
        },
        {
            name: "posted",
            type: "boolean"
        },
        {
            name: "line_item_id",
            type: "text"
        }
    ]
}, sql)