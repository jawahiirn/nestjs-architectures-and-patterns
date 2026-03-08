// script/events-store-mongoinit.js
rs.initiate({
    _id: "vf-event-store-repl-set",
    members: [{ _id: 0, host: "localhost:27017" }]
});
